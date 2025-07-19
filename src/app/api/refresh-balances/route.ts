import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";
import { prisma } from "@/lib/prisma";
import { sendBalanceUpdateEmail } from "@/lib/email";

export async function POST() {
  try {
    // Get all connected Plaid items
    const plaidItems = await prisma.plaidItem.findMany({
      include: { accounts: true },
    });

    const changes: Array<{
      accountName: string;
      institutionName: string;
      previousBalance: number;
      currentBalance: number;
      change: number;
    }> = [];

    let totalChange = 0;

    for (const item of plaidItems) {
      try {
        // Get fresh balance data from Plaid
        const response = await plaidClient.accountsBalanceGet({
          access_token: item.accessToken,
        });

        for (const plaidAccount of response.data.accounts) {
          const account = item.accounts.find(a => a.plaidId === plaidAccount.account_id);
          
          if (account) {
            // Get the most recent balance
            const previousBalance = await prisma.accountBalance.findFirst({
              where: { accountId: account.id },
              orderBy: { date: 'desc' },
            });

            const currentBalance = plaidAccount.balances.current || 0;
            const prevAmount = previousBalance?.current || 0;
            const change = currentBalance - prevAmount;

            // Only save if balance changed significantly (more than 1 cent)
            if (Math.abs(change) > 0.01) {
              await prisma.accountBalance.create({
                data: {
                  accountId: account.id,
                  current: currentBalance,
                  available: plaidAccount.balances.available,
                  limit: plaidAccount.balances.limit,
                },
              });

              changes.push({
                accountName: account.name,
                institutionName: item.institutionName || 'Unknown Bank',
                previousBalance: prevAmount,
                currentBalance: currentBalance,
                change: change,
              });

              totalChange += change;
            }
          }
        }
      } catch (error) {
        console.error(`Error refreshing balances for item ${item.id}:`, error);
      }
    }

    // Calculate current totals for email
    const accounts = await prisma.account.findMany({
      include: {
        balances: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    const totalAssets = accounts
      .filter(acc => acc.type === 'depository' || acc.type === 'investment')
      .reduce((sum, acc) => sum + (acc.balances[0]?.current || 0), 0);

    const totalLiabilities = accounts
      .filter(acc => acc.type === 'credit' || acc.type === 'loan')
      .reduce((sum, acc) => sum + Math.abs(acc.balances[0]?.current || 0), 0);

    const netWorth = totalAssets - totalLiabilities;

    // Send email if there are changes or if it's a manual refresh
    const sendEmail = changes.length > 0;
    
    if (sendEmail) {
      try {
        await sendBalanceUpdateEmail({
          changes,
          totalChange,
          totalAssets,
          totalLiabilities,
          netWorth,
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      changes,
      totalChange,
      emailSent: sendEmail,
      summary: {
        totalAssets,
        totalLiabilities,
        netWorth,
      },
      message: `Refreshed balances. Found ${changes.length} changes totaling $${totalChange.toFixed(2)}${sendEmail ? '. Email notification sent.' : '.'}`,
    });
  } catch (error) {
    console.error("Error refreshing balances:", error);
    return NextResponse.json(
      { error: "Failed to refresh balances" },
      { status: 500 }
    );
  }
}
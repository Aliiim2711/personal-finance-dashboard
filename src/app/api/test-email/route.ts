import { NextResponse } from "next/server";
import { testEmailConnection, sendBalanceUpdateEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Test email connection first
    const connectionTest = await testEmailConnection();
    
    if (!connectionTest) {
      return NextResponse.json(
        { error: "Email server connection failed. Check your email settings." },
        { status: 500 }
      );
    }

    // Get current account data for test email
    const accounts = await prisma.account.findMany({
      include: {
        plaidItem: true,
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

    // Create sample changes for test email
    const sampleChanges = accounts.slice(0, 3).map(account => ({
      accountName: account.name,
      institutionName: account.plaidItem.institutionName || 'Test Bank',
      previousBalance: (account.balances[0]?.current || 0) - 50,
      currentBalance: account.balances[0]?.current || 0,
      change: 50,
    }));

    const result = await sendBalanceUpdateEmail({
      changes: sampleChanges,
      totalChange: 150,
      totalAssets,
      totalLiabilities,
      netWorth,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully!",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send test email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get balance history grouped by date
    const balanceHistory = await prisma.accountBalance.findMany({
      include: {
        account: {
          select: {
            type: true,
            subtype: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Group by date and calculate totals
    const groupedData = balanceHistory.reduce((acc, balance) => {
      const date = balance.date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!acc[date]) {
        acc[date] = {
          date,
          totalAssets: 0,
          totalLiabilities: 0,
          netWorth: 0,
        };
      }

      const amount = balance.current;
      const isLiability = balance.account.type === 'credit' || balance.account.type === 'loan';

      if (isLiability) {
        acc[date].totalLiabilities += Math.abs(amount);
      } else {
        acc[date].totalAssets += amount;
      }

      acc[date].netWorth = acc[date].totalAssets - acc[date].totalLiabilities;

      return acc;
    }, {} as Record<string, any>);

    const historyArray = Object.values(groupedData);

    return NextResponse.json(historyArray);
  } catch (error) {
    console.error("Error fetching balance history:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance history" },
      { status: 500 }
    );
  }
}
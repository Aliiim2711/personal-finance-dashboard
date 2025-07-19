"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Account {
  id: string;
  type: string;
  subtype: string | null;
  balances: Array<{
    current: number;
  }>;
}

interface FinancialGroupChartProps {
  accounts: Account[];
}

// Financial groupings as defined in the article
const financialGroups = {
  Assets: {
    color: "rgba(16, 185, 129, 0.8)", // Green
    borderColor: "rgba(16, 185, 129, 1)",
    types: ["depository"],
  },
  Investments: {
    color: "rgba(139, 92, 246, 0.8)", // Purple  
    borderColor: "rgba(139, 92, 246, 1)",
    types: ["investment", "brokerage"],
  },
  Liabilities: {
    color: "rgba(239, 68, 68, 0.8)", // Red
    borderColor: "rgba(239, 68, 68, 1)",
    types: ["credit", "loan"],
  },
};

function getFinancialGroup(accountType: string, subtype: string | null): string {
  // Investment accounts (401k, IRA, etc.)
  if (accountType === "investment" || 
      subtype === "401k" || 
      subtype === "ira" || 
      subtype === "brokerage") {
    return "Investments";
  }
  
  // Liabilities (credit cards, loans)
  if (accountType === "credit" || accountType === "loan") {
    return "Liabilities";
  }
  
  // Assets (checking, savings, CDs)
  if (accountType === "depository") {
    return "Assets";
  }
  
  return "Assets"; // Default
}

export function FinancialGroupChart({ accounts }: FinancialGroupChartProps) {
  // Group accounts by financial type and sum balances
  const groupData = accounts.reduce((acc, account) => {
    const group = getFinancialGroup(account.type, account.subtype);
    const balance = account.balances[0]?.current || 0;
    
    if (!acc[group]) acc[group] = 0;
    
    // For liabilities, use absolute value for the chart
    acc[group] += group === "Liabilities" ? Math.abs(balance) : balance;
    
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const chartData = {
    labels: Object.keys(groupData),
    datasets: [
      {
        data: Object.values(groupData),
        backgroundColor: Object.keys(groupData).map(
          (group) => financialGroups[group as keyof typeof financialGroups]?.color
        ),
        borderColor: Object.keys(groupData).map(
          (group) => financialGroups[group as keyof typeof financialGroups]?.borderColor
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (Object.keys(groupData).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Balance by Financial Group</h2>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Balance by Financial Group</h2>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
      
      {/* Summary below chart */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {Object.entries(groupData).map(([group, amount]) => (
          <div key={group} className="text-sm">
            <div className="font-medium text-gray-900">
              ${amount.toLocaleString()}
            </div>
            <div className="text-gray-500">{group}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import PlaidLink from '@/components/PlaidLink';
import { FinancialGroupChart } from '@/components/FinancialGroupChart';
import { BalanceHistoryChart } from '@/components/BalanceHistoryChart';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Building, RefreshCw, Mail } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: string;
  subtype: string | null;
  mask: string | null;
  plaidItem: {
    institutionName: string | null;
    institutionLogo: string | null;
  };
  balances: Array<{
    current: number;
    available: number | null;
    limit: number | null;
  }>;
}

interface HistoryData {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [emailTesting, setEmailTesting] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalanceHistory = async () => {
    try {
      const response = await fetch('/api/balance-history');
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
      }
    } catch (error) {
      console.error('Error fetching balance history:', error);
    }
  };

  const refreshBalances = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/refresh-balances', {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Balance refresh result:', result);
        
        // Show user-friendly message about email
        if (result.emailSent) {
          alert(`Balance refresh complete! Found ${result.changes.length} changes totaling $${Math.abs(result.totalChange).toFixed(2)}. Email notification sent!`);
        } else {
          alert(`Balance refresh complete! No significant changes detected.`);
        }
        
        // Refresh the accounts and history data
        await fetchAccounts();
        await fetchBalanceHistory();
      }
    } catch (error) {
      console.error('Error refreshing balances:', error);
      alert('Failed to refresh balances. Check console for details.');
    } finally {
      setRefreshing(false);
    }
  };

  const testEmail = async () => {
    try {
      setEmailTesting(true);
      const response = await fetch('/api/test-email', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Test email sent successfully! Check your inbox.');
      } else {
        alert(`Failed to send test email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email. Check console for details.');
    } finally {
      setEmailTesting(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchBalanceHistory();
  }, []);

  // Calculate totals
  const totalAssets = accounts
    .filter(acc => acc.type === 'depository' || acc.type === 'investment')
    .reduce((sum, acc) => sum + (acc.balances[0]?.current || 0), 0);

  const totalLiabilities = accounts
    .filter(acc => acc.type === 'credit' || acc.type === 'loan')
    .reduce((sum, acc) => sum + Math.abs(acc.balances[0]?.current || 0), 0);

  const netWorth = totalAssets - totalLiabilities;

  const getAccountIcon = (type: string, subtype: string | null) => {
    if (type === 'credit' || subtype === 'credit card') return CreditCard;
    if (type === 'investment' || subtype === '401k' || subtype === 'ira') return TrendingUp;
    if (subtype === 'savings') return PiggyBank;
    return Building;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Personal Finance Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Track all your financial accounts in one place
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={refreshBalances}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Balances'}
                </button>
                
                <button
                  onClick={testEmail}
                  disabled={emailTesting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Mail className={`w-4 h-4 mr-2 ${emailTesting ? 'animate-pulse' : ''}`} />
                  {emailTesting ? 'Sending...' : 'Test Email'}
                </button>
                
                <PlaidLink onSuccess={fetchAccounts} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Assets
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(totalAssets)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Liabilities
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(totalLiabilities)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className={`h-6 w-6 ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Net Worth
                    </dt>
                    <dd className={`text-lg font-medium ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(netWorth)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FinancialGroupChart accounts={accounts} />
          <BalanceHistoryChart data={historyData} />
        </div>

        {/* Connected Accounts */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Connected Accounts
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {accounts.length === 0 
                ? "No accounts connected yet. Click 'Connect Bank Account' to get started!"
                : `${accounts.length} account${accounts.length !== 1 ? 's' : ''} connected`
              }
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading accounts...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by connecting your first bank account.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {accounts.map((account) => {
                const Icon = getAccountIcon(account.type, account.subtype);
                const balance = account.balances[0]?.current || 0;
                const isNegative = balance < 0;
                
                return (
                  <li key={account.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {account.plaidItem.institutionLogo ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={account.plaidItem.institutionLogo}
                                alt={account.plaidItem.institutionName || 'Bank'}
                              />
                            ) : (
                              <Icon className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {account.name}
                              </p>
                              {account.mask && (
                                <span className="ml-2 text-xs text-gray-500">
                                  ••••{account.mask}
                                </span>
                              )}
                            </div>
                            <div className="flex">
                              <p className="text-sm text-gray-500">
                                {account.plaidItem.institutionName}
                              </p>
                              <span className="mx-2 text-gray-300">•</span>
                              <p className="text-sm text-gray-500 capitalize">
                                {account.subtype || account.type}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            isNegative ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatCurrency(Math.abs(balance))}
                          </p>
                          {account.balances[0]?.available && (
                            <p className="text-xs text-gray-500">
                              Available: {formatCurrency(account.balances[0].available)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
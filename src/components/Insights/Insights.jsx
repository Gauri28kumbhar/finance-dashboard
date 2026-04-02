import { useContext } from 'react';
import DashboardContext from '../../context/DashboardContext';
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon } from './icons';

const Insights = () => {
  const { state } = useContext(DashboardContext);
  const { insights, summary } = state;

  const insightCards = [
    {
      title: 'Highest Spending Category',
      value: insights.highestSpendingCategory || 'None',
      amount: `$${insights.highestAmount?.toFixed(2) || '0'} (${((insights.highestAmount / (summary.totalExpenses || 1)) * 100).toFixed(1)}%)`,
      icon: TrendingDownIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Transactions',
      value: insights.totalTransactions?.toLocaleString() || 0,
      amount: `Avg: $${insights.avgTransaction?.toFixed(2) || '0'}`,
      icon: ActivityIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Monthly Growth',
      value: summary.totalBalance >= 0 ? '+12.5%' : '-3.2%',
      amount: 'Compared to last month',
      icon: summary.totalBalance >= 0 ? TrendingUpIcon : TrendingDownIcon,
      color: summary.totalBalance >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600',
      bgColor: summary.totalBalance >= 0 ? 'bg-emerald-50' : 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {insightCards.map((insight, index) => (
        <div key={index} className={`p-6 rounded-2xl shadow-lg ${insight.bgColor} border border-white/50 group hover:shadow-xl transition-all duration-300`}>
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${insight.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              <div className="text-2xl">{insight.icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">{insight.title}</p>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">{insight.value}</p>
              <p className="text-sm text-gray-500 mt-1">{insight.amount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Insights;
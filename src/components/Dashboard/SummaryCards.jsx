import { useContext } from 'react';
import DashboardContext from '../../context/DashboardContext';

const SummaryCards = () => {
  const { state } = useContext(DashboardContext);
  const { summary } = state;

  const cards = [
    {
      title: 'Total Balance',
      value: `$${Math.abs(summary.totalBalance).toLocaleString()}`,
      trend: summary.totalBalance >= 0 ? '+2.5%' : '-1.2%',
      color: summary.totalBalance >= 0 ? 'bg-emerald-500' : 'bg-red-500',
      icon: summary.totalBalance >= 0 ? '💰' : '⚠️'
    },
    {
      title: 'Total Income',
      value: `$${summary.totalIncome.toLocaleString()}`,
      trend: '+12.3%',
      color: 'bg-blue-500',
      icon: '📈'
    },
    {
      title: 'Total Expenses',
      value: `$${summary.totalExpenses.toLocaleString()}`,
      trend: '-8.2%',
      color: 'bg-orange-500',
      icon: '📉'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`p-6 rounded-2xl shadow-xl ${card.color} text-white hover:scale-[1.02] transition-all duration-200 group`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">{card.title}</p>
              <p className="text-3xl font-bold mt-1 leading-tight">{card.value}</p>
            </div>
            <div className="text-4xl opacity-90 group-hover:opacity-100 transition-opacity">{card.icon}</div>
          </div>
          <p className="text-sm mt-3 opacity-90">{card.trend} from last month</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useContext, useMemo } from 'react';
import DashboardContext from '../../context/DashboardContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartSection = () => {
  const { state } = useContext(DashboardContext);
  
  const balanceTrendData = useMemo(() => [
    { month: 'Jan', balance: 12000 },
    { month: 'Feb', balance: 11500 },
    { month: 'Mar', balance: 14200 },
    { month: 'Apr', balance: 13800 },
    { month: 'May', balance: 15600 },
    { month: 'Jun', balance: 16200 }
  ], []);

  const spendingBreakdown = useMemo(() => {
    const categoryTotals = {};
    state.transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [state.transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Balance Trend */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={balanceTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#64748b" fontWeight="500" />
            <YAxis stroke="#64748b" fontWeight="500" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#0088FE" 
              strokeWidth={4}
              dot={{ fill: '#0088FE', strokeWidth: 2 }}
              activeDot={{ r: 8, strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Breakdown */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Spending Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={spendingBreakdown}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={40}
              dataKey="value"
              nameKey="name"
            >
              {spendingBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
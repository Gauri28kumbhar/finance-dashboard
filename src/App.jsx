import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

// Mock data & Context (self-contained)
const mockTransactions = [
  { id: 1, description: 'Grocery', amount: 45.99, category: 'Food', type: 'expense', date: '2024-03-15' },
  { id: 2, description: 'Salary', amount: 3500, category: 'Salary', type: 'income', date: '2024-03-31' },
  { id: 3, description: 'Netflix', amount: 15.99, category: 'Entertainment', type: 'expense', date: '2024-04-01' },
];

const DashboardContext = React.createContext();

const useDashboard = () => useContext(DashboardContext);

function SummaryCards() {
  const { summary } = useDashboard();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'Balance', value: `$${summary.balance?.toLocaleString() || 0}`, color: 'bg-emerald-500', icon: '💰' },
        { title: 'Income', value: `$${summary.income?.toLocaleString() || 0}`, color: 'bg-blue-500', icon: '📈' },
        { title: 'Expenses', value: `$${summary.expenses?.toLocaleString() || 0}`, color: 'bg-red-500', icon: '📉' },
      ].map((card, i) => (
        <div key={i} className={`${card.color} p-8 rounded-3xl text-white shadow-2xl hover:scale-105 transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{card.title}</p>
              <p className="text-4xl font-bold mt-2">{card.value}</p>
            </div>
            <span className="text-4xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartSection() {
  const data = [
    { month: 'Jan', balance: 12000 },
    { month: 'Feb', balance: 11500 },
    { month: 'Mar', balance: 14200 },
    { month: 'Apr', balance: 15600 },
  ];

  const pieData = [
    { name: 'Food', value: 46 },
    { name: 'Entertainment', value: 16 },
    { name: 'Salary', value: 3500 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <div className="bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-6">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="balance" stroke="#0088FE" strokeWidth={4} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-6">Spending Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              <Cell fill="#0088FE" />
              <Cell fill="#00C49F" />
              <Cell fill="#FFBB28" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TransactionList() {
  const { transactions, currentRole, addTransaction } = useDashboard();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
      <h2 className="text-3xl font-bold mb-6">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map(t => (
          <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold">{t.description}</p>
              <p className="text-sm text-gray-500">{t.category} • {t.date}</p>
            </div>
            <span className={t.type === 'income' ? 'text-emerald-600 font-bold text-xl' : 'text-red-600 font-bold text-xl'}>
              {t.type === 'income' ? '+' : '-'}${t.amount}
            </span>
          </div>
        ))}
      </div>
      {currentRole === 'admin' && (
        <button 
          onClick={() => setShowModal(true)}
          className="mt-6 w-full bg-emerald-500 text-white py-4 px-6 rounded-2xl font-bold hover:bg-emerald-600 transition-all duration-200 shadow-xl"
        >
          ➕ Add Transaction
        </button>
      )}
    </div>
  );
}

function Filters() {
  return (
    <div className="bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-xl sticky top-8 h-fit">
      <h3 className="text-2xl font-bold mb-6">Filters</h3>
      <select className="w-full p-4 border border-gray-200 rounded-2xl mb-4 focus:ring-4 focus:ring-blue-500/30">
        <option>All Types</option>
        <option>Income</option>
        <option>Expense</option>
      </select>
      <select className="w-full p-4 border border-gray-200 rounded-2xl mb-6 focus:ring-4 focus:ring-purple-500/30">
        <option>All Categories</option>
        <option>Food</option>
        <option>Salary</option>
      </select>
      <p className="text-sm text-gray-500">3 of 3 transactions</p>
    </div>
  );
}

function RoleSelector() {
  const { currentRole, setRole } = useDashboard();
  return (
    <div className="inline-flex items-center p-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
      <select 
        value={currentRole} 
        onChange={e => setRole(e.target.value)}
        className="bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-blue-500/30 font-semibold mr-3"
      >
        <option value="viewer">👁️ Viewer</option>
        <option value="admin">⚙️ Admin</option>
      </select>
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${currentRole === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
        {currentRole.toUpperCase()}
      </span>
    </div>
  );
}

function App() {
  const [state, setState] = useState({
    transactions: mockTransactions,
    currentRole: 'viewer',
    summary: { balance: 3438.02, income: 3500, expenses: 61.98 }
  });

  const value = {
    ...state,
    setRole: role => setState(s => ({ ...s, currentRole: role })),
    addTransaction: () => console.log('Add transaction'),
  };

  return (
    <DashboardContext.Provider value={value}>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6">
              Finance Dashboard
            </h1>
            <RoleSelector />
          </div>

          <SummaryCards />
          <ChartSection />
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-20">
            <Filters />
            <div className="xl:col-span-3">
              <TransactionList />
            </div>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

export default App;
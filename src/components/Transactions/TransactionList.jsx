import { useContext, useState } from 'react';
import DashboardContext from '../../context/DashboardContext';
import { format } from 'date-fns';

const TransactionList = () => {
  const { state, dispatch } = useContext(DashboardContext);
  const { filteredTransactions, currentRole } = state;
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Salary', 'Investment'];

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (currentRole !== 'admin') return;

    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      date: new Date(newTransaction.date).toISOString()
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    setShowAddModal(false);
    setNewTransaction({
      description: '',
      amount: '',
      category: 'Food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/50 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Transactions</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          No transactions match your current filters. Try adjusting your filters or add a new transaction.
        </p>
        {currentRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
          >
            ➕ Add First Transaction
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-white/50 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Recent Transactions
              </h2>
              <p className="text-gray-600 mt-1">Latest financial activity</p>
            </div>
            {currentRole === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                ➕ Add New
              </button>
            )}
          </div>
        </div>

        {/* Transactions */}
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredTransactions.slice(0, 15).map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-semibold shadow-lg transform group-hover:scale-105 transition-transform ${
                    transaction.type === 'income' 
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-500/25' 
                      : 'bg-gradient-to-br from-red-400 to-red-500 text-white shadow-red-500/25'
                  }`}>
                    {transaction.amount > 100 ? '💰' : transaction.amount > 50 ? '💳' : '💵'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-gray-800 truncate">{transaction.description}</p>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={`font-bold text-xl leading-tight ${
                    transaction.type === 'income' 
                      ? 'text-emerald-600 group-hover:text-emerald-700' 
                      : 'text-red-600 group-hover:text-red-700'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && currentRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Add Transaction
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="What did you spend on?"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl hover:bg-gray-200 font-semibold transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 font-semibold transition-all shadow-lg transform hover:scale-[1.02] hover:shadow-xl"
                >
                  ➕ Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionList;
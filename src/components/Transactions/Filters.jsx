import { useContext, useState, useEffect, useMemo } from 'react';
import DashboardContext from '../../context/DashboardContext';

const Filters = () => {
  const { state, dispatch } = useContext(DashboardContext);
  const [localFilters, setLocalFilters] = useState(state.filters);

  const categories = useMemo(() => {
    const cats = [...new Set(state.transactions.map(t => t.category))];
    return ['all', ...cats.sort()];
  }, [state.transactions]);

  useEffect(() => {
    setLocalFilters(state.filters);
  }, [state.filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const handleSortChange = (field) => {
    const newSort = {
      field,
      direction: state.sort.field === field && state.sort.direction === 'asc' ? 'desc' : 'asc'
    };
    dispatch({ type: 'SET_SORT', payload: newSort });
  };

  const getSortIcon = (field) => {
    if (state.sort.field !== field) return '↕️';
    return state.sort.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 sticky top-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Filters & Sort</h3>
      
      {/* Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          value={localFilters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={localFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
        <div className="space-y-2">
          {[
            { field: 'date', label: 'Date' },
            { field: 'amount', label: 'Amount' },
            { field: 'category', label: 'Category' }
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
            >
              <span>{label}</span>
              <span className="text-lg group-hover:scale-110 transition-transform">{getSortIcon(field)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          {state.filteredTransactions.length} of {state.transactions.length} transactions
        </p>
      </div>
    </div>
  );
};

export default Filters;
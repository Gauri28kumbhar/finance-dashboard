import React, { createContext, useReducer, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

const DashboardContext = createContext();

const initialState = {
  transactions: [],
  filteredTransactions: [],
  filters: { type: 'all', category: 'all', dateRange: 'all' },
  sort: { field: 'date', direction: 'desc' },
  currentRole: localStorage.getItem('role') || 'viewer',
  summary: { totalBalance: 0, totalIncome: 0, totalExpenses: 0 },
  insights: {}
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, filteredTransactions: action.payload };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
        filteredTransactions: applyFilters(state.transactions, action.payload, state.sort)
      };
    case 'SET_SORT':
      return {
        ...state,
        sort: action.payload,
        filteredTransactions: applyFilters(state.transactions, state.filters, action.payload)
      };
    case 'SET_ROLE':
      localStorage.setItem('role', action.payload);
      return { ...state, currentRole: action.payload };
    case 'ADD_TRANSACTION':
      const newTransactions = [...state.transactions, action.payload];
      return {
        ...state,
        transactions: newTransactions,
        filteredTransactions: applyFilters(newTransactions, state.filters, state.sort)
      };
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload };
    case 'UPDATE_INSIGHTS':
      return { ...state, insights: action.payload };
    default:
      return state;
  }
}

function applyFilters(transactions, filters, sort) {
  let filtered = [...transactions];

  if (filters.type !== 'all') {
    filtered = filtered.filter(t => t.type === filters.type);
  }
  if (filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  filtered.sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];
    return sort.direction === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  return filtered;
}

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });
  }, []);

  useEffect(() => {
    const totalIncome = state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalBalance = totalIncome - totalExpenses;

    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: { totalBalance, totalIncome, totalExpenses }
    });

    const categoryTotals = {};
    state.transactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const highestCategory = Object.entries(categoryTotals).reduce((a, b) => 
      a[1] > b[1] ? a : b, ['None', 0]
    );

    dispatch({
      type: 'UPDATE_INSIGHTS',
      payload: {
        highestSpendingCategory: highestCategory[0],
        highestAmount: highestCategory[1],
        totalTransactions: state.transactions.length,
        avgTransaction: state.transactions.length ? 
          state.transactions.reduce((sum, t) => sum + t.amount, 0) / state.transactions.length : 0
      }
    });
  }, [state.transactions]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
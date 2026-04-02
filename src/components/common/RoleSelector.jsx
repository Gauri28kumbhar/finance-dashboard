import { useContext } from 'react';
import DashboardContext from '../../context/DashboardContext';

const RoleSelector = () => {
  const { state, dispatch } = useContext(DashboardContext);
  const { currentRole } = state;

  return (
    <div className="inline-flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl">
      <span className="text-sm font-semibold text-gray-700">User Role:</span>
      <select
        value={currentRole}
        onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
        className="bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 font-semibold text-sm cursor-pointer hover:shadow-lg transition-all duration-200 appearance-none"
      >
        <option value="viewer">👁️ Viewer Mode</option>
        <option value="admin">⚙️ Admin Mode</option>
      </select>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        currentRole === 'admin'
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          : 'bg-blue-100 text-blue-800 border border-blue-200'
      }`}>
        {currentRole.toUpperCase()}
      </span>
    </div>
  );
};

export default RoleSelector;
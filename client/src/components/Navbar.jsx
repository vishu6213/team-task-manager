import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-sky-600 p-1.5 rounded-lg shadow-sm shadow-sky-200">
              <span className="block w-4 h-4 border-2 border-white rounded-sm"></span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-display">TaskFlow</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-soft-xl border border-slate-100 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                    <span className="text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">New</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto p-2">
                    <div className="p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                      <p className="text-sm text-slate-800 font-medium">Welcome to TaskFlow!</p>
                      <p className="text-xs text-slate-500 mt-1">Your premium dashboard is now ready.</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          <Link to="/settings" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-sky-600 transition-colors">{user?.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider">{user?.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white transition-all group-hover:scale-105">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </Link>
          
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

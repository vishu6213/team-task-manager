import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  Activity,
  Calendar,
  Briefcase
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
        const tasksRes = await api.get('/tasks');
        setRecentTasks(tasksRes.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      label: 'Total Tasks', 
      value: stats.totalTasks, 
      icon: LayoutDashboard, 
      color: 'sky',
      trend: '+12%',
      trendUp: true,
      description: 'Total workload'
    },
    { 
      label: 'Completed', 
      value: stats.completedTasks, 
      icon: CheckCircle2, 
      color: 'emerald',
      trend: '+8%',
      trendUp: true,
      description: 'Tasks finished'
    },
    { 
      label: 'In Progress', 
      value: stats.inProgressTasks, 
      icon: Clock, 
      color: 'amber',
      trend: '-2%',
      trendUp: false,
      description: 'Active tasks'
    },
    { 
      label: 'Overdue', 
      value: stats.overdueTasks, 
      icon: AlertCircle, 
      color: 'rose',
      trend: '+1%',
      trendUp: false,
      description: 'Urgent attention'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-sky-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Dashboard <span className="text-sky-600 underline decoration-sky-200 underline-offset-8">Overview</span>
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-3 text-lg font-medium"
          >
            Welcome back! Here's what's happening with your projects today.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <Calendar className="text-sky-600" size={20} />
          <span className="font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="card-3d glass-card p-6 rounded-3xl relative overflow-hidden group cursor-pointer"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700`}></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 shadow-sm border border-${stat.color}-100`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>

            <div className="mt-6 relative z-10">
              <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.label}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-400 font-semibold">{stat.description}</span>
              </div>
            </div>

            <div className={`h-1.5 w-full bg-slate-100 rounded-full mt-6 overflow-hidden`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full bg-${stat.color}-500 rounded-full`}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Activity size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
            </div>
            <button className="text-sky-600 font-bold text-sm hover:underline">View All Tasks</button>
          </div>

          <div className="space-y-6">
            {recentTasks.length > 0 ? (
              recentTasks.map((task, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  key={task._id} 
                  className="group flex items-center gap-4 p-4 hover:bg-slate-50/80 rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                    task.status === 'Completed' ? 'bg-emerald-500 shadow-emerald-200' :
                    task.status === 'In Progress' ? 'bg-amber-500 shadow-amber-200' : 'bg-slate-400 shadow-slate-200'
                  }`}>
                    {task.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 font-bold truncate group-hover:text-sky-600 transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-slate-500 text-sm truncate mt-0.5">{task.description}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutDashboard className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 font-medium italic">No recent activity to show.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="glass-card p-8 rounded-3xl bg-slate-900 text-white border-slate-800">
            <TrendingUp className="text-sky-400 mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-2">Team Efficiency</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your team is completing tasks 15% faster this week. Keep up the great work!
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-sky-500 flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400 font-bold">+12 others active</span>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                <Briefcase size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Projects Bloom</h3>
            </div>
            <div className="space-y-4">
              <div className="h-2 w-full bg-slate-100 rounded-full">
                <div className="h-full w-3/4 bg-sky-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">Total Progress</span>
                <span className="text-sky-600">75%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

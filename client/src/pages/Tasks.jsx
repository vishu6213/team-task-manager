import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Calendar, 
  User, 
  Briefcase,
  ChevronRight,
  Target,
  ArrowRight,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Todo',
    project: '',
    assignedTo: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchData();
    // Prevent body scroll when modal is open
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/auth/users'),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task created successfully');
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', status: 'Todo', project: '', assignedTo: '', dueDate: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        console.log('Deleting task:', id);
        await api.delete(`/tasks/${id}`);
        toast.success('Task deleted');
        setTasks(prev => prev.filter(t => t._id !== id));
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = (t.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  }), [tasks]);

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Header & Stats Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Mission <span className="text-sky-600">Control</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Manage and monitor tasks across all active projects.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-3 border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <span className="text-sm font-bold text-slate-600">{stats.todo} Todo</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-3 border-amber-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-sm font-bold text-slate-600">{stats.inProgress} In Progress</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-2xl flex items-center gap-3 border-emerald-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-bold text-slate-600">{stats.completed} Completed</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="ml-2 bg-sky-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-sky-500 transition-all shadow-xl shadow-sky-100 active:scale-95"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Filter tasks by name or description..." 
            className="w-full bg-slate-50/50 border border-transparent rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all text-slate-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {['all', 'Todo', 'In Progress', 'Completed'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === opt ? 'bg-white text-sky-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              key={task._id}
              className="card-3d glass-card p-6 rounded-3xl group border-white/60 hover:border-sky-200 transition-all hover:z-50"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Status Indicator */}
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => updateStatus(task._id, task.status === 'Completed' ? 'Todo' : 'Completed')}
                     className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border-2 ${
                       task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 'border-slate-200 text-slate-300 hover:border-sky-400 hover:text-sky-400'
                     }`}
                   >
                     <CheckCircle2 size={24} />
                   </button>
                   <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-500 flex items-center gap-1">
                      <Target size={12} />
                      {task.project?.name || 'No Project'}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate ${task.status === 'Completed' ? 'line-through text-slate-400 opacity-60' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1 line-clamp-1 font-medium">{task.description}</p>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 md:gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-[10px]">
                        {task.assignedTo?.name?.charAt(0) || <User size={12} />}
                      </div>
                      {task.assignedTo?.name || 'Unassigned'}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Calendar size={14} className="text-rose-500" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative group/menu">
                       <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                         <MoreHorizontal size={20} />
                       </button>
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] origin-bottom">
                          {['Todo', 'In Progress', 'Completed'].map(s => (
                            <button 
                              key={s}
                              onClick={() => updateStatus(task._id, s)}
                              className="w-full px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-sky-600 flex items-center justify-between"
                            >
                              Move to {s}
                              <ArrowRight size={14} />
                            </button>
                          ))}
                          <div className="h-px bg-slate-50"></div>
                          <button 
                            onClick={() => deleteTask(task._id)}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center justify-between"
                          >
                            Delete Task
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-[1000] border border-white/20"
            >
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-10 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black">Create Mission</h2>
                  <p className="text-slate-400 mt-2 font-medium">Deploy a new task to your project timeline.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/30">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Task Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="What needs to be done?"
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-slate-800"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Project</label>
                  <select 
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Assign To</label>
                  <select 
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Select Member</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Due Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-slate-700"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Initial Status</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide context and requirements..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium text-slate-600 resize-none"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95"
                  >
                    Deploy Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Users, 
  Shield, 
  Trash2, 
  Mail, 
  Loader2, 
  UserPlus, 
  Search, 
  ShieldCheck,
  User as UserIcon,
  Crown,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/auth/users/${userId}`, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('Attempting to delete user:', userId);
    if (!window.confirm('Are you sure you want to permanently remove this user from the system?')) {
      console.log('Deletion cancelled by user');
      return;
    }

    setDeletingId(userId);
    try {
      console.log('Sending DELETE request for user:', userId);
      const response = await api.delete(`/auth/users/${userId}`);
      console.log('Delete response:', response.data);
      toast.success('User removed successfully');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Delete error details:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to remove user');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Team <span className="text-sky-600">Directory</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Manage permissions and coordinate with your elite squad.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group w-full sm:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-slate-700 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-sky-600 text-white p-3.5 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-500 transition-all active:scale-95">
            <UserPlus size={24} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-5 border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Members</p>
            <h3 className="text-2xl font-black text-slate-900">{users.length}</h3>
          </div>
        </div>
        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-5 border-indigo-200">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Admins</p>
            <h3 className="text-2xl font-black text-slate-900">{users.filter(u => u?.role === 'admin').length}</h3>
          </div>
        </div>
        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-5 border-emerald-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserIcon size={28} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Regular Members</p>
            <h3 className="text-2xl font-black text-slate-900">{users.filter(u => u?.role === 'member').length}</h3>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((member, index) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              key={member._id} 
              className="card-3d glass-card p-0 rounded-[2.5rem] flex flex-col relative overflow-hidden group border-white/60"
            >
              {deletingId === member._id && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-30 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                </div>
              )}

              {/* Card Header Background */}
              <div className={`h-24 w-full bg-gradient-to-br transition-all duration-500 ${
                member.role === 'admin' ? 'from-indigo-600 to-sky-500' : 'from-slate-100 to-slate-200 group-hover:from-sky-100 group-hover:to-sky-50'
              }`}></div>
              
              <div className="px-8 pb-8 -mt-12 relative z-10 flex flex-col items-center text-center">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-3xl border-4 border-white shadow-xl group-hover:rotate-6 transition-transform duration-500 ${
                    member.role === 'admin' ? 'bg-white text-indigo-600' : 'bg-white text-slate-400'
                  }`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  {member.role === 'admin' && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg rotate-12">
                      <Crown size={20} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">{member.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-slate-400 mt-1 font-bold">
                    <Mail size={14} />
                    <span className="text-sm">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                    member.role === 'admin' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    {member.role}
                  </span>
                  <button className="p-2 text-slate-300 hover:text-sky-600 transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>

                {currentUser?.role === 'admin' && (
                  <div className="mt-8 pt-6 border-t border-slate-100 w-full flex items-center justify-between gap-4">
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5">Access Level</p>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 appearance-none cursor-pointer"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member._id, e.target.value)}
                        disabled={member._id === currentUser._id || deletingId === member._id}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => handleDeleteUser(member._id)}
                      disabled={member._id === currentUser._id || deletingId === member._id}
                      className={`mt-4 p-3 rounded-2xl transition-all shadow-sm ${
                        member._id === currentUser._id 
                        ? 'text-slate-200 bg-slate-50 cursor-not-allowed' 
                        : 'text-slate-400 bg-white border border-slate-100 hover:text-rose-600 hover:border-rose-100 hover:shadow-rose-100/50 hover:shadow-lg'
                      }`}
                      title={member._id === currentUser._id ? "Cannot remove yourself" : "Remove user"}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6">
            <Users className="text-slate-200" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Member not found</h2>
          <p className="text-slate-500 mt-2 font-medium">Try searching for a different name or email address.</p>
        </div>
      )}
    </div>
  );
};

export default Team;

import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, 
  Folder, 
  Search, 
  MoreVertical, 
  Trash2, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Edit2,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setNewProject({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setNewProject({ name: project.name, description: project.description });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, newProject);
        toast.success('Project updated!');
      } else {
        await api.post('/projects', newProject);
        toast.success('Project created!');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">Project <span className="text-sky-600">Hub</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Coordinate and track your team's initiatives with precision.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-slate-700 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 font-bold pb-4 -mb-4 transition-all ${viewMode === 'grid' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid size={18} />
            Grid View
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 font-bold pb-4 -mb-4 transition-all ${viewMode === 'list' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ListIcon size={18} />
            List View
          </button>
        </div>
        <button className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-all">
          <Filter size={16} />
          Sort: Newest
        </button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            viewMode === 'grid' ? (
              <motion.div
                layout
                variants={item}
                key={project._id}
                className="card-3d glass-card p-0 rounded-[2.5rem] overflow-hidden group border-white/40"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-100 group-hover:scale-110 transition-transform duration-500">
                      <Folder size={28} />
                    </div>
                    <div className="flex items-center gap-2">
                       {user?.role === 'admin' && (
                         <>
                           <button 
                             onClick={() => openEditModal(project)}
                             className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"
                           >
                             <Edit2 size={18} />
                           </button>
                           <button 
                             onClick={() => deleteProject(project._id)}
                             className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                           >
                             <Trash2 size={18} />
                           </button>
                         </>
                       )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">{project.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-slate-500 font-bold text-xs">
                       <Users size={14} className="text-sky-500" />
                       {project.members?.length || 0} Members
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                layout
                variants={item}
                key={project._id}
                className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-sky-200 transition-all"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Folder size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">{project.name}</h3>
                    <p className="text-slate-500 text-sm truncate">{project.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 ml-8">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Members</span>
                    <span className="text-sm font-bold text-slate-700">{project.members?.length || 0} People</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.role === 'admin' && (
                      <>
                        <button onClick={() => openEditModal(project)} className="p-2 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => deleteProject(project._id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"><Trash2 size={16} /></button>
                      </>
                    )}
                    <ChevronRight className="text-slate-300" size={20} />
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
            <Folder className="text-slate-300" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">No projects found</h2>
          <p className="text-slate-500 mt-2 max-w-sm">
            Try adjusting your search or create a new project to get started.
          </p>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-white/20"
            >
              <div className="bg-slate-950 p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/20 rounded-full -mr-20 -mt-20 blur-3xl" />
                <h2 className="text-3xl font-black relative z-10">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-slate-50/50">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Project Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter project name..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-slate-800"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Description</label>
                  <textarea 
                    required 
                    rows={4}
                    placeholder="Describe the goals and details..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium text-slate-600 resize-none"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-sky-600 text-white py-4 px-6 rounded-2xl font-bold hover:bg-sky-500 transition-all shadow-xl shadow-sky-100 active:scale-95"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
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

export default Projects;

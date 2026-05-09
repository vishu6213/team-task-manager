import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import { MenuBar } from './ui/GlowMenu';
import { LayoutDashboard, FolderKanban, CheckSquare, Users } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = useMemo(() => [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
      iconColor: "text-blue-500",
    },
    {
      icon: FolderKanban,
      label: "Projects",
      href: "/projects",
      gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
      iconColor: "text-orange-500",
    },
    {
      icon: CheckSquare,
      label: "Tasks",
      href: "/tasks",
      gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
      iconColor: "text-green-500",
    },
    {
      icon: Users,
      label: "Team",
      href: "/team",
      gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
      iconColor: "text-red-500",
    },
  ], []);

  const activeItem = useMemo(() => {
    const currentPath = location.pathname;
    const item = menuItems.find(item => currentPath.startsWith(item.href));
    return item ? item.label : "Dashboard";
  }, [location.pathname, menuItems]);

  const handleItemClick = (label, href) => {
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-500 selection:text-white">
      {/* Background gradients for a premium feel */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex flex-col min-h-screen relative z-10">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-10 relative">
          <div className="max-w-7xl mx-auto pb-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Floating Bottom Center Menu */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          >
            <MenuBar 
              items={menuItems} 
              activeItem={activeItem} 
              onItemClick={handleItemClick}
              className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-white/20 bg-slate-900/90"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Layout, 
  Users, 
  Shield, 
  LayoutDashboard, 
  Zap, 
  BarChart3, 
  Globe,
  MessageSquare,
  Send,
  Mail
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    { 
      icon: Zap, 
      title: "Real-time Updates", 
      desc: "Changes are reflected instantly across all devices. No more refreshing pages to see what your team is working on." 
    },
    { 
      icon: BarChart3, 
      title: "Advanced Analytics", 
      desc: "Gain deep insights into project progress and team productivity with our intuitive dashboard and reports." 
    },
    { 
      icon: Globe, 
      title: "Global Collaboration", 
      desc: "Work seamlessly with team members from around the world. Time zone management and multi-language support included." 
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      features: ["Up to 3 Projects", "Unlimited Tasks", "Basic Analytics", "Community Support"],
      buttonText: "Get Started",
      highlight: false
    },
    {
      name: "Professional",
      price: "$29",
      features: ["Unlimited Projects", "Unlimited Tasks", "Advanced Analytics", "Priority Support", "Custom Branding"],
      buttonText: "Go Pro",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$99",
      features: ["Everything in Pro", "Single Sign-On (SSO)", "Dedicated Manager", "SLA Guarantee", "On-premise Options"],
      buttonText: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* Fixed Video Background - Removed Blur */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
            type="video/mp4"
          />
        </video>
        {/* Transparent Overlay for readability without blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-900/80"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 backdrop-blur-md bg-slate-900/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="bg-sky-500 p-2 rounded-lg shadow-lg shadow-sky-500/20">
              <Layout className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TaskFlow</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-sky-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20 flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white font-medium hover:text-sky-300 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-sky-500/20 backdrop-blur-md border border-sky-400/30 px-4 py-1.5 rounded-full text-sky-200 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            New: Enhanced Collaborative Workflow
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-6 tracking-tighter">
            Build Faster <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400">
              With Precision
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Empower your team with a workspace that actually works. Streamlined task management, real-time collaboration, and powerful analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="w-full sm:w-auto bg-sky-500 text-white font-bold px-10 py-5 rounded-2xl hover:bg-sky-600 transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 group text-lg"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/signup" 
                  className="w-full sm:w-auto bg-sky-500 text-white font-bold px-10 py-5 rounded-2xl hover:bg-sky-600 transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2 group text-lg"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  Watch Demo
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6 bg-slate-900/60 backdrop-blur-lg border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Unrivaled Power</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Everything you need to manage complex projects without the unnecessary complexity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all group"
              >
                <div className="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-sky-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Simple Pricing</h2>
            <p className="text-slate-400 text-xl">Choose the plan that fits your team's needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-3xl border transition-all ${
                  plan.highlight 
                    ? 'bg-sky-500/10 border-sky-500 shadow-[0_0_50px_rgba(14,165,233,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-tighter">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-sky-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/30' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}>
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to transform your team?</h2>
              <p className="text-sky-100 text-xl mb-12 max-w-2xl mx-auto font-light">Join thousands of teams who have already streamlined their workflow with TaskFlow.</p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-3 bg-white text-sky-600 font-black px-10 py-5 rounded-2xl hover:bg-slate-100 transition-all shadow-2xl shadow-slate-900/40 text-xl active:scale-95"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-sky-500 p-1.5 rounded-lg">
                <Layout className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TaskFlow</span>
            </div>
            <p className="text-slate-500 leading-relaxed mb-6">The ultimate workspace for modern teams to build, track, and deliver excellence together.</p>
            <div className="flex gap-4">
              {[MessageSquare, Globe, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-sky-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Solutions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-sky-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-slate-500 mb-6">Get the latest updates and news delivered to your inbox.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600 text-sm">
          <p>© 2026 TaskFlow Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookies</a>
          </div>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-sky-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full blur-[200px] pointer-events-none z-0"></div>
    </div>
  );
};

export default Landing;

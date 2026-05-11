import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AuthContext } from "../../context/AuthContext";
import { CheckSquare, Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight, LayoutDashboard } from "lucide-react";

// --- Shader Components (Provided by user) ---

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}) => {
  const { size } = useThree();
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    const material = ref.current.material;
    material.uniforms.u_time.value = timestamp;
  });

  const preparedUniforms = useMemo(() => {
    const prepared = {};
    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];
      switch (uniform.type) {
        case "uniform1f":
          prepared[uniformName] = { value: uniform.value };
          break;
        case "uniform1i":
          prepared[uniformName] = { value: uniform.value };
          break;
        case "uniform3f":
          prepared[uniformName] = { value: new THREE.Vector3().fromArray(uniform.value) };
          break;
        case "uniform1fv":
          prepared[uniformName] = { value: uniform.value };
          break;
        case "uniform3fv":
          prepared[uniformName] = {
            value: uniform.value.map((v) => new THREE.Vector3().fromArray(v)),
          };
          break;
        case "uniform2f":
          prepared[uniformName] = { value: new THREE.Vector2().fromArray(uniform.value) };
          break;
        default:
          break;
      }
    }
    prepared["u_time"] = { value: 0 };
    prepared["u_resolution"] = { value: new THREE.Vector2(size.width * 2, size.height * 2) };
    return prepared;
  }, [uniforms, size]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        uniform vec2 u_resolution;
        varying vec2 vFragCoord;
        void main(){
          gl_Position = vec4(position.x, position.y, 0.0, 1.0);
          vFragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
          vFragCoord.y = u_resolution.y - vFragCoord.y;
        }
      `,
      fragmentShader: source,
      uniforms: preparedUniforms,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });
  }, [source, preparedUniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

const DotMatrix = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = Array(6).fill(colors[0]);
    if (colors.length === 2) {
      colorsArray = [...Array(3).fill(colors[0]), ...Array(3).fill(colors[1])];
    } else if (colors.length === 3) {
      colorsArray = [...Array(2).fill(colors[0]), ...Array(2).fill(colors[1]), ...Array(2).fill(colors[2])];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [color[0] / 255, color[1] / 255, color[2] / 255]),
        type: "uniform3fv",
      },
      u_opacities: { value: opacities, type: "uniform1fv" },
      u_total_size: { value: totalSize, type: "uniform1f" },
      u_dot_size: { value: dotSize, type: "uniform1f" },
      u_reverse: { value: shader.includes("u_reverse_active") ? 1 : 0, type: "uniform1i" },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        varying vec2 vFragCoord;
        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) { return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x); }
        void main() {
            vec2 st = vFragCoord.xy;
            ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
            ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}
            float opacity = step(0.0, st.x) * step(0.0, st.y);
            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
            vec3 color = u_colors[int(show_offset * 6.0)];
            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);
            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);
            if (u_reverse == 1) {
                opacity *= 1.0 - step(timing_offset_outro, u_time * animation_speed_factor);
                opacity *= clamp((step(timing_offset_outro + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                opacity *= step(timing_offset_intro, u_time * animation_speed_factor);
                opacity *= clamp((1.0 - step(timing_offset_intro + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }
            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
    />
  );
};

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize ?? 3}
          opacities={opacities}
          shader={`${reverse ? 'u_reverse_active' : 'false'}_; animation_speed_factor_${animationSpeed.toFixed(1)}_;`}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

const AnimatedNavLink = ({ to, children }) => {
  return (
    <Link to={to} className="group relative inline-block overflow-hidden h-5 flex items-center text-sm">
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-gray-300">{children}</span>
        <span className="text-white">{children}</span>
      </div>
    </Link>
  );
};

function MiniNavbar() {
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const logoElement = (
    <Link to="/" className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
    </Link>
  );

  return (
    <header className={cn(
      "fixed top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center pl-6 pr-6 py-3 backdrop-blur-sm border border-[#333] bg-[#1f1f1f57] w-[calc(100%-2rem)] sm:w-auto transition-[border-radius] duration-300",
      headerShapeClass
    )}>
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">{logoElement}</div>
        <nav className="hidden sm:flex items-center space-x-6 text-sm">
          <AnimatedNavLink to="/">Home</AnimatedNavLink>
          <AnimatedNavLink to="/#features">Features</AnimatedNavLink>
          <AnimatedNavLink to="/#pricing">Pricing</AnimatedNavLink>
        </nav>
        <div className="flex items-center gap-3">
           <Link to="/login" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Login</Link>
           <Link to="/signup" className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-all">Signup</Link>
        </div>
      </div>
    </header>
  );
}

import Preloader from "./Preloader";

export const SignInPage = ({ type = "login" }) => {
  const navigate = useNavigate();
  const { user, login, register } = useContext(AuthContext);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !showPreloader && !isRedirecting) {
      navigate('/dashboard');
    }
  }, [user, navigate, showPreloader, isRedirecting]);

  const handleNext = (e) => {
    e.preventDefault();
    if (type === "login") {
      if (step === 1 && formData.email) setStep(2);
    } else {
      if (step === 1 && formData.name) setStep(2);
      else if (step === 2 && formData.email) setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let success = false;
    try {
      if (type === "login") {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password, formData.role);
      }
    } catch (err) {
      console.error("Auth action failed:", err);
      success = false;
    }

    if (success) {
      setIsRedirecting(true);
      setReverseCanvasVisible(true);
      const timer1 = setTimeout(() => setInitialCanvasVisible(false), 50);
      // Wait for a brief moment of the reverse canvas effect, then start preloader
      const timer2 = setTimeout(() => {
        setShowPreloader(true);
        setIsSubmitting(false);
      }, 1000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setIsSubmitting(false);
    }
  };

  const handlePreloaderComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative overflow-hidden text-white font-sans">
      <AnimatePresence>
        {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_transparent_100%)]" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        <MiniNavbar />

        <div className="flex flex-1 flex-col justify-center items-center px-6">
          <div className="w-full max-w-sm mt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${type}-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">
                    {type === "login" ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p className="text-white/50 font-light">
                    {type === "login" 
                      ? (step === 1 ? "Enter your email to continue" : "Enter your password")
                      : (step === 1 ? "What's your name?" : step === 2 ? "What's your email?" : "Choose a password")
                    }
                  </p>
                </div>

                <form onSubmit={step === (type === "login" ? 2 : 3) ? handleSubmit : handleNext} className="space-y-6">
                  <div className="relative">
                    {type === "login" ? (
                      step === 1 ? (
                        <input 
                          type="email" 
                          placeholder="name@example.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/30 text-center text-lg transition-all"
                        />
                      ) : (
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Your Password"
                            required
                            autoFocus
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/30 text-center text-lg transition-all"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      )
                    ) : (
                      step === 1 ? (
                        <input 
                          type="text" 
                          placeholder="Your Name"
                          required
                          autoFocus
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/30 text-center text-lg transition-all"
                        />
                      ) : step === 2 ? (
                        <input 
                          type="email" 
                          placeholder="name@example.com"
                          required
                          autoFocus
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/30 text-center text-lg transition-all"
                        />
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Create Password"
                              required
                              autoFocus
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/30 text-center text-lg transition-all"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          <select 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-white/30 text-center text-lg transition-all appearance-none cursor-pointer"
                          >
                            <option value="member" className="bg-slate-900">Member Role</option>
                            <option value="admin" className="bg-slate-900">Admin Role</option>
                          </select>
                        </div>
                      )
                    )}

                    <div className="flex gap-4 mt-8">
                      {step > 1 && (
                        <button 
                          type="button"
                          onClick={() => setStep(step - 1)}
                          disabled={isSubmitting}
                          className="flex-1 bg-white/10 text-white font-bold py-4 rounded-full hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          Back
                        </button>
                      )}
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2",
                          step > 1 ? "flex-[2]" : "w-full"
                        )}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            {step === (type === "login" ? 2 : 3) ? (type === "login" ? "Sign In" : "Register") : "Continue"}
                            <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="pt-8">
                  <p className="text-sm text-white/40">
                    {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <Link 
                      to={type === "login" ? "/signup" : "/login"} 
                      onClick={() => setStep(1)}
                      className="text-white hover:underline font-medium"
                    >
                      {type === "login" ? "Sign up" : "Log in"}
                    </Link>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

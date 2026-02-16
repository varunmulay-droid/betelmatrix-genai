import React, { useState, useEffect } from 'react';
import { 
  Server, Activity, ArrowRight, CheckCircle, Cloud, Database, 
  Shield, Zap, Lock, Code, Cpu, LogOut, User, Loader2, Mail
} from 'lucide-react';

// --- GLOBAL CONFIGURATION ---
const VITE_SUPABASE_URL = "https://rrwpstldufkxjbxeygzr.supabase.co";
const VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyd3BzdGxkdWZreGpieGV5Z3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTY5NDgsImV4cCI6MjA4NjI5Mjk0OH0.T2usc1roi-5Aa8jQHEOZkmnnYIQb8EfRCJaZoxfWnFU";

const SUPABASE_CONFIG = {
  url: VITE_SUPABASE_URL,
  anonKey: VITE_SUPABASE_ANON_KEY
};

const App = () => {
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const initSupabase = async () => {
      try {
        if (!window.supabase) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
          script.async = true;
          document.head.appendChild(script);
          script.onload = () => setupClient();
        } else {
          setupClient();
        }
      } catch (err) {
        console.error("Failed to load Supabase:", err);
        setLoading(false);
      }
    };

    const setupClient = () => {
      const { url, anonKey } = SUPABASE_CONFIG;
      if (url && anonKey && window.supabase) {
        const client = window.supabase.createClient(url, anonKey);
        setSupabase(client);
        
        client.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });

        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            setStatusMsg({ type: '', text: '' });
          }
        });

        return () => subscription.unsubscribe();
      } else {
        setLoading(false);
      }
    };

    initSupabase();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    
    setAuthLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        if (error) throw error;
        
        if (data?.session) {
          // Auto-logged in (Email confirmation is likely disabled in Supabase)
          setUser(data.user);
        } else {
          // Verification required
          setStatusMsg({ 
            type: 'verify', 
            text: 'Verification Email Sent! Please check your inbox and click the link to activate your compute portal.' 
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-emerald-500">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#020617]/90 backdrop-blur-xl border-b border-emerald-500/20 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
              <Server className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">BETELMATRIX</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-mono text-emerald-400 hidden sm:block">{user.email}</span>
                <button onClick={handleSignOut} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => document.getElementById('auth-section').scrollIntoView({behavior: 'smooth'})} 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95"
              >
                PARTNER LOGIN
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Compute Infrastructure</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-white">
              Smarter <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Diffusion.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Accelerate enterprise video training by absorbing 100% of the GPU overhead. Distributed infrastructure powered by NVIDIA H100 clusters.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
               <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Shield className="w-3 h-3 text-emerald-500" /> <span>SOC2 COMPLIANT</span>
               </div>
               <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Lock className="w-3 h-3 text-emerald-500" /> <span>AES-256 ENCRYPTION</span>
               </div>
            </div>
          </div>

          <div id="auth-section" className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              {user ? (
                <div className="text-center py-10 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-emerald-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Identity Verified</h3>
                  <p className="text-slate-400 mb-8 text-sm">Welcome back, {user.email}</p>
                  <div className="space-y-3">
                    <button className="w-full bg-emerald-600 py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg text-white uppercase tracking-wider text-sm">Open Training Console</button>
                    <button className="w-full bg-slate-800 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all text-slate-300 uppercase tracking-wider text-sm">API Settings</button>
                  </div>
                </div>
              ) : statusMsg.type === 'verify' ? (
                <div className="text-center py-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="text-cyan-500 w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">Verify Your Email</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    We've sent a magic link to <span className="text-emerald-400 font-mono">{email}</span>. 
                    Please click it to activate your enterprise compute access.
                  </p>
                  <button 
                    onClick={() => setStatusMsg({type:'', text:''})}
                    className="text-emerald-400 font-bold hover:underline text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                      {authMode === 'signin' ? 'Portal Access' : 'Partner Registration'}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">Authorized access to BetelMatrix Compute</p>
                  </div>
                  
                  {statusMsg.text && statusMsg.type === 'error' && (
                    <div className="p-4 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 animate-in shake">
                      {statusMsg.text}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Enterprise Email</label>
                    <input 
                      type="email" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                      placeholder="name@company.ai"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
                    <input 
                      type="password" required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
                      placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    disabled={authLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-4 rounded-xl font-bold text-white transition-all shadow-xl flex items-center justify-center group"
                  >
                    {authLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                      <>
                        <span>{authMode === 'signin' ? 'Verify Identity' : 'Request Partnership'}</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500 mt-6 font-medium">
                    {authMode === 'signin' ? "New prospective partner?" : "Existing member?"}{' '}
                    <button 
                      type="button"
                      onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                      className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                    >
                      {authMode === 'signin' ? 'Apply for Account' : 'Back to Login'}
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#01040f] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 group">
            <Database className="text-emerald-500 w-8 h-8 mb-6 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Relational Storage</h4>
            <p className="text-sm text-slate-400 leading-relaxed">High-availability storage for training meta-data and indices managed by PostgreSQL.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 group">
            <Shield className="text-emerald-500 w-8 h-8 mb-6 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Secure Governance</h4>
            <p className="text-sm text-slate-400 leading-relaxed">JWT-based session management ensuring proprietary model weights stay within your org.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 group">
            <Zap className="text-emerald-500 w-8 h-8 mb-6 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Edge Ingress</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Instant model deployment and low-latency inference across global NVIDIA clusters.</p>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-slate-900 text-center bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Server className="text-emerald-500 w-5 h-5" />
            <span className="text-lg font-black tracking-tighter text-white uppercase">BetelMatrix AI</span>
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-slate-600 uppercase mb-4">
            Secured by AES-256 &bull; Powered by AWS Silicon &bull; Managed via PostgreSQL
          </p>
          <p className="text-xs text-slate-700">
            &copy; {new Date().getFullYear()} BetelMatrix AI Technologies Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

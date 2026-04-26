"use client";
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Activity, Zap, LogOut, Plus, X, Fingerprint, 
  ShieldCheck, Key, Copy, Eye, EyeOff, RefreshCw 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [usage, setUsage] = useState({ used: 0, monthly_limit: 0 });
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const router = useRouter();

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const statusRes = await axios.get(`http://localhost:3000/api/usage-status`, config);
      setUsage(statusRes.data);
      const historyRes = await axios.get(`http://localhost:3000/api/usage-history`, config);
      setHistory(historyRes.data.map((item: any) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      })));
    } catch (err: any) {
      if (err.response?.status === 401) router.push('/login');
    }
  };

  const generateKey = async () => {
    setIsGenerating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:3000/api/generate-key', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiKey(res.data.api_key);
      toast.success("NEW SECRET KEY GENERATED");
    } catch (err) {
      toast.error("KEY GENERATION FAILED");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("KEY COPIED TO CLIPBOARD");
  };

  const handleTopup = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/api/add-units', { units_to_add: topupAmount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`SYSTEM UPDATED: +${topupAmount} UNITS`);
      setIsModalOpen(false);
      fetchData();
    } catch (err) { toast.error("ACCESS DENIED"); }
    finally { setLoading(false); }
  };

  const trackUsage = async () => {
    if (usage.used >= usage.monthly_limit) {
      toast.error("LIMIT REACHED: Please inject more units.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/api/track-usage', { action: "Pulse_Sync" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err: any) { 
      toast.error("LIMIT REACHED"); 
      fetchData();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) { 
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); 
      setApiKey(parsedUser.api_key || '');
      fetchData(); 
    }
    else router.push('/login');
  }, []);

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-[#CCFF00]">LOADING...</div>;

  const isLimitReached = usage.used >= usage.monthly_limit;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      
      <header className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b-2 border-zinc-900 px-4 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Fingerprint size={20} className="text-[#CCFF00]" />
                <span className="text-[10px] tracking-[0.5em] text-zinc-500 uppercase font-black">Secure Access Layer</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
              SAAS<span className="text-[#CCFF00]">PULSE</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/plans" className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-tighter hover:border-[#CCFF00] transition-all">
                <Zap size={14} className="text-[#CCFF00]" /> Upgrade
            </Link>

            {user?.role === 'admin' && (
                <Link href="/admin" className="hidden md:flex items-center gap-2 bg-[#CCFF00] text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-tighter hover:bg-white transition-all">
                    <ShieldCheck size={14} /> Admin Panel
                </Link>
            )}
            
            <div className="hidden md:flex flex-col items-end">
               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-right">
                {user?.role === 'admin' ? "Admin" : "User"}
               </p>
               <p className="text-sm font-bold text-white tracking-tight uppercase text-right">
                {user?.role === 'admin' ? "Syed Dawar Ali Shah" : user.name}
               </p>
            </div>

            <button onClick={() => {localStorage.clear(); router.push('/login');}} className="group p-4 bg-zinc-900 hover:bg-red-500/20 border border-zinc-800 rounded-full transition-all">
              <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-zinc-900/20 border-2 border-zinc-900 p-12 rounded-[4rem] group relative overflow-hidden">
            <span className="text-[#CCFF00] text-[10px] font-black uppercase tracking-[0.6em] mb-12 block">Consumption</span>
            <div className="flex items-end gap-6 mb-16">
              <h2 className={`text-[10rem] font-black tracking-tighter leading-none transition-colors duration-500 ${isLimitReached ? 'text-red-500' : 'text-white group-hover:text-[#CCFF00]'}`}>
                {usage.used}
              </h2>
              <div className="pb-6">
                <span className="text-zinc-700 font-black text-5xl italic">/ {usage.monthly_limit}</span>
              </div>
            </div>
            <div className="w-full bg-zinc-900 h-6 rounded-full overflow-hidden mb-12 p-1 border border-zinc-800">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${isLimitReached ? 'bg-red-500' : 'bg-[#CCFF00]'}`} 
                style={{ width: `${Math.min((usage.used / (usage.monthly_limit || 1)) * 100, 100)}%` }}
              ></div>
            </div>
            
            <button 
                onClick={trackUsage} 
                disabled={isLimitReached}
                className={`px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 
                    ${isLimitReached 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700' 
                        : 'bg-white text-black hover:bg-[#CCFF00]'
                    }`}
            >
                {isLimitReached ? "LIMIT EXCEEDED" : "Execute Pulse"}
            </button>
          </div>

          <div className="bg-[#CCFF00] p-12 rounded-[4rem] flex flex-col justify-between text-black group overflow-hidden relative border-2 border-[#CCFF00]">
            <div className="absolute top-10 right-10 opacity-20 group-hover:scale-125 transition-transform duration-500"><Zap size={100} className="fill-black" /></div>
            <div>
               <h3 className="text-5xl font-black leading-[0.9] mb-8 tracking-tighter italic uppercase">Want<br/>More<br/>Power?</h3>
               <p className="text-black/60 text-sm leading-relaxed font-black max-w-[200px]">Inject additional computing units.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-black text-[#CCFF00] w-full py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] transition-all shadow-2xl">Add Credits</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
            <div className="bg-zinc-900/10 border-2 border-zinc-900 p-12 rounded-[4rem] relative overflow-hidden group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Key size={20} className="text-[#CCFF00]" />
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Secret Pulse Key</h3>
                        </div>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold max-w-md leading-relaxed">
                            Use this key to authorize external requests.
                        </p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-4">
                        <div className="flex items-center gap-2 bg-black border-2 border-zinc-800 p-2 rounded-2xl min-w-[300px] justify-between">
                            <code className="text-[#CCFF00] text-xs font-bold px-4 tracking-wider">
                                {apiKey ? (showKey ? apiKey : "••••••••••••••••••••••••") : "NO KEY GENERATED"}
                            </code>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setShowKey(!showKey)} className="p-3 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-all">
                                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button onClick={() => copyToClipboard(apiKey)} disabled={!apiKey} className="p-3 hover:bg-zinc-900 rounded-xl text-zinc-500 hover:text-[#CCFF00] transition-all disabled:opacity-20">
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                        <button onClick={generateKey} disabled={isGenerating} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#CCFF00] transition-all">
                            <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} />
                            {apiKey ? "Regenerate New Key" : "Generate Access Key"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-zinc-900/10 border-2 border-zinc-900 p-12 rounded-[4rem] mb-12">
          <h3 className="text-[10px] font-black mb-12 flex items-center gap-3 text-zinc-500 uppercase tracking-widest">
            <Activity size={18} className="text-[#CCFF00]" /> Historic Consumption
          </h3>
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#18181b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10, fontWeight: 'bold'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#3f3f46', fontSize: 10}} />
                <Tooltip cursor={{fill: 'rgba(204,255,0,0.05)'}} contentStyle={{ backgroundColor: '#000', border: '2px solid #CCFF00', borderRadius: '12px', color: '#CCFF00', fontWeight: 'bold' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45}>
                  {history.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === history.length - 1 ? '#CCFF00' : '#CCFF0044'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-black w-full max-w-sm border-4 border-[#CCFF00] p-12 shadow-[0_0_100px_rgba(204,255,0,0.15)] rounded-3xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-[#CCFF00]"><X size={24} /></button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic text-center">Injection</h2>
            </div>
            <div className="space-y-8">
                <input type="number" autoFocus className="w-full bg-zinc-900 border-b-4 border-zinc-800 focus:border-[#CCFF00] p-8 text-7xl font-black text-white outline-none transition-all text-center" value={topupAmount} onChange={(e) => setTopupAmount(parseInt(e.target.value) || 0)} />
              <button onClick={handleTopup} disabled={loading} className="w-full bg-[#CCFF00] text-black py-6 font-black uppercase text-xs tracking-[0.3em] transition-all hover:bg-white active:scale-95">Execute Provision</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
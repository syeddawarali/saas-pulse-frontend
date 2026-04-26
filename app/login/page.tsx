"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Fingerprint, ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success(`Welcome, Syed Dawar Ali Shah`, {
        style: { border: '2px solid #CCFF00', background: '#000', color: '#CCFF00' },
      });
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-mono flex flex-col justify-center items-center p-6 text-white">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full mb-6 border border-zinc-800 bg-zinc-900/50">
            <Fingerprint size={32} className="text-[#CCFF00]" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            SAAS<span className="text-[#CCFF00]">PULSE</span>
          </h1>
          <p className="text-zinc-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Fixed Access Protocol</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 p-8 rounded-[2rem] border border-zinc-900 bg-zinc-900/20 shadow-2xl">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-2">Email Node</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="email" 
                placeholder="pulse@dawar.com" 
                className="w-full bg-black border border-zinc-800 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-[#CCFF00] transition-all font-bold text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-2">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-black border border-zinc-800 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-[#CCFF00] transition-all font-bold text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-[#CCFF00] text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 mt-2 hover:bg-white active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
          >
            {loading ? "AUTHENTICATING..." : "ESTABLISH LINK"}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] text-zinc-500 uppercase font-black tracking-widest">
          New Operator? <Link href="/signup" className="text-white underline decoration-[#CCFF00] decoration-2">Register Here</Link>
        </p>
      </div>
    </div>
  );
}
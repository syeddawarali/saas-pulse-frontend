"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Command, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/signup', formData);
      toast.success("Account created successfully!");
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-zinc-900 rounded-full mb-6 border border-zinc-800">
            <Command size={32} className="text-[#CCFF00]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            SAAS<span className="text-[#CCFF00]">PULSE</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-2 font-bold uppercase tracking-widest">Create a new account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4 bg-zinc-900/20 p-8 rounded-[2rem] border-2 border-zinc-900 shadow-2xl">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 ml-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              <input 
                type="text" 
                placeholder="Enter your name" 
                className="w-full bg-black border-2 border-zinc-800 focus:border-[#CCFF00] rounded-2xl p-4 pl-12 text-sm outline-none transition-all font-bold"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-black border-2 border-zinc-800 focus:border-[#CCFF00] rounded-2xl p-4 pl-12 text-sm outline-none transition-all font-bold"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              <input 
                type="password" 
                placeholder="Create a password" 
                className="w-full bg-black border-2 border-zinc-800 focus:border-[#CCFF00] rounded-2xl p-4 pl-12 text-sm outline-none transition-all font-bold"
                value={formData.password || ''}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#CCFF00] transition-all flex items-center justify-center gap-2 mt-2">
            {loading ? "Signing Up..." : "Sign Up"}
            <ArrowRight size={16} />
          </button>
        </form>
        <p className="text-center mt-8 text-[10px] text-zinc-500 uppercase font-black tracking-widest">
          Already have an account? <Link href="/login" className="text-white hover:text-[#CCFF00] underline decoration-[#CCFF00]">Login</Link>
        </p>
      </div>
    </div>
  );
}
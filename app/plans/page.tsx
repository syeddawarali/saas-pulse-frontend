"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Zap, CheckCircle2, Fingerprint, CreditCard, Sparkles, Crown, Shield } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Plans() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const plans = [
    { name: 'Starter', price: '$0', units: '100', features: ['Basic Analytics', 'Standard Support', 'Public Nodes'], icon: Zap },
    { name: 'Professional', price: '$29', units: '1000', features: ['Advanced Pulse', 'Priority Support', 'API Access', 'Master Dashboard'], popular: true, icon: Crown },
    { name: 'Enterprise', price: '$99', units: 'Custom', features: ['Custom Nodes', '24/7 Master Support', 'Full Scale API', 'Whitelabel'], icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-[#CCFF00] selection:text-black">
      
      <header className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b-2 border-zinc-900 px-4 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-3 bg-zinc-900 hover:bg-[#CCFF00] hover:text-black rounded-full transition-all border border-zinc-800">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Fingerprint size={16} className="text-[#CCFF00]" />
                <span className="text-[8px] tracking-[0.5em] text-zinc-500 uppercase font-black">Billing Core</span>
              </div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">SELECT_<span className="text-[#CCFF00]">POWER_LEVEL</span></h1>
            </div>
          </div>
          <div className="hidden md:block text-right">
              <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.2em] mb-1">Authenticated Operator</p>
              <p className="text-xs font-bold text-white uppercase italic">{user?.name || "Syed Dawar Ali Shah"}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-12 pt-16">
        
        <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
                UPGRADE_YOUR_<span className="text-[#CCFF00]">INFRASTRUCTURE</span>
            </h2>
            <p className="text-zinc-500 text-[10px] max-w-xl mx-auto uppercase font-black leading-relaxed tracking-[0.2em]">
                Hover over a tier to initialize connection protocol.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className="group p-12 rounded-[4rem] border-2 border-zinc-900 bg-zinc-900/10 flex flex-col justify-between relative transition-all duration-500 ease-out hover:scale-[1.02] hover:border-[#CCFF00] hover:bg-[#CCFF00]/[0.02] hover:shadow-[0_0_80px_rgba(204,255,0,0.15)]"
            >
              <div className="absolute top-8 right-12 text-zinc-800 group-hover:text-[#CCFF00] group-hover:drop-shadow-[0_0_10px_#CCFF00] transition-all duration-300">
                <plan.icon size={32} />
              </div>

              <div>
                <span className={`text-[8px] font-black uppercase tracking-[0.5em] mb-6 block transition-colors ${plan.popular ? 'text-[#CCFF00]/40 group-hover:text-[#CCFF00]' : 'text-zinc-800 group-hover:text-zinc-500'}`}>
                  {plan.popular ? 'Recommended System' : 'Standard Node'}
                </span>
                
                <h3 className="text-3xl font-black uppercase mb-4 italic tracking-tighter group-hover:text-white">
                  {plan.name}
                </h3>
                
                <div className="flex items-end gap-1 mb-12">
                  <span className="text-6xl font-black leading-none group-hover:text-[#CCFF00] transition-colors">
                    {plan.price}
                  </span>
                  <span className="text-zinc-600 text-[10px] font-black uppercase mb-2">/month</span>
                </div>

                <ul className="space-y-5 mb-12">
                  <li className="flex items-center gap-3 text-xs font-black text-white uppercase tracking-tighter">
                    <Zap size={16} className="text-zinc-700 group-hover:text-[#CCFF00] group-hover:fill-[#CCFF00] transition-all" /> 
                    {plan.units} Units Included
                  </li>
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-zinc-600 italic">
                      <CheckCircle2 size={14} className="text-zinc-800 group-hover:text-zinc-500" /> 
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => toast.error("PAYMENT SYSTEM OFFLINE: ENCRYPTION PENDING")}
                className="w-full py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-600 group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] hover:!bg-[#CCFF00] hover:!text-black hover:shadow-[0_0_30px_rgba(204,255,0,0.4)]"
              >
                <CreditCard size={14} />
                {plan.price === '$0' ? 'Current Tier' : 'Initialize Payment'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/10 border-2 border-zinc-900 p-8 rounded-[3rem] text-center max-w-2xl mx-auto border-dashed hover:border-[#CCFF00]/30 transition-colors group">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic leading-relaxed group-hover:text-zinc-400">
                * All transactions are monitored by master admin Syed Dawar Ali Shah. <br/>
                Secure Payment Protocol: Active
            </p>
        </div>
      </main>
    </div>
  );
}
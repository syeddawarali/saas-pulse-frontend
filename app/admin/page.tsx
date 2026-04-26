"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Activity, CreditCard, ShieldCheck, ArrowLeft, Zap, Search } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [stats, setStats] = useState<any>({ total_users: 0, total_requests: 0, total_topups: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const statsRes = await axios.get('http://localhost:3000/api/admin/stats', config);
      setStats(statsRes.data);
      const usersRes = await axios.get('http://localhost:3000/api/admin/users', config);
      setUsers(usersRes.data);
    } catch (err) { 
      toast.error("ADMIN ACCESS DENIED"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handlePlanChange = async (targetId: number, currentPlan: string) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const isPro = currentPlan.toLowerCase().includes('pro');
    const newPlanId = isPro ? 1 : 2; 

    try {
      await axios.post('http://localhost:3000/api/admin/change-plan', 
        { target_user_id: targetId, new_plan_id: newPlanId }, config
      );
      toast.success(isPro ? "DOWNGRADED TO STARTER" : "UPGRADED TO PRO TIER");
      fetchAdminData(); 
    } catch (err) {
      toast.error("DATABASE UPDATE FAILED");
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono text-[#CCFF00]">
        <div className="w-16 h-16 border-4 border-[#CCFF00]/20 border-t-[#CCFF00] rounded-full animate-spin mb-4"></div>
        <div className="tracking-[0.5em] animate-pulse uppercase text-xs font-black">Decrypting_Admin_Node...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-[#CCFF00] selection:text-black">
      
      <header className="sticky top-0 z-[100] bg-[#050505]/80 backdrop-blur-xl border-b-2 border-zinc-900 px-4 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-4 bg-zinc-900/50 hover:bg-[#CCFF00] hover:text-black rounded-2xl transition-all border border-zinc-800 group shadow-lg shadow-black">
              <ArrowLeft size={24} className="group-hover:scale-110 transition-transform" />
            </Link>
            <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                    ADMIN<span className="text-[#CCFF00] drop-shadow-[0_0_10px_#CCFF00]">_PULSE</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Status: Operational</p>
                </div>
            </div>
          </div>
          <div className="text-right bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
             <p className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.3em] mb-1">Superuser Identity</p>
             <p className="text-sm font-bold text-white uppercase italic text-right">Syed Dawar Ali Shah</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { label: "Total Operators", val: stats.total_users, icon: Users, color: "text-blue-400", glow: "shadow-blue-500/10" },
                { label: "Total Pulses", val: stats.total_requests, icon: Activity, color: "text-[#CCFF00]", glow: "shadow-[#CCFF00]/10" },
                { label: "Total Injections", val: stats.total_topups || 0, icon: CreditCard, color: "text-purple-400", glow: "shadow-purple-500/10" }
            ].map((item, i) => (
                <div key={i} className={`bg-zinc-900/20 border-2 border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-zinc-700 transition-all shadow-xl ${item.glow}`}>
                    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity ${item.color}`}>
                        <item.icon size={80} />
                    </div>
                    <item.icon className={`${item.color} mb-4`} size={28} />
                    <div className="text-5xl font-black tracking-tighter mb-1">{item.val}</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">{item.label}</div>
                </div>
            ))}
        </div>

        <div className="bg-zinc-900/10 border-2 border-zinc-900 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="p-10 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/30">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                    <ShieldCheck className="text-[#CCFF00]" size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Registry_Control</h3>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase">Real-time database sync active</p>
                </div>
             </div>
             <div className="relative group w-full md:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#CCFF00] transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search Operator..." 
                    className="bg-black/50 border-2 border-zinc-800 rounded-2xl py-3 pl-12 pr-6 text-xs outline-none focus:border-[#CCFF00] w-full md:w-80 transition-all font-bold placeholder:text-zinc-800"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900/50 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-zinc-900">
                  <th className="p-10">Operator_Entity</th>
                  <th className="p-10 text-center">Service_Tier</th>
                  <th className="p-10 text-center">Fuel_Units</th>
                  <th className="p-10 text-center">Administrative_Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-zinc-900/50">
                {filteredUsers.map((u: any, index: number) => {
                  const isPro = u.plan_name.toLowerCase().includes('pro');
                  return (
                    <tr key={`${u.user_id}-${index}`} className="hover:bg-[#CCFF00]/[0.02] transition-colors group">
                      <td className="p-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${isPro ? 'bg-[#CCFF00] animate-pulse shadow-[0_0_8px_#CCFF00]' : 'bg-zinc-800'}`}></div>
                            <div>
                                <div className="font-black text-white group-hover:text-[#CCFF00] text-sm uppercase transition-colors">{u.name}</div>
                                <div className="text-[10px] text-zinc-600 font-bold tracking-tight">{u.email}</div>
                            </div>
                        </div>
                      </td>
                      <td className="p-10 text-center">
                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase italic transition-all ${isPro ? 'bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.2)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                          {u.plan_name}
                        </span>
                      </td>
                      <td className="p-10 text-center">
                          <div className="text-lg font-black text-white group-hover:scale-110 transition-transform">{u.extra_units}</div>
                          <div className="text-[8px] text-zinc-700 uppercase font-black tracking-tighter">Injected</div>
                      </td>
                      <td className="p-10 text-center">
                        <button 
                          onClick={() => handlePlanChange(u.user_id, u.plan_name)}
                          className={`inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${!isPro ? 'bg-white text-black hover:bg-[#CCFF00] hover:shadow-[#CCFF00]/20' : 'bg-zinc-900 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-red-500/20'}`}
                        >
                          <Zap size={14} className={!isPro ? 'fill-black' : 'fill-current'} />
                          {!isPro ? 'Go Pro' : 'Restrict'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-zinc-900/30 border-t border-zinc-900 text-center">
             <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.5em]">End of encrypted registry</p>
          </div>
        </div>
      </main>
    </div>
  );
}
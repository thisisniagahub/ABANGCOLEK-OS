/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Download, 
  Users, 
  Plus, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  Flame, 
  Zap, 
  Check, 
  X,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/services/supabaseAuth';
import { appStore } from '@/services/store';

interface GlobalCommandHeaderProps {
  onOpenCommandPalette: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAction?: (msg?: string) => void;
}

export const GlobalCommandHeader: React.FC<GlobalCommandHeaderProps> = ({
  onOpenCommandPalette,
  activeTab,
  setActiveTab,
  onAction
}) => {
  const { user, role, quickStaffSignIn } = useSupabaseAuth();
  const [timeString, setTimeString] = useState<string>('');
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Live Asia/Kuala_Lumpur Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setTimeString(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick Data Export (.XLS / CSV)
  const handleExportData = () => {
    const orders = appStore.getOrders();
    const headers = ['Order ID', 'Pelanggan', 'Bandar', 'Item', 'Status', 'Jumlah (RM)', 'Tarikh'];
    const rows = orders.map(o => [
      o.order_id,
      `"${o.customer_id}"`,
      `"${o.city || 'Kuala Lumpur'}"`,
      `"${o.items || ''}"`,
      o.status,
      o.amount,
      o.date
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ABANGCOLEK_OPERASI_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const teamMembers = [
    { name: 'Megat Epull', role: 'HQ Lead & Founder', avatar: '/assets/brand/epull.png', status: 'online' },
    { name: 'Kak Siti', role: 'Hab Stokis Terengganu', avatar: '/assets/brand/MASKOT-1.PNG', status: 'online' },
    { name: 'Wan Toppen', role: 'Krew Hab Pop-Up JB', avatar: '/assets/brand/MASKOT-2.PNG', status: 'online' },
    { name: 'Pak Mat TBS', role: 'Logistik Bas Ekspres TBS', avatar: '/assets/brand/MASKOT-3.PNG', status: 'busy' },
  ];

  return (
    <>
      <header className="w-full shrink-0 bg-[#0C0E16]/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 md:px-6 py-2.5 flex items-center justify-between gap-3 z-30 select-none">
        {/* Left: Brand Identity & Version */}
        <div className="flex items-center gap-3.5 shrink-0">
          <button 
            onClick={() => setActiveTab('discovery')}
            className="flex items-center gap-3 group text-left transition-transform active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <img 
                src="/assets/brand/ABANG-COLEX-LOGO-2.png" 
                alt="Abang Colek" 
                className="h-9 md:h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,193,7,0.3)] transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#CFFF5E] border-2 border-[#0C0E16] shadow-[0_0_8px_#CFFF5E]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] md:text-[17px] font-black tracking-tight text-white flex items-center gap-1">
                  ABANGCOLEK<span className="text-[#CFFF5E]">™</span>
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#CFFF5E] text-black tracking-wider uppercase shadow-[0_0_10px_rgba(207,255,94,0.3)]">
                  OS PRO
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider flex items-center gap-1">
                <span>Enterprise Tactical Cockpit</span>
                <span className="text-zinc-600">•</span>
                <span className="text-[#FFC107]">v4.2</span>
              </span>
            </div>
          </button>
        </div>

        {/* Center: Omni-Search Command Trigger (Orbital Style) */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-4">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-[#141624] hover:bg-[#181B2C] border border-white/10 hover:border-[#CFFF5E]/40 text-zinc-400 hover:text-white transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] group cursor-pointer"
            title="Buka Pusat Perintah Global (Ctrl+K)"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search size={15} className="text-[#CFFF5E] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-[12.5px] font-medium text-zinc-300 truncate">
                Cari modul operasi, semak bas TBS, pesanan atau JEV triage...
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Mic size={13} className="text-[#8C7DFF]" />
              </div>
              <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold border border-white/15 shadow-xs">
                Ctrl+K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Team Stack, Live MYT Clock, XLS Export & Role Switcher */}
        <div className="flex items-center gap-2.5 md:gap-3.5 shrink-0">
          {/* Live MYT Time Cockpit */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141624] border border-white/10 text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CFFF5E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CFFF5E]" />
            </span>
            <span className="text-white font-bold">{timeString || '18:00:00'}</span>
            <span className="text-zinc-500 font-sans text-[10px]">MYT</span>
          </div>

          {/* Team Avatars Stack (Krew Hab) */}
          <div className="hidden xl:flex items-center">
            <div className="flex -space-x-2 overflow-hidden items-center pr-1">
              {teamMembers.map((member, i) => (
                <div 
                  key={i} 
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0C0E16] overflow-hidden bg-[#181B2C] relative cursor-pointer group"
                  title={`${member.name} (${member.role})`}
                >
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/brand/MASKOT-LOGO.PNG';
                    }}
                  />
                  <span className={cn(
                    "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0C0E16]",
                    member.status === 'online' ? "bg-[#CFFF5E]" : "bg-amber-400"
                  )} />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#181B2C] hover:bg-[#202438] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1 ml-1"
              title="Jemput ahli krew baharu"
            >
              <Plus size={11} className="text-[#CFFF5E]" />
              <span>+5 Krew</span>
            </button>
          </div>

          {/* Instant XLS Export Button */}
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181B2C] hover:bg-[#22263C] text-zinc-200 hover:text-white border border-white/10 text-[11px] font-bold transition-all shadow-xs cursor-pointer group"
            title="Muat turun lejar operasi format .CSV / .XLS"
          >
            <Download size={13} className="text-[#CFFF5E] group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden md:inline">Eksport .XLS</span>
          </button>

          {/* Quick Staff Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsStaffMenuOpen(!isStaffMenuOpen)}
              className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-full bg-gradient-to-r from-[#181B2C] to-[#1F2338] border border-white/15 text-white hover:border-[#CFFF5E]/50 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#CFFF5E] text-black font-extrabold flex items-center justify-center text-[10px] shrink-0">
                {role === 'stockist_kt' ? 'KT' : role === 'crew_toppen' ? 'JB' : 'HQ'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold leading-tight text-white flex items-center gap-1">
                  {role === 'stockist_kt' ? 'Stokis KT' : role === 'crew_toppen' ? 'Krew Toppen' : 'Megat Epull'}
                </span>
                <span className="text-[9px] text-[#CFFF5E] font-medium leading-none">
                  {role === 'stockist_kt' ? 'Pantai Timur Hub' : role === 'crew_toppen' ? 'Selatan Hub' : 'HQ Admin'}
                </span>
              </div>
              <ChevronDown size={13} className={cn("text-zinc-400 transition-transform", isStaffMenuOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isStaffMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#141624] border border-white/15 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 text-[12px]"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-extrabold text-white text-[12px]">Pilihan Profil Operator</p>
                    <p className="text-[10px] text-zinc-400">Tukar peranan tanpa log keluar</p>
                  </div>

                  <button
                    onClick={() => {
                      quickStaffSignIn('hq_admin');
                      setIsStaffMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left",
                      role === 'hq_admin' || !role ? "bg-[#CFFF5E]/15 text-[#CFFF5E] font-bold" : "text-zinc-300 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#CFFF5E]" />
                      <div>
                        <p className="font-bold">Megat Epull (HQ Admin)</p>
                        <p className="text-[10px] text-zinc-400">Pusat Kawalan & Penuh</p>
                      </div>
                    </div>
                    {(role === 'hq_admin' || !role) && <Check size={14} className="text-[#CFFF5E]" />}
                  </button>

                  <button
                    onClick={() => {
                      quickStaffSignIn('stockist_kt');
                      setIsStaffMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left mt-1",
                      role === 'stockist_kt' ? "bg-[#FFC107]/15 text-[#FFC107] font-bold" : "text-zinc-300 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
                      <div>
                        <p className="font-bold">Stokis Terengganu (KT)</p>
                        <p className="text-[10px] text-zinc-400">Penerimaan Kargo Bas TBS</p>
                      </div>
                    </div>
                    {role === 'stockist_kt' && <Check size={14} className="text-[#FFC107]" />}
                  </button>

                  <button
                    onClick={() => {
                      quickStaffSignIn('crew_toppen');
                      setIsStaffMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left mt-1",
                      role === 'crew_toppen' ? "bg-[#8C7DFF]/15 text-[#8C7DFF] font-bold" : "text-zinc-300 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8C7DFF]" />
                      <div>
                        <p className="font-bold">Krew Toppen JB</p>
                        <p className="text-[10px] text-zinc-400">Gerai Pop-Up & Jualan Runcit</p>
                      </div>
                    </div>
                    {role === 'crew_toppen' && <Check size={14} className="text-[#8C7DFF]" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Export Toast Notification */}
      <AnimatePresence>
        {showExportToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 bg-[#161824] border border-[#CFFF5E]/40 text-white px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex items-center gap-2.5 text-xs font-bold"
          >
            <div className="w-6 h-6 rounded-full bg-[#CFFF5E] text-black flex items-center justify-center font-black">
              ✓
            </div>
            <span>Lejar operasi berjaya dieksport (.CSV). Sedia untuk Google Sheets!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#12141F] border border-white/15 p-6 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users className="text-[#CFFF5E]" size={18} />
                  <h3 className="font-black text-base">Senarai Pasukan & Krew Operasi</h3>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="py-4 space-y-3">
                {teamMembers.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#181A28] border border-white/5">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover bg-black" />
                      <div>
                        <p className="font-bold text-xs text-white">{m.name}</p>
                        <p className="text-[10px] text-zinc-400">{m.role}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#CFFF5E]/15 text-[#CFFF5E] border border-[#CFFF5E]/30">
                      Aktif
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-full bg-[#CFFF5E] text-black font-extrabold text-xs hover:bg-[#d8ff6b] transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

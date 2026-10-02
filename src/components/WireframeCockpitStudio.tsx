/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Sliders, 
  User, 
  Package, 
  Bus, 
  Flame, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight, 
  RefreshCw, 
  Radio, 
  ChevronRight, 
  DollarSign, 
  TrendingUp, 
  Music, 
  Ticket, 
  QrCode, 
  Layers, 
  Clock, 
  FileText, 
  MapPin, 
  Bot,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { appStore } from '@/services/store';
import { busFreightService } from '@/services/busFreightService';

interface WireframeCockpitStudioProps {
  onAction: (msg?: string) => void;
  setActiveTab?: (tab: string) => void;
}

export const WireframeCockpitStudio: React.FC<WireframeCockpitStudioProps> = ({
  onAction,
  setActiveTab
}) => {
  const [activeRailTab, setActiveRailTab] = useState<'dashboard' | 'orders' | 'bus' | 'jev' | 'reports'>('dashboard');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [activeStackedCard, setActiveStackedCard] = useState<0 | 1 | 2>(0);
  const [selectedManifestIndex, setSelectedManifestIndex] = useState<number | null>(null);
  
  // Interactive matrix states
  const [shiftTurbo, setShiftTurbo] = useState(true);
  const [dailyQuota, setDailyQuota] = useState(450);
  const [sopAlertActive, setSopAlertActive] = useState(true);
  const [jinglePlaying, setJinglePlaying] = useState(false);
  const [sliderVal, setSliderVal] = useState(78);

  const orders = appStore.getOrders();
  const consignments = busFreightService.getConsignments();
  const reviews = appStore.getReviews();

  const totalGMV = orders.reduce((acc, o) => acc + (o.status !== 'Refunded' ? o.amount : 0), 0);
  const activeBuses = consignments.filter(c => c.status === 'IN_TRANSIT' || c.status === 'ONE_HOUR_ALERT').length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onAction(quickPrompt.trim());
    setQuickPrompt('');
  };

  // Stacked cards data for middle-right widget
  const stackedData = [
    {
      id: 'orders',
      title: 'Pesanan Terkini',
      subtitle: `${orders.length} pesanan disahkan`,
      badge: 'Supabase Realtime',
      badgeColor: 'text-[#CFFF5E] bg-[#CFFF5E]/15 border-[#CFFF5E]/30',
      items: orders.slice(0, 3).map(o => ({
        primary: o.customer_id,
        secondary: `${o.city} • RM ${o.amount}`,
        status: o.status
      }))
    },
    {
      id: 'bus',
      title: 'Kargo Bas TBS',
      subtitle: `${activeBuses} bas aktif dalam transit`,
      badge: 'SOP 1-Jam Aktif',
      badgeColor: 'text-amber-400 bg-amber-400/15 border-amber-400/30',
      items: consignments.slice(0, 3).map(c => ({
        primary: `${c.companyName} (${c.busPlateNo})`,
        secondary: `ETA: ${c.estimatedArrivalTime} • ${c.destinationTerminal}`,
        status: c.status
      }))
    },
    {
      id: 'reviews',
      title: 'Maklum Balas JEV',
      subtitle: `${reviews.length} ulasan pelanggan`,
      badge: 'Invarian Terkunci',
      badgeColor: 'text-purple-400 bg-purple-400/15 border-purple-400/30',
      items: reviews.slice(0, 3).map(r => ({
        primary: `Order #${r.order_id}`,
        secondary: r.comment_message,
        status: r.issue_class || 'PRAISE'
      }))
    }
  ];

  // Manifest cards data for bottom-right widget
  const manifests = [
    {
      id: 'BATCH-4021',
      title: 'Lot #4021: Kuah Colek 500g',
      sku: 'SKU-COLEK-500G',
      qty: '450 Botol',
      status: 'QC LULUS',
      color: 'from-[#1E293B] to-[#0F172A]',
      border: 'border-emerald-500/40'
    },
    {
      id: 'WB-SANI-8821',
      title: 'Waybill TBS #WXY-8821',
      sku: 'Sani Express -> Terengganu',
      qty: '50 Botol',
      status: 'DI TRANSIT',
      color: 'from-[#2D1B36] to-[#170E1C]',
      border: 'border-purple-500/40'
    },
    {
      id: 'VOUCHER-STYLO',
      title: 'Baucar Promo TikTok Live',
      sku: '@styloairpool Beli 3 Percuma 1',
      qty: 'RM 1,260 GMV',
      status: 'DITEBUS (45)',
      color: 'from-[#2A2312] to-[#141006]',
      border: 'border-amber-500/40'
    }
  ];

  return (
    <div className="w-full bg-[#08090E] p-2 sm:p-4 md:p-6 text-white font-sans selection:bg-[#CFFF5E] selection:text-black">
      {/* ========================================================================= */}
      {/* COCKPIT CHASSIS FRAME (REPLICATING THE WIREFRAME TABLET CASING)          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[44px] bg-[#0E1019] border-2 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-3 sm:p-5 md:p-6 relative overflow-hidden">
        
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#CFFF5E]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Master Cockpit Grid (Mobile-first 1-col, Desktop Asymmetric Bento Studio) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 relative z-10">

          {/* ===================================================================== */}
          {/* 1. LEFT VERTICAL ACTION & DOCK RAIL (COL-SPAN 1 ON DESKTOP)          */}
          {/* ===================================================================== */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col justify-between items-center bg-[#131522] rounded-[24px] sm:rounded-[32px] p-2 sm:p-3 border border-white/10 shadow-lg relative">
            
            {/* Top Star/Sparkle Quick AI Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onAction("Buka pusat bantuan AI & semak status integriti operasi terkini.")}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#FF4757] via-[#FFA000] to-[#CFFF5E] flex items-center justify-center text-black font-black shadow-lg cursor-pointer shrink-0"
              title="Pusat Perintah Pintar AI (Sparkle Trigger)"
            >
              <Sparkles size={18} className="fill-black text-black" />
            </motion.button>

            {/* Middle Vertical Pill Container (5 Navigation / Metric Nodes) */}
            <div className="flex flex-row lg:flex-col items-center gap-2.5 p-2 bg-[#0C0E16] rounded-full border border-white/10 my-2 shadow-inner">
              <button
                onClick={() => {
                  setActiveRailTab('dashboard');
                  setActiveTab && setActiveTab('dashboards');
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                  activeRailTab === 'dashboard' 
                    ? "bg-[#CFFF5E] text-black shadow-[0_0_10px_#CFFF5E]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
                title="Bento Dashboard"
              >
                <Activity size={14} />
              </button>

              <button
                onClick={() => {
                  setActiveRailTab('orders');
                  setActiveTab && setActiveTab('orders');
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                  activeRailTab === 'orders' 
                    ? "bg-[#CFFF5E] text-black shadow-[0_0_10px_#CFFF5E]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
                title="Pesanan Langsung"
              >
                <Package size={14} />
              </button>

              <button
                onClick={() => {
                  setActiveRailTab('bus');
                  setActiveTab && setActiveTab('bus_freight');
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                  activeRailTab === 'bus' 
                    ? "bg-[#CFFF5E] text-black shadow-[0_0_10px_#CFFF5E]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
                title="Kargo Bas TBS"
              >
                <Bus size={14} />
              </button>

              <button
                onClick={() => {
                  setActiveRailTab('jev');
                  setActiveTab && setActiveTab('discovery');
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                  activeRailTab === 'jev' 
                    ? "bg-[#CFFF5E] text-black shadow-[0_0_10px_#CFFF5E]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
                title="JEV Discovery Engine"
              >
                <Flame size={14} />
              </button>

              <button
                onClick={() => {
                  setActiveRailTab('reports');
                  setActiveTab && setActiveTab('reports');
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                  activeRailTab === 'reports' 
                    ? "bg-[#CFFF5E] text-black shadow-[0_0_10px_#CFFF5E]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
                title="Laporan Eksekutif"
              >
                <FileText size={14} />
              </button>
            </div>

            {/* Organic Connector Node (Protrudes to Hero Viewport on Desktop) */}
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#181A28] border-2 border-white/20 shadow-md flex items-center justify-center z-20">
              <span className="w-2 h-2 rounded-full bg-[#CFFF5E] animate-pulse" />
            </div>

            {/* Bottom Status Dot & Operator Avatar Button */}
            <div className="flex flex-row lg:flex-col items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online Telemetry" />
              <button
                onClick={() => onAction("Tukar profil atau buka konfigurasi akaun pengasas Megat Epull.")}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#CFFF5E] transition-colors cursor-pointer bg-zinc-900"
                title="Megat Epull (Founder & Ops Lead)"
              >
                <img 
                  src="/assets/brand/founder.png" 
                  alt="Megat Epull" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/brand/epull.png';
                  }}
                />
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. CENTER STAGE: DOMINANT HERO VIEWPORT (COL-SPAN 7 ON DESKTOP)       */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Massive Hero Canvas with Central Avatar & Floating Command Pill */}
            <div className="rounded-[28px] sm:rounded-[36px] bg-[#121422] border border-white/10 shadow-2xl p-5 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[400px]">
              
              {/* Radial Focal Atmosphere */}
              <div className="absolute inset-0 bg-radial from-[#1A1D30] via-[#121422] to-[#0A0C14] pointer-events-none" />
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-[#CFFF5E] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CFFF5E] animate-pulse" />
                  REALTIME BUSINESS OS v4.2
                </span>
              </div>

              {/* Central Silhouette / Founder Focal Identity */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
                <div className="relative group cursor-pointer mb-3" onClick={() => onAction("Buka profil pengasas dan status pencapaian GMV semasa.")}>
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-gradient-to-tr from-[#CFFF5E] via-blue-500 to-[#FF4757] shadow-2xl transition-transform duration-300 group-hover:scale-105">
                    <div className="w-full h-full rounded-full bg-[#0D0F18] border-2 border-white/90 overflow-hidden flex items-center justify-center">
                      <img 
                        src="/assets/brand/founder.png" 
                        alt="Megat Epull" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <User size={38} className="text-zinc-400 group-hover:text-white" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#CFFF5E] text-black border-2 border-[#121422] flex items-center justify-center text-[10px] font-black">
                    ✓
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Pusat Kawalan Eksekutif Abang Colek
                </h2>
                <p className="text-xs text-zinc-400 max-w-md font-medium mt-1">
                  Megat Epull • 3 Hab Utama (Larkin, Toppen JB, Shah Alam)
                </p>

                {/* Primary Metric Ribbons */}
                <div className="flex items-center gap-4 mt-4 flex-wrap justify-center font-mono">
                  <div className="px-3.5 py-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <DollarSign size={13} className="text-[#FFC107]" />
                    <span className="text-xs text-zinc-400">GMV:</span>
                    <strong className="text-sm font-black text-white">RM {totalGMV.toLocaleString()}</strong>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <Bus size={13} className="text-blue-400" />
                    <span className="text-xs text-zinc-400">Transit:</span>
                    <strong className="text-sm font-black text-[#CFFF5E]">{activeBuses} Bas TBS</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Floating Quick Command Pill Bar with (+) Button */}
              <div className="relative z-10 w-full max-w-lg mx-auto sm:mx-0">
                <form 
                  onSubmit={handleQuickSubmit}
                  className="rounded-full bg-[#0C0E16]/95 border border-white/20 p-1.5 pl-2 flex items-center gap-2 shadow-2xl backdrop-blur-md focus-within:border-[#CFFF5E] transition-all"
                >
                  <button
                    type="button"
                    onClick={() => onAction("Tambah pesanan baru atau jana penghantaran bas sekarang.")}
                    className="w-8 h-8 rounded-full bg-[#CFFF5E] text-black flex items-center justify-center hover:bg-[#d8ff6b] transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
                    title="Tambah Tindakan Baharu (+)"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>

                  <input 
                    type="text"
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    placeholder="Taip arahan AI atau kemas kini operasi..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none font-medium px-2"
                  />

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Hantar
                  </button>
                </form>
              </div>

            </div>

            {/* =================================================================== */}
            {/* 3. BOTTOM CENTER TACTILE MATRIX CONSOLE (MATCHING WIREFRAME)        */}
            {/* =================================================================== */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-[#121422] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-white/10 text-[#CFFF5E] border border-white/15">
                    KONSOL TAKTIKAL 3x3
                  </span>
                  <span className="text-[11px] font-bold text-zinc-400">Suis Operasi Gerai & Krew</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">MATRIX 8-PILL</span>
              </div>

              {/* 3-Column Pill Matrix (Exact layout from wireframe: 3-3-2 Pills) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                
                {/* Column 1: Mode & Quota Controls (3 pills) */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShiftTurbo(!shiftTurbo)}
                    className={cn(
                      "w-full px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer border",
                      shiftTurbo 
                        ? "bg-[#CFFF5E] text-black border-[#CFFF5E] shadow-sm font-extrabold" 
                        : "bg-[#181A28] text-zinc-400 border-white/10 hover:text-white"
                    )}
                  >
                    <span>Mod Sif: {shiftTurbo ? 'PUNCAK' : 'BIASA'}</span>
                    <Zap size={13} className={shiftTurbo ? "text-black fill-black" : "text-zinc-500"} />
                  </button>

                  <button
                    onClick={() => setDailyQuota(prev => Math.min(1000, prev + 25))}
                    className="w-full px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center justify-between bg-[#181A28] border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  >
                    <span>Sasaran: {dailyQuota} btl</span>
                    <Plus size={13} className="text-[#CFFF5E]" />
                  </button>

                  <div className="w-full px-3 py-2 rounded-2xl text-[11px] font-mono flex items-center justify-between bg-[#181A28] border border-white/5 text-zinc-400">
                    <span>Halaju Jualan:</span>
                    <span className="text-[#FFC107] font-bold">18 btl/j</span>
                  </div>
                </div>

                {/* Column 2: Inventory & Freight Controls (3 pills) */}
                <div className="space-y-2">
                  <button
                    onClick={() => onAction("Semak baki inventori kuah colek 500g dan botol kaca.")}
                    className="w-full px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center justify-between bg-[#181A28] border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <span>Stok 500g: 450 btl</span>
                    <Package size={13} className="text-emerald-400" />
                  </button>

                  <button
                    onClick={() => setSopAlertActive(!sopAlertActive)}
                    className={cn(
                      "w-full px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer border",
                      sopAlertActive 
                        ? "bg-red-950/80 text-red-300 border-red-800/40 animate-pulse" 
                        : "bg-[#181A28] text-zinc-400 border-white/10"
                    )}
                  >
                    <span>SOP 1-Jam: {sopAlertActive ? 'AKTIF' : 'REHAT'}</span>
                    <Bus size={13} />
                  </button>

                  <div className="w-full px-3 py-2 rounded-2xl text-[11px] font-mono flex items-center justify-between bg-[#181A28] border border-white/5 text-zinc-400">
                    <span>DuitNow QR:</span>
                    <span className="text-emerald-400 font-bold">100% OK</span>
                  </div>
                </div>

                {/* Column 3: Quality & Media Controls (2 pills) */}
                <div className="space-y-2">
                  <div className="w-full px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center justify-between bg-[#181A28] border border-white/10 text-purple-300">
                    <span>Invarian JEV: Kunci</span>
                    <ShieldCheck size={14} className="text-purple-400" />
                  </div>

                  <button
                    onClick={() => setJinglePlaying(!jinglePlaying)}
                    className={cn(
                      "w-full px-3 py-2 rounded-2xl text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer border",
                      jinglePlaying 
                        ? "bg-[#FFC107] text-black border-[#FFC107]" 
                        : "bg-[#181A28] text-zinc-400 border-white/10 hover:text-white"
                    )}
                  >
                    <span>Jingle: {jinglePlaying ? 'Dimainkan' : 'Mute'}</span>
                    <Music size={13} className={jinglePlaying ? "animate-bounce" : ""} />
                  </button>
                </div>

              </div>

              {/* Bottom Tactile Linear Slider with Graduations (From Wireframe) */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                  <span>Pencapaian Kuota Harian</span>
                  <span className="text-[#CFFF5E] font-bold">{sliderVal}% Selesai</span>
                </div>
                <div className="relative w-full h-3 bg-[#0C0E16] rounded-full p-0.5 border border-white/10 flex items-center overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 via-[#CFFF5E] to-emerald-400 rounded-full transition-all"
                    style={{ width: `${sliderVal}%` }}
                  />
                  {/* Graduation Notch Marks */}
                  <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-40">
                    {[...Array(9)].map((_, i) => (
                      <span key={i} className="w-0.5 h-full bg-white/40" />
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. RIGHT COLUMN: STACKED OVERLAPPING CARDS & MANIFEST DECK (COL-4)     */}
          {/* ===================================================================== */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Top Right Status Pill (Matching Top-Right Pill in Wireframe) */}
            <div className="rounded-full bg-[#121422] border border-white/10 px-4 py-2.5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CFFF5E] animate-ping" />
                <span className="text-xs font-black text-white">Telemetri Satelit & Peta</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                8 Bas GPS Aktif
              </span>
            </div>

            {/* Middle Right: Cascading Stacked Multi-Cards (Overlapping Depth with Tabs) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-[#121422] border border-white/10 p-5 shadow-xl flex flex-col justify-between min-h-[300px] relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10 z-10 relative">
                <div>
                  <h3 className="text-sm font-black text-white">Kad Lapisan Timbunan (Stacked Cards)</h3>
                  <p className="text-[10px] text-zinc-400">Sentuh tab kiri untuk bawa kad ke hadapan</p>
                </div>
                <Layers size={16} className="text-[#CFFF5E]" />
              </div>

              {/* Overlapping Stack Canvas with Tab Grips */}
              <div className="relative h-56 mt-3 z-10">
                {stackedData.map((card, idx) => {
                  const isTop = activeStackedCard === idx;
                  const offset = (idx - activeStackedCard);
                  const zIndex = isTop ? 30 : 20 - idx;
                  const translateY = isTop ? 0 : (idx * 14);
                  const scale = isTop ? 1 : 0.96 - (idx * 0.02);

                  return (
                    <motion.div
                      key={card.id}
                      animate={{ 
                        y: translateY,
                        scale: scale,
                        opacity: isTop ? 1 : 0.75
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      onClick={() => setActiveStackedCard(idx as 0 | 1 | 2)}
                      style={{ zIndex }}
                      className={cn(
                        "absolute inset-x-0 top-0 rounded-2xl p-4 border transition-shadow cursor-pointer select-none",
                        isTop 
                          ? "bg-[#181A2A] border-white/20 shadow-2xl" 
                          : "bg-[#131520] border-white/10"
                      )}
                    >
                      {/* Left Tab Handle (Matching Wireframe Overlap Tabs) */}
                      <div className="absolute -left-2 top-4 w-3 h-8 rounded-l-md bg-[#CFFF5E] border-l border-y border-black/40 shadow-sm" />

                      <div className="flex items-center justify-between mb-2 pl-1">
                        <div>
                          <h4 className="text-xs font-black text-white">{card.title}</h4>
                          <span className="text-[9.5px] text-zinc-400">{card.subtitle}</span>
                        </div>
                        <span className={cn("text-[9px] font-extrabold px-2 py-0.5 rounded-full border", card.badgeColor)}>
                          {card.badge}
                        </span>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-1.5 pl-1 mt-3">
                        {card.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] p-1.5 rounded-xl bg-black/30 border border-white/5">
                            <span className="font-bold text-zinc-200 truncate max-w-[150px]">{item.primary}</span>
                            <span className="text-[10px] font-mono text-zinc-400">{item.secondary}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Quick Switch Indicator */}
              <div className="flex justify-center gap-1.5 pt-2 border-t border-white/10 z-10 relative">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStackedCard(i as 0 | 1 | 2)}
                    className={cn(
                      "h-1.5 rounded-full transition-all cursor-pointer",
                      activeStackedCard === i ? "w-6 bg-[#CFFF5E]" : "w-2 bg-zinc-700"
                    )}
                  />
                ))}
              </div>

            </div>

            {/* Bottom Right: Fanned-Out Manifest Deck (Angled Cascading Deck) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-[#121422] border border-white/10 p-5 shadow-xl flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
              
              <div className="flex items-center justify-between pb-2 border-b border-white/10 z-10 relative">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-[#FFC107]/20 text-[#FFC107] border border-[#FFC107]/30">
                    DEK MANIFEST RESIT
                  </span>
                  <span className="text-[11px] font-bold text-zinc-400">3 Baucar Batch</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FFC107]">
                  <Ticket size={14} />
                </div>
              </div>

              {/* Fanned-Out Diagonal Deck of Cards */}
              <div className="relative h-28 my-2 flex items-center justify-center z-10">
                {manifests.map((man, i) => {
                  const isHovered = selectedManifestIndex === i;
                  const rotation = (i - 1) * 7;
                  const translateX = (i - 1) * 36;
                  const translateY = i * 4;

                  return (
                    <motion.div
                      key={man.id}
                      animate={{
                        rotate: isHovered ? 0 : rotation,
                        x: isHovered ? 0 : translateX,
                        y: isHovered ? -10 : translateY,
                        scale: isHovered ? 1.05 : 1
                      }}
                      whileHover={{ scale: 1.08, zIndex: 40 }}
                      onMouseEnter={() => setSelectedManifestIndex(i)}
                      onMouseLeave={() => setSelectedManifestIndex(null)}
                      onClick={() => onAction(`Siasat rekod manifest ${man.id}: ${man.title} bagi sku ${man.sku}.`)}
                      className={cn(
                        "absolute w-52 p-3 rounded-2xl bg-gradient-to-br border shadow-xl cursor-pointer transition-all",
                        man.color,
                        man.border
                      )}
                      style={{ zIndex: 10 + i }}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono font-bold text-zinc-400">{man.id}</span>
                        <span className="font-extrabold text-[9px] text-[#CFFF5E]">{man.status}</span>
                      </div>
                      <p className="text-[11px] font-black text-white truncate mt-1">{man.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-300 mt-1 font-mono">
                        <span className="truncate max-w-[100px]">{man.sku}</span>
                        <strong className="text-white font-black">{man.qty}</strong>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center pt-2 border-t border-white/10 text-[10px] text-zinc-400 font-medium z-10 relative">
                Sentuh kad untuk semak integriti nombor lot kilang & resit bas
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

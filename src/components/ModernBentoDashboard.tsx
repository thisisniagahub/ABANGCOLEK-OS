/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Bus, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  MapPin, 
  Flame, 
  Zap, 
  RefreshCw, 
  SlidersHorizontal, 
  Layers, 
  Send, 
  Eye, 
  Users, 
  QrCode, 
  Calendar, 
  Sparkles, 
  Plus, 
  Minus,
  ChevronRight, 
  Bot,
  Activity,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Play,
  Pause,
  Power,
  Volume2,
  Headphones,
  Sliders,
  Award,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Grid,
  Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { appStore } from '@/services/store';
import { busFreightService, BusConsignment } from '@/services/busFreightService';
import { AgentInsightCard } from './AgentInsightCard';
import { WireframeCockpitStudio } from './WireframeCockpitStudio';

export interface ModernBentoDashboardProps {
  onAction: (msg?: string) => void;
  setActiveTab?: (tab: string) => void;
}

type OperationalZone = 'all' | 'pantai_timur' | 'selatan' | 'klang_valley';
type TimeframeOption = 'today' | '7d' | '30d';
type MetricMode = 'gmv' | 'bottles';
type GridLayoutMode = 'cockpit_studio' | 'balanced' | 'chart_focus' | 'ops_focus';

export const ModernBentoDashboard: React.FC<ModernBentoDashboardProps> = ({
  onAction,
  setActiveTab
}) => {
  const [selectedZone, setSelectedZone] = useState<OperationalZone>('all');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7d');
  const [metricMode, setMetricMode] = useState<MetricMode>('gmv');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic Grid Layout & Dynamic Row Span State
  const [gridLayoutMode, setGridLayoutMode] = useState<GridLayoutMode>('balanced');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Visual Grid Overlay for Layout Debugging & Spacing Management
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(false);
  const [gridOverlayTheme, setGridOverlayTheme] = useState<'cyan' | 'lime' | 'magenta'>('cyan');
  const [showGutterMarkers, setShowGutterMarkers] = useState<boolean>(true);

  // Dynamic individual card row span tracking (1, 2, or 3 rows) to maximize screen real estate
  const [cardRowSpans, setCardRowSpans] = useState<Record<string, number>>({
    chart: 2,
    quota: 1,
    bus: 1,
    stock: 1,
    tiktok: 1,
    jev: 2,
    agent: 2
  });

  const toggleCardRowSpan = (cardId: string, minSpan: number = 1, maxSpan: number = 2) => {
    setCardRowSpans(prev => {
      const current = prev[cardId] || minSpan;
      const next = current === maxSpan ? minSpan : maxSpan;
      return { ...prev, [cardId]: next };
    });
  };

  const handleLayoutModeChange = (mode: GridLayoutMode) => {
    setGridLayoutMode(mode);
    setExpandedCardId(null);
    if (mode === 'cockpit_studio' || mode === 'balanced') {
      setCardRowSpans({
        chart: 2,
        quota: 1,
        bus: 1,
        stock: 1,
        tiktok: 1,
        jev: 2,
        agent: 2
      });
    } else if (mode === 'chart_focus') {
      setCardRowSpans({
        chart: 3,
        quota: 1,
        bus: 1,
        stock: 1,
        tiktok: 1,
        jev: 2,
        agent: 2
      });
    } else if (mode === 'ops_focus') {
      setCardRowSpans({
        chart: 2,
        quota: 2,
        bus: 2,
        stock: 2,
        tiktok: 1,
        jev: 3,
        agent: 2
      });
    }
  };

  // Tactile Interactive Controls (Target Quota & Shift Power)
  const [dailyTargetBottles, setDailyTargetBottles] = useState<number>(250);
  const [isShiftActive, setIsShiftActive] = useState<boolean>(true);
  const [fanMode, setFanMode] = useState<'normal' | 'turbo'>('turbo');

  // Music Player for Lagu Rasmi "Kasi Lagi-Lagi"
  const [isPlayingJingle, setIsPlayingJingle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleJingle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/kasi-lagi-lagi.mp3');
      audioRef.current.onended = () => setIsPlayingJingle(false);
    }
    if (isPlayingJingle) {
      audioRef.current.pause();
      setIsPlayingJingle(false);
    } else {
      audioRef.current.play().catch(e => console.log('Audio playback prevented:', e));
      setIsPlayingJingle(true);
    }
  };

  // Tactile Quick Toggles
  const [bottleStockAlert, setBottleStockAlert] = useState(false);
  const [sopOneHourActive, setSopOneHourActive] = useState(true);

  // Live Freight from Service
  const consignments = useMemo(() => {
    return busFreightService.getConsignments();
  }, [isRefreshing]);

  // Hourly / Daily Trend Data based on Timeframe & Zone
  const chartData = useMemo(() => {
    if (timeframe === 'today') {
      return [
        { time: '08:00', gmv: 3400, bottles: 120, target: 3000, label: '08:00 Pagi' },
        { time: '10:00', gmv: 6800, bottles: 245, target: 6000, label: '10:00 Pagi' },
        { time: '12:00', gmv: 14200, bottles: 510, target: 12000, label: '12:00 Tgh (Puncak)' },
        { time: '14:00', gmv: 19800, bottles: 715, target: 18000, label: '02:00 Petang' },
        { time: '16:00', gmv: 26500, bottles: 960, target: 24000, label: '04:00 Petang' },
        { time: '18:00', gmv: 34200, bottles: 1230, target: 30000, label: '06:00 Ptg (Pasar Karat)' },
        { time: '20:00', gmv: 41800, bottles: 1510, target: 38000, label: '08:00 Mlm (TikTok Live)' },
        { time: '22:00', gmv: 48900, bottles: 1765, target: 45000, label: '10:00 Malam' }
      ];
    } else if (timeframe === '7d') {
      return [
        { time: 'Isn', gmv: 18400, bottles: 660, target: 16000, label: 'Isnin' },
        { time: 'Sel', gmv: 21200, bottles: 760, target: 18000, label: 'Selasa' },
        { time: 'Rab', gmv: 19800, bottles: 710, target: 18000, label: 'Rabu' },
        { time: 'Kha', gmv: 24500, bottles: 880, target: 20000, label: 'Khamis' },
        { time: 'Jum', gmv: 32600, bottles: 1180, target: 28000, label: 'Jumaat (Puncak TBS)' },
        { time: 'Sab', gmv: 42100, bottles: 1520, target: 35000, label: 'Sabtu (Gerai Toppen)' },
        { time: 'Ahd', gmv: 38900, bottles: 1410, target: 32000, label: 'Ahad (Pasar Karat JB)' }
      ];
    } else {
      return [
        { time: 'Mggu 1', gmv: 112000, bottles: 4050, target: 100000, label: 'Minggu 1' },
        { time: 'Mggu 2', gmv: 135000, bottles: 4880, target: 120000, label: 'Minggu 2' },
        { time: 'Mggu 3', gmv: 148250, bottles: 5294, target: 130000, label: 'Minggu 3 (Semasa)' },
        { time: 'Mggu 4', gmv: 165000, bottles: 5900, target: 150000, label: 'Minggu 4 (Unjuran)' }
      ];
    }
  }, [timeframe]);

  const zoneMultiplier = selectedZone === 'all' ? 1.0 : selectedZone === 'pantai_timur' ? 0.38 : selectedZone === 'selatan' ? 0.42 : 0.20;
  const currentGMV = Math.round(148250 * zoneMultiplier);
  const targetGMV = Math.round(180000 * zoneMultiplier);
  const currentBottles = Math.round(5294 * zoneMultiplier);
  const completionPct = Math.min(100, Math.round((currentGMV / targetGMV) * 100));

  // Regional Hubs Data
  const regionalHubs = [
    { 
      name: 'Hab Selatan (Larkin JB & Toppen)', 
      stockist: 'Cikgu Din & Kru Toppen', 
      stockBottles: 840, 
      status: 'OPTIMAL',
      zone: 'selatan'
    },
    { 
      name: 'Hab Pantai Timur (MBKT Terengganu)', 
      stockist: 'Kak Mas (@jeruxsliurleleh)', 
      stockBottles: 210, 
      status: 'RESTOCK_NEEDED',
      zone: 'pantai_timur'
    },
    { 
      name: 'Hab Pantai Timur (Lembah Sireh KB)', 
      stockist: 'Wan Ejen Kelantan', 
      stockBottles: 490, 
      status: 'OPTIMAL',
      zone: 'pantai_timur'
    },
    { 
      name: 'Hab Lembah Klang (TBS & Shah Alam)', 
      stockist: 'Pn. Siti', 
      stockBottles: 650, 
      status: 'OPTIMAL',
      zone: 'klang_valley'
    }
  ].filter(h => selectedZone === 'all' || h.zone === selectedZone);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-28 md:pb-24 text-zinc-100 bg-[#090A0F] selection:bg-[#CFFF5E] selection:text-black overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
      
      {/* ========================================================================= */}
      {/* 1. COHESIVE EXECUTIVE COMMAND HEADER BAR (RESPONSIVE CSS GRID)            */}
      {/* ========================================================================= */}
      <div className="rounded-[32px] bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#1E1B4B] p-6 sm:p-7 border border-blue-400/20 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-center relative z-10">
          
          {/* Left: Branding & Greeting (Grid Col Span 6) */}
          <div className="xl:col-span-6 flex items-center gap-4">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 bg-gradient-to-tr from-[#CFFF5E] via-[#8C7DFF] to-[#FFC107] shadow-lg">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 border-2 border-white/90">
                  <img 
                    src="/assets/brand/founder.png" 
                    alt="Megat Shaifulreza" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#CFFF5E] border-2 border-blue-900 flex items-center justify-center text-[10px] font-black text-black">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-200">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 text-[#CFFF5E] border border-blue-400/30 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CFFF5E] animate-pulse" />
                  Sistem Beroperasi · Asia/Kuala_Lumpur
                </span>
                <span className="text-blue-300/60">·</span>
                <span className="font-mono text-blue-300 text-[11px]">HQ Executive v4.3</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Pusat Kawalan Operasi Abang Colek</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFC107] text-black font-extrabold uppercase tracking-wide">
                  Live
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/80 font-medium">
                Sinergi peruncitan kuah colek, konsinan bas ekspres TBS & klasifikasi integriti JEV System-1.
              </p>
            </div>
          </div>

          {/* Right: Symmetrical Segmented Filters & Grid Mode Selector (Grid Col Span 6) */}
          <div className="xl:col-span-6 flex flex-wrap items-center gap-2.5 justify-start xl:justify-end">
            {/* Zone Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold backdrop-blur-md">
              <button
                onClick={() => setSelectedZone('all')}
                className={cn(
                  "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
                  selectedZone === 'all' 
                    ? "bg-[#CFFF5E] text-black font-black shadow-sm" 
                    : "text-zinc-300 hover:text-white"
                )}
              >
                Semua Zon
              </button>
              <button
                onClick={() => setSelectedZone('pantai_timur')}
                className={cn(
                  "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
                  selectedZone === 'pantai_timur' 
                    ? "bg-[#CFFF5E] text-black font-black shadow-sm" 
                    : "text-zinc-300 hover:text-white"
                )}
              >
                Pantai Timur
              </button>
              <button
                onClick={() => setSelectedZone('selatan')}
                className={cn(
                  "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
                  selectedZone === 'selatan' 
                    ? "bg-[#CFFF5E] text-black font-black shadow-sm" 
                    : "text-zinc-300 hover:text-white"
                )}
              >
                Selatan (JB)
              </button>
              <button
                onClick={() => setSelectedZone('klang_valley')}
                className={cn(
                  "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
                  selectedZone === 'klang_valley' 
                    ? "bg-[#CFFF5E] text-black font-black shadow-sm" 
                    : "text-zinc-300 hover:text-white"
                )}
              >
                Lembah Klang
              </button>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold backdrop-blur-md">
              {(['today', '7d', '30d'] as TimeframeOption[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl transition-all uppercase cursor-pointer",
                    timeframe === tf 
                      ? "bg-white text-black font-black shadow-sm" 
                      : "text-zinc-300 hover:text-white"
                  )}
                >
                  {tf === 'today' ? 'Hari Ini' : tf === '7d' ? '7 Hari' : '30 Hari'}
                </button>
              ))}
            </div>

            {/* Dynamic Grid Layout & Row Span Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold backdrop-blur-md">
              <span className="px-2 text-[10px] text-zinc-400 font-extrabold uppercase flex items-center gap-1">
                <LayoutGrid size={11} className="text-[#CFFF5E]" />
                <span className="hidden xl:inline">Grid:</span>
              </span>
              <button
                onClick={() => handleLayoutModeChange('balanced')}
                className={cn(
                  "px-3 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] flex items-center gap-1.5",
                  gridLayoutMode === 'balanced' && !expandedCardId
                    ? "bg-[#CFFF5E] text-black font-black shadow-sm" 
                    : "text-zinc-300 hover:text-white"
                )}
                title="Grid Seimbang: High-Density Symmetrical Bento Grid (12-Col Master)"
              >
                <LayoutGrid size={11} className={gridLayoutMode === 'balanced' ? "text-black" : "text-[#CFFF5E]"} />
                <span>Bento Seimbang</span>
              </button>
              <button
                onClick={() => handleLayoutModeChange('chart_focus')}
                className={cn(
                  "px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-[11px]",
                  gridLayoutMode === 'chart_focus' || expandedCardId === 'chart'
                    ? "bg-[#CFFF5E] text-black font-black shadow-sm" 
                    : "text-zinc-300 hover:text-white"
                )}
                title="Fokus Carta: Trajektori Jualan Spans 3 Rows x 12 Cols"
              >
                Fokus Carta
              </button>
              <button
                onClick={() => handleLayoutModeChange('ops_focus')}
                className={cn(
                  "px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-[11px]",
                  gridLayoutMode === 'ops_focus'
                    ? "bg-[#CFFF5E] text-black font-black shadow-sm" 
                    : "text-zinc-300 hover:text-white"
                )}
                title="Fokus Operasi: Modul JEV & Kuota Spans Ekstra Rows"
              >
                Fokus Operasi
              </button>
              <button
                onClick={() => handleLayoutModeChange('cockpit_studio')}
                className={cn(
                  "px-3 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] flex items-center gap-1.5",
                  gridLayoutMode === 'cockpit_studio'
                    ? "bg-gradient-to-r from-[#FF4757] to-[#FFA000] text-white font-black shadow-md" 
                    : "text-zinc-300 hover:text-white"
                )}
                title="Cockpit Studio: Susun atur futuristik berpandukan lakaran konsep tablet"
              >
                <Sparkles size={11} className={gridLayoutMode === 'cockpit_studio' ? "fill-white" : "text-[#CFFF5E]"} />
                <span>Cockpit Studio</span>
              </button>
            </div>

            {/* Visual Grid Overlay Toggle */}
            <button
              type="button"
              onClick={() => setShowGridOverlay(!showGridOverlay)}
              className={cn(
                "px-3 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-sm",
                showGridOverlay
                  ? "bg-[#CFFF5E] text-black border-[#CFFF5E] shadow-md shadow-[#CFFF5E]/20"
                  : "bg-black/40 border-white/10 text-zinc-300 hover:text-white hover:bg-black/60"
              )}
              title={showGridOverlay ? "Tutup Hamparan Grid Visual (Debug Mode Aktif)" : "Buka Hamparan Grid Visual untuk Semakan Spacing & Jajaran (Layout Debugging)"}
            >
              <Grid size={14} className={showGridOverlay ? "text-black" : "text-[#CFFF5E]"} />
              <span className="hidden sm:inline">Grid Visual</span>
              {showGridOverlay && (
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              )}
            </button>

            {/* Manual Refresh */}
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-2xl bg-black/40 border border-white/10 hover:bg-black/60 text-white transition-all cursor-pointer shadow-sm"
              title="Segarkan metrik langsung"
            >
              <RefreshCw size={15} className={cn(isRefreshing && "animate-spin text-[#CFFF5E]")} />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. COCKPIT STUDIO (WIREFRAME KONSEP) OR BENTO GRID MASTER                 */}
      {/* ========================================================================= */}
      {gridLayoutMode === 'cockpit_studio' ? (
        <div className="space-y-6">
          <WireframeCockpitStudio onAction={onAction} setActiveTab={setActiveTab} />

          {/* Quick Sub-Grid Bar to Access Full Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-3xl bg-[#121420] border border-white/10 shadow-lg gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CFFF5E] animate-pulse" />
              <span className="text-xs font-bold text-white">Paparan Cockpit Studio Aktif (Konsep Lakaran Tablet)</span>
              <span className="hidden md:inline text-[11px] text-zinc-400">• Beralih ke mod 'Seimbang' untuk melihat semua 12 kad operasi serentak.</span>
            </div>
            <button
              onClick={() => handleLayoutModeChange('balanced')}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#CFFF5E] flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Buka Semua 12 Kad Metrik</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      ) : (
      <div className="relative space-y-4">
        {/* Visual Grid Overlay Debug HUD & Spacing Controls */}
        <AnimatePresence>
          {showGridOverlay && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-3.5 sm:p-4 rounded-3xl bg-[#0C0D14]/95 border border-cyan-400/40 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-cyan-400/20 text-cyan-400 flex items-center justify-center border border-cyan-400/30 shrink-0 shadow-inner">
                  <Ruler size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Grid size={12} />
                      <span>Hamparan Grid Visual &amp; Spacing (Debug HUD)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      12-Col Master
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-900 text-zinc-300 border border-white/10">
                      Gutter: 20px (gap-5)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-900 text-zinc-300 border border-white/10">
                      Radius: 24px (rounded-3xl)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-900 text-zinc-300 border border-white/10">
                      Padding: 24px (p-6)
                    </span>
                  </div>
                  <p className="text-[10.5px] text-zinc-400 mt-0.5">
                    Mod semakan jajaran: Garis panduan 12-lajur, jarak ruang (gutters), dan sempadan kad aktif di seluruh dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Theme Selector */}
                <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-bold">
                  <span className="px-1.5 text-zinc-400">Tema:</span>
                  <button
                    type="button"
                    onClick={() => setGridOverlayTheme('cyan')}
                    className={cn(
                      "px-2 py-0.5 rounded-lg transition-colors cursor-pointer",
                      gridOverlayTheme === 'cyan' ? "bg-cyan-500 text-black font-extrabold" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    Cyan
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridOverlayTheme('lime')}
                    className={cn(
                      "px-2 py-0.5 rounded-lg transition-colors cursor-pointer",
                      gridOverlayTheme === 'lime' ? "bg-[#CFFF5E] text-black font-extrabold" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    Lime
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridOverlayTheme('magenta')}
                    className={cn(
                      "px-2 py-0.5 rounded-lg transition-colors cursor-pointer",
                      gridOverlayTheme === 'magenta' ? "bg-pink-500 text-white font-extrabold" : "text-zinc-400 hover:text-white"
                    )}
                  >
                    Magenta
                  </button>
                </div>

                {/* Gutter Callout Toggle */}
                <button
                  type="button"
                  onClick={() => setShowGutterMarkers(!showGutterMarkers)}
                  className={cn(
                    "px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer",
                    showGutterMarkers 
                      ? "bg-white text-black border-white" 
                      : "bg-black/60 border-white/10 text-zinc-400 hover:text-white"
                  )}
                  title="Papar petunjuk saiz gutter 20px antara kad"
                >
                  Ukuran Gutter
                </button>

                <button
                  type="button"
                  onClick={() => setShowGridOverlay(false)}
                  className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-bold transition-all cursor-pointer"
                >
                  Tutup Debug
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Bento Grid Wrapper with Visual Grid Overlay */}
        <div className="relative">
          {/* Visual Grid Column & Gutter Guides */}
          {showGridOverlay && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 h-full">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-full border-x border-dashed flex flex-col justify-between items-center py-2 transition-colors relative",
                      gridOverlayTheme === 'cyan' && "bg-cyan-500/[0.04] border-cyan-400/30 text-cyan-300",
                      gridOverlayTheme === 'lime' && "bg-[#CFFF5E]/[0.04] border-[#CFFF5E]/30 text-[#CFFF5E]",
                      gridOverlayTheme === 'magenta' && "bg-pink-500/[0.04] border-pink-400/30 text-pink-300"
                    )}
                  >
                    <div className="px-1.5 py-0.5 rounded font-mono text-[9px] font-black bg-black/85 border border-current shadow-xs">
                      #{idx + 1}
                    </div>

                    {/* Gutter Callout Tag between columns */}
                    {showGutterMarkers && idx < 11 && (
                      <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center">
                        <span className="px-1 py-0.5 rounded-full text-[7.5px] font-mono font-black bg-black/90 text-amber-300 border border-amber-400/40 shadow-xs whitespace-nowrap">
                          20px
                        </span>
                      </div>
                    )}

                    <div className="font-mono text-[8.5px] font-bold opacity-35 rotate-90 my-auto tracking-widest">
                      COL {idx + 1}
                    </div>
                    <div className="px-1.5 py-0.5 rounded font-mono text-[8px] font-bold bg-black/75 border border-current/40">
                      8.33%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actual 12-Column Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-auto"
          >
        
        {/* KPI 1: GMV Jualan Bersih */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -3 }} 
          transition={{ type: "spring", stiffness: 400, damping: 25 }} 
          className="col-span-1 md:col-span-1 lg:col-span-3 p-5 sm:p-6 rounded-3xl bg-[#121422]/90 border border-white/[0.08] shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between h-full hover:border-amber-400/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">GMV Jualan Bersih</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-[#FFC107] flex items-center justify-center border border-amber-400/20">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="my-3">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              RM {currentGMV.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-[#CFFF5E]">
              <TrendingUp size={13} />
              <span>+24.8% vs sasaran zon</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-semibold text-zinc-400 mb-1">
              <span>Sasaran: RM {targetGMV.toLocaleString()}</span>
              <span className="text-[#CFFF5E] font-bold">{completionPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-[#CFFF5E] rounded-full transition-all" 
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Volum Botol Terjual */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -3 }} 
          transition={{ type: "spring", stiffness: 400, damping: 25 }} 
          className="col-span-1 md:col-span-1 lg:col-span-3 p-5 sm:p-6 rounded-3xl bg-[#121422]/90 border border-white/[0.08] shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between h-full hover:border-emerald-400/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Volum Botol Terjual</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/20">
              <Package size={16} />
            </div>
          </div>
          <div className="my-3">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {currentBottles.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">botol</span>
            </p>
            <p className="text-[11px] font-semibold text-zinc-300 mt-1">
              Colek 500g: <strong className="text-white">68%</strong> · Jeruk: <strong className="text-white">32%</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-white/[0.06] text-[10px] font-bold text-zinc-400 flex items-center justify-between">
            <span>Halaju: 18 botol/jam</span>
            <span className="text-[#CFFF5E]">Permintaan Tinggi</span>
          </div>
        </motion.div>

        {/* KPI 3: Kargo Bas TBS Aktif */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -3 }} 
          transition={{ type: "spring", stiffness: 400, damping: 25 }} 
          className="col-span-1 md:col-span-1 lg:col-span-3 p-5 sm:p-6 rounded-3xl bg-[#121422]/90 border border-white/[0.08] shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between h-full hover:border-blue-400/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Kargo Bas TBS</span>
            <div className="w-8 h-8 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center border border-blue-400/20">
              <Bus size={16} />
            </div>
          </div>
          <div className="my-3">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {consignments.filter(c => c.status === 'IN_TRANSIT' || c.status === 'ONE_HOUR_ALERT').length} <span className="text-xs font-normal text-zinc-400 font-sans">konsinan aktif</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-blue-300">
              <Clock size={12} />
              <span>SOP 1-Jam Dipatuhi 100%</span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.06] text-[10px] font-bold text-zinc-400 flex items-center justify-between">
            <span>Laluan: TBS &rarr; Pantai Timur</span>
            <span className="text-emerald-400">Lancar</span>
          </div>
        </motion.div>

        {/* KPI 4: Integriti JEV System-1 */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -3 }} 
          transition={{ type: "spring", stiffness: 400, damping: 25 }} 
          className="col-span-1 md:col-span-1 lg:col-span-3 p-5 sm:p-6 rounded-3xl bg-[#121422]/90 border border-white/[0.08] shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between h-full hover:border-purple-400/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Integriti JEV System-1</span>
            <div className="w-8 h-8 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center border border-purple-400/20">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="my-3">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              99.4%
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-purple-300">
              <span>0 Penutup Bocor Terlepas</span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Invarian 1 (Bocor):</span>
            <span className="text-black font-extrabold bg-[#CFFF5E] px-2 py-0.5 rounded-full text-[9px]">
              UNDETERMINED
            </span>
          </div>
        </motion.div>

        {/* FEATURED CARD 1: SALES VELOCITY & RECHARTS TRAJECTORY COCKPIT (DYNAMIC ROW SPAN) */}
        {(() => {
          const isChartExpanded = cardRowSpans.chart === 3 || gridLayoutMode === 'chart_focus' || expandedCardId === 'chart';
          return (
            <motion.div 
              whileHover={{ scale: 1.012, y: -2 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }} 
              className={cn(
                "p-6 sm:p-7 rounded-3xl bg-[#121422]/90 border border-white/[0.08] hover:border-white/20 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between h-full cursor-pointer",
                isChartExpanded
                  ? "col-span-1 md:col-span-2 lg:col-span-12 border-amber-400/30"
                  : "col-span-1 md:col-span-2 lg:col-span-8"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-amber-500/20 text-[#FFC107]">
                      <Activity size={16} />
                    </span>
                    <h3 className="text-lg font-black text-white tracking-tight">
                      Trajektori Prestasi Jualan & Kargo Bas ({timeframe.toUpperCase()})
                    </h3>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 text-[9px] font-black rounded-full bg-[#CFFF5E]/15 text-[#CFFF5E] border border-[#CFFF5E]/30 font-mono">
                      {isChartExpanded ? 'ROW SPAN 3 (MAKSIMA)' : 'ROW SPAN 2'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    Data analitik sebenar berbanding sasaran kuota jualan seluruh semenanjung
                  </p>
                </div>

                {/* Symmetrical Mode & Timeframe Switch */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-bold">
                    <button
                      onClick={() => setMetricMode('gmv')}
                      className={cn(
                        "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
                        metricMode === 'gmv' ? "bg-white text-black shadow-md font-bold" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      Hasil RM
                    </button>
                    <button
                      onClick={() => setMetricMode('bottles')}
                      className={cn(
                        "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
                        metricMode === 'bottles' ? "bg-white text-black shadow-md font-bold" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      Kuantiti Botol
                    </button>
                  </div>

                  {/* Dynamic Row Span Toggle */}
                  <button
                    onClick={() => {
                      toggleCardRowSpan('chart', 2, 3);
                      if (expandedCardId === 'chart') setExpandedCardId(null);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer",
                      isChartExpanded 
                        ? "bg-[#CFFF5E] text-black border-[#CFFF5E]" 
                        : "bg-zinc-900 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    )}
                    title={isChartExpanded ? "Kecilkan baris carta ke Row Span 2" : "Luaskan carta ke Row Span 3 (12 Lajur)"}
                  >
                    {isChartExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    <span className="text-[11px] font-mono">{isChartExpanded ? '3 Rows' : '2 Rows'}</span>
                  </button>
                </div>
              </div>

              {/* Recharts Area Chart */}
              <div className={cn("w-full mt-4 transition-all", isChartExpanded ? "h-72 sm:h-96" : "h-64 sm:h-80")}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="neoGoldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CFFF5E" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#CFFF5E" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="neoRedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF4757" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#FF4757" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0d" />
                    <XAxis 
                      dataKey="time" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 600 }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(v) => metricMode === 'gmv' ? `RM ${(v / 1000).toFixed(0)}k` : `${v}`}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 bg-[#0A0B10] text-white rounded-2xl shadow-2xl text-xs space-y-1.5 border border-zinc-700">
                              <p className="font-black text-[#CFFF5E]">{data.label}</p>
                              <p className="text-zinc-200">
                                Sebenar: <strong className="text-white">{metricMode === 'gmv' ? `RM ${data.gmv.toLocaleString()}` : `${data.bottles} botol`}</strong>
                              </p>
                              <p className="text-zinc-400">
                                Sasaran: <span className="text-zinc-300">{metricMode === 'gmv' ? `RM ${data.target.toLocaleString()}` : `${Math.round(data.target / 28)} botol`}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={metricMode === 'gmv' ? 'gmv' : 'bottles'} 
                      stroke="#CFFF5E" 
                      strokeWidth={3} 
                      fill="url(#neoGoldGradient)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey={metricMode === 'gmv' ? 'target' : 'bottles'} 
                      stroke="#FF4757" 
                      strokeDasharray="4 4"
                      strokeWidth={2} 
                      fill="url(#neoRedGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Symmetrical 3-Card SKU Velocity Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 mt-4 border-t border-white/[0.06]">
                <motion.div 
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">SKU Utama</span>
                    <p className="text-xs font-black text-white">Kuah Colek 500g (RM28)</p>
                    <p className="text-[10px] text-[#CFFF5E] font-bold mt-0.5">3,420 botol terjual</p>
                  </div>
                  <span className="text-xl">🥭</span>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Pakej Ejen</span>
                    <p className="text-xs font-black text-white">Pakej 50 Botol (RM850)</p>
                    <p className="text-[10px] text-blue-400 font-bold mt-0.5">24 kotak kargo dihantar</p>
                  </div>
                  <span className="text-xl">📦</span>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.03, y: -2 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Kombo Viral</span>
                    <p className="text-xs font-black text-white">Beli 3 Percuma 1 (RM75)</p>
                    <p className="text-[10px] text-purple-400 font-bold mt-0.5">890 set TikTok Shop</p>
                  </div>
                  <span className="text-xl">🔥</span>
                </motion.div>
              </div>
            </motion.div>
          );
        })()}

        {/* FEATURED CARD 2: ELECTRIC LIME TACTILE QUOTA COCKPIT (DYNAMIC ROW SPAN) */}
        {(() => {
          const isChartExpanded = cardRowSpans.chart === 3 || gridLayoutMode === 'chart_focus' || expandedCardId === 'chart';
          const isQuotaExpanded = cardRowSpans.quota === 2 || gridLayoutMode === 'ops_focus' || expandedCardId === 'quota';
          return (
            <motion.div 
              whileHover={{ scale: 1.018, y: -2 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }} 
              className={cn(
                "p-6 rounded-3xl bg-[#CFFF5E] text-black shadow-xl hover:shadow-2xl hover:shadow-[#CFFF5E]/20 flex flex-col justify-between h-full border-2 border-[#CFFF5E]/60 relative overflow-hidden transition-all cursor-pointer",
                isChartExpanded
                  ? "col-span-1 md:col-span-2 lg:col-span-12"
                  : "col-span-1 md:col-span-2 lg:col-span-4"
              )}
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-black text-[#CFFF5E]">
                    <Sliders size={16} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-zinc-950">Sasaran Volum Jualan Harian</h3>
                    <p className="text-[10px] font-bold text-zinc-700">Kawalan Kuota Krew Gerai & Tempahan</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Dynamic Row Span Toggle */}
                  <button
                    onClick={() => {
                      toggleCardRowSpan('quota', 1, 2);
                      if (expandedCardId === 'quota') setExpandedCardId(null);
                    }}
                    className={cn(
                      "px-2 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer border border-black/20",
                      isQuotaExpanded ? "bg-black text-[#CFFF5E]" : "bg-black/10 text-black hover:bg-black/20"
                    )}
                    title={isQuotaExpanded ? "Kecilkan ke 1 baris" : "Luaskan ke 2 baris (Dynamic Row Span)"}
                  >
                    {isQuotaExpanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                    <span>{isQuotaExpanded ? '2 Rows' : '1 Row'}</span>
                  </button>

                  {/* Tactile Power Switch */}
                  <button
                    onClick={() => setIsShiftActive(!isShiftActive)}
                    className={cn(
                      "p-2 rounded-full transition-all shadow-md cursor-pointer border border-black/20 flex items-center justify-center",
                      isShiftActive ? "bg-black text-[#CFFF5E]" : "bg-zinc-300 text-zinc-600"
                    )}
                    title="Togol Sif Operasi Gerai"
                  >
                    <Power size={14} className={cn(isShiftActive && "animate-pulse")} />
                  </button>
                </div>
              </div>

              {/* Symmetrical Central Dial & Buttons */}
              <div className="my-3 flex flex-col justify-center gap-3">
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <button
                    onClick={() => setDailyTargetBottles(prev => Math.max(50, prev - 25))}
                    className="w-11 h-11 rounded-full bg-black hover:bg-zinc-800 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
                    title="Kurangkan 25 botol"
                  >
                    <Minus size={20} strokeWidth={3} />
                  </button>

                  <div className="px-6 py-2.5 rounded-3xl bg-black/10 border-2 border-black/20 flex flex-col items-center justify-center min-w-[130px] shadow-inner">
                    <span className="text-2xl sm:text-3xl font-black text-black tracking-tight font-mono">
                      {dailyTargetBottles}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-800">
                      Botol / Hari
                    </span>
                  </div>

                  <button
                    onClick={() => setDailyTargetBottles(prev => Math.min(1000, prev + 25))}
                    className="w-11 h-11 rounded-full bg-black hover:bg-zinc-800 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
                    title="Tambah 25 botol"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>

                {/* Expanded Operational Real Estate Breakdown when Row Span 2 */}
                {isQuotaExpanded && (
                  <div className="p-3 rounded-2xl bg-black/10 border border-black/15 text-[11px] grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-zinc-700 block uppercase">Larkin JB</span>
                      <strong className="text-black font-mono font-black">{Math.round(dailyTargetBottles * 0.45)} btl</strong>
                    </div>
                    <div className="text-center border-x border-black/15">
                      <span className="text-[9px] font-bold text-zinc-700 block uppercase">Toppen JB</span>
                      <strong className="text-black font-mono font-black">{Math.round(dailyTargetBottles * 0.35)} btl</strong>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-zinc-700 block uppercase">Shah Alam</span>
                      <strong className="text-black font-mono font-black">{Math.round(dailyTargetBottles * 0.20)} btl</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Mode Status */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs font-bold">
                <button
                  onClick={() => setFanMode(fanMode === 'normal' ? 'turbo' : 'normal')}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10.5px] font-black transition-all flex items-center gap-1.5 cursor-pointer",
                    fanMode === 'turbo' 
                      ? "bg-black text-[#CFFF5E] shadow-sm" 
                      : "bg-black/10 text-black"
                  )}
                >
                  <Zap size={12} className={cn(fanMode === 'turbo' && "text-[#CFFF5E]")} />
                  <span>{fanMode === 'turbo' ? 'Mod Puncak' : 'Mod Biasa'}</span>
                </button>

                <span className="text-[10.5px] font-extrabold text-zinc-900 font-mono">
                  RM {(dailyTargetBottles * 28).toLocaleString()} / hari
                </span>
              </div>
            </motion.div>
          );
        })()}

        {/* OPERATIONAL CARD 1: STOK BOTOL 500G */}
        {(() => {
          const isStockExpanded = cardRowSpans.stock === 2 || gridLayoutMode === 'ops_focus' || expandedCardId === 'stock';
          return (
            <motion.div 
              whileHover={{ scale: 1.02, y: -3 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }} 
              className={cn(
                "p-6 rounded-3xl bg-[#121422]/90 border border-white/[0.08] shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between h-full hover:border-amber-400/40 transition-all col-span-1 md:col-span-1 lg:col-span-4 cursor-pointer",
                isStockExpanded && "border-amber-400/40"
              )}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-bold text-white">Botol Kuah Colek 500g</h3>
                  <p className="text-[10px] text-zinc-400">SKU Terlaris Gerai & Pasar Karat</p>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      toggleCardRowSpan('stock', 1, 2);
                      if (expandedCardId === 'stock') setExpandedCardId(null);
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border",
                      isStockExpanded ? "bg-[#CFFF5E] text-black border-[#CFFF5E]" : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                    )}
                    title={isStockExpanded ? "Kecilkan baris stok" : "Luaskan ke 2 baris (Dynamic Row Span)"}
                  >
                    {isStockExpanded ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
                    <span>{isStockExpanded ? '2 Rows' : '1 Row'}</span>
                  </button>

                  <button
                    onClick={() => setBottleStockAlert(!bottleStockAlert)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer",
                      bottleStockAlert ? "bg-[#FF4757] text-white" : "bg-[#2962FF] text-white"
                    )}
                  >
                    {bottleStockAlert ? 'Stok Amaran' : 'Tersedia'}
                  </button>
                </div>
              </div>

              <div className="my-3 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 p-2 flex items-center justify-center shrink-0">
                    <img 
                      src="/assets/brand/cdb518f0-6449-4c0b-a7fb-9e973ffea56a.png" 
                      alt="Botol Kuah Colek" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white font-mono">840 <span className="text-xs font-normal text-zinc-400">botol</span></p>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">RM 28.00 / botol</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Gudang Larkin JB & Shah Alam</p>
                  </div>
                </div>

                {/* Expanded Operational Telemetry when Row Span 2 */}
                {isStockExpanded && (
                  <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/5 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Gudang Utama Larkin JB:</span>
                      <strong className="text-white font-mono">450 botol (53.6%)</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Hab Transit Shah Alam:</span>
                      <strong className="text-white font-mono">390 botol (46.4%)</strong>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-[#CFFF5E] font-bold">Lot: LOT-2026-03B</span>
                      <span className="text-emerald-400 font-medium">Ujian Seal: LULUS</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab ? setActiveTab('orders') : onAction("Tambah pesanan botol colek 500g")}
                className="w-full py-2.5 rounded-2xl bg-[#CFFF5E] hover:bg-[#bfe84e] text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={14} strokeWidth={3} />
                <span>Tambah Pesanan Botol</span>
              </button>
            </motion.div>
          );
        })()}

        {/* OPERATIONAL CARD 2: RADAR KARGO BAS TBS */}
        {(() => {
          const isBusExpanded = cardRowSpans.bus === 2 || gridLayoutMode === 'ops_focus' || expandedCardId === 'bus';
          return (
            <motion.div 
              whileHover={{ scale: 1.02, y: -3 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }} 
              className={cn(
                "p-6 rounded-3xl bg-[#121422]/90 border border-white/[0.08] shadow-xl hover:shadow-2xl hover:shadow-red-500/10 flex flex-col justify-between h-full hover:border-red-400/40 transition-all col-span-1 md:col-span-1 lg:col-span-4 cursor-pointer",
                isBusExpanded && "border-red-500/40"
              )}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-red-950 text-red-400 border border-red-800/40">
                    <Bus size={15} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Kargo Bas TBS</h3>
                    <p className="text-[10px] text-zinc-400">SOP Panggilan 1 Jam Sebelum Tiba</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      toggleCardRowSpan('bus', 1, 2);
                      if (expandedCardId === 'bus') setExpandedCardId(null);
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border",
                      isBusExpanded ? "bg-[#CFFF5E] text-black border-[#CFFF5E]" : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                    )}
                    title={isBusExpanded ? "Kecilkan baris bas" : "Luaskan ke 2 baris (Dynamic Row Span)"}
                  >
                    {isBusExpanded ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
                    <span>{isBusExpanded ? '2 Rows' : '1 Row'}</span>
                  </button>

                  <button
                    onClick={() => setSopOneHourActive(!sopOneHourActive)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all cursor-pointer",
                      sopOneHourActive ? "bg-[#FF4757] text-white animate-pulse" : "bg-zinc-800 text-zinc-400"
                    )}
                  >
                    {sopOneHourActive ? 'SOP 1-Jam AKTIF' : 'Rehat'}
                  </button>
                </div>
              </div>

              <div className="my-2.5 space-y-2">
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#FFC107]">Sani Express (TBS &rarr; MBKT)</span>
                    <span className="font-mono text-[10px] text-zinc-400">WXY 8821</span>
                  </div>
                  
                  <p className="text-[11px] text-zinc-300">
                    Ejen: <strong>Kak Mas Terengganu</strong> (50 botol)
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                    <span>Jangka Tiba: 03:30 PM</span>
                    <span className="text-emerald-400 font-bold">DuitNow Selesai</span>
                  </div>
                </div>

                {/* Expanded Operational Bus Telemetry when Row Span 2 */}
                {isBusExpanded && (
                  <div className="p-3 rounded-2xl bg-zinc-900/90 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-400">Mayang Sari (TBS &rarr; Larkin)</span>
                      <span className="font-mono text-[10px] text-zinc-400">JTN 4492</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      Ejen: <strong>Cikgu Din JB</strong> (40 botol)
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                      <span>Jangka Tiba: 05:15 PM</span>
                      <span className="text-amber-400 font-bold">SOP 1-Jam Bermula</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab ? setActiveTab('bus_freight') : onAction("Buka kargo bas")}
                className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Semak Semua 8 Jadual Bas</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>
          );
        })()}

        {/* OPERATIONAL CARD 3: TIKTOK LIVE & MASKOT */}
        {(() => {
          const isTiktokExpanded = cardRowSpans.tiktok === 2 || expandedCardId === 'tiktok';
          return (
            <motion.div 
              whileHover={{ scale: 1.02, y: -3 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }} 
              className={cn(
                "p-6 rounded-3xl bg-gradient-to-br from-[#1C1829] to-[#120F1D] border border-purple-500/20 shadow-xl hover:shadow-2xl hover:shadow-purple-500/15 flex flex-col justify-between h-full relative overflow-hidden transition-all col-span-1 md:col-span-2 lg:col-span-4 cursor-pointer",
                isTiktokExpanded && "border-purple-500/40"
              )}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-purple-900/60 text-purple-300">
                    <Sparkles size={15} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">TikTok Live Commerce</h3>
                    <p className="text-[10px] text-zinc-400">@styloairpool · Beli 3 Percuma 1</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      toggleCardRowSpan('tiktok', 1, 2);
                      if (expandedCardId === 'tiktok') setExpandedCardId(null);
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border",
                      isTiktokExpanded ? "bg-[#CFFF5E] text-black border-[#CFFF5E]" : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                    )}
                    title={isTiktokExpanded ? "Kecilkan baris TikTok" : "Luaskan ke 2 baris (Dynamic Row Span)"}
                  >
                    {isTiktokExpanded ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
                    <span>{isTiktokExpanded ? '2 Rows' : '1 Row'}</span>
                  </button>

                  <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FF4757] text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>

              <div className="my-2.5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-2xl font-black text-white font-mono">4.2k</p>
                    <p className="text-xs text-[#CFFF5E] font-bold">14.8% Kadar Belian</p>
                    <p className="text-[10px] text-zinc-400">18 set terjual / 10 min</p>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-white/5 p-1 border border-white/10 flex items-center justify-center shrink-0">
                    <img 
                      src="/assets/brand/MASKOT-1.PNG" 
                      alt="Maskot Cili Abang Colek" 
                      className="w-full h-full object-contain filter drop-shadow-md hover:scale-110 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {isTiktokExpanded && (
                  <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs space-y-1.5">
                    <div className="flex justify-between text-purple-200">
                      <span>Jumlah Hasil Live Stream:</span>
                      <strong className="text-white font-mono">RM 14,280</strong>
                    </div>
                    <div className="flex justify-between text-purple-200">
                      <span>Baucar RM5 Ditebus:</span>
                      <strong className="text-[#CFFF5E] font-mono">312 / 500</strong>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onAction("Tunjukkan analisis jualan siaran langsung TikTok Shop @styloairpool.")}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Analisis Siaran Langsung</span>
                <ArrowUpRight size={14} />
              </button>
            </motion.div>
          );
        })()}

        {/* FEATURED CARD 3: WARM GOLDEN AMBER MEDIA & JINGLE COCKPIT */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -3 }} 
          transition={{ type: "spring", stiffness: 400, damping: 25 }} 
          className="col-span-1 md:col-span-1 lg:col-span-4 p-6 rounded-3xl bg-[#FFC107] text-black shadow-xl hover:shadow-2xl hover:shadow-[#FFC107]/20 flex flex-col justify-between h-full border-2 border-amber-300 relative overflow-hidden transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-black text-[#FFC107]">
                <Headphones size={15} />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-black">Jingle Promosi Abang Colek</h3>
                <p className="text-[9.5px] font-bold text-zinc-800">Lagu Tema Rasmi Gerai</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-black text-[#FFC107] uppercase font-mono">
              1:00 MP3
            </span>
          </div>

          {/* Central Rotating Vinyl Player */}
          <div className="my-2 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ rotate: isPlayingJingle ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 border-4 border-black/40 shadow-xl flex items-center justify-center p-1.5"
              >
                <div className="w-full h-full rounded-full border border-zinc-700/50 flex items-center justify-center p-1.5">
                  <div className="w-full h-full rounded-full border border-zinc-800/80 flex items-center justify-center bg-gradient-to-tr from-amber-600 to-red-600 p-1">
                    <span className="text-[8px] font-black text-white text-center leading-none">
                      COLEK
                    </span>
                  </div>
                </div>
              </motion.div>

              <button
                onClick={toggleJingle}
                className="absolute w-10 h-10 rounded-full bg-black text-white hover:bg-zinc-800 shadow-xl flex items-center justify-center active:scale-90 transition-transform cursor-pointer border-2 border-[#FFC107]"
                title={isPlayingJingle ? "Hentikan Jingle" : "Mainkan Jingle Kasi Lagi-Lagi"}
              >
                {isPlayingJingle ? (
                  <Pause size={16} className="fill-white" />
                ) : (
                  <Play size={16} className="fill-white ml-0.5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-center space-y-0.5">
            <p className="text-xs font-black text-black truncate">
              "Kasi Lagi-Lagi" — Lagu Rasmi
            </p>
            <p className="text-[9.5px] font-bold text-zinc-800">
              {isPlayingJingle ? (
                <span className="text-red-700 font-extrabold animate-pulse">♫ Audio Sedang Dimainkan</span>
              ) : (
                <span className="text-zinc-700">Tekan Main Untuk Audio Gerai</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* FEATURED CARD 4: JEV QUALITY & REGIONAL STOCKIST METERS */}
        {(() => {
          const isJevExpanded = cardRowSpans.jev === 3 || expandedCardId === 'jev';
          return (
            <motion.div 
              whileHover={{ scale: 1.015, y: -3 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }} 
              className={cn(
                "p-6 rounded-3xl bg-[#121422]/90 border border-white/[0.08] shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between h-full transition-all col-span-1 md:col-span-1 lg:col-span-8 cursor-pointer",
                isJevExpanded && "border-purple-500/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-purple-900/50 text-purple-300">
                      <ShieldCheck size={16} />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">Kawalan Kualiti JEV & Stokis Wilayah</h3>
                      <p className="text-[10px] text-zinc-400">Strict Invariant Guardrail & Tahap Stok Botol</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-[#CFFF5E] font-bold bg-black px-2 py-0.5 rounded-full border border-white/10">
                      100% Invarian Terkunci
                    </span>
                    <button
                      onClick={() => {
                        toggleCardRowSpan('jev', 2, 3);
                        if (expandedCardId === 'jev') setExpandedCardId(null);
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border",
                        isJevExpanded ? "bg-[#CFFF5E] text-black border-[#CFFF5E]" : "bg-white/10 hover:bg-white/20 text-zinc-300 border-white/10"
                      )}
                      title={isJevExpanded ? "Kecilkan baris JEV ke 2 baris" : "Luaskan JEV ke 3 baris penuh (12 Lajur)"}
                    >
                      {isJevExpanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                      <span>{isJevExpanded ? '3 Rows' : '2 Rows'}</span>
                    </button>
                  </div>
                </div>

                {/* Invariant Note */}
                <div className="p-3.5 my-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs">
                  <p className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <span>Invarian 1 (Kebocoran Penutup Botol):</span>
                  </p>
                  <p className="text-[11px] text-amber-200/90 mt-1 leading-relaxed">
                    Status punca botol bocor kekal <strong className="font-mono bg-black/40 text-[#CFFF5E] px-1 py-0.5 rounded">UNDETERMINED</strong> sehingga bukti nombor lot kilang atau kecuaian logistik disahkan.
                  </p>
                </div>

                {/* Regional Stockist Meters */}
                <div className="space-y-3 mt-3">
                  {regionalHubs.map((h, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white text-[11px]">{h.name}</p>
                          <p className="text-[10px] text-zinc-400">{h.stockist}</p>
                        </div>
                        <span className={cn(
                          "text-[9px] font-extrabold px-2 py-0.5 rounded-full",
                          h.status === 'OPTIMAL' ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40" : "bg-red-950 text-red-300 border border-red-800/40 animate-pulse"
                        )}>
                          {h.status === 'OPTIMAL' ? 'Stok Cukup' : 'Perlu Tambah'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              h.status === 'OPTIMAL' ? "bg-[#CFFF5E]" : "bg-[#FF4757]"
                            )}
                            style={{ width: `${Math.min(100, (h.stockBottles / 1000) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-zinc-300 shrink-0">
                          {h.stockBottles} btl
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 mt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => setActiveTab && setActiveTab('discovery')}
                  className="flex-1 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Buka Hab JEV Triage</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setActiveTab && setActiveTab('maps')}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Peta Google Maps</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          );
        })()}

        {/* FEATURED CARD 5: AGENT TELEMETRY INSIGHT COMPONENT */}
        {(() => {
          const isAgentExpanded = cardRowSpans.agent === 3 || expandedCardId === 'agent';
          return (
            <motion.div 
              whileHover={{ scale: 1.012, y: -2 }} 
              transition={{ type: "spring", stiffness: 400, damping: 25 }} 
              className="col-span-1 md:col-span-2 lg:col-span-12 rounded-3xl transition-all h-full cursor-pointer"
            >
              <AgentInsightCard 
                className="h-full"
                onAction={onAction}
                onViewFullPerformance={() => setActiveTab && setActiveTab('agent_performance')}
              />
            </motion.div>
          );
        })()}

          </div>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SYMMETRICAL FLOATING NEO-DOCK NAVIGATION                               */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto bg-[#141522]/95 backdrop-blur-md border border-white/15 px-3 py-2 rounded-full shadow-2xl flex items-center gap-2">
          
          <button
            onClick={() => setActiveTab && setActiveTab('dashboards')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CFFF5E] text-black font-extrabold text-xs shadow-md cursor-pointer transition-transform active:scale-95"
          >
            <Activity size={15} strokeWidth={2.5} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('orders')}
            className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Pengurusan Pesanan"
          >
            <ShoppingBag size={16} />
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('bus_freight')}
            className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Kargo Bas Ekspres TBS"
          >
            <Bus size={16} />
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('discovery')}
            className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="JEV System-1 Triage"
          >
            <Flame size={16} />
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('maps')}
            className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Google Maps Hab & Gerai"
          >
            <MapPin size={16} />
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('chat')}
            className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Sembang Ejen Gemini AI"
          >
            <Bot size={16} />
          </button>

        </div>
      </div>

      </div>
    </div>
  );
};

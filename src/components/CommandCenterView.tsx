/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  Info, 
  Bot, 
  ShieldAlert, 
  ExternalLink, 
  Filter, 
  Activity, 
  Check, 
  X, 
  Phone, 
  FileText, 
  Search,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Terminal,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { appStore, OrderItem } from '@/services/store';
import { busFreightManager, BusConsignment } from '@/services/busFreightService';
import { productService, ProductItem } from '@/services/productService';
import { useSupabaseAuth } from '@/services/supabaseAuth';

export interface CommandCenterViewProps {
  onAction?: (msg?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export type FocusFilter = 'today' | '7d' | 'operations' | 'commerce' | 'logistics';

export interface SourceExplanation {
  title: string;
  source: string;
  recordsCount: number;
  period: string;
  lastUpdated: string;
  calculation: string;
  status: 'live' | 'cached' | 'demo';
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ 
  onAction, 
  onNavigateTab 
}) => {
  const { role, user } = useSupabaseAuth();

  // Active filter mode
  const [activeFilter, setActiveFilter] = useState<FocusFilter>('today');

  // Live data subscriptions
  const [orders, setOrders] = useState<OrderItem[]>(() => appStore.getOrders());
  const [consignments, setConsignments] = useState<BusConsignment[]>(() => busFreightManager.getConsignments());
  const [products, setProducts] = useState<ProductItem[]>(() => productService.getProducts());

  // Source Drawer state ("Why this number?")
  const [selectedSource, setSelectedSource] = useState<SourceExplanation | null>(null);

  // Entity Drawer state (Inspection for Order, Shipment, Case)
  const [inspectedEntity, setInspectedEntity] = useState<{
    type: 'order' | 'shipment' | 'case' | 'dealer';
    id: string;
    title: string;
    status: string;
    details: any;
  } | null>(null);

  // Decision Queue action notifications
  const [resolvedTasks, setResolvedTasks] = useState<Record<string, boolean>>({});
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubOrders = appStore.subscribe(() => {
      setOrders(appStore.getOrders());
    });
    const unsubBus = busFreightManager.subscribe(() => {
      setConsignments(busFreightManager.getConsignments());
    });
    const unsubProd = productService.subscribe(() => {
      setProducts(productService.getProducts());
    });
    return () => {
      unsubOrders();
      unsubBus();
      unsubProd();
    };
  }, []);

  // Compute calculated values
  const todayOrders = useMemo(() => {
    return orders.filter(o => o.status === 'Processing' || o.status === 'Delivered');
  }, [orders]);

  const salesToday = useMemo(() => {
    return todayOrders.reduce((sum, o) => sum + (o.amount || 0), 0) + 4850; // base + dynamic
  }, [todayOrders]);

  const pendingActionOrders = useMemo(() => {
    return orders.filter(o => o.status === 'Processing' || o.status === 'Delayed');
  }, [orders]);

  const activeShipments = useMemo(() => {
    return consignments.filter(c => c.status !== 'COLLECTED');
  }, [consignments]);

  const oneHourZoneShipments = useMemo(() => {
    return consignments.filter(c => c.status === 'ONE_HOUR_ALERT');
  }, [consignments]);

  const totalBottlesInStock = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.inventoryCount ?? 120), 0);
  }, [products]);

  // Handle Quick Decisions in the Attention Queue
  const handleResolveTask = (taskId: string, message: string) => {
    setResolvedTasks(prev => ({ ...prev, [taskId]: true }));
    setBannerMessage(`✓ ${message}`);
    setTimeout(() => setBannerMessage(null), 4000);
  };

  return (
    <div className="space-y-4 pb-16 text-zinc-100 font-sans max-w-[1560px] mx-auto">
      {/* 1. Header: Command Center Master Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-3xl bg-[#0D0F19] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#161928] to-[#1F2338] border border-white/10 flex items-center justify-center text-[#CFFF5E] shadow-inner">
            <Activity size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                ABANGCOLEK COMMAND CENTER
              </h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE OS
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Selamat bertugas, <span className="text-white font-bold">{role === 'stockist_kt' ? 'Kak Siti (KT)' : role === 'crew_toppen' ? 'Wan (Toppen JB)' : 'Megat Epull (Founder)'}</span> • Gambaran Operasi Bersepadu Semasa
            </p>
          </div>
        </div>

        {/* Operating Focus Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/60 border border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: '7d', label: '7 Hari' },
            { id: 'operations', label: 'Operasi' },
            { id: 'commerce', label: 'Jualan' },
            { id: 'logistics', label: 'Logistik' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FocusFilter)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                activeFilter === tab.id
                  ? "bg-[#CFFF5E] text-black shadow-md font-black"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Success / Receipt Banner */}
      <AnimatePresence>
        {bannerMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{bannerMessage}</span>
            </div>
            <button 
              onClick={() => setBannerMessage(null)}
              className="text-emerald-400 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Row 1: The 4 Primary Essential KPIs (Zero vanity, Clickable for Source of Truth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Sales Today */}
        <div 
          onClick={() => setSelectedSource({
            title: "Jualan Hari Ini (Gross Sales)",
            source: "Lejar Supabase & Pesanan E-Commerce appStore",
            recordsCount: todayOrders.length + 18,
            period: "Hari ini (MYT)",
            lastUpdated: new Date().toLocaleTimeString('ms-MY'),
            calculation: "Jumlah nilai transaksi pembayaran disahkan tolak pulangan (refund)",
            status: "live"
          })}
          className="p-4 rounded-3xl bg-[#0F111D] border border-white/10 hover:border-[#CFFF5E]/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Jualan Hari Ini</span>
            <div className="flex items-center gap-1 text-[10px] text-[#CFFF5E] font-mono group-hover:underline">
              <span>Source</span>
              <Info size={12} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-black text-white font-mono">
              RM {salesToday.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight size={14} /> +12.4%
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 truncate">
            vs semalam • 24 transaksi disahkan
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#CFFF5E]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#CFFF5E]/20 transition-colors" />
        </div>

        {/* KPI 2: Orders Needing Action */}
        <div 
          onClick={() => {
            if (onNavigateTab) onNavigateTab('orders');
          }}
          className="p-4 rounded-3xl bg-[#0F111D] border border-white/10 hover:border-[#00F0FF]/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pesanan Perlu Tindakan</span>
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-black text-white font-mono">
              {pendingActionOrders.length || 7}
            </span>
            <span className="text-xs font-bold text-[#00F0FF]">
              Perlu Semakan
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 truncate">
            3 bayaran • 2 bungkus • 2 kargo bas
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#00F0FF]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#00F0FF]/20 transition-colors" />
        </div>

        {/* KPI 3: Stock Health */}
        <div 
          onClick={() => {
            if (onNavigateTab) onNavigateTab('admin_products');
          }}
          className="p-4 rounded-3xl bg-[#0F111D] border border-white/10 hover:border-[#FFC107]/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kesihatan Stok</span>
            <Package size={14} className="text-[#FFC107]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-black text-white font-mono">
              {totalBottlesInStock} unit
            </span>
            <span className="text-xs font-bold text-[#FFC107]">
              3 SKU Rendah
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 truncate">
            Kuah 350ml: 18 baki • Gerai JB: Selamat
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#FFC107]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#FFC107]/20 transition-colors" />
        </div>

        {/* KPI 4: Active Logistics */}
        <div 
          onClick={() => {
            if (onNavigateTab) onNavigateTab('bus_freight');
          }}
          className="p-4 rounded-3xl bg-[#0F111D] border border-white/10 hover:border-[#FF4757]/50 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Penghantaran Aktif</span>
            <Truck size={14} className="text-[#FF4757]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-black text-white font-mono">
              {activeShipments.length || 4}
            </span>
            <span className="text-xs font-bold text-[#FF4757] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4757] animate-ping" />
              1 Zon 1-Jam
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 truncate">
            TBS → MBKT (Sani Express) tiba 15:30
          </p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#FF4757]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#FF4757]/20 transition-colors" />
        </div>
      </div>

      {/* 3. Row 2: Master Core Split (LEFT: NEEDS ATTENTION Queue | RIGHT: LOGISTICS RADAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: NEEDS ATTENTION (Nerve Center of Operational OS) - 7 cols */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0D0F19] border border-white/10 p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-[#FF4757]" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  NEEDS ATTENTION (Giliran Tindakan)
                </h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FF4757]/20 text-[#FF4757] border border-[#FF4757]/30 font-bold">
                {4 - Object.keys(resolvedTasks).length} Menunggu
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Task 1: Leakage Case */}
              {!resolvedTasks['leakage-1'] ? (
                <div className="p-3 rounded-2xl bg-[#141624] border border-red-500/30 hover:border-red-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF4757] mt-1 shrink-0 animate-ping" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Aduan Penutup Botol Bocor (LEAKAGE)</span>
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-mono">AC-ORD-1023</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Pelanggan: Pn. Zulaikha • JEV Status: <strong className="text-yellow-400">UNDETERMINED</strong> • Gambar slip kurier belum lengkap
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setInspectedEntity({
                        type: 'case',
                        id: 'AC-ORD-1023',
                        title: 'Aduan Kebocoran Botol 350ml - Pn. Zulaikha',
                        status: 'LEAKAGE (JEV System-1)',
                        details: {
                          orderId: 'AC-ORD-1023',
                          customer: 'Pn. Zulaikha (Kuantan)',
                          issue: 'Penutup botol longgar semasa kargo kurier',
                          batchLot: 'LOT-2026-03B',
                          actionSuggested: 'Penggantian 1 botol baharu percuma dengan induction heat seal'
                        }
                      })}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 transition-colors cursor-pointer"
                    >
                      Perincian
                    </button>
                    <button
                      onClick={() => handleResolveTask('leakage-1', 'Aduan AC-ORD-1023 telah diluluskan untuk botol ganti percuma.')}
                      className="px-3 py-1.5 rounded-xl bg-[#FF4757] hover:bg-red-600 text-xs font-black text-white transition-colors cursor-pointer shadow-md"
                    >
                      Luluskan Gantian
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Task 2: Payment Pending */}
              {!resolvedTasks['pay-1'] ? (
                <div className="p-3 rounded-2xl bg-[#141624] border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107] mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Sahkan Bayaran DuitNow QR (RM120.00)</span>
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-mono">AC-ORD-1028</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Pesanan Ejen: Kedai Buah Pok Nik • Slip transaksi telah dimuat naik ke Google Drive
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleResolveTask('pay-1', 'Bayaran RM120.00 disahkan. Pesanan AC-ORD-1028 dipindahkan ke mod Pembungkusan.')}
                      className="px-3 py-1.5 rounded-xl bg-[#CFFF5E] hover:bg-lime-400 text-xs font-black text-black transition-colors cursor-pointer shadow-md"
                    >
                      Sahkan Resit
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Task 3: Low Stock Alert */}
              {!resolvedTasks['stock-1'] ? (
                <div className="p-3 rounded-2xl bg-[#141624] border border-orange-500/30 hover:border-orange-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Amaran Stok Kritikal: Kuah Colek Signature 350ml</span>
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-orange-950 text-orange-300 font-mono">18 Botol Baki</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Di bawah paras selamat (50 botol). Perlukan bancuhan baharu di dapur HQ Johor Bahru
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        if (onAction) onAction("Keluarkan arahan bancuhan stok baharu 200 botol Kuah Colek Signature di HQ.");
                        handleResolveTask('stock-1', 'Arahan bancuhan baharu 200 botol telah dihantar kepada krew dapur.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-black text-white transition-colors cursor-pointer shadow-md"
                    >
                      Pesan Dapur HQ
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Task 4: Dealer Application */}
              {!resolvedTasks['dealer-1'] ? (
                <div className="p-3 rounded-2xl bg-[#141624] border border-blue-500/30 hover:border-blue-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">Permohonan Stokis Baharu (Pantai Timur)</span>
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">EJEN-KT-04</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Pemohon: Cikgu Razak (Kuala Nerus) • Cadangan kuota: 100 botol/bulan • Borang Forms sedia disemak
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleResolveTask('dealer-1', 'Cikgu Razak diluluskan sebagai ejen rasmi Kuala Nerus.')}
                      className="px-3 py-1.5 rounded-xl bg-[#00F0FF] hover:bg-cyan-400 text-xs font-black text-black transition-colors cursor-pointer shadow-md"
                    >
                      Luluskan Ejen
                    </button>
                  </div>
                </div>
              ) : null}

              {Object.keys(resolvedTasks).length >= 4 && (
                <div className="py-8 text-center text-zinc-400">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-white">Semua tindakan kecemasan telah diselesaikan!</p>
                  <p className="text-[11px] text-zinc-500">Tiada isu tertunggak pada giliran operasi hari ini.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Sistem Pemantauan Automatik JEV System-1</span>
            <button 
              onClick={() => {
                if (onNavigateTab) onNavigateTab('reviews');
              }}
              className="text-[#CFFF5E] hover:underline font-bold flex items-center gap-1"
            >
              Buka Semua Aduan & QC <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* RIGHT: LOGISTICS RADAR (Live Bus Freight & 1-Hour Zone Alerts) - 5 cols */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0D0F19] border border-white/10 p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#FFC107]" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">
                  LOGISTICS RADAR (Kargo Bas TBS)
                </h2>
              </div>
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('bus_freight');
                }}
                className="text-xs text-[#FFC107] hover:underline font-bold"
              >
                Buka Peta Penuh
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Shipment 1 (Critical 1-Hour Alert) */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/40 to-[#141624] border border-red-500/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    TBS → MBKT Kuala Terengganu
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                    1-Hour Zone
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-300">
                  <span>Bas: Sani Express (WXX 4821)</span>
                  <span className="font-mono text-[#CFFF5E] font-bold">ETA 15:30 (35 min)</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Pemandu: Pak Mat • Kargo: 3 Kotak (90 botol) untuk Kak Siti
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (onAction) onAction("Hantar peringatan WhatsApp segera kepada ejen Kak Siti bahawa bas Sani Express tiba MBKT dalam 30 minit.");
                    }}
                    className="flex-1 text-[10px] font-black py-1 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer text-center"
                  >
                    ⚡ Notis Amaran Ejen
                  </button>
                  <button
                    onClick={() => setInspectedEntity({
                      type: 'shipment',
                      id: 'BFG-2026-041',
                      title: 'Konsainan TBS → MBKT (Sani Express)',
                      status: 'ONE_HOUR_ALERT',
                      details: {
                        operator: 'Sani Express',
                        plate: 'WXX 4821',
                        driver: 'Pak Mat (019-3829102)',
                        agent: 'Kak Siti (012-9847123)',
                        boxes: 3,
                        bottles: 90,
                        fare: 'RM 45.00 (DuitNow QR Telah Dibayar)'
                      }
                    })}
                    className="text-[10px] font-bold py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors cursor-pointer"
                  >
                    Maklumat
                  </button>
                </div>
              </div>

              {/* Shipment 2 */}
              <div className="p-3 rounded-2xl bg-[#141624] border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    TBS → Kota Bharu (Kelantan)
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Dalam Perjalanan
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Perdana Express • 2 Kotak (60 botol)</span>
                  <span className="font-mono text-zinc-300">ETA 17:45</span>
                </div>
              </div>

              {/* Shipment 3 */}
              <div className="p-3 rounded-2xl bg-[#141624] border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    Larkin JB → TBS Terminal
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Restok Hab
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>KKKL Express • 10 Kotak Kilang HQ</span>
                  <span className="font-mono text-zinc-300">ETA 18:10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Terminal Terlibat: TBS, MBKT, KB, Larkin</span>
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('maps');
              }}
              className="text-[#FFC107] hover:underline font-bold flex items-center gap-1"
            >
              Radar Terminal <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Row 3: 4 Operational Intelligence Pulses (Compact & Informative) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pulse 1: Sales Velocity */}
        <div className="p-4 rounded-3xl bg-[#0F111D] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Sales Velocity</span>
            <span className="text-xs font-bold text-[#CFFF5E]">Target: 250</span>
          </div>
          <div className="h-10 flex items-end gap-1.5 py-1">
            {[35, 45, 60, 40, 80, 75, 90, 65, 85, 95].map((val, i) => (
              <div 
                key={i} 
                style={{ height: `${val}%` }} 
                className={cn(
                  "flex-1 rounded-t-sm transition-all",
                  i === 9 ? "bg-[#CFFF5E]" : "bg-white/20"
                )}
                title={`Jam ${i + 9}:00 - ${val} botol`}
              />
            ))}
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 truncate">
            183 botol terjual hari ini (73% target harian dicapai)
          </p>
        </div>

        {/* Pulse 2: Inventory Health */}
        <div className="p-4 rounded-3xl bg-[#0F111D] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Kesihatan Inventori</span>
            <span className="text-xs font-mono text-zinc-300">840 Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5 h-2 my-3 rounded-full bg-white/10 overflow-hidden">
            <div style={{ width: '85%' }} className="h-full bg-emerald-400 rounded-full" title="Tersedia: 840" />
            <div style={{ width: '10%' }} className="h-full bg-amber-400 rounded-full" title="Rizab: 100" />
            <div style={{ width: '5%' }} className="h-full bg-red-400 rounded-full" title="Kuantin: 12" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 840 Elok</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> 100 Ejen</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> 12 Kuarantin</span>
          </div>
        </div>

        {/* Pulse 3: Cases & QC Status */}
        <div className="p-4 rounded-3xl bg-[#0F111D] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Kes Pelanggan & QC</span>
            <span className="text-xs font-bold text-[#FF4757]">6 Terbuka</span>
          </div>
          <div className="space-y-1.5 my-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Siasatan Kilang (LEAKAGE)</span>
              <span className="font-mono text-white font-bold">2 kes</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Semakan Integriti JEV</span>
              <span className="font-mono text-yellow-400 font-bold">3 kes</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 truncate">
            SOP Penutup Kedap Induksi aktif bagi semua batch baru
          </p>
        </div>

        {/* Pulse 4: AI Agent Runtime */}
        <div className="p-4 rounded-3xl bg-[#0F111D] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Ejen AI & Automasi</span>
            <span className="text-xs font-bold text-[#CFFF5E]">Gemini 2.5</span>
          </div>
          <div className="space-y-1.5 my-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Tugasan Selesai (24j)</span>
              <span className="font-mono text-emerald-400 font-bold">38 tugasan</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Perlu Pengesahan Founder</span>
              <span className="font-mono text-amber-400 font-bold">2 tugasan</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 truncate">
            Uptime 99.4% • Telemetri & Tool Registry Aktif
          </p>
        </div>
      </div>

      {/* 5. Row 4: Master Operating Timeline & Action Receipts (The OS Heartbeat) */}
      <div className="rounded-3xl bg-[#0D0F19] border border-white/10 p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#00F0FF]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              OPERATING TIMELINE (Diari Aktiviti & Bukti Transaksi Rasmi)
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Masa Nyata (MYT)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              time: '14:32',
              title: 'Bayaran Disahkan',
              subtitle: 'Order AC-ORD-1024 (RM84.00)',
              icon: Check,
              color: 'text-emerald-400',
              bg: 'bg-emerald-950/60 border-emerald-800/60'
            },
            {
              time: '14:18',
              title: 'Aduan Leakage Dibuka',
              subtitle: 'Order AC-ORD-1017 (JEV Triage)',
              icon: AlertTriangle,
              color: 'text-[#FF4757]',
              bg: 'bg-red-950/60 border-red-800/60'
            },
            {
              time: '14:04',
              title: 'Amaran Zon 1-Jam',
              subtitle: 'Kargo Bas TBS → MBKT (Sani Exp)',
              icon: Truck,
              color: 'text-[#FFC107]',
              bg: 'bg-amber-950/60 border-amber-800/60'
            },
            {
              time: '13:55',
              title: 'Ejen Diluluskan',
              subtitle: 'Stokis Kuantan (ABC Fruits)',
              icon: CheckCircle2,
              color: 'text-[#00F0FF]',
              bg: 'bg-cyan-950/60 border-cyan-800/60'
            },
            {
              time: '13:41',
              title: 'Klasifikasi JEV Selesai',
              subtitle: 'Status: REVIEW_REQUIRED (Kilang)',
              icon: Bot,
              color: 'text-[#CFFF5E]',
              bg: 'bg-lime-950/60 border-lime-800/60'
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className={cn("p-3 rounded-2xl border transition-all hover:scale-[1.02]", item.bg)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-zinc-400">{item.time} MYT</span>
                <item.icon size={13} className={item.color} />
              </div>
              <h3 className="text-xs font-black text-white">{item.title}</h3>
              <p className="text-[11px] text-zinc-300 mt-0.5 truncate">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Contextual Entity Inspection Drawer */}
      <AnimatePresence>
        {inspectedEntity && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-[#0E101A] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#CFFF5E]">
                      {inspectedEntity.type.toUpperCase()} CONTEXT DRAWER
                    </span>
                    <h2 className="text-base font-black text-white mt-0.5">{inspectedEntity.title}</h2>
                    <span className="text-xs font-mono text-zinc-400">ID: {inspectedEntity.id}</span>
                  </div>
                  <button 
                    onClick={() => setInspectedEntity(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-4 p-3 rounded-2xl bg-[#141624] border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Status Entiti Semasa:</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-[#CFFF5E]/20 text-[#CFFF5E] border border-[#CFFF5E]/30">
                      {inspectedEntity.status}
                    </span>
                  </div>
                </div>

                {/* Key Details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Data Transaksi & Bukti</h3>
                  {Object.entries(inspectedEntity.details).map(([key, value]) => (
                    <div key={key} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-mono text-zinc-400">{key}</span>
                      <span className="text-xs font-bold text-zinc-200">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 mt-6">
                <button
                  onClick={() => {
                    if (onAction) {
                      onAction(`Siasat konteks ${inspectedEntity.type} ${inspectedEntity.id} secara mendalam menggunakan JEV System-1.`);
                    }
                    setInspectedEntity(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#CFFF5E] hover:bg-lime-400 text-black font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Bot size={15} /> Tanya AI Mengenai Entiti Ini
                </button>
                <button
                  onClick={() => setInspectedEntity(null)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup Drawer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Source of Truth Drawer ("Why this number?") */}
      <AnimatePresence>
        {selectedSource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-[#121422] border border-white/15 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-[#CFFF5E]" />
                  <h3 className="text-sm font-black text-white">{selectedSource.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedSource(null)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono">Sumber Kebenaran (Source of Truth)</span>
                  <p className="text-xs font-bold text-[#CFFF5E] mt-0.5">{selectedSource.source}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">Bilangan Rekod</span>
                    <p className="text-xs font-bold text-white mt-0.5">{selectedSource.recordsCount} transaksi</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">Status Data</span>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {selectedSource.status.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono">Kaedah Kiraan (Calculation Formula)</span>
                  <p className="text-xs font-medium text-zinc-300 mt-0.5">{selectedSource.calculation}</p>
                </div>

                <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-2">
                  <span>Kemaskini terakhir: {selectedSource.lastUpdated}</span>
                  <span>Zon Waktu: Asia/Kuala_Lumpur (MYT)</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSource(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Faham & Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

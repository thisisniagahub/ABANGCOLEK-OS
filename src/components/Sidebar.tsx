/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Briefcase, 
  Search, 
  Database,
  FileText,
  Mail,
  CheckSquare,
  FolderOpen,
  Calendar,
  FileSpreadsheet,
  MapPin,
  Video,
  MessageSquare,
  Flame,
  Truck,
  Gauge,
  Activity,
  Mic,
  Zap,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  HardDrive,
  ShoppingBag,
  Globe,
  Tag,
  Terminal,
  Layers,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeAuth } from '@/services/googleAuth';
import { User as FbUser } from 'firebase/auth';
import { useSupabaseAuth } from '@/services/supabaseAuth';
import { appStore } from '@/services/store';
import { busFreightManager } from '@/services/busFreightService';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  isToolOrPluginInProgress?: boolean;
  onOpenCommandPalette?: () => void;
  onAction?: (msg?: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  dotColor?: string;
  dotPulse?: boolean;
  activeCount?: number | string;
  tooltipText?: string;
  keywords?: string[];
}

export interface NavCategory {
  id: string;
  label: string;
  tagline: string;
  icon: React.ElementType;
  accentColor: string;
  badgeText?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isToolOrPluginInProgress,
  onOpenCommandPalette,
  onAction,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}) => {
  const [googleUser, setGoogleUser] = useState<FbUser | null>(null);
  const { user: supabaseUser, role, quickStaffSignIn, signOut: supabaseSignOut } = useSupabaseAuth();
  
  // Real-time live counts from application state
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(() => {
    return appStore.getOrders().filter(o => o.status === 'Processing' || o.status === 'Delayed').length;
  });

  const [activeBusCount, setActiveBusCount] = useState<number>(() => {
    return busFreightManager.getConsignments().filter(c => c.status !== 'COLLECTED').length;
  });

  // Search filter for quick navigation
  const [filterQuery, setFilterQuery] = useState('');

  // Collapsible Accordion states per category (all open by default for visibility)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    storefront: true,
    operations: true,
    ai_intelligence: true,
    workspace: true,
    analytics_dev: true,
  });

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const expandAllCategories = () => {
    setOpenCategories({
      storefront: true,
      operations: true,
      ai_intelligence: true,
      workspace: true,
      analytics_dev: true,
    });
  };

  const collapseAllCategories = () => {
    setOpenCategories({
      storefront: false,
      operations: false,
      ai_intelligence: false,
      workspace: false,
      analytics_dev: false,
    });
  };

  const [showVoicePopover, setShowVoicePopover] = useState(false);

  useEffect(() => {
    return subscribeAuth((u) => {
      setGoogleUser(u);
    });
  }, []);

  // Subscribe to live order updates and bus freight events
  useEffect(() => {
    const unsubOrders = appStore.subscribe(() => {
      const orders = appStore.getOrders();
      setPendingOrdersCount(orders.filter(o => o.status === 'Processing' || o.status === 'Delayed').length);
    });

    const unsubBus = busFreightManager.subscribe(() => {
      const consignments = busFreightManager.getConsignments();
      setActiveBusCount(consignments.filter(c => c.status !== 'COLLECTED').length);
    });

    return () => {
      unsubOrders();
      unsubBus();
    };
  }, []);

  // Organized Categories Architecture
  const categories: NavCategory[] = useMemo(() => [
    {
      id: 'storefront',
      label: 'Jualan & Pelanggan',
      tagline: 'Portal Kedai & Pemasaran',
      icon: ShoppingBag,
      accentColor: 'text-emerald-400',
      badgeText: 'Pelanggan',
      items: [
        { 
          id: 'landing', 
          label: 'Laman Utama Brand', 
          icon: Globe, 
          badge: 'Portal',
          dotColor: 'bg-[#00F0FF]',
          dotPulse: false,
          tooltipText: 'Halaman Utama & Pemasaran Pelanggan Abang Colek',
          keywords: ['landing', 'home', 'portal', 'web', 'promosi', 'jenama']
        },
        { 
          id: 'ecommerce_store', 
          label: 'Kedai E-Commerce', 
          icon: ShoppingBag, 
          badge: 'Beli Online',
          dotColor: 'bg-[#CFFF5E]',
          dotPulse: true,
          tooltipText: 'Kedai E-Commerce Rasmi, Troli & Pesanan Borong Ejen',
          keywords: ['kedai', 'store', 'shop', 'ecommerce', 'beli', 'troli', 'cart', 'borong']
        },
        { 
          id: 'admin_products', 
          label: 'Urus Produk & Stok', 
          icon: Tag,
          badge: 'CRUD',
          dotColor: 'bg-[#CFFF5E]',
          dotPulse: false,
          tooltipText: 'Pengurusan Inventori, Tambah & Edit Produk E-Commerce',
          keywords: ['produk', 'katalog', 'stok', 'crud', 'harga', 'inventori', 'botol']
        }
      ]
    },
    {
      id: 'operations',
      label: 'Operasi & Logistik',
      tagline: 'Hab Pesanan & Konsainan Bas',
      icon: Truck,
      accentColor: 'text-[#FFC107]',
      badgeText: activeBusCount > 0 ? `${activeBusCount} Bas` : undefined,
      items: [
        { 
          id: 'discovery', 
          label: 'Abang Colek Hub', 
          icon: Flame, 
          badge: 'v4.2',
          dotColor: 'bg-[#CFFF5E]',
          dotPulse: false,
          tooltipText: 'Hab Operasi & Ekosistem Utama Abang Colek (v4.2)',
          keywords: ['hub', 'cockpit', 'operasi', 'utama', 'hq']
        },
        { 
          id: 'orders', 
          label: 'Pengurusan Pesanan', 
          icon: Database,
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Baru` : 'Semua',
          activeCount: pendingOrdersCount,
          dotColor: pendingOrdersCount > 0 ? 'bg-[#00F0FF]' : 'bg-[#CFFF5E]',
          dotPulse: pendingOrdersCount > 0,
          tooltipText: `${pendingOrdersCount} Pesanan Baharu Dalam Proses & Menunggu Semakan`,
          keywords: ['orders', 'pesanan', 'order', 'pelanggan', 'lejar', 'invoice', 'resit']
        },
        { 
          id: 'bus_freight', 
          label: 'Ekspres Bas & Ejen', 
          icon: Truck, 
          badge: `${activeBusCount} Bas`,
          activeCount: activeBusCount,
          dotColor: 'bg-[#FFC107]',
          dotPulse: activeBusCount > 0,
          tooltipText: `${activeBusCount} Konsinan Bas Ekspres Sedang Bergerak / Aktif`,
          keywords: ['bas', 'bus', 'freight', 'kargo', 'tbs', 'mbkt', 'konsainan', 'pemandu']
        },
        { 
          id: 'maps', 
          label: 'Radar Peta Logistik', 
          icon: MapPin, 
          badge: '3 Hab',
          activeCount: 3,
          dotColor: 'bg-[#00F0FF]',
          dotPulse: false,
          tooltipText: '3 Hab Terminal Utama (TBS, MBKT, JB) Dalam Radar',
          keywords: ['maps', 'peta', 'radar', 'gps', 'terminal', 'lokasi', 'tbs']
        },
        { 
          id: 'reviews', 
          label: 'Aduan & QC Botol', 
          icon: Briefcase, 
          badge: '1 Aduan',
          activeCount: 1,
          dotColor: 'bg-[#FF4757]',
          dotPulse: true,
          tooltipText: '1 Aduan Kebocoran Botol (LEAKAGE Triage Diperlukan)',
          keywords: ['reviews', 'aduan', 'qc', 'leakage', 'bocor', 'kualiti']
        }
      ]
    },
    {
      id: 'ai_intelligence',
      label: 'Ejen AI & Automasi',
      tagline: 'Gemini Assistant & Plugin',
      icon: Bot,
      accentColor: 'text-[#CFFF5E]',
      badgeText: isToolOrPluginInProgress ? 'Live' : 'Gemini',
      items: [
        { 
          id: 'chat', 
          label: 'Ejen AI Abang Colek', 
          icon: Bot, 
          badge: isToolOrPluginInProgress ? 'Live' : 'Gemini',
          dotColor: isToolOrPluginInProgress ? 'bg-[#FF4757]' : 'bg-[#CFFF5E]',
          dotPulse: Boolean(isToolOrPluginInProgress),
          tooltipText: isToolOrPluginInProgress ? 'Ejen AI Sedang Memproses Arahan (Live)' : 'Ejen AI Pintar Bersedia (Gemini 2.5 Flash)',
          keywords: ['ai', 'chat', 'gemini', 'assistant', 'bot', 'tanya', 'agen']
        },
        { 
          id: 'plugins', 
          label: 'Gedung Plugins', 
          icon: Zap, 
          badge: '12 Aktif',
          activeCount: 12,
          dotColor: 'bg-[#CFFF5E]',
          dotPulse: false,
          tooltipText: '12 Plugin Integrasi Sistem Berfungsi',
          keywords: ['plugin', 'gedung', 'integrasi', 'tools', 'toolshed']
        },
        { 
          id: 'agent_performance', 
          label: 'Prestasi Ejen AI', 
          icon: Gauge, 
          badge: '99.4%',
          dotColor: 'bg-[#CFFF5E]',
          dotPulse: true,
          tooltipText: 'Kesihatan Agen: 99.4% Uptime • Recharts Telemetri Live',
          keywords: ['telemetri', 'prestasi', 'agent', 'performance', 'uptime', 'kesihatan']
        }
      ]
    },
    {
      id: 'workspace',
      label: 'Google Workspace',
      tagline: 'Produktiviti & Komunikasi Rasmi',
      icon: Layers,
      accentColor: 'text-[#8C7DFF]',
      badgeText: googleUser ? 'Synced' : 'Offline',
      items: [
        { 
          id: 'gmail', 
          label: 'Gmail Rasmi', 
          icon: Mail,
          badge: '1 Aduan',
          activeCount: 1,
          dotColor: 'bg-[#FF4757]',
          dotPulse: true,
          tooltipText: '1 Emel Aduan Kualiti Botol Bocor Menunggu Respons',
          keywords: ['gmail', 'emel', 'email', 'surat', 'inbox']
        },
        { 
          id: 'calendar', 
          label: 'Google Calendar', 
          icon: Calendar,
          badge: '1 Sesi',
          activeCount: 1,
          dotColor: 'bg-[#00F0FF]',
          dotPulse: false,
          tooltipText: '1 Sesi Taklimat Stokis Terengganu Hari Ini (3:00 PM)',
          keywords: ['calendar', 'jadual', 'sesi', 'tarikh', 'temujanji']
        },
        { 
          id: 'drive', 
          label: 'Drive Hub', 
          icon: HardDrive, 
          badge: '2 Folder',
          dotColor: 'bg-[#CFFF5E]',
          dotPulse: false,
          tooltipText: 'Hab 2 Folder Google Drive (Aset Jenama & Media TikTok)',
          keywords: ['drive', 'fail', 'folder', 'media', 'dokumen', 'storage']
        },
        { 
          id: 'sheets', 
          label: 'Google Sheets', 
          icon: FileSpreadsheet,
          badge: 'Auto',
          dotColor: 'bg-[#10B981]',
          dotPulse: false,
          tooltipText: 'Lejar Jualan Terkini Diselaraskan Automatik',
          keywords: ['sheets', 'lejar', 'excel', 'spreadsheet', 'akaun']
        },
        { 
          id: 'tasks', 
          label: 'Google Tasks', 
          icon: CheckSquare,
          badge: '3 Tugas',
          activeCount: 3,
          dotColor: 'bg-[#8C7DFF]',
          dotPulse: false,
          tooltipText: '3 Tugasan QC Penutup Botol & Audit Inventori',
          keywords: ['tasks', 'tugas', 'todo', 'senarai', 'qc']
        },
        { 
          id: 'docs', 
          label: 'SOP & Dokumen', 
          icon: FileText,
          badge: 'SOP',
          dotColor: 'bg-[#8C7DFF]',
          dotPulse: false,
          tooltipText: 'SOP Piawaian Kualiti & Pembungkusan Kargo',
          keywords: ['docs', 'sop', 'piawaian', 'prosedur', 'kualiti']
        },
        { 
          id: 'forms', 
          label: 'Borang Pendaftaran', 
          icon: FolderOpen, 
          badge: googleUser ? 'Synced' : 'Lokal',
          dotColor: googleUser ? 'bg-[#00F0FF]' : 'bg-zinc-500',
          dotPulse: false,
          tooltipText: googleUser ? 'Borang Pendaftaran Ejen Diselaraskan (Google Forms)' : 'Borang Pendaftaran Ejen (Mod Luar Talian)',
          keywords: ['forms', 'borang', 'pendaftaran', 'ejen', 'survey']
        },
        { 
          id: 'meet', 
          label: 'Google Meet', 
          icon: Video,
          badge: 'Bilik Maya',
          dotColor: 'bg-[#00F0FF]',
          dotPulse: false,
          tooltipText: 'Bilik Sidang Maya Google Meet Krew Karnival',
          keywords: ['meet', 'sidang', 'video', 'mesyuarat', 'call']
        },
        { 
          id: 'chat_workspace', 
          label: 'Sembang Krew', 
          icon: MessageSquare,
          badge: 'Krew',
          dotColor: 'bg-[#FFC107]',
          dotPulse: false,
          tooltipText: 'Saluran Sembang Krew Gerai & Pemandu Bas TBS',
          keywords: ['chat_workspace', 'sembang', 'krew', 'mesej', 'komunikasi']
        }
      ]
    },
    {
      id: 'analytics_dev',
      label: 'Analitik & Sistem',
      tagline: 'Pemantauan & Diagnostik',
      icon: Terminal,
      accentColor: 'text-indigo-400',
      badgeText: 'Sistem',
      items: [
        { 
          id: 'dashboards', 
          label: 'Papan Pemuka Bento', 
          icon: Activity,
          badge: 'Live',
          dotColor: 'bg-[#FFC107]',
          dotPulse: false,
          tooltipText: 'Papan Pemuka Bento Berketumpatan Tinggi & Visual Grid',
          keywords: ['dashboard', 'pemuka', 'bento', 'analitik', 'graf', 'metrik']
        },
        { 
          id: 'reports', 
          label: 'Laporan Integriti JEV', 
          icon: Search,
          badge: 'JEV',
          dotColor: 'bg-[#8C7DFF]',
          dotPulse: false,
          tooltipText: 'Laporan Integriti JEV System-1 & Analisis Kerosakan',
          keywords: ['reports', 'laporan', 'jev', 'audit', 'integriti']
        },
        { 
          id: 'dev_console', 
          label: 'Konsol Pembangun', 
          icon: Terminal,
          badge: 'Dev',
          dotColor: 'bg-[#8C7DFF]',
          dotPulse: false,
          tooltipText: 'Telemetri Sistem, Pemeriksa JSON & Alat Diagnostik',
          keywords: ['dev', 'developer', 'console', 'terminal', 'api', 'debug', 'json']
        }
      ]
    }
  ], [pendingOrdersCount, activeBusCount, isToolOrPluginInProgress, googleUser]);

  // Filtered categories based on user query
  const filteredCategories = useMemo(() => {
    if (!filterQuery.trim()) return categories;
    const query = filterQuery.toLowerCase().trim();

    return categories.map(category => {
      const matchingItems = category.items.filter(item => {
        const matchLabel = item.label.toLowerCase().includes(query);
        const matchBadge = item.badge?.toLowerCase().includes(query);
        const matchKeywords = item.keywords?.some(k => k.toLowerCase().includes(query));
        return matchLabel || matchBadge || matchKeywords;
      });

      return {
        ...category,
        items: matchingItems
      };
    }).filter(category => category.items.length > 0);
  }, [categories, filterQuery]);

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  // Compact Mode (Collapsed Sidebar on Desktop: 76px)
  if (isCollapsed && !isMobile) {
    return (
      <aside 
        aria-label="Sidebar Kompak"
        className="hidden md:flex w-[76px] flex-col h-full pt-3 pb-24 px-2 shrink-0 bg-[#0C0E16]/95 backdrop-blur-2xl border-r border-white/[0.08] select-none transition-all duration-300 items-center justify-between"
      >
        {/* Top: Toggle & Compact Avatar */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Expand Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-2xl bg-[#141624] border border-white/10 hover:border-[#CFFF5E]/50 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md group"
            title="Kembangkan Sidebar Penuh (295px)"
          >
            <PanelLeftOpen size={18} className="text-[#CFFF5E] group-hover:scale-110 transition-transform" />
          </button>

          {/* Operator Avatar */}
          <div className="relative group cursor-pointer" onClick={onOpenCommandPalette} title="Pusat Perintah (Ctrl+K)">
            <img 
              src="/assets/brand/epull.png" 
              alt="Megat Epull" 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#CFFF5E]/80 shadow-[0_0_10px_rgba(207,255,94,0.3)] bg-black"
              onError={(e) => {
                e.currentTarget.src = '/assets/brand/founder.png';
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#CFFF5E] border-2 border-[#141624] shadow-[0_0_6px_#CFFF5E]" />
            
            {/* Tooltip on hover */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-[#141624] border border-white/15 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-50">
              <p className="text-white text-[11px] leading-tight font-black">
                {role === 'stockist_kt' ? 'Kak Siti (KT)' : role === 'crew_toppen' ? 'Wan (JB)' : 'Megat Epull'}
              </p>
              <p className="text-[9px] text-[#CFFF5E] font-medium">Buka Pusat Perintah (Ctrl+K)</p>
            </div>
          </div>

          {/* AI Voice Mini Wave / Assistant Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowVoicePopover(!showVoicePopover)}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4757]/20 to-[#FFA000]/20 border border-[#8C7DFF]/40 hover:border-[#8C7DFF] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm group"
              title="Abang Colek AI Voice Assistant"
            >
              <Mic size={17} className="text-[#FFA000] group-hover:scale-110 transition-transform" />
            </button>

            {/* AI Mini Popover */}
            <AnimatePresence>
              {showVoicePopover && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.95 }}
                  className="absolute left-14 top-0 w-64 p-3 rounded-2xl bg-[#141624] border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 space-y-2 text-left"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Mic size={13} className="text-[#FFA000]" />
                      Abang Colek AI
                    </span>
                    <button 
                      onClick={() => setShowVoicePopover(false)}
                      className="text-zinc-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <p className="text-[10.5px] text-zinc-300 leading-tight">
                    "Ada isu botol kuah colek bocor atau semakan bas TBS?"
                  </p>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setShowVoicePopover(false);
                        onAction && onAction("Siasat aduan integriti botol kuah colek bocor (LEAKAGE) mengikut JEV System-1.");
                      }}
                      className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-[#CFFF5E] border border-[#CFFF5E]/30 text-left transition-colors cursor-pointer"
                    >
                      ⚡ Siasat Botol Bocor
                    </button>
                    <button
                      onClick={() => {
                        setShowVoicePopover(false);
                        onAction && onAction("Semak status pelepasan kargo bas TBS ke MBKT Kuala Terengganu hari ini.");
                      }}
                      className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-[#FFC107] border border-[#FFC107]/30 text-left transition-colors cursor-pointer"
                    >
                      🚌 Semak Bas TBS
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Scrollable Icon-Only Nav Items Grouped by Category */}
        <nav className="flex-1 w-full flex flex-col items-center gap-2 py-4 overflow-y-auto no-scrollbar">
          {categories.map((cat, catIdx) => (
            <React.Fragment key={cat.id}>
              {catIdx > 0 && <div className="w-5 h-px bg-white/10 my-1" />}
              {cat.items.map((item) => {
                const isChat = item.id === 'chat';
                const isExecuting = isChat && isToolOrPluginInProgress;
                const isActive = activeTab === item.id;

                return (
                  <div key={item.id} className="relative group flex items-center justify-center">
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative",
                        isActive 
                          ? "bg-[#161826] text-[#CFFF5E] border border-[#CFFF5E]/50 shadow-[0_0_12px_rgba(207,255,94,0.2)] font-black" 
                          : "text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                      )}
                      aria-label={item.label}
                    >
                      {isExecuting ? (
                        <span className="relative flex items-center justify-center">
                          <item.icon size={18} className="text-[#CFFF5E] animate-pulse" />
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4757] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4757]" />
                          </span>
                        </span>
                      ) : (
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      )}

                      {/* Status Indicator Dot */}
                      {!isExecuting && item.dotColor && (
                        <span className="absolute top-1 right-1 flex h-2 w-2 pointer-events-none">
                          {item.dotPulse && (
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", item.dotColor)} />
                          )}
                          <span className={cn("relative inline-flex rounded-full h-2 w-2 border border-[#0C0E16]", item.dotColor)} />
                        </span>
                      )}

                      {/* Active Indicator Bar on Left */}
                      {isActive && (
                        <span className="absolute -left-1 top-2 bottom-2 w-1 rounded-r-full bg-[#CFFF5E]" />
                      )}
                    </button>

                    {/* Floating Tooltip */}
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#141624] border border-white/15 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-50 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono">{cat.label} ›</span>
                        <span className="text-white font-extrabold">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#CFFF5E] font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.tooltipText && (
                        <span className="text-[10px] text-zinc-400 font-normal">
                          {item.tooltipText}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        {/* Bottom: Mini System Indicators */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-white/10 w-full">
          {/* Supabase status dot */}
          <div 
            className="w-8 h-8 rounded-xl bg-[#141624] border border-white/10 flex items-center justify-center group relative cursor-pointer"
            onClick={() => quickStaffSignIn(role === 'hq_admin' ? 'stockist_kt' : 'hq_admin')}
            title="Supabase Postgres Live"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#CFFF5E] animate-pulse" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#141624] border border-white/15 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-50">
              Supabase Postgres Live • Klik tukar peranan
            </div>
          </div>

          {/* Google Workspace status dot */}
          <div 
            className="w-8 h-8 rounded-xl bg-[#141624] border border-white/10 flex items-center justify-center group relative cursor-pointer"
            onClick={() => handleItemClick('gmail')}
            title="Google Workspace"
          >
            <span className={cn("w-2.5 h-2.5 rounded-full", googleUser ? "bg-[#8C7DFF]" : "bg-zinc-500")} />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#141624] border border-white/15 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-50">
              Google Workspace ({googleUser ? 'Connected' : 'Offline'})
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Full Expanded Sidebar (Desktop: 295px or Mobile Drawer: max 320px)
  return (
    <aside 
      aria-label="Pohon Navigasi Teratur"
      className={cn(
        "flex flex-col h-full pt-3 pb-24 pl-4 pr-3 shrink-0 bg-[#0C0E16]/95 backdrop-blur-2xl select-none transition-all duration-300",
        isMobile ? "w-full max-w-[320px] border-r border-white/15 shadow-2xl" : "hidden md:flex w-[295px] border-r border-white/[0.08]"
      )}
    >
      {/* 1. Header: Operator Profile Card & Collapse Controls */}
      <div className="mb-2.5 p-2.5 rounded-2xl bg-[#141624] border border-white/10 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img 
              src="/assets/brand/epull.png" 
              alt="Megat Epull" 
              className="w-9 h-9 rounded-full object-cover border-2 border-[#CFFF5E]/80 shadow-[0_0_10px_rgba(207,255,94,0.3)] bg-black"
              onError={(e) => {
                e.currentTarget.src = '/assets/brand/founder.png';
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#CFFF5E] border-2 border-[#141624] shadow-[0_0_6px_#CFFF5E]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">
                {role === 'stockist_kt' ? 'Kak Siti' : role === 'crew_toppen' ? 'Wan (JB)' : 'Megat Epull'}
              </span>
              <span className="text-[8.5px] px-1.5 py-0.2 rounded-md bg-[#CFFF5E]/15 text-[#CFFF5E] font-black border border-[#CFFF5E]/30 uppercase">
                {role === 'stockist_kt' ? 'Stokis' : role === 'crew_toppen' ? 'Krew' : 'HQ Admin'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 truncate">
              {role === 'stockist_kt' ? 'Pantai Timur Hub' : role === 'crew_toppen' ? 'Toppen Johor Bahru' : 'Pusat Kawalan Operasi'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Search Shortcut */}
          <button
            onClick={onOpenCommandPalette}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Pusat Perintah (Ctrl+K)"
          >
            <Search size={13} className="text-[#CFFF5E]" />
          </button>

          {/* Desktop Collapse Button */}
          {!isMobile && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Kuncupkan Sidebar (76px)"
            >
              <PanelLeftClose size={13} />
            </button>
          )}

          {/* Mobile Drawer Close Button */}
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Interactive AI Assistant Quick Banner */}
      <div className="mb-2.5 p-2.5 rounded-2xl bg-gradient-to-br from-[#161828] to-[#1D1F34] border border-[#8C7DFF]/30 shadow-md">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF4757] to-[#FFA000] flex items-center justify-center text-white shadow-xs">
              <Mic size={11} />
            </div>
            <span className="text-xs font-black text-white tracking-tight">Abang Colek AI</span>
          </div>
          
          {/* Audio Waveform */}
          <div className="flex items-center gap-0.5 h-3.5 px-1" title="Gelombang Suara Aktif">
            {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8].map((scale, i) => (
              <motion.span
                key={i}
                animate={{
                  scaleY: [0.3, scale, 0.4],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + i * 0.15,
                  ease: "easeInOut"
                }}
                className={cn(
                  "w-0.5 rounded-full",
                  i % 3 === 0 ? "bg-[#00F0FF]" : i % 3 === 1 ? "bg-[#CFFF5E]" : "bg-[#FF007A]"
                )}
                style={{ height: '100%' }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (isMobile && onCloseMobile) onCloseMobile();
              onAction && onAction("Siasat aduan integriti botol kuah colek bocor (LEAKAGE) mengikut JEV System-1.");
            }}
            className="flex-1 text-[9.5px] font-bold px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-[#CFFF5E] border border-[#CFFF5E]/30 transition-all truncate text-left cursor-pointer"
          >
            ⚡ Botol Bocor
          </button>
          <button
            onClick={() => {
              if (isMobile && onCloseMobile) onCloseMobile();
              onAction && onAction("Semak status pelepasan kargo bas TBS ke MBKT Kuala Terengganu hari ini.");
            }}
            className="text-[9.5px] font-bold px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-[#FFC107] border border-[#FFC107]/30 transition-all cursor-pointer"
          >
            🚌 Bas TBS
          </button>
        </div>
      </div>

      {/* 3. Fast In-Sidebar Search / Filter Bar */}
      <div className="mb-2">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari menu... (e.g. kedai, bas, lejar)"
            className="w-full bg-[#121422] border border-white/10 focus:border-[#CFFF5E]/50 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 text-zinc-400 hover:text-white cursor-pointer"
              title="Padam carian"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Global Accordion Toggle Controls (only when not searching) */}
        {!filterQuery && (
          <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-zinc-400">
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">
              5 Kategori Operasi
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAllCategories}
                className="hover:text-[#CFFF5E] transition-colors cursor-pointer"
              >
                Buka Semua
              </button>
              <span className="text-zinc-700">•</span>
              <button
                type="button"
                onClick={collapseAllCategories}
                className="hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Kuncup
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 4. Categorized Navigation Tree with Accordions */}
      <nav className="flex-1 space-y-2.5 pr-1 overflow-y-auto min-h-0 text-[13px] no-scrollbar">
        {filteredCategories.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs">
            <p>Tiada menu sepadan "{filterQuery}"</p>
            <button
              onClick={() => setFilterQuery('')}
              className="mt-2 text-[11px] text-[#CFFF5E] underline cursor-pointer"
            >
              Set semula carian
            </button>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isOpen = openCategories[category.id] ?? true;
            const hasActiveItem = category.items.some(it => it.id === activeTab);

            return (
              <div 
                key={category.id} 
                className={cn(
                  "rounded-2xl transition-all border",
                  hasActiveItem 
                    ? "bg-white/[0.02] border-white/10" 
                    : "border-transparent hover:border-white/5"
                )}
              >
                {/* Category Header Accordion Button */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-2.5 py-1.5 flex items-center justify-between text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <category.icon size={13} className={cn("shrink-0", category.accentColor)} />
                    <span className="text-[11px] font-black uppercase tracking-wider text-zinc-300 group-hover:text-white truncate">
                      {category.label}
                    </span>
                    
                    {/* Category Activity Badge */}
                    {category.badgeText && (
                      <span className="text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full bg-white/10 text-white font-mono shrink-0">
                        {category.badgeText}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[9.5px] font-mono text-zinc-400">
                      {category.items.length}
                    </span>
                    <ChevronDown 
                      size={12} 
                      className={cn(
                        "text-zinc-500 transition-transform duration-200", 
                        !isOpen && "-rotate-90"
                      )} 
                    />
                  </div>
                </button>

                {/* Category Items List */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-0.5 px-1 pb-1.5 pt-0.5 overflow-hidden"
                    >
                      {category.items.map((item) => {
                        const isChat = item.id === 'chat';
                        const isExecuting = isChat && isToolOrPluginInProgress;
                        const isActive = activeTab === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={cn(
                              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-medium transition-all text-left group cursor-pointer relative",
                              isActive 
                                ? "bg-[#161826] text-[#CFFF5E] border border-[#CFFF5E]/40 font-black shadow-[0_0_15px_rgba(207,255,94,0.15)]" 
                                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                            )}
                            title={item.tooltipText}
                          >
                            <div className="flex items-center gap-2 truncate min-w-0">
                              {isExecuting ? (
                                <span className="relative flex items-center justify-center shrink-0 w-4 h-4">
                                  <motion.span
                                    animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="flex items-center justify-center"
                                  >
                                    <item.icon 
                                      size={14} 
                                      strokeWidth={isActive ? 2.5 : 2} 
                                      className="text-[#CFFF5E]" 
                                    />
                                  </motion.span>
                                  <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CFFF5E] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF4757]" />
                                  </span>
                                </span>
                              ) : (
                                <item.icon 
                                  size={14} 
                                  strokeWidth={isActive ? 2.5 : 2} 
                                  className={cn(
                                    "shrink-0 transition-colors",
                                    isActive ? "text-[#CFFF5E]" : "text-zinc-400 group-hover:text-zinc-200"
                                  )} 
                                />
                              )}
                              <span className="truncate text-xs">{item.label}</span>
                            </div>

                            {/* Right: Dot & Badge */}
                            <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                              {isExecuting ? (
                                <span className="text-[8.5px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1 bg-[#FF4757] text-white shadow-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                  <span>Live</span>
                                </span>
                              ) : (
                                <>
                                  {/* Small Status Indicator Dot */}
                                  {item.dotColor && (
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                      {item.dotPulse && (
                                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", item.dotColor)} />
                                      )}
                                      <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", item.dotColor)} />
                                    </span>
                                  )}

                                  {/* Clean Typographic Badge */}
                                  {item.badge && (
                                    <span className={cn(
                                      "text-[9px] font-mono tracking-tight",
                                      isActive 
                                        ? "text-[#CFFF5E] font-bold" 
                                        : "text-zinc-400 group-hover:text-zinc-200"
                                    )}>
                                      {item.badge}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </nav>

      {/* 5. Footer: System Connection Cards (Supabase & Google Workspace) */}
      <div className="pr-1 pt-2.5 border-t border-white/10 shrink-0 space-y-1.5">
        {/* Supabase PostgreSQL Card */}
        <div className="p-2 rounded-2xl bg-[#141624] border border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CFFF5E] animate-pulse" />
              Supabase Postgres
            </span>
            <span className="text-[8.5px] font-black px-1.5 py-0.2 rounded-md bg-[#CFFF5E]/20 text-[#CFFF5E] border border-[#CFFF5E]/30">
              Live
            </span>
          </div>
          <p className="text-[9.5px] text-zinc-400 mt-0.5 truncate font-mono">
            {supabaseUser?.email || 'thisisabangcolek@gmail.com'}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <button
              onClick={() => quickStaffSignIn('hq_admin')}
              className={cn(
                "text-[9px] px-2 py-0.5 rounded-lg font-black transition-colors cursor-pointer border",
                role === 'hq_admin' || !role ? "bg-[#CFFF5E] text-black border-[#CFFF5E]" : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
              )}
            >
              HQ Admin
            </button>
            <button
              onClick={() => quickStaffSignIn('stockist_kt')}
              className={cn(
                "text-[9px] px-2 py-0.5 rounded-lg font-black transition-colors cursor-pointer border",
                role === 'stockist_kt' ? "bg-[#FFC107] text-black border-[#FFC107]" : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
              )}
            >
              Stokis KT
            </button>
            {supabaseUser && (
              <button
                onClick={() => supabaseSignOut()}
                className="text-[9px] px-1.5 py-0.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 font-bold ml-auto transition-colors cursor-pointer border border-red-800/40"
              >
                Keluar
              </button>
            )}
          </div>
        </div>

        {/* Google Workspace Connection Card */}
        <button
          onClick={() => handleItemClick('gmail')}
          className="w-full text-left p-2 rounded-2xl bg-[#141624] border border-white/10 hover:border-[#8C7DFF]/50 transition-all shadow-xs group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C7DFF]" />
              Google Workspace
            </span>
            <span className={cn(
              "text-[8.5px] font-black px-1.5 py-0.2 rounded-md",
              googleUser ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50" : "bg-white/10 text-zinc-400"
            )}>
              {googleUser ? 'Connected' : 'Offline'}
            </span>
          </div>
          <p className="text-[9.5px] text-zinc-400 mt-0.5 line-clamp-1 font-medium">
            {googleUser ? (googleUser.displayName || googleUser.email) : 'Klik untuk hubung akaun Google'}
          </p>
        </button>
      </div>
    </aside>
  );
};

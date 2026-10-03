/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Bot, 
  Activity, 
  Truck, 
  Zap, 
  Mail, 
  Calendar, 
  Database,
  Search,
  ChevronDown,
  ChevronUp,
  Gauge,
  CheckSquare,
  FileText,
  FileSpreadsheet,
  FolderOpen,
  Video,
  MessageSquare,
  MapPin,
  Briefcase,
  Keyboard,
  HardDrive,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { appStore } from '@/services/store';
import { busFreightManager } from '@/services/busFreightService';

interface FloatingNeoDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isToolOrPluginInProgress?: boolean;
  onOpenCommandPalette?: () => void;
  onOpenShortcuts?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const FloatingNeoDock: React.FC<FloatingNeoDockProps> = ({
  activeTab,
  setActiveTab,
  isToolOrPluginInProgress,
  onOpenCommandPalette,
  onOpenShortcuts,
  isMinimized: controlledMinimized,
  onToggleMinimize
}) => {
  const [localMinimized, setLocalMinimized] = useState(false);
  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : localMinimized;
  const toggleMinimize = () => {
    if (onToggleMinimize) {
      onToggleMinimize();
    } else {
      setLocalMinimized(!localMinimized);
    }
  };

  // Live Counts for Activity Indicators on Dock
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(() => {
    return appStore.getOrders().filter(o => o.status === 'Processing' || o.status === 'Delayed').length;
  });

  const [activeBusCount, setActiveBusCount] = useState<number>(() => {
    return busFreightManager.getConsignments().filter(c => c.status !== 'COLLECTED').length;
  });

  useEffect(() => {
    const unsubOrders = appStore.subscribe(() => {
      setPendingOrdersCount(appStore.getOrders().filter(o => o.status === 'Processing' || o.status === 'Delayed').length);
    });

    const unsubBus = busFreightManager.subscribe(() => {
      setActiveBusCount(busFreightManager.getConsignments().filter(c => c.status !== 'COLLECTED').length);
    });

    return () => {
      unsubOrders();
      unsubBus();
    };
  }, []);

  const dockItems = [
    { 
      id: 'discovery', 
      label: 'Hub', 
      icon: Flame,
      dotColor: 'bg-[#CFFF5E]',
      shortcut: 'Alt+1'
    },
    { 
      id: 'dashboards', 
      label: 'Bento', 
      icon: Activity,
      dotColor: 'bg-[#FFC107]',
      shortcut: 'Alt+2'
    },
    { 
      id: 'chat', 
      label: 'Ejen AI', 
      icon: Bot,
      dotColor: isToolOrPluginInProgress ? 'bg-[#FF4757]' : 'bg-[#CFFF5E]',
      dotPulse: isToolOrPluginInProgress,
      shortcut: 'Alt+3'
    },
    { 
      id: 'bus_freight', 
      label: 'Bas TBS', 
      icon: Truck,
      dotColor: 'bg-[#FFC107]',
      count: activeBusCount > 0 ? activeBusCount : undefined,
      shortcut: 'Alt+4'
    },
    { 
      id: 'orders', 
      label: 'Pesanan', 
      icon: Database,
      dotColor: pendingOrdersCount > 0 ? 'bg-[#00F0FF]' : undefined,
      count: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      shortcut: 'Alt+5'
    },
    { 
      id: 'plugins', 
      label: 'Plugins', 
      icon: Zap,
      dotColor: 'bg-[#CFFF5E]',
      shortcut: 'Alt+6'
    },
    { 
      id: 'gmail', 
      label: 'Gmail', 
      icon: Mail,
      dotColor: 'bg-[#FF4757]',
      count: 1,
      shortcut: 'Alt+7'
    },
    { 
      id: 'calendar', 
      label: 'Jadual', 
      icon: Calendar,
      dotColor: 'bg-[#00F0FF]',
      shortcut: 'Alt+8'
    },
  ];

  // Secondary items lookup when user is viewing tabs outside the primary 8
  const secondaryItemsMap: Record<string, { label: string; icon: React.ElementType }> = {
    command_center: { label: 'Command Center', icon: Activity },
    workspace_hub: { label: 'Workspace Hub', icon: Layers },
    ecommerce_store: { label: 'Kedai E-Commerce', icon: ShoppingBag },
    drive: { label: 'Drive Hub', icon: HardDrive },
    agent_performance: { label: 'Prestasi AI', icon: Gauge },
    tasks: { label: 'Tugasan QC', icon: CheckSquare },
    docs: { label: 'SOP Docs', icon: FileText },
    sheets: { label: 'Sheets', icon: FileSpreadsheet },
    forms: { label: 'Borang Ejen', icon: FolderOpen },
    meet: { label: 'Meet Pop-Up', icon: Video },
    chat_workspace: { label: 'Chat Krew', icon: MessageSquare },
    maps: { label: 'Peta Logistik', icon: MapPin },
    reviews: { label: 'Ulasan & Aduan', icon: Briefcase },
    reports: { label: 'Laporan JEV', icon: Search },
  };

  const isCurrentTabInDock = dockItems.some(item => item.id === activeTab);
  const secondaryActiveItem = !isCurrentTabInDock && secondaryItemsMap[activeTab] 
    ? { id: activeTab, ...secondaryItemsMap[activeTab] }
    : null;

  return (
    <div className="fixed bottom-2.5 md:bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] pointer-events-auto flex flex-col items-center gap-1">
      {/* Minimized Quick Expand Handle */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={toggleMinimize}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10121C]/90 backdrop-blur-2xl border border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.8)] text-zinc-300 hover:text-white transition-all cursor-pointer group hover:border-[#CFFF5E]/40"
            title="Kembangkan Dok Bawah"
          >
            <span className="w-2 h-2 rounded-full bg-[#CFFF5E] animate-pulse" />
            <span className="text-[11px] font-bold tracking-tight">Dok Operasi</span>
            <ChevronUp size={13} className="text-[#CFFF5E] group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Full Floating Dock */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#10121C]/92 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.85)] overflow-x-auto no-scrollbar max-w-full"
          >
            {dockItems.map((item) => {
              const isActive = activeTab === item.id;
              const isChat = item.id === 'chat';
              const isExecuting = isChat && isToolOrPluginInProgress;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "relative flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3.5 py-2 rounded-full font-bold text-xs transition-all shrink-0 cursor-pointer select-none",
                    isActive 
                      ? "bg-[#CFFF5E] text-black shadow-[0_0_20px_rgba(207,255,94,0.45)] scale-105" 
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  )}
                  title={`${item.label}${item.shortcut ? ` (${item.shortcut})` : ''}`}
                >
                  {isExecuting ? (
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <item.icon size={15} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-black" : "text-[#CFFF5E]"} />
                      </motion.div>
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CFFF5E] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF4757]" />
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <item.icon size={15} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-black" : "text-zinc-400"} />
                      
                      {/* Status indicator dot on dock icons */}
                      {!isActive && item.dotColor && (
                        <span className="absolute -top-0.5 -right-1 flex h-1.5 w-1.5 pointer-events-none">
                          {item.dotPulse && (
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", item.dotColor)} />
                          )}
                          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", item.dotColor)} />
                        </span>
                      )}
                    </div>
                  )}
                  
                  <span className={cn(
                    "text-[11px] md:text-xs tracking-tight",
                    isActive ? "font-black" : "hidden sm:inline"
                  )}>
                    {item.label}
                  </span>

                  {/* Micro Count Pill on Active/Inactive */}
                  {item.count !== undefined && (
                    <span className={cn(
                      "text-[9px] font-mono px-1 py-0.2 rounded-full",
                      isActive ? "bg-black/20 text-black font-extrabold" : "bg-white/10 text-[#CFFF5E]"
                    )}>
                      {item.count}
                    </span>
                  )}

                  {isActive && (
                    <motion.div 
                      layoutId="activeDockIndicator"
                      className="absolute inset-0 rounded-full border-2 border-white/40 pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* Dynamic Slot for Active Secondary Tab (e.g. Tasks, Docs, Sheets, Maps) */}
            {secondaryActiveItem && (
              <div className="flex items-center pl-1 border-l border-white/15">
                <button
                  onClick={() => setActiveTab(secondaryActiveItem.id)}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-full font-black text-xs bg-[#CFFF5E] text-black shadow-[0_0_20px_rgba(207,255,94,0.45)] scale-105 shrink-0 select-none cursor-pointer"
                  title={secondaryActiveItem.label}
                >
                  <secondaryActiveItem.icon size={15} strokeWidth={2.5} className="text-black" />
                  <span className="text-[11px] md:text-xs tracking-tight">{secondaryActiveItem.label}</span>
                  <motion.div 
                    layoutId="activeDockIndicator"
                    className="absolute inset-0 rounded-full border-2 border-white/40 pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                </button>
              </div>
            )}

            {/* Quick Search Launcher trigger on dock */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="p-2 rounded-full bg-[#181A28] hover:bg-[#202438] text-[#CFFF5E] border border-white/10 hover:border-[#CFFF5E]/40 transition-all cursor-pointer shrink-0 ml-0.5"
                title="Buka Pusat Perintah (Ctrl+K)"
              >
                <Search size={14} />
              </button>
            )}

            {/* Quick Keyboard Shortcuts Trigger on dock */}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="p-2 rounded-full bg-[#181A28] hover:bg-[#202438] text-zinc-300 hover:text-white border border-white/10 hover:border-[#CFFF5E]/40 transition-all cursor-pointer shrink-0"
                title="Pintasan Papan Kekunci (?)"
              >
                <Keyboard size={14} className="text-[#CFFF5E]" />
              </button>
            )}

            {/* Minimize Dock Toggle Button */}
            <button
              onClick={toggleMinimize}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Kuncupkan Dok (Alt+D)"
              aria-label="Kuncupkan Dok"
            >
              <ChevronDown size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Layers,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
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
  onOpenVoiceCommand?: () => void;
}

interface DockItemData {
  id: string;
  label: string;
  icon: React.ElementType;
  dotColor?: string;
  dotPulse?: boolean;
  count?: number;
  shortcut?: string;
}

// 21st.dev Magnified Dock Item with Spring Proximity Physics
const MagnifiedDockItem: React.FC<{
  item: DockItemData;
  isActive: boolean;
  mouseX: MotionValue<number>;
  onClick: () => void;
  isToolOrPluginInProgress?: boolean;
}> = ({ item, isActive, mouseX, onClick, isToolOrPluginInProgress }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Physical spring magnification inspired by 21st.dev macOS Dock component
  const widthSync = useTransform(distance, [-120, 0, 120], [42, 60, 42]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 14 });

  const isChat = item.id === 'chat';
  const isExecuting = isChat && isToolOrPluginInProgress;

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-colors cursor-pointer select-none shrink-0 group focus:outline-none",
        isActive
          ? "bg-[#CFFF5E] text-black shadow-[0_0_24px_rgba(207,255,94,0.55)]"
          : "bg-white/[0.05] hover:bg-white/[0.12] text-zinc-300 hover:text-white"
      )}
    >
      {/* 21st.dev Spring Floating Tooltip Preview */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: -48, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#090A10]/95 backdrop-blur-xl border border-white/20 text-white text-[11px] font-bold shadow-2xl pointer-events-none flex items-center gap-1.5 whitespace-nowrap z-50"
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#CFFF5E]">
                {item.shortcut}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon rendering */}
      {isExecuting ? (
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-black" : "text-[#CFFF5E]"} />
          </motion.div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CFFF5E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4757]" />
          </span>
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-black" : "text-zinc-300 group-hover:text-white"} />
          
          {/* Status indicator dot on dock icons */}
          {!isActive && item.dotColor && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              {item.dotPulse && (
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", item.dotColor)} />
              )}
              <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", item.dotColor)} />
            </span>
          )}
        </div>
      )}

      {/* Micro Count Pill on Active/Inactive */}
      {item.count !== undefined && (
        <span className={cn(
          "absolute -top-1 -right-1 text-[9px] font-mono px-1 rounded-full shadow-xs",
          isActive ? "bg-black text-[#CFFF5E] font-black" : "bg-[#FF4757] text-white font-bold"
        )}>
          {item.count}
        </span>
      )}

      {/* Active layout indicator pill */}
      {isActive && (
        <motion.div 
          layoutId="activeDockGlow"
          className="absolute inset-0 rounded-full border-2 border-white/50 pointer-events-none"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}
    </motion.button>
  );
};

export const FloatingNeoDock: React.FC<FloatingNeoDockProps> = ({
  activeTab,
  setActiveTab,
  isToolOrPluginInProgress,
  onOpenCommandPalette,
  onOpenShortcuts,
  isMinimized: controlledMinimized,
  onToggleMinimize,
  onOpenVoiceCommand
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

  const mouseX = useMotionValue(Infinity);

  const dockItems: DockItemData[] = [
    { 
      id: 'discovery', 
      label: 'Hub Eksplorasi', 
      icon: Flame,
      dotColor: 'bg-[#CFFF5E]',
      shortcut: 'Alt+1'
    },
    { 
      id: 'dashboards', 
      label: 'Bento Kokpit', 
      icon: Activity,
      dotColor: 'bg-[#FFC107]',
      shortcut: 'Alt+2'
    },
    { 
      id: 'chat', 
      label: 'Ejen AI JEV', 
      icon: Bot,
      dotColor: isToolOrPluginInProgress ? 'bg-[#FF4757]' : 'bg-[#CFFF5E]',
      dotPulse: isToolOrPluginInProgress,
      shortcut: 'Alt+3'
    },
    { 
      id: 'bus_freight', 
      label: 'Logistik Bas TBS', 
      icon: Truck,
      dotColor: 'bg-[#FFC107]',
      count: activeBusCount > 0 ? activeBusCount : undefined,
      shortcut: 'Alt+4'
    },
    { 
      id: 'orders', 
      label: 'Pengurusan Pesanan', 
      icon: Database,
      dotColor: pendingOrdersCount > 0 ? 'bg-[#00F0FF]' : undefined,
      count: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      shortcut: 'Alt+5'
    },
    { 
      id: 'plugins', 
      label: 'Arkitektur Plugin', 
      icon: Zap,
      dotColor: 'bg-[#CFFF5E]',
      shortcut: 'Alt+6'
    },
    { 
      id: 'gmail', 
      label: 'Komunikasi Gmail', 
      icon: Mail,
      dotColor: 'bg-[#FF4757]',
      count: 1,
      shortcut: 'Alt+7'
    },
    { 
      id: 'calendar', 
      label: 'Kalendar Operasi', 
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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10121C]/92 backdrop-blur-2xl border border-white/20 shadow-[0_12px_30px_rgba(0,0,0,0.8)] text-zinc-300 hover:text-white transition-all cursor-pointer group hover:border-[#CFFF5E]/40"
            title="Kembangkan Dok Bawah (Alt+D)"
          >
            <span className="w-2 h-2 rounded-full bg-[#CFFF5E] animate-pulse" />
            <span className="text-[11px] font-bold tracking-tight">Dok Operasi Interaktif</span>
            <ChevronUp size={13} className="text-[#CFFF5E] group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 21st.dev Magnification Floating Dock Body */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0E1019]/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-w-full"
          >
            {dockItems.map((item) => (
              <MagnifiedDockItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                mouseX={mouseX}
                onClick={() => setActiveTab(item.id)}
                isToolOrPluginInProgress={isToolOrPluginInProgress}
              />
            ))}

            {/* Dynamic Slot for Secondary Active Item */}
            {secondaryActiveItem && (
              <div className="flex items-center pl-1 border-l border-white/15">
                <MagnifiedDockItem
                  item={{
                    id: secondaryActiveItem.id,
                    label: secondaryActiveItem.label,
                    icon: secondaryActiveItem.icon,
                    dotColor: 'bg-[#CFFF5E]'
                  }}
                  isActive={true}
                  mouseX={mouseX}
                  onClick={() => setActiveTab(secondaryActiveItem.id)}
                />
              </div>
            )}

            {/* Separator */}
            <div className="h-6 w-px bg-white/10 mx-0.5" />

            {/* Quick Voice Command Launcher on dock */}
            {onOpenVoiceCommand && (
              <button
                onClick={onOpenVoiceCommand}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#CFFF5E]/20 text-[#CFFF5E] border border-white/10 hover:border-[#CFFF5E]/50 flex items-center justify-center transition-all cursor-pointer shrink-0 group relative"
                title="Perintah Suara Global (Tahan untuk Suara / Alt+V)"
                aria-label="Perintah Suara"
              >
                <Mic size={15} className="group-hover:scale-110 transition-transform" />
              </button>
            )}

            {/* Quick Search Launcher trigger on dock */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#CFFF5E]/15 text-[#CFFF5E] border border-white/10 hover:border-[#CFFF5E]/40 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Buka Pusat Perintah (Ctrl+K)"
              >
                <Search size={15} />
              </button>
            )}

            {/* Quick Keyboard Shortcuts Trigger on dock */}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#CFFF5E]/15 text-zinc-300 hover:text-white border border-white/10 hover:border-[#CFFF5E]/40 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Pintasan Papan Kekunci (?)"
              >
                <Keyboard size={15} className="text-[#CFFF5E]" />
              </button>
            )}

            {/* Minimize Dock Toggle Button */}
            <button
              onClick={toggleMinimize}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
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

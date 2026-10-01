/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
  Sparkles,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingNeoDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isToolOrPluginInProgress?: boolean;
  onOpenCommandPalette?: () => void;
}

export const FloatingNeoDock: React.FC<FloatingNeoDockProps> = ({
  activeTab,
  setActiveTab,
  isToolOrPluginInProgress,
  onOpenCommandPalette
}) => {
  const dockItems = [
    { id: 'discovery', label: 'Hub Pintar', icon: Flame },
    { id: 'dashboards', label: 'Bento', icon: Activity },
    { id: 'chat', label: 'Ejen AI', icon: Bot },
    { id: 'bus_freight', label: 'Bas TBS', icon: Truck },
    { id: 'orders', label: 'Pesanan', icon: Database },
    { id: 'plugins', label: 'Plugins', icon: Zap },
    { id: 'gmail', label: 'Gmail', icon: Mail },
    { id: 'calendar', label: 'Jadual', icon: Calendar },
  ];

  return (
    <div className="fixed bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] pointer-events-auto">
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#10121C]/90 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar">
        {dockItems.map((item) => {
          const isActive = activeTab === item.id;
          const isChat = item.id === 'chat';
          const isExecuting = isChat && isToolOrPluginInProgress;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-bold text-xs transition-all shrink-0 cursor-pointer select-none",
                isActive 
                  ? "bg-[#CFFF5E] text-black shadow-[0_0_20px_rgba(207,255,94,0.45)] scale-105" 
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              )}
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
                <item.icon size={15} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-black" : "text-zinc-400"} />
              )}
              
              <span className={cn(
                "text-[11px] md:text-xs tracking-tight",
                isActive ? "font-black" : "hidden sm:inline"
              )}>
                {item.label}
              </span>

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

        {/* Quick Search Launcher trigger on dock */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-full bg-[#181A28] hover:bg-[#202438] text-[#CFFF5E] border border-white/10 hover:border-[#CFFF5E]/40 transition-all cursor-pointer shrink-0 ml-1"
            title="Buka Pusat Perintah (Ctrl+K)"
          >
            <Search size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

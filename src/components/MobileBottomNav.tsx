/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Mobile Bottom Navigation Dock for ABANGCOLEK-OS
 * Standard 21st.dev Mobile Floating Island with spring physics, tactile tap, and layoutId slider.
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Truck, 
  ShoppingBag, 
  Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { appStore } from '@/services/store';
import { busFreightManager } from '@/services/busFreightService';

import { VoiceCommandButton } from '@/components/VoiceCommandButton';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  onToggleAiSidecar: () => void;
  isAiSidecarOpen?: boolean;
  onOpenCommandPalette?: () => void;
  isToolOrPluginInProgress?: boolean;
  onOpenVoiceCommand?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  isToolOrPluginInProgress = false,
  onOpenVoiceCommand
}) => {
  // Live Operational Counts
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

  const navItems = [
    {
      id: 'command_center',
      label: 'Kokpit',
      icon: Activity,
      count: undefined,
      accent: 'text-[#CFFF5E]'
    },
    {
      id: 'orders',
      label: 'Pesanan',
      icon: Database,
      count: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      countColor: 'bg-[#FF4757] text-white',
      accent: 'text-[#00F0FF]'
    },
    {
      id: 'bus_freight',
      label: 'Bas TBS',
      icon: Truck,
      count: activeBusCount > 0 ? activeBusCount : undefined,
      countColor: 'bg-[#FFC107] text-black font-extrabold',
      accent: 'text-[#FFC107]'
    },
    {
      id: 'ecommerce_store',
      label: 'Kedai',
      icon: ShoppingBag,
      count: undefined,
      accent: 'text-[#CFFF5E]'
    }
  ];

  const isSecondaryTabActive = !navItems.some(i => i.id === activeTab);

  return (
    <nav 
      aria-label="Navigasi Mudah Alih"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090B12]/92 backdrop-blur-2xl border-t border-white/[0.12] px-2 py-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.85)]"
    >
      <div className="grid grid-cols-5 items-center justify-between gap-1 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center min-h-[50px] py-1 rounded-2xl transition-all cursor-pointer select-none z-10",
                isActive 
                  ? "text-[#CFFF5E]" 
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {/* 21st.dev Fluid Sliding Active Background Pill */}
              {isActive && (
                <motion.div 
                  layoutId="mobileActiveTabBackground"
                  className="absolute inset-0 rounded-2xl bg-white/[0.08] border border-[#CFFF5E]/30 shadow-[0_0_15px_rgba(207,255,94,0.15)] z-[-1]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <div className="relative">
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-transform duration-200",
                    isActive ? "scale-110 text-[#CFFF5E]" : "text-zinc-400"
                  )} 
                />
                
                {/* Live Count Badge */}
                {item.count !== undefined && (
                  <span className={cn(
                    "absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[9px] font-mono font-bold leading-tight min-w-[15px] text-center shadow-xs",
                    item.countColor || "bg-[#CFFF5E] text-black"
                  )}>
                    {item.count}
                  </span>
                )}
              </div>

              <span className={cn(
                "text-[10.5px] tracking-tight mt-0.5 truncate max-w-full px-1",
                isActive ? "font-bold text-white" : "font-medium text-zinc-400"
              )}>
                {item.label}
              </span>
            </motion.button>
          );
        })}

        {/* 5th Slot: Quick Operational Drawer Trigger */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onOpenMobileMenu}
          className={cn(
            "relative flex flex-col items-center justify-center min-h-[50px] py-1 rounded-2xl transition-all cursor-pointer select-none z-10",
            isSecondaryTabActive 
              ? "text-[#CFFF5E]" 
              : "text-zinc-400 hover:text-zinc-200"
          )}
          title="Buka Menu Modul Penuh (Laci Operasi)"
          aria-label="Buka Menu Modul Penuh"
        >
          {isSecondaryTabActive && (
            <motion.div 
              layoutId="mobileActiveTabBackground"
              className="absolute inset-0 rounded-2xl bg-white/[0.08] border border-[#CFFF5E]/30 shadow-[0_0_15px_rgba(207,255,94,0.15)] z-[-1]"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}

          <div className="relative">
            <Menu 
              size={20} 
              strokeWidth={isSecondaryTabActive ? 2.5 : 2} 
              className={isSecondaryTabActive ? "scale-110 text-[#CFFF5E]" : "text-zinc-400"}
            />
            {isToolOrPluginInProgress && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF4757] animate-ping" />
            )}
            {isSecondaryTabActive && !isToolOrPluginInProgress && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#CFFF5E]" />
            )}
          </div>
          <span className={cn(
            "text-[10.5px] tracking-tight mt-0.5 truncate max-w-full px-1",
            isSecondaryTabActive ? "font-bold text-white" : "font-medium text-zinc-400"
          )}>
            {isSecondaryTabActive ? 'Laci' : 'Menu'}
          </span>
        </motion.button>
      </div>

      {/* Floating Push-to-Talk Thumb Satellite (Touch Target >= 48px, 1-Hand Thumb Reachable) */}
      {onOpenVoiceCommand && (
        <div className="fixed bottom-[76px] right-3.5 z-40 pointer-events-auto">
          <VoiceCommandButton 
            onOpenOverlay={onOpenVoiceCommand}
            variant="floating"
            className="shadow-2xl shadow-black/90 border-[#CFFF5E]/30"
          />
        </div>
      )}
    </nav>
  );
};

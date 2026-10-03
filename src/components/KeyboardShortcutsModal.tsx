/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Keyboard, 
  X, 
  Search, 
  PanelLeftClose, 
  Layers, 
  Download, 
  ArrowRight,
  Flame,
  Bot,
  Truck,
  Database,
  Activity,
  Zap,
  Mail,
  Calendar,
  Sparkles,
  HardDrive,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const shortcutGroups = [
    {
      group: 'Pusat Perintah & Bantuan',
      items: [
        { keys: ['Ctrl', 'K'], label: 'Buka Pusat Perintah Global (Omni-Search)' },
        { keys: ['?'], label: 'Buka Lembaran Pintasan Papan Kekunci ini' },
        { keys: ['Esc'], label: 'Tutup sebarang modal / popup aktif' },
      ]
    },
    {
      group: 'Kawalan Paparan & Susun Atur',
      items: [
        { keys: ['Alt', 'B'], label: 'Togol Kuncup / Kembangkan Sidebar (76px ↔ 295px)' },
        { keys: ['Alt', 'D'], label: 'Togol Kuncup / Kembangkan Dok Bawah' },
        { keys: ['Alt', 'X'], label: 'Eksport Data Operasi Segera (.CSV / .XLS)' },
      ]
    },
    {
      group: 'Navigasi Tab Utama (Pintas Terus)',
      items: [
        { keys: ['Alt', '1'], label: 'Command Center (Live OS)', tabId: 'command_center', icon: Activity },
        { keys: ['Alt', '2'], label: 'Modern Bento Dashboard', tabId: 'dashboards', icon: Activity },
        { keys: ['Alt', '3'], label: 'Agent Chat (AI Operations)', tabId: 'chat', icon: Bot },
        { keys: ['Alt', '4'], label: 'Ekspres Bas & Ejen (TBS)', tabId: 'bus_freight', icon: Truck },
        { keys: ['Alt', '5'], label: 'Pengurusan Pesanan (Supabase)', tabId: 'orders', icon: Database },
        { keys: ['Alt', '6'], label: 'Gedung Plugins (12 Aktif)', tabId: 'plugins', icon: Zap },
        { keys: ['Alt', '7'], label: 'Gmail (Triage Aduan)', tabId: 'gmail', icon: Mail },
        { keys: ['Alt', '8'], label: 'Calendar (Jadual Hab)', tabId: 'calendar', icon: Calendar },
        { keys: ['Alt', '9'], label: 'Google Drive Hub (2 Folder)', tabId: 'drive', icon: HardDrive },
        { keys: ['Alt', 'W'], label: 'Google Workspace Hub (9-in-1)', tabId: 'workspace_hub', icon: Layers },
        { keys: ['Alt', 'S'], label: 'Kedai E-Commerce & Borong', tabId: 'ecommerce_store', icon: ShoppingBag },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-[#10121C] border border-white/15 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#CFFF5E]/20 text-[#CFFF5E] border border-[#CFFF5E]/40 flex items-center justify-center">
                  <Keyboard size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                    <span>Pintasan Papan Kekunci</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#CFFF5E] text-black uppercase">
                      Pro
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">Navigasi dan kendalikan kokpit ABANGCOLEK OS sepantas kilat</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Tutup (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Shortcut Categories List */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
              {shortcutGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <h4 className="text-[10.5px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CFFF5E]" />
                    <span>{group.group}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        onClick={() => {
                          if (item.tabId) {
                            onNavigateTab(item.tabId);
                            onClose();
                          }
                        }}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-2xl bg-[#141624] border border-white/[0.06] transition-all",
                          item.tabId ? "hover:border-[#CFFF5E]/40 hover:bg-[#181B2C] cursor-pointer group" : ""
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.icon && (
                            <item.icon size={14} className="text-zinc-400 group-hover:text-[#CFFF5E] shrink-0 transition-colors" />
                          )}
                          <span className="text-xs text-zinc-300 group-hover:text-white truncate font-medium">
                            {item.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.keys.map((k, kIdx) => (
                            <kbd
                              key={kIdx}
                              className="px-2 py-0.5 rounded-md bg-white/10 text-zinc-200 border border-white/15 text-[10.5px] font-mono font-bold shadow-xs min-w-[22px] text-center"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer tip */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Tekan <kbd className="px-1.5 py-0.2 rounded bg-white/10 font-mono text-white text-[10px]">?</kbd> di mana-mana skrin untuk buka semula</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Faham & Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

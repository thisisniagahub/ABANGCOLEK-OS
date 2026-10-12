/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reusable Source of Truth Drawer ("Why this number?") for ABANGCOLEK-OS
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, RefreshCw, ExternalLink, Database, Clock, Layers } from 'lucide-react';
import { MetricSourceMeta } from '@/services/dataEnvelope';
import { cn } from '@/lib/utils';

export interface SourceDrawerProps {
  meta: MetricSourceMeta | null;
  onClose: () => void;
  onRefresh?: () => void;
  onViewRecords?: (route: string) => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  meta,
  onClose,
  onRefresh,
  onViewRecords
}) => {
  if (!meta) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-3xl bg-[#0F111D] border border-white/15 p-6 shadow-[0_24px_50px_rgba(0,0,0,0.8)] space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#CFFF5E]/15 border border-[#CFFF5E]/30 flex items-center justify-center text-[#CFFF5E]">
                <Info size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                  PUNCA KEBENARAN DATA (SOURCE OF TRUTH)
                </span>
                <h3 className="text-sm font-black text-white">{meta.title}</h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X size={15} />
            </button>
          </div>

          {/* Core Source Details */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#141624] border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] text-zinc-400 uppercase font-mono">Sistem Punca</span>
                <span className={cn(
                  "text-[9px] font-black font-mono px-2 py-0.5 rounded-full border uppercase",
                  meta.status === 'live' 
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                    : meta.status === 'cached'
                    ? "bg-amber-950/80 text-amber-400 border-amber-800"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700"
                )}>
                  ● {meta.status}
                </span>
              </div>
              <p className="text-xs font-bold text-[#CFFF5E] mt-1">{meta.source}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">Jadual Entiti: {meta.entityTable}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-[#141624] border border-white/5">
                <span className="text-[10px] text-zinc-400 uppercase font-mono">Bilangan Rekod</span>
                <p className="text-xs font-bold text-white mt-1">
                  {meta.recordCount > 0 ? `${meta.recordCount} rekod disahkan` : '0 rekod'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#141624] border border-white/5">
                <span className="text-[10px] text-zinc-400 uppercase font-mono">Tempoh Masa</span>
                <p className="text-xs font-bold text-white mt-1 truncate">{meta.period}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#141624] border border-white/5">
              <span className="text-[10px] text-zinc-400 uppercase font-mono">Formula Pengiraan Autoritatif</span>
              <p className="text-xs font-medium text-zinc-200 mt-1 leading-relaxed">{meta.calculation}</p>
            </div>

            <div className="flex items-center justify-between text-[10.5px] text-zinc-400 pt-1 px-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Clock size={12} /> Kemaskini: {meta.lastUpdated}
              </span>
              <span>Asia/Kuala_Lumpur (MYT)</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            {meta.linkedRoute && onViewRecords && (
              <button
                onClick={() => {
                  onViewRecords(meta.linkedRoute!);
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink size={13} /> Buka Rekod Asal
              </button>
            )}
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-[#CFFF5E] hover:bg-lime-400 text-black font-black text-xs transition-colors cursor-pointer"
            >
              Faham
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

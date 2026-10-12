/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reusable Contextual Entity Drawer for ABANGCOLEK-OS
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIActionProposal, isActionHighRisk } from '@/services/ai/aiContext';

export interface EntityDrawerData {
  type: 'order' | 'shipment' | 'case' | 'product' | 'customer' | 'dealer';
  id: string;
  title: string;
  status: string;
  statusColor?: string;
  details: Record<string, any>;
  jevAnalysis?: {
    issueClass: string;
    rootCause: string;
    risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    recommendation: string;
    evidenceNotes?: string;
  };
  timeline?: Array<{
    time: string;
    event: string;
    actor?: string;
  }>;
  availableAction?: {
    label: string;
    actionClass: 'WRITE' | 'EXTERNAL' | 'DESTRUCTIVE';
    description: string;
    onExecute: () => void;
  };
}

export interface EntityDrawerProps {
  entity: EntityDrawerData | null;
  onClose: () => void;
  onAskAi?: (contextSummary: string) => void;
}

export const EntityDrawer: React.FC<EntityDrawerProps> = ({
  entity,
  onClose,
  onAskAi
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'jev' | 'timeline'>('overview');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!entity) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end bg-black/75 backdrop-blur-xs select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg max-h-[92vh] md:max-h-full md:h-full bg-[#0D0F19] rounded-t-[28px] md:rounded-none border-t md:border-t-0 md:border-l border-white/10 p-5 pb-8 md:pb-5 flex flex-col justify-between overflow-y-auto shadow-2xl"
        >
          {/* Top Grab Handle for Mobile Swipe Affordance */}
          <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-3 md:hidden shrink-0" />

          {/* Top Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-[#CFFF5E] font-bold">
                    {entity.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">ID: {entity.id}</span>
                </div>
                <h2 className="text-base font-black text-white mt-1 leading-snug">{entity.title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Tutup Paparan"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Strip */}
            <div className="p-3 rounded-2xl bg-[#141624] border border-white/5 flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400">Status Semasa Entiti:</span>
              <span className={cn(
                "text-xs font-black px-2.5 py-0.5 rounded-lg border uppercase tracking-wider font-mono",
                entity.statusColor || "bg-[#CFFF5E]/15 text-[#CFFF5E] border-[#CFFF5E]/30"
              )}>
                {entity.status}
              </span>
            </div>

            {/* Contextual Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 mb-3">
              {(['overview', 'details', 'jev', 'timeline'] as const).map(tab => {
                if (tab === 'jev' && !entity.jevAnalysis) return null;
                if (tab === 'timeline' && (!entity.timeline || entity.timeline.length === 0)) return null;

                const labels = {
                  overview: 'Ringkasan',
                  details: 'Data & Bukti',
                  jev: 'Analisis JEV',
                  timeline: 'Garis Masa'
                };

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer",
                      activeTab === tab
                        ? "bg-[#1E2238] text-white shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-2 text-xs">
                {Object.entries(entity.details).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-[#141624] border border-white/5 flex justify-between items-center">
                    <span className="text-[10.5px] uppercase font-mono text-zinc-400">{key}</span>
                    <span className="text-xs font-bold text-white font-mono">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Details */}
            {activeTab === 'details' && (
              <div className="space-y-2 text-xs max-h-[350px] overflow-y-auto pr-1">
                {Object.entries(entity.details).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-[#141624] border border-white/5 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-mono text-zinc-400">{key}</span>
                    <span className="text-xs font-bold text-zinc-200">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: JEV Analysis */}
            {activeTab === 'jev' && entity.jevAnalysis && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">Klasifikasi Isu</span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                      RISIKO {entity.jevAnalysis.risk}
                    </span>
                  </div>
                  <p className="text-xs font-black text-white">{entity.jevAnalysis.issueClass}</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#141624] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-zinc-400">Punca Sebenar Operasi (Root Cause)</span>
                  <p className="text-xs font-bold text-yellow-400">{entity.jevAnalysis.rootCause}</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                    Kekal {entity.jevAnalysis.rootCause} mengikut invariant JEV System-1 sehingga bukti fizikal kilang disahkan.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#141624] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-zinc-400">Cadangan Tindakan Seterusnya</span>
                  <p className="text-xs font-medium text-emerald-400">{entity.jevAnalysis.recommendation}</p>
                </div>
              </div>
            )}

            {/* Tab 4: Timeline */}
            {activeTab === 'timeline' && entity.timeline && (
              <div className="space-y-2 text-xs">
                {entity.timeline.map((evt, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#141624] border border-white/5 flex items-start gap-2">
                    <Clock size={13} className="text-[#00F0FF] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400">{evt.time}</span>
                      <p className="text-xs font-bold text-white">{evt.event}</p>
                      {evt.actor && <span className="text-[10px] text-zinc-400">oleh {evt.actor}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer (Mobile Thumb-Zone Optimized >= 44px) */}
          <div className="pt-3 border-t border-white/10 space-y-2.5 mt-4">
            {entity.availableAction && (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full min-h-[46px] py-3 px-4 rounded-2xl bg-[#CFFF5E] hover:bg-lime-400 text-black font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <span>{entity.availableAction.label}</span>
                <ArrowRight size={15} />
              </button>
            )}

            {/* Quick One-Tap WhatsApp Dispatch for Customer / Case */}
            {(entity.type === 'order' || entity.type === 'case' || entity.type === 'customer') && (
              <a
                href={`https://wa.me/601123456789?text=${encodeURIComponent(`Salam dari HQ Abang Colek berhubung ${entity.title} (#${entity.id}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <MessageSquare size={15} />
                <span>WhatsApp Pelanggan (Satu Sentuhan)</span>
              </a>
            )}

            <button
              onClick={() => {
                if (onAskAi) {
                  onAskAi(`Siasat konteks entiti ${entity.type.toUpperCase()} #${entity.id} (${entity.title}) secara menyeluruh.`);
                }
                onClose();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Bot size={15} className="text-[#CFFF5E]" />
              <span>Tanya AI Mengenai Entiti Ini</span>
            </button>
          </div>

          {/* Irreversible Action Preview Confirmation Modal */}
          {showConfirmModal && entity.availableAction && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
              <div className="w-full max-w-sm rounded-3xl bg-[#121422] border border-white/20 p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#FFC107]">
                  <AlertTriangle size={18} />
                  <h3 className="text-xs font-black uppercase text-white">Sahkan Tindakan Operasi</h3>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {entity.availableAction.description}
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      entity.availableAction!.onExecute();
                      setShowConfirmModal(false);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#CFFF5E] hover:bg-lime-400 text-black font-black text-xs cursor-pointer"
                  >
                    Sahkan & Laksana
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Context-Aware AI Sidecar for ABANGCOLEK-OS
 * High-fidelity, operational copilot integrated into the operating environment.
 * Complies with Master Directive Section 7 & anti-fabrication invariants.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Layers,
  Terminal,
  RefreshCw,
  PanelRightClose,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Database,
  ArrowRight,
  User,
  Zap,
  Info
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { AIContext, AIActionProposal } from '@/services/ai/aiContext';
import { ChatMessage, AgentStep } from '@/services/gemini';

export interface AISidecarProps {
  isOpen: boolean;
  onToggle: () => void;
  context: AIContext;
  onSendMessage: (text: string) => void;
  history?: ChatMessage[];
  isProcessing?: boolean;
  streamingText?: string;
  isMobile?: boolean;
}

export const AISidecar: React.FC<AISidecarProps> = ({
  isOpen,
  onToggle,
  context,
  onSendMessage,
  history = [],
  isProcessing = false,
  streamingText = "",
  isMobile = false
}) => {
  const [inputText, setInputText] = useState('');
  const [proposedActionConfirmed, setProposedActionConfirmed] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamingText, isProcessing]);

  // Context-aware dynamic suggestions based on workspace & selected entity
  const contextualPrompts = useMemo(() => {
    if (context.entityType === 'order') {
      return [
        `Semak status pembayaran pesanan #${context.entityId}`,
        `Apakah risiko kelewatan kargo untuk pesanan ini?`,
        `Draf templat WhatsApp status kepada pelanggan`
      ];
    }
    if (context.entityType === 'case') {
      return [
        `Klasifikasikan aduan #${context.entityId} mengikut JEV System-1`,
        `Adakah terdapat bukti fizikal penutup botol bocor?`,
        `Cadangkan keputusan pampasan / botol gantian`
      ];
    }
    if (context.entityType === 'shipment') {
      return [
        `Kira anggaran ketibaan (ETA) konsainan #${context.entityId}`,
        `Hantar amaran zon 1-jam kepada ejen penerima`,
        `Semak maklumat telefon pemandu bas`
      ];
    }
    
    // Tab-specific fallbacks
    switch (context.workspace) {
      case 'orders':
        return [
          `Berapa banyak pesanan tertangguh atau belum disahkan?`,
          `Sahkan resit DuitNow transaksi terkini`,
          `Eksport ringkasan pesanan ke format CSV`
        ];
      case 'bus_freight':
        return [
          `Senaraikan konsainan bas yang kini dalam zon 1-jam`,
          `Semak nombor plat bas dan nama pemandu aktif`,
          `Bina waybill konsainan baharu ke MBKT Terengganu`
        ];
      case 'ecommerce_store':
      case 'admin_products':
        return [
          `Semak baki stok botol kuah colek 350ml`,
          `Apakah pakej borong stokis paling laris?`,
          `Semak integriti penutup botol induction seal`
        ];
      case 'reviews':
        return [
          `Siasat aduan LEAKAGE penutup botol terkini`,
          `Apakah punca utama kerosakan dalam transit kurier?`,
          `Jalankan audit SOP pembungkusan 2026`
        ];
      default:
        return [
          `Ringkaskan status operasi dan pengecualian hari ini`,
          `Semak pesanan yang memerlukan perhatian segera`,
          `Semak status konsainan bas TBS ke Pantai Timur`
        ];
    }
  }, [context]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  // Level 3 Confirmation Handler
  const handleConfirmAction = (actionId: string, actionText: string) => {
    setProposedActionConfirmed(prev => ({ ...prev, [actionId]: true }));
    onSendMessage(`Sahkan dan laksanakan tindakan: ${actionText}`);
  };

  if (!isOpen) {
    // When closed, do NOT render duplicate floating buttons to comply with Master Directive
    return null;
  }

  return (
    <aside
      aria-label="Ejen Sisi Pintar AI"
      className={cn(
        "flex flex-col h-full bg-[#0C0E16]/98 backdrop-blur-2xl border-l border-white/[0.08] z-40 select-none transition-all duration-300 shrink-0",
        isMobile 
          ? "fixed inset-0 w-full z-50 p-3 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))]" 
          : "w-[340px] lg:w-[380px] p-3.5 relative"
      )}
    >
      {/* 1. Header: Context Identity & Close Control */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4757]/20 to-[#FFA000]/20 border border-[#CFFF5E]/40 flex items-center justify-center text-[#CFFF5E] shrink-0">
            <Bot size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-white uppercase tracking-wider truncate">
                AI Operating Sidecar
              </h2>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#CFFF5E]/20 text-[#CFFF5E] font-bold shrink-0">
                Live
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate">
              Gemini 2.5 Flash • Bersandarkan Lejar Sebenar
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Tutup AI Sidecar"
          aria-label="Tutup AI Sidecar"
        >
          {isMobile ? <X size={18} /> : <PanelRightClose size={16} />}
        </button>
      </div>

      {/* 2. Operational Context Badge Strip */}
      <div className="mb-3 p-2.5 rounded-2xl bg-[#121422] border border-white/[0.06] shrink-0 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-mono text-zinc-400 flex items-center gap-1">
            <Layers size={11} className="text-[#8C7DFF]" />
            <span>Konteks Paparan:</span>
          </span>
          <span className="text-[10px] font-bold text-[#CFFF5E] font-mono capitalize">
            {context.workspace?.replace('_', ' ') || 'Command Center'}
          </span>
        </div>
        {context.entityId && (
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[9.5px] text-zinc-400">Entiti Terfokus:</span>
            <span className="text-[9.5px] font-bold text-white font-mono bg-white/5 px-1.5 py-0.5 rounded">
              {context.entityType?.toUpperCase()} #{context.entityId}
            </span>
          </div>
        )}
      </div>

      {/* 3. Messages Stream */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs no-scrollbar"
      >
        {history.length === 0 ? (
          <div className="p-4 text-center text-zinc-400 space-y-2.5 my-auto py-8">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-[#CFFF5E]">
              <Sparkles size={20} />
            </div>
            <p className="text-xs font-bold text-white">Sedia membantu operasi anda.</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[240px] mx-auto">
              Tanyakan semakan pesanan lejar, kargo bas TBS, atau klasifikasi kualiti botol kuah colek.
            </p>
          </div>
        ) : (
          history.slice(-10).map((msg, i) => {
            const isUser = msg.role === 'user';
            const rawText = typeof msg.parts?.[0] === 'string' 
              ? msg.parts[0] 
              : (msg.parts?.[0] as any)?.text || '';

            // Detect proposed action patterns for Level 3 Confirmation requirement
            const hasProposedAction = !isUser && (
              rawText.includes('Cadangan Tindakan') || 
              rawText.includes('Luluskan') || 
              rawText.includes('Botol Gantian') ||
              rawText.includes('Refund')
            );
            const actionId = `action-${i}`;
            const isConfirmed = proposedActionConfirmed[actionId];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-3 rounded-2xl max-w-[94%] leading-relaxed break-words space-y-1.5 shadow-xs",
                  isUser
                    ? "ml-auto bg-[#1C1F32] text-white border border-white/10 rounded-br-xs"
                    : "mr-auto bg-[#131625] text-zinc-200 border border-white/[0.08] rounded-bl-xs"
                )}
              >
                <div className="flex items-center justify-between text-[9.5px] font-mono text-zinc-400 pb-1 border-b border-white/5">
                  <span className="flex items-center gap-1 font-bold">
                    {isUser ? (
                      <>
                        <User size={10} className="text-[#00F0FF]" />
                        <span>Operator (Anda)</span>
                      </>
                    ) : (
                      <>
                        <Bot size={10} className="text-[#CFFF5E]" />
                        <span>Abang Colek AI</span>
                      </>
                    )}
                  </span>
                  {msg.latencyMs && (
                    <span className="text-[9px] text-zinc-500">
                      {(msg.latencyMs / 1000).toFixed(2)}s
                    </span>
                  )}
                </div>

                <div className="markdown-body text-[12px] leading-relaxed text-zinc-200">
                  <ReactMarkdown>{rawText}</ReactMarkdown>
                </div>

                {/* Level 3 Consequential Action Proposal Card */}
                {hasProposedAction && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#0B0D16] border border-amber-500/30 text-amber-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-300">
                      <AlertTriangle size={12} className="shrink-0" />
                      <span>Tindakan Berkesan Diperlukan Pengesahan</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      Tindakan ini akan mengemas kini status lejar rasmi. Sila sahkan sebelum pelaksanaan.
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
                      {isConfirmed ? (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 size={12} />
                          <span>Disahkan & Direkodkan</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConfirmAction(actionId, rawText.slice(0, 40))}
                          className="px-2.5 py-1 rounded-lg bg-[#CFFF5E] hover:bg-[#d8ff7a] text-black font-black text-[10.5px] transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 size={11} />
                          <span>Luluskan & Laksana</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {/* Streaming & Processing State */}
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-[#131625] text-zinc-200 border border-[#CFFF5E]/30 mr-auto max-w-[94%] space-y-1.5"
          >
            <div className="flex items-center gap-2 text-[10px] text-[#CFFF5E] font-mono">
              <RefreshCw size={11} className="animate-spin" />
              <span>Memproses konteks & pangkalan data...</span>
            </div>
            {streamingText && (
              <div className="markdown-body text-[12px] leading-relaxed text-zinc-300">
                <ReactMarkdown>{streamingText}</ReactMarkdown>
              </div>
            )}
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggested Contextual Prompt Chips */}
      <div className="pt-2 pb-2 shrink-0 space-y-1">
        <span className="text-[9px] font-mono uppercase text-zinc-400 block px-1">
          Cadangan Pantas ({context.workspace || 'Konteks'}):
        </span>
        <div className="flex flex-col gap-1 max-h-24 overflow-y-auto no-scrollbar">
          {contextualPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(prompt)}
              className="text-left text-[11px] p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/5 transition-all truncate cursor-pointer flex items-center justify-between group min-h-[36px]"
            >
              <span className="truncate">{prompt}</span>
              <ChevronRight size={11} className="text-zinc-500 group-hover:text-[#CFFF5E] shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* 5. Input Composer */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-white/[0.08] shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanya arahan operasi..."
            disabled={isProcessing}
            className="w-full bg-[#121422] border border-white/10 focus:border-[#CFFF5E]/50 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-1.5 p-2 rounded-lg bg-[#CFFF5E] text-black disabled:opacity-30 disabled:bg-zinc-700 disabled:text-zinc-400 transition-all cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center hover:scale-105"
            title="Hantar arahan"
            aria-label="Hantar Arahan"
          >
            {isProcessing ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} strokeWidth={2.5} />}
          </button>
        </div>
      </form>
    </aside>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Context-Aware AI Sidecar for ABANGCOLEK-OS
 */

import React, { useState, useRef, useEffect } from 'react';
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
  PanelRightOpen,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIContext, AIActionProposal } from '@/services/ai/aiContext';
import { ChatMessage } from '@/services/gemini';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamingText]);

  // Generate contextual quick action chips based on active entity or workspace
  const contextualPrompts = React.useMemo(() => {
    if (context.entityType === 'order') {
      return [
        `Semak status pembayaran pesanan #${context.entityId}`,
        `Apakah risiko kelewatan kargo untuk pesanan ini?`,
        `Draf mesej WhatsApp status kepada pelanggan`
      ];
    }
    if (context.entityType === 'case') {
      return [
        `Klasifikasikan aduan #${context.entityId} mengikut JEV System-1`,
        `Adakah terdapat bukti fizikal botol bocor mencukupi?`,
        `Cadangkan keputusan pampasan / botol gantian`
      ];
    }
    if (context.entityType === 'shipment') {
      return [
        `Kira anggaran ketibaan (ETA) konsainan #${context.entityId}`,
        `Hantar amaran zon 1-jam kepada ejen penerima`,
        `Semak rekod nombor telefon pemandu bas`
      ];
    }
    // Default workspace prompts
    return [
      `Beri ringkasan status operasi hari ini`,
      `Siasat aduan penutup botol bocor terkini`,
      `Semak konsainan bas TBS ke Pantai Timur`
    ];
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

  if (!isOpen) {
    if (isMobile) return null;
    return (
      <button
        onClick={onToggle}
        className="hidden md:flex fixed bottom-6 right-4 z-40 p-3 rounded-2xl bg-[#121422] border border-[#CFFF5E]/40 text-[#CFFF5E] hover:border-[#CFFF5E] hover:bg-[#1A1D30] shadow-[0_8px_30px_rgba(207,255,94,0.25)] transition-all cursor-pointer items-center gap-2 group"
        title="Buka AI Sidecar"
      >
        <Bot size={18} className="group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black inline text-white">Ask AI</span>
        <span className="w-2 h-2 rounded-full bg-[#CFFF5E] animate-pulse" />
      </button>
    );
  }

  return (
    <aside
      aria-label="AI Context Sidecar"
      className={cn(
        "flex flex-col h-full bg-[#0D0F19]/95 backdrop-blur-2xl border-l border-white/10 z-40 select-none transition-all duration-300 shrink-0",
        isMobile 
          ? "fixed inset-0 w-full z-50 p-4" 
          : "w-[340px] lg:w-[380px] p-4 relative"
      )}
    >
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4757]/30 to-[#FFA000]/30 border border-[#CFFF5E]/40 flex items-center justify-center text-[#CFFF5E]">
            <Bot size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-white uppercase tracking-wider">
                ABANG COLEK AI
              </h2>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#CFFF5E]/20 text-[#CFFF5E] font-bold">
                OS Sidecar
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">Gemini 2.5 Flash • Bersandarkan Konteks</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Tutup Sidecar"
        >
          {isMobile ? <X size={16} /> : <PanelRightClose size={16} />}
        </button>
      </div>

      {/* 2. Context Badge Strip */}
      <div className="mb-3 p-2.5 rounded-2xl bg-[#141624] border border-white/5 shrink-0 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono text-zinc-400">Konteks Aktif</span>
          <span className="text-[9.5px] font-bold text-[#CFFF5E] font-mono capitalize">
            {context.workspace || 'Command Center'}
          </span>
        </div>
        {context.entityId && (
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <span className="text-[10px] text-zinc-400">Entiti Dipilih:</span>
            <span className="text-[10px] font-bold text-white font-mono">
              {context.entityType?.toUpperCase()} #{context.entityId}
            </span>
          </div>
        )}
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs no-scrollbar">
        {history.length === 0 ? (
          <div className="p-4 text-center text-zinc-400 space-y-2 mt-4">
            <Sparkles size={24} className="mx-auto text-[#CFFF5E]" />
            <p className="text-xs font-bold text-white">Sedia membantu operasi anda.</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Tanyakan soalan berkaitan pesanan, kargo bas TBS, atau klasifikasi kualiti botol colek.
            </p>
          </div>
        ) : (
          history.slice(-8).map((msg, i) => {
            const isUser = msg.role === 'user';
            const text = typeof msg.parts?.[0] === 'string' 
              ? msg.parts[0] 
              : (msg.parts?.[0] as any)?.text || '';

            return (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-2xl max-w-[90%] leading-relaxed break-words",
                  isUser
                    ? "ml-auto bg-[#1C1F32] text-white border border-white/10"
                    : "mr-auto bg-[#141624] text-zinc-200 border border-[#CFFF5E]/20 shadow-xs"
                )}
              >
                <div className="text-[9.5px] font-mono text-zinc-400 mb-1">
                  {isUser ? 'Anda' : 'Abang Colek AI'}
                </div>
                <p className="text-xs whitespace-pre-wrap">{text}</p>
              </div>
            );
          })
        )}

        {isProcessing && (
          <div className="p-3 rounded-2xl bg-[#141624] text-zinc-200 border border-[#CFFF5E]/20 mr-auto max-w-[90%] space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-[#CFFF5E] font-mono">
              <RefreshCw size={11} className="animate-spin" />
              <span>Memproses konteks operasi...</span>
            </div>
            {streamingText && (
              <p className="text-xs whitespace-pre-wrap leading-relaxed mt-1">{streamingText}</p>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggested Contextual Chips */}
      <div className="pt-2 pb-2 shrink-0 space-y-1">
        <span className="text-[9.5px] font-mono uppercase text-zinc-500 block px-1">
          Cadangan Soalan:
        </span>
        <div className="flex flex-col gap-1">
          {contextualPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(prompt)}
              className="text-left text-[11px] p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/5 transition-all truncate cursor-pointer flex items-center justify-between group"
            >
              <span className="truncate">{prompt}</span>
              <ChevronRight size={11} className="text-zinc-500 group-hover:text-[#CFFF5E] shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* 5. Input Bar */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-white/10 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanya Abang Colek AI..."
            disabled={isProcessing}
            className="w-full bg-[#141624] border border-white/10 focus:border-[#CFFF5E]/50 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-1.5 p-1.5 rounded-lg bg-[#CFFF5E] text-black disabled:opacity-30 disabled:bg-zinc-700 disabled:text-zinc-400 transition-all cursor-pointer"
            title="Hantar"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </aside>
  );
};

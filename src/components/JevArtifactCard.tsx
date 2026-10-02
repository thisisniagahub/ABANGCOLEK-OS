/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  FileText, 
  Mail,
  CheckSquare,
  Activity,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { JevClassificationResult } from '@/services/jevEngine';

interface JevArtifactCardProps {
  jevData: JevClassificationResult;
  onOpenDiscovery?: () => void;
  onAction?: (msg?: string) => void;
}

export const JevArtifactCard: React.FC<JevArtifactCardProps> = ({ 
  jevData, 
  onOpenDiscovery,
  onAction 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!jevData) return null;

  const { dimensions, primitives, recommendedAction, suggestedSop, latencyMs, id, timestamp } = jevData;
  const isLeakageOrSeal = dimensions?.issueClass?.value === 'LEAKAGE' || dimensions?.issueClass?.value === 'SEAL_FAILURE';
  const isUndetermined = dimensions?.rootCauseStatus?.value === 'UNDETERMINED';
  const urgency = primitives?.urgencyScore?.score ?? 3;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jevData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 w-full rounded-2xl sm:rounded-3xl bg-[#121422] border border-amber-400/30 shadow-xl text-zinc-100 overflow-hidden font-sans transition-all">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171A2E] via-[#1B1F38] to-[#171A2E] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-[#FFC107] border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Flame size={20} className="text-[#FF4444] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>🌶️</span>
                <span>Analisis Integriti JEV System-1</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-[#CFFF5E] text-black">
                7-Dimensi Invarian
              </span>
              {id && (
                <span className="text-[10px] font-mono text-zinc-400">
                  #{id.slice(-6)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 font-medium flex items-center gap-2">
              <span>Pengelasan semantik deterministik satu pas</span>
              {latencyMs !== undefined && (
                <>
                  <span>•</span>
                  <span className="text-[#CFFF5E] font-mono font-bold flex items-center gap-1">
                    <Activity size={10} />
                    {latencyMs}ms
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Urgency & CSAT Badges */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <div className={cn(
            "px-2.5 py-1 rounded-xl text-[10.5px] font-bold border flex items-center gap-1",
            urgency >= 4 
              ? "bg-red-500/20 text-red-300 border-red-500/40" 
              : urgency >= 3 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          )}>
            <span>Urgensi: {urgency}/5.0</span>
            <span className="text-[9px] opacity-80">({primitives?.urgencyScore?.label || 'NORMAL'})</span>
          </div>

          <button
            onClick={handleCopyJson}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors text-[11px] flex items-center gap-1"
            title="Salin JSON JEV"
          >
            {copied ? <Check size={13} className="text-[#CFFF5E]" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 7-DIMENSION JEV MATRIX */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers size={13} className="text-[#CFFF5E]" />
              Matriks Pengelasan 7-Dimensi
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Taksonomi Abang Colek v4.2
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {/* 1. Brand */}
            <div className="p-3 rounded-2xl bg-[#17192A] border border-white/5 flex flex-col justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">
                1. Jenama (Brand)
              </span>
              <div className="my-1">
                <span className="font-black text-sm text-white block">
                  {dimensions?.brand?.value || 'ABANGCOLEK'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Keyakinan</span>
                <span className="text-[#CFFF5E] font-bold">
                  {((dimensions?.brand?.confidence ?? 0.98) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* 2. Business Function */}
            <div className="p-3 rounded-2xl bg-[#17192A] border border-white/5 flex flex-col justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">
                2. Fungsi (Business)
              </span>
              <div className="my-1">
                <span className="font-black text-sm text-white block truncate">
                  {dimensions?.businessFunction?.value || 'PACKAGING'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Keyakinan</span>
                <span className="text-[#CFFF5E] font-bold">
                  {((dimensions?.businessFunction?.confidence ?? 0.95) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* 3. Sales Channel */}
            <div className="p-3 rounded-2xl bg-[#17192A] border border-white/5 flex flex-col justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">
                3. Saluran (Channel)
              </span>
              <div className="my-1">
                <span className="font-black text-sm text-white block truncate">
                  {dimensions?.salesChannel?.value || 'AGENT'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Keyakinan</span>
                <span className="text-[#CFFF5E] font-bold">
                  {((dimensions?.salesChannel?.confidence ?? 0.92) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* 4. Customer Intent */}
            <div className="p-3 rounded-2xl bg-[#17192A] border border-white/5 flex flex-col justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">
                4. Hasrat (Intent)
              </span>
              <div className="my-1">
                <span className="font-black text-sm text-white block truncate">
                  {dimensions?.customerIntent?.value || 'COMPLAINT'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Keyakinan</span>
                <span className="text-[#CFFF5E] font-bold">
                  {((dimensions?.customerIntent?.confidence ?? 0.94) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* 5. Issue Class (Highlighted) */}
            <div className={cn(
              "p-3 rounded-2xl border flex flex-col justify-between",
              isLeakageOrSeal 
                ? "bg-red-500/10 border-red-500/30 text-red-200" 
                : "bg-[#17192A] border-white/5 text-white"
            )}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">
                  5. Kelas Isu (Issue)
                </span>
                {isLeakageOrSeal && (
                  <span className="px-1.5 py-0.2 rounded text-[8.5px] font-black bg-red-500 text-white uppercase">
                    Kritikal
                  </span>
                )}
              </div>
              <div className="my-1">
                <span className={cn(
                  "font-black text-sm block truncate",
                  isLeakageOrSeal ? "text-red-400" : "text-white"
                )}>
                  {dimensions?.issueClass?.value || 'LEAKAGE'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Keyakinan</span>
                <span className={isLeakageOrSeal ? "text-red-300 font-bold" : "text-[#CFFF5E] font-bold"}>
                  {((dimensions?.issueClass?.confidence ?? 0.96) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* 6. Process Stage */}
            <div className="p-3 rounded-2xl bg-[#17192A] border border-white/5 flex flex-col justify-between">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">
                6. Peringkat (Stage)
              </span>
              <div className="my-1">
                <span className="font-black text-sm text-white block truncate">
                  {dimensions?.processStage?.value || 'PACKAGING'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Keyakinan</span>
                <span className="text-[#CFFF5E] font-bold">
                  {((dimensions?.processStage?.confidence ?? 0.91) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* 7. Root Cause Status (Invariant 1 Guardrail) - Spans 2 cols */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 sm:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <ShieldCheck size={11} />
                  7. Status Punca (Invariant 1)
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase",
                  isUndetermined 
                    ? "bg-amber-400 text-black font-black" 
                    : "bg-emerald-500 text-white"
                )}>
                  {dimensions?.rootCauseStatus?.value || 'UNDETERMINED'}
                </span>
              </div>
              <div className="my-1.5">
                <p className="text-[11px] text-zinc-300 leading-snug">
                  {isUndetermined ? (
                    <span>
                      <strong className="text-amber-300">Invarian 1 Berkuatkuasa:</strong> Status punca kekal <em>UNDETERMINED</em> sehingga semakan fizikal botol atau kargo bas disahkan (anti-hallucination).
                    </span>
                  ) : (
                    <span>Status punca telah disahkan melalui bukti fizikal atau verifikasi logistik.</span>
                  )}
                </p>
              </div>
              <div className="text-[9.5px] text-zinc-400 font-mono flex items-center justify-between">
                <span>Piawaian Integriti System-1</span>
                <span className="text-amber-300 font-semibold">Mematuhi SOP 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* TYPED PRIMITIVES: NOUL & CSAT */}
        {primitives && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#0E101A] border border-white/5">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
              <span className="text-zinc-400 font-medium block text-[10px]">Campur Tangan Segera:</span>
              <span className={cn(
                "font-black text-xs inline-flex items-center gap-1 mt-0.5",
                primitives.requiresImmediateIntervention?.isAffirmative ? "text-red-400" : "text-emerald-400"
              )}>
                {primitives.requiresImmediateIntervention?.isAffirmative ? '🔴 YA (SEGERA)' : '🟢 TIDAK'}
                <span className="text-[10px] text-zinc-500 font-mono font-normal">
                  ({((primitives.requiresImmediateIntervention?.probability ?? 0.8) * 100).toFixed(0)}%)
                </span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
              <span className="text-zinc-400 font-medium block text-[10px]">Kelayakan Gantian / Refund:</span>
              <span className={cn(
                "font-black text-xs inline-flex items-center gap-1 mt-0.5",
                primitives.isRefundEligible?.isAffirmative ? "text-[#CFFF5E]" : "text-zinc-400"
              )}>
                {primitives.isRefundEligible?.isAffirmative ? ' Layak 1-ke-1' : 'Pemeriksaan Lanjut'}
                <span className="text-[10px] text-zinc-500 font-mono font-normal">
                  ({((primitives.isRefundEligible?.probability ?? 0.9) * 100).toFixed(0)}%)
                </span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
              <span className="text-zinc-400 font-medium block text-[10px]">Peluang Ejen Nilai Tinggi:</span>
              <span className={cn(
                "font-black text-xs inline-flex items-center gap-1 mt-0.5",
                primitives.isHighValueAgentOpportunity?.isAffirmative ? "text-[#FFC107]" : "text-zinc-400"
              )}>
                {primitives.isHighValueAgentOpportunity?.isAffirmative ? '⭐ Potensi Tinggi' : 'Biasa / Runcit'}
                <span className="text-[10px] text-zinc-500 font-mono font-normal">
                  ({((primitives.isHighValueAgentOpportunity?.probability ?? 0.5) * 100).toFixed(0)}%)
                </span>
              </span>
            </div>
          </div>
        )}

        {/* RECOMMENDED ACTION & SOP */}
        {(recommendedAction || suggestedSop) && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
            {recommendedAction && (
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block mb-0.5">
                  Cadangan Tindakan Operasi:
                </span>
                <p className="text-zinc-200 font-medium leading-relaxed">
                  {recommendedAction}
                </p>
              </div>
            )}
            {suggestedSop && (
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <span className="text-amber-300 font-bold">Piawaian SOP:</span>
                  <span className="font-mono text-zinc-200">{suggestedSop}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">SLA: 24 Jam</span>
              </div>
            )}
          </div>
        )}

        {/* WORKSPACE ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {onOpenDiscovery && (
            <button
              onClick={onOpenDiscovery}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Flame size={13} />
              <span>Buka Hab JEV Abang Colek &rarr;</span>
            </button>
          )}

          {onAction && isLeakageOrSeal && (
            <button
              onClick={() => onAction("Siasat aduan pembungkusan botol kuah colek bocor (LEAKAGE) dan draf emel gantian di Gmail")}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <Mail size={13} className="text-red-400" />
              <span>Draf Emel Gantian Botol</span>
            </button>
          )}

          {onAction && (
            <button
              onClick={() => onAction("Cipta tugasan pemeriksaan QC penutup botol kuah colek pembekal di Google Tasks")}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <CheckSquare size={13} className="text-blue-400" />
              <span>Tugasan QC Botol</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white text-[11px] font-medium flex items-center gap-1 border border-white/5 transition-all cursor-pointer"
          >
            <span>{isExpanded ? 'Tutup Perincian' : 'Lihat Probabiliti'}</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* COLLAPSIBLE DETAILS */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Log Data Terkawal JEV System-1 (JSON):
                </span>
                <pre className="p-3 rounded-xl bg-black/80 text-[#CFFF5E] font-mono text-[10.5px] overflow-x-auto border border-white/10 leading-tight">
                  {JSON.stringify({
                    dimensions: jevData.dimensions,
                    primitives: jevData.primitives,
                    suggestedSop: jevData.suggestedSop,
                    recommendedAction: jevData.recommendedAction,
                  }, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

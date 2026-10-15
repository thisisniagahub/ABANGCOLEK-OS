/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Global Voice Command Overlay & HUD for ABANGCOLEK-OS
 * Features:
 * - 9 Visually distinct operational states (Ready, Active, Recognizing, Interpreted, Awaiting Confirmation, Processing, Completed, Failed, Denied/Unsupported)
 * - Microphone sensitivity noise gate toggle (Stall / Balanced / Quiet)
 * - Manual text command entry fallback (for silent offices or unsupported browsers)
 * - Truthful audio frequency visualizer (only animates when actively listening)
 * - Touch-ergonomic layout (>= 44px touch targets)
 */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Check, 
  X, 
  AlertCircle,
  Truck, 
  Download, 
  Flame, 
  Music, 
  Bot, 
  Database,
  Radio,
  Volume2,
  SlidersHorizontal,
  ShieldCheck,
  Ear,
  Info,
  Activity,
  Keyboard,
  Send,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { 
  voiceCommandService, 
  VoiceRecognitionState, 
  ParsedVoiceCommand,
  MicSensitivityMode,
  SENSITIVITY_CONFIGS
} from '@/services/voiceCommandService';
import { cn } from '@/lib/utils';

interface VoiceCommandOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (command: ParsedVoiceCommand) => void;
  isPushToTalk?: boolean;
}

const SAMPLE_COMMANDS = [
  { text: 'Semak bas TBS 1 jam', icon: Truck, label: 'Kargo Bas' },
  { text: 'Eksport data lejar CSV', icon: Download, label: 'Eksport XLS' },
  { text: 'Siasat aduan botol bocor', icon: Flame, label: 'JEV Triage' },
  { text: 'Buka senarai pesanan', icon: Database, label: 'Pesanan' },
  { text: 'Mainkan lagu Kasi Lagi-Lagi', icon: Music, label: 'Jingle' },
  { text: 'Analisis jualan hari ini', icon: Bot, label: 'Ejen AI' }
];

const SENSITIVITY_OPTIONS: Array<{
  id: MicSensitivityMode;
  label: string;
  sublabel: string;
  badge: string;
  icon: React.ElementType;
}> = [
  {
    id: 'stall',
    label: 'Gerai Bising',
    sublabel: 'Pasar Malam',
    badge: '-18 dB Gate',
    icon: ShieldCheck
  },
  {
    id: 'balanced',
    label: 'Seimbang',
    sublabel: 'Kiosk / Kedai',
    badge: '-10 dB Gate',
    icon: Volume2
  },
  {
    id: 'sensitive',
    label: 'Senyap',
    sublabel: 'Pejabat HQ',
    badge: '-3 dB Gate',
    icon: Ear
  }
];

export type VoiceStateLabel = 
  | 'ready_to_listen'
  | 'mic_active'
  | 'recognizing'
  | 'interpreted'
  | 'awaiting_confirmation'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'denied_or_unsupported';

export const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({
  isOpen,
  onClose,
  onExecute,
  isPushToTalk = false
}) => {
  const [state, setState] = useState<VoiceRecognitionState>(voiceCommandService.state);
  const [countdown, setCountdown] = useState<number>(3);
  const [showSensitivityInfo, setShowSensitivityInfo] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const executionScheduledRef = useRef(false);

  useEffect(() => {
    return voiceCommandService.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  // Compute exact explicit state for high-fidelity workflow compliance
  const activeOperationalState: {
    status: VoiceStateLabel;
    title: string;
    description: string;
    color: string;
    badgeBg: string;
  } = useMemo(() => {
    if (isCompleted) {
      return {
        status: 'completed',
        title: 'Arahan Berjaya Dilaksanakan',
        description: 'Tindakan telah diserahkan kepada enjin operasi.',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/80 border-emerald-500/40'
      };
    }
    if (!state.isSupported) {
      return {
        status: 'denied_or_unsupported',
        title: 'Pelayar Tidak Menyokong Pengecaman Suara',
        description: 'Gunakan input teks manual di bawah atau pelayar berasaskan Chromium.',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-950/80 border-amber-500/40'
      };
    }
    if (state.error) {
      return {
        status: 'failed',
        title: 'Pengecaman Tidak Berjaya',
        description: state.error,
        color: 'text-red-400',
        badgeBg: 'bg-red-950/80 border-red-500/40'
      };
    }
    if (state.isProcessing) {
      return {
        status: 'processing',
        title: 'Memproses Transkripsi Suara...',
        description: 'Enjin NLU sedang menganalisis maksud dan parameter arahan.',
        color: 'text-[#00F0FF]',
        badgeBg: 'bg-cyan-950/80 border-cyan-500/40'
      };
    }
    if (state.parsedCommand && !state.isListening) {
      return {
        status: 'awaiting_confirmation',
        title: `Arahan Dikenal Pasti: ${state.parsedCommand.label}`,
        description: `Ketetapan ${Math.round(state.parsedCommand.confidence * 100)}% • Sahkan tindakan di bawah`,
        color: 'text-[#CFFF5E]',
        badgeBg: 'bg-[#CFFF5E]/15 border-[#CFFF5E]/40'
      };
    }
    if (state.isListening && (state.interimTranscript || state.finalTranscript)) {
      return {
        status: 'recognizing',
        title: 'Mengecam Suara (Transcribing)...',
        description: 'Sedang menukar gelombang suara ke teks arahan secara masa-nyata.',
        color: 'text-[#CFFF5E]',
        badgeBg: 'bg-[#CFFF5E]/15 border-[#CFFF5E]/40'
      };
    }
    if (state.isListening) {
      return {
        status: 'mic_active',
        title: 'Mikrofon Aktif — Bercakap Sekarang',
        description: 'Sistem sedang mendengar input suara anda. Klik mikrofon bila selesai.',
        color: 'text-[#CFFF5E]',
        badgeBg: 'bg-[#CFFF5E]/20 border-[#CFFF5E]/50'
      };
    }
    return {
      status: 'ready_to_listen',
      title: 'Sedia Mendengar Arahan',
      description: 'Tekan butang mikrofon atau sebut arahan operasi bila aktif.',
      color: 'text-zinc-300',
      badgeBg: 'bg-white/5 border-white/10'
    };
  }, [state, isCompleted]);

  // When speech ends and a command is parsed, auto-execute with countdown or let user confirm
  useEffect(() => {
    if (!state.isListening && state.parsedCommand && !state.isProcessing && !executionScheduledRef.current && !isCompleted) {
      executionScheduledRef.current = true;
      setCountdown(2);
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleConfirmExecution();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }

    if (state.isListening) {
      executionScheduledRef.current = false;
      setIsCompleted(false);
      setCountdown(3);
    }
  }, [state.isListening, state.parsedCommand, state.isProcessing, isCompleted]);

  const handleConfirmExecution = () => {
    if (state.parsedCommand) {
      setIsCompleted(true);
      setTimeout(() => {
        onExecute(state.parsedCommand!);
        onClose();
      }, 500);
    }
  };

  const handleSampleClick = (sampleText: string) => {
    const parsed = voiceCommandService.simulateSpokenCommand(sampleText);
    setIsCompleted(true);
    setTimeout(() => {
      onExecute(parsed);
      onClose();
    }, 400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    const parsed = voiceCommandService.simulateSpokenCommand(manualText.trim());
    setManualText('');
    setIsCompleted(true);
    setTimeout(() => {
      onExecute(parsed);
      onClose();
    }, 400);
  };

  const handleToggleMic = () => {
    if (state.isListening) {
      voiceCommandService.stopListening();
    } else {
      setIsCompleted(false);
      voiceCommandService.startListening();
    }
  };

  const handleSensitivityChange = (mode: MicSensitivityMode) => {
    voiceCommandService.setSensitivity(mode);
  };

  if (!isOpen) return null;

  const currentConfig = SENSITIVITY_CONFIGS[state.sensitivity || 'balanced'];
  const currentText = state.finalTranscript || state.interimTranscript;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
        {/* Backdrop with dark frosted glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0D0F18] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Glow Ambient Accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#CFFF5E] via-[#00F0FF] to-[#8C7DFF]" />
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-2.5 shrink-0 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#CFFF5E]/15 border border-[#CFFF5E]/30 flex items-center justify-center text-[#CFFF5E]">
                <Radio size={16} className={state.isListening ? 'animate-pulse' : ''} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5 tracking-tight">
                  <span>Perintah Suara Global</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#CFFF5E]/20 text-[#CFFF5E] font-bold">
                    VOICE-OS
                  </span>
                </h3>
                <p className="text-[10.5px] text-zinc-400">
                  Kawalan pertuturan pantas & operasi tanpa tangan
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Tutup (Esc)"
              aria-label="Tutup Paparan Suara"
            >
              <X size={16} />
            </button>
          </div>

          {/* Operational State Banner (Directive Section 8 Compliance) */}
          <div className="px-5 pt-3">
            <div className={cn(
              "p-2.5 rounded-2xl border flex items-center justify-between gap-2.5 transition-all",
              activeOperationalState.badgeBg
            )}>
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  state.isListening ? "bg-[#CFFF5E] animate-ping" : "bg-[#CFFF5E]"
                )} />
                <div className="min-w-0">
                  <span className={cn("text-xs font-black block truncate leading-tight", activeOperationalState.color)}>
                    {activeOperationalState.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 block truncate leading-normal">
                    {activeOperationalState.description}
                  </span>
                </div>
              </div>
              <span className="text-[9.5px] font-mono uppercase font-bold text-zinc-400 shrink-0">
                {activeOperationalState.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Scrollable HUD Content */}
          <div className="overflow-y-auto px-5 py-3 space-y-3 custom-scrollbar">
            
            {/* Microphone Sensitivity Segmented Toggle (Touch Ergonomic >= 44px) */}
            <div className="p-3 rounded-2xl bg-[#141624]/90 border border-white/10 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal size={13} className="text-[#CFFF5E]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-200">
                    Penalaan Sensitiviti Mikrofon
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSensitivityInfo(!showSensitivityInfo)}
                  className="text-[10px] text-zinc-400 hover:text-[#CFFF5E] flex items-center gap-1 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-white/5 min-h-[36px]"
                  title="Ketahui tentang penapis hingar gerai"
                >
                  <Info size={11} />
                  <span>{showSensitivityInfo ? 'Sembunyi' : 'Info Penapis'}</span>
                </button>
              </div>

              {/* 3-State Segmented Control */}
              <div className="grid grid-cols-3 gap-1.5 bg-[#0A0C14] p-1 rounded-xl border border-white/5">
                {SENSITIVITY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = (state.sensitivity || 'balanced') === opt.id;
                  
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSensitivityChange(opt.id)}
                      className={cn(
                        "min-h-[46px] rounded-lg px-2 py-1.5 flex flex-col items-center justify-center transition-all select-none cursor-pointer relative",
                        isSelected
                          ? "bg-gradient-to-b from-[#CFFF5E]/20 to-[#CFFF5E]/5 text-white border border-[#CFFF5E]/50 shadow-[0_0_15px_rgba(207,255,94,0.15)]"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                      )}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-1">
                        <Icon 
                          size={13} 
                          className={isSelected ? "text-[#CFFF5E]" : "text-zinc-400"} 
                        />
                        <span className={cn(
                          "text-[11.5px] font-black tracking-tight leading-none",
                          isSelected ? "text-[#CFFF5E]" : "text-zinc-300"
                        )}>
                          {opt.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] text-zinc-400 font-medium leading-none">
                          {opt.sublabel}
                        </span>
                        <span className={cn(
                          "text-[8px] font-mono px-1 py-0.2 rounded font-bold leading-none",
                          isSelected ? "bg-[#CFFF5E]/20 text-[#CFFF5E]" : "bg-white/5 text-zinc-500"
                        )}>
                          {opt.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Descriptor & Noise Filter Badge */}
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-start justify-between gap-2 text-[10.5px]">
                <div className="text-zinc-400 leading-snug">
                  <span className="font-bold text-zinc-300">{currentConfig.label}: </span>
                  {currentConfig.description}
                </div>
                <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#CFFF5E]/10 border border-[#CFFF5E]/25 text-[#CFFF5E] font-mono text-[9.5px] font-bold">
                  <Activity size={10} />
                  <span>Ambang {Math.round(currentConfig.minConfidence * 100)}%</span>
                </div>
              </div>

              {/* Explanatory Collapsible Details */}
              {showSensitivityInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-2.5 rounded-xl bg-black/40 border border-[#CFFF5E]/20 text-[10.5px] text-zinc-300 space-y-1"
                >
                  <p className="font-bold text-[#CFFF5E] flex items-center gap-1">
                    <ShieldCheck size={12} />
                    Kenapa mod Gerai Bising penting di tapak jualan?
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    Di pasar malam & karnival, pembesar suara jiran dan perbualan pelanggan sering mencetuskan arahan palsu.
                    Mod <strong>Gerai Bising</strong> menaikkan ambang penapis kepada <strong>75%</strong> dan memotong senyap dalam <strong>1.3s</strong> agar sistem hanya memproses suara tegas operator.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Central Voice Wave & Mic Sphere */}
            <div className="py-2 flex flex-col items-center justify-center relative">
              {/* Visualizer Pulse Rings (Only rendered when microphone is actively listening) */}
              <div className="relative flex items-center justify-center my-2">
                {state.isListening && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                      className="absolute w-24 h-24 rounded-full bg-[#CFFF5E]/20 border border-[#CFFF5E]/40"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      className="absolute w-20 h-20 rounded-full bg-[#00F0FF]/25 border border-[#00F0FF]/50"
                    />
                  </>
                )}

                {/* Main Interactive Mic Orb */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer relative z-10",
                    state.isListening
                      ? "bg-[#CFFF5E] text-black shadow-[0_0_35px_rgba(207,255,94,0.6)] scale-105"
                      : "bg-[#181B2C] text-zinc-300 hover:text-white border border-white/15 hover:border-[#CFFF5E]/50"
                  )}
                  title={state.isListening ? 'Klik untuk henti mendengar' : 'Klik untuk mula mendengar'}
                  aria-label={state.isListening ? 'Henti Mendengar' : 'Mula Mendengar'}
                >
                  {state.isListening ? (
                    <Mic size={26} className="animate-bounce" />
                  ) : (
                    <Mic size={26} />
                  )}
                </button>
              </div>

              {/* Audio Frequency Bars Animation (Honest Audio Metering) */}
              <div className="relative flex items-center gap-1.5 h-8 my-2 px-4 py-1 rounded-xl bg-black/30 border border-white/5">
                {[40, 75, 55, 90, 60, 100, 70, 85, 45, 95, 65, 80, 50].map((h, i) => {
                  const isAboveGate = (state.audioLevel || 0) >= (currentConfig.noiseGateLevel || 0.16);
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        height: state.isListening ? `${Math.max(6, h * (state.audioLevel || 0.4))}px` : '4px',
                        backgroundColor: state.isListening 
                          ? (isAboveGate ? (i % 2 === 0 ? '#CFFF5E' : '#00F0FF') : '#475569') 
                          : '#2A2E44'
                      }}
                      transition={{ duration: 0.1 }}
                      className="w-1 rounded-full"
                    />
                  );
                })}
              </div>

              {/* Real-time Transcription Display */}
              <div className="w-full mt-2 min-h-[56px] p-3 rounded-2xl bg-[#141624] border border-white/10 text-center flex flex-col items-center justify-center">
                {currentText ? (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold text-white tracking-wide leading-relaxed italic"
                  >
                    "{currentText}"
                  </motion.p>
                ) : (
                  <p className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                    <Volume2 size={13} className="text-zinc-500" />
                    <span>Sebut arahan: cth. "Semak bas TBS", "Eksport data", atau "Siasat botol bocor"</span>
                  </p>
                )}
              </div>

              {/* Noise Gate Active Warning / Filtered Murmur Notification */}
              {state.isNoiseFiltered && state.filterMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300"
                >
                  <ShieldCheck size={14} className="shrink-0 text-amber-400" />
                  <span>{state.filterMessage}</span>
                </motion.div>
              )}

              {/* Detected Action Card (if recognized) */}
              {state.parsedCommand && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#181B2C] to-[#121422] border border-[#CFFF5E]/40 shadow-lg text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CFFF5E] flex items-center gap-1">
                      <Sparkles size={11} />
                      <span>Niat Tindakan Dikenal Pasti</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#CFFF5E]/10 text-[#CFFF5E] font-bold">
                      Ketetapan {Math.round(state.parsedCommand.confidence * 100)}%
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white">
                    {state.parsedCommand.label}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    {state.parsedCommand.description}
                  </p>

                  {/* Instant Execution Buttons */}
                  <div className="mt-3 flex items-center justify-end gap-2 pt-2.5 border-t border-white/10">
                    <button
                      type="button"
                      onClick={onClose}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmExecution}
                      className="min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-black bg-[#CFFF5E] hover:bg-[#d8ff7a] text-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Check size={13} />
                      <span>Laksana Sekarang {countdown > 0 ? `(${countdown}s)` : ''}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Manual Text Command Entry Fallback (Directive Section 8 Compliance) */}
            <form onSubmit={handleManualSubmit} className="pt-2">
              <div className="flex items-center gap-1.5 p-1 bg-[#121422] rounded-2xl border border-white/10 focus-within:border-[#CFFF5E]/50 transition-all">
                <Keyboard size={15} className="text-zinc-500 ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Atau taip arahan operasi manual di sini..."
                  className="flex-1 bg-transparent px-2.5 py-2 text-xs text-white placeholder-zinc-500 outline-none min-h-[42px]"
                />
                <button
                  type="submit"
                  disabled={!manualText.trim()}
                  className="px-3.5 py-2 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff7a] disabled:opacity-30 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 min-h-[38px]"
                >
                  <span>Laksana</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </form>

          </div>

          {/* Quick-Action Chips Footer (Zero-Friction Fallback) */}
          <div className="px-5 pb-4 pt-2.5 border-t border-white/10 bg-[#0C0E16] shrink-0">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Arahan Suara Pantas (1-Sentuhan)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SAMPLE_COMMANDS.map((sample, idx) => {
                const Icon = sample.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleClick(sample.text)}
                    className="p-2 rounded-xl bg-[#141624] hover:bg-[#1A1E30] border border-white/5 hover:border-[#CFFF5E]/30 text-left transition-all flex items-center gap-2 group cursor-pointer min-h-[44px]"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-[#CFFF5E]/15 flex items-center justify-center shrink-0 text-zinc-400 group-hover:text-[#CFFF5E] transition-colors">
                      <Icon size={12} />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white truncate">
                      {sample.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

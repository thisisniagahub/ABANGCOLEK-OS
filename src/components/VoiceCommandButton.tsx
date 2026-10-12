/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Touch-Ergonomic Voice Command Trigger Button for ABANGCOLEK-OS
 * Enforces >=44px touch target, push-to-talk hold gestures, haptic feedback,
 * and seamless fallback across desktop & mobile.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Radio, Sparkles } from 'lucide-react';
import { voiceCommandService, VoiceRecognitionState } from '@/services/voiceCommandService';
import { cn } from '@/lib/utils';

interface VoiceCommandButtonProps {
  onOpenOverlay?: () => void;
  variant?: 'header' | 'floating' | 'dock' | 'pill' | 'minimal';
  className?: string;
  label?: string;
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  onOpenOverlay,
  variant = 'header',
  className,
  label = 'Tahan untuk Suara'
}) => {
  const [voiceState, setVoiceState] = useState<VoiceRecognitionState>(voiceCommandService.state);
  const [isPressing, setIsPressing] = useState(false);
  const pressTimerRef = useRef<number | null>(null);
  const isHoldGestureRef = useRef(false);

  useEffect(() => {
    return voiceCommandService.subscribe((state) => {
      setVoiceState(state);
    });
  }, []);

  // Gesture handling: Hold to Speak vs Tap
  const handleStartHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsPressing(true);
    isHoldGestureRef.current = false;

    // Start listening immediately
    voiceCommandService.startListening();
    if (onOpenOverlay) {
      onOpenOverlay();
    }

    pressTimerRef.current = window.setTimeout(() => {
      isHoldGestureRef.current = true;
    }, 250);
  };

  const handleEndHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsPressing(false);

    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    // Stop listening on release
    voiceCommandService.stopListening();
  };

  const handleClick = (e: React.MouseEvent) => {
    // If was just a simple click (not held), ensure overlay opens
    if (!isHoldGestureRef.current && onOpenOverlay) {
      onOpenOverlay();
    }
  };

  const isActive = isPressing || voiceState.isListening;

  // Variant Renderings
  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onMouseDown={handleStartHold}
        onMouseUp={handleEndHold}
        onTouchStart={handleStartHold}
        onTouchEnd={handleEndHold}
        onTouchCancel={handleEndHold}
        onClick={handleClick}
        className={cn(
          "min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center transition-all select-none cursor-pointer relative",
          isActive
            ? "bg-[#CFFF5E] text-black shadow-[0_0_20px_rgba(207,255,94,0.6)] scale-105"
            : "bg-[#181B2C] text-zinc-300 hover:text-white border border-white/10 hover:border-[#CFFF5E]/40",
          className
        )}
        title="Tahan untuk Suara (Push-to-Talk) atau Klik untuk Buka"
        aria-label="Perintah Suara Global"
      >
        {isActive && (
          <span className="absolute inset-0 rounded-full animate-ping bg-[#CFFF5E]/40 opacity-75 pointer-events-none" />
        )}
        <Mic size={18} className={isActive ? 'animate-pulse' : ''} />
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onMouseDown={handleStartHold}
        onMouseUp={handleEndHold}
        onTouchStart={handleStartHold}
        onTouchEnd={handleEndHold}
        onTouchCancel={handleEndHold}
        onClick={handleClick}
        className={cn(
          "min-h-[48px] px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl transition-all select-none cursor-pointer border",
          isActive
            ? "bg-[#CFFF5E] text-black border-[#CFFF5E] shadow-[0_0_25px_rgba(207,255,94,0.6)]"
            : "bg-[#10121C]/90 backdrop-blur-md text-white border-white/15 hover:border-[#CFFF5E]/50 shadow-black/80",
          className
        )}
        title="Tahan untuk Suara (Push-to-Talk) atau Klik untuk Buka"
        aria-label="Perintah Suara Global"
      >
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
          isActive ? "bg-black text-[#CFFF5E]" : "bg-[#CFFF5E]/20 text-[#CFFF5E]"
        )}>
          <Mic size={14} className={isActive ? 'animate-bounce' : ''} />
        </div>
        <div className="flex flex-col text-left pr-1">
          <span className="text-[12px] font-black leading-tight">
            {isActive ? 'Mendengar...' : 'Perintah Suara'}
          </span>
          <span className="text-[9.5px] opacity-75 leading-none">
            {isActive ? 'Lepas untuk laksana' : 'Tahan butang'}
          </span>
        </div>
      </motion.button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onMouseDown={handleStartHold}
        onMouseUp={handleEndHold}
        onTouchStart={handleStartHold}
        onTouchEnd={handleEndHold}
        onTouchCancel={handleEndHold}
        onClick={handleClick}
        className={cn(
          "min-h-[44px] w-full px-3.5 py-2 rounded-2xl flex items-center justify-between text-xs font-bold transition-all select-none cursor-pointer border",
          isActive
            ? "bg-[#CFFF5E] text-black border-[#CFFF5E] shadow-[0_0_20px_rgba(207,255,94,0.5)]"
            : "bg-[#141624] text-zinc-300 hover:text-white border-white/10 hover:border-[#CFFF5E]/40",
          className
        )}
        title="Tahan untuk Suara atau Klik untuk Buka"
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center",
            isActive ? "bg-black text-[#CFFF5E]" : "bg-white/5 text-[#CFFF5E]"
          )}>
            <Mic size={13} className={isActive ? 'animate-pulse' : ''} />
          </div>
          <span>{isActive ? 'Mendengar arahan anda...' : label}</span>
        </div>
        <span className="text-[10px] font-mono opacity-60">Push-to-Talk</span>
      </button>
    );
  }

  // Default 'header' variant
  return (
    <button
      type="button"
      onMouseDown={handleStartHold}
      onMouseUp={handleEndHold}
      onTouchStart={handleStartHold}
      onTouchEnd={handleEndHold}
      onTouchCancel={handleEndHold}
      onClick={handleClick}
      className={cn(
        "min-h-[38px] sm:min-h-[40px] px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all select-none cursor-pointer border",
        isActive
          ? "bg-[#CFFF5E] text-black border-[#CFFF5E] shadow-[0_0_20px_rgba(207,255,94,0.6)] scale-[1.02]"
          : "bg-[#141624] hover:bg-[#1A1E30] text-zinc-300 hover:text-white border-white/10 hover:border-[#CFFF5E]/40",
        className
      )}
      title="Tahan untuk Suara (Push-to-Talk) atau Klik untuk Buka Menu Suara"
      aria-label="Perintah Suara"
    >
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
        isActive ? "bg-black text-[#CFFF5E]" : "text-[#CFFF5E]"
      )}>
        <Mic size={13} className={isActive ? 'animate-pulse' : ''} />
      </div>
      <span className="hidden sm:inline font-semibold text-[11.5px] truncate">
        {isActive ? 'Mendengar...' : 'Suara'}
      </span>
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping ml-0.5" />
      )}
    </button>
  );
};

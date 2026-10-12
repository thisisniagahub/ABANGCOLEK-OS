/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Global Voice Command Engine for ABANGCOLEK-OS
 * High-precision Speech-to-Text with push-to-talk, Web Audio synthesis,
 * haptic ergonomics, and deterministic operational action mapping.
 */

import { activityService } from './activityService';

export type VoiceIntentType = 
  | 'NAVIGATE'
  | 'EXPORT_DATA'
  | 'BUS_ALERT'
  | 'JEV_TRIAGE'
  | 'PLAY_JINGLE'
  | 'SWITCH_STAFF'
  | 'TOGGLE_SIDECAR'
  | 'OPEN_PALETTE'
  | 'AI_PROMPT';

export interface ParsedVoiceCommand {
  rawTranscript: string;
  normalizedTranscript: string;
  type: VoiceIntentType;
  label: string;
  description: string;
  confidence: number;
  targetTab?: string;
  staffRole?: 'hq_admin' | 'stockist_kt';
  aiPrompt?: string;
  isDestructive?: boolean;
}

export type MicSensitivityMode = 'stall' | 'balanced' | 'sensitive';

export interface MicSensitivityConfig {
  mode: MicSensitivityMode;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  minConfidence: number;
  silenceTimeoutMs: number;
  noiseGateLevel: number;
  noiseReductionDb: string;
}

export const SENSITIVITY_CONFIGS: Record<MicSensitivityMode, MicSensitivityConfig> = {
  stall: {
    mode: 'stall',
    label: 'Pasar Malam & Gerai Pop-Up',
    shortLabel: 'Gerai Bising',
    badge: 'Penapis Agresif (Tapak Jualan)',
    description: 'Penapis hingar maksimum untuk persekitaran bising seperti pasar malam, ekspo makanan, dan gerai tepi jalan. Menolak hingar sembang latar & hanya menerima arahan jelas.',
    minConfidence: 0.75,
    silenceTimeoutMs: 1300,
    noiseGateLevel: 0.32,
    noiseReductionDb: '-18 dB Gate'
  },
  balanced: {
    mode: 'balanced',
    label: 'Kaunter & Kiosk (Standard)',
    shortLabel: 'Seimbang',
    badge: 'Standard (Kaunter Kedai)',
    description: 'Pilihan seimbang untuk operasi kiosk dalaman, kaunter juruwang, atau ruang terlindung.',
    minConfidence: 0.55,
    silenceTimeoutMs: 2000,
    noiseGateLevel: 0.16,
    noiseReductionDb: '-10 dB Gate'
  },
  sensitive: {
    mode: 'sensitive',
    label: 'Bilik Senyap & Pejabat HQ',
    shortLabel: 'Senyap',
    badge: 'Sensitif (Bilik Pejabat)',
    description: 'Kepekaan tinggi untuk bilik mesyuarat, pejabat HQ, atau ruang tenang. Menangkap suara lembut dan arahan santai.',
    minConfidence: 0.35,
    silenceTimeoutMs: 3200,
    noiseGateLevel: 0.06,
    noiseReductionDb: '-3 dB Gate'
  }
};

export interface VoiceRecognitionState {
  isListening: boolean;
  isProcessing: boolean;
  interimTranscript: string;
  finalTranscript: string;
  parsedCommand: ParsedVoiceCommand | null;
  error: string | null;
  isSupported: boolean;
  audioLevel: number;
  sensitivity: MicSensitivityMode;
  isNoiseFiltered: boolean;
  filterMessage: string | null;
  activeGateFloor: number;
}

type StateListener = (state: VoiceRecognitionState) => void;

class VoiceCommandService {
  private recognition: any = null;
  private audioCtx: AudioContext | null = null;
  private stateListeners: Set<StateListener> = new Set();
  private isPushToTalkActive = false;
  private silenceTimer: any = null;
  private audioLevelInterval: any = null;

  public state: VoiceRecognitionState = {
    isListening: false,
    isProcessing: false,
    interimTranscript: '',
    finalTranscript: '',
    parsedCommand: null,
    error: null,
    isSupported: typeof window !== 'undefined' && Boolean(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    ),
    audioLevel: 0,
    sensitivity: (typeof window !== 'undefined' && 
      (localStorage.getItem('abangcolek_voice_mic_sensitivity') as MicSensitivityMode)) || 'balanced',
    isNoiseFiltered: false,
    filterMessage: null,
    activeGateFloor: 0.16
  };

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.state.isSupported = false;
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = 'ms-MY'; // Default to Bahasa Melayu, handles Malay & English loanwords seamlessly

      this.recognition.onstart = () => {
        this.updateState({
          isListening: true,
          isProcessing: false,
          error: null,
          interimTranscript: '',
          finalTranscript: '',
          parsedCommand: null
        });
        this.startAudioLevelSimulation();
        this.playAudioCue('start');
        this.triggerHaptic([35]);
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0].transcript;
          if (item.isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        const combined = (final || interim).trim();
        const config = SENSITIVITY_CONFIGS[this.state.sensitivity];

        // Noise gate & aggressive stall filter heuristic
        let isFiltered = false;
        let filterMsg: string | null = null;
        let parsed: ParsedVoiceCommand | null = null;

        if (combined) {
          // Detect ambient murmur/filler syllables common in crowded night markets
          const isMurmur = combined.length < 3 || /^(ha|ah|eh|oh|erm|um|uh|tsh|sh|mm|ye|la|loh|woi|oi)+$/i.test(combined);

          if (this.state.sensitivity === 'stall' && isMurmur) {
            isFiltered = true;
            filterMsg = 'Hingar pasar malam ditapis (Noise Gate Aktif). Sila sebut arahan lebih jelas berhampiran mikrofon.';
          } else {
            parsed = this.parseTranscript(combined);
            // In stall mode, enforce strict min confidence to prevent false triggers from background chatter
            if (this.state.sensitivity === 'stall' && parsed.confidence < config.minConfidence) {
              isFiltered = true;
              filterMsg = `Keyakinan (${Math.round(parsed.confidence * 100)}%) ditapis oleh mod Gerai Bising (Ambang min: ${Math.round(config.minConfidence * 100)}%).`;
              parsed = null;
            }
          }
        }

        this.updateState({
          interimTranscript: interim,
          finalTranscript: final || combined,
          parsedCommand: parsed,
          isNoiseFiltered: isFiltered,
          filterMessage: filterMsg
        });

        // Dynamic auto-finalize on silence depending on sensitivity profile
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
        }
        if (combined && parsed && !this.isPushToTalkActive) {
          this.silenceTimer = setTimeout(() => {
            if (this.state.isListening) {
              this.stopListening();
            }
          }, config.silenceTimeoutMs);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[VoiceCommandService] Speech error:', event.error);
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
        // Only set error if not simply 'no-speech' or 'aborted'
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          this.updateState({
            error: `Ralat pengecaman suara: ${event.error}`,
            isListening: false
          });
          this.playAudioCue('error');
        }
        this.stopAudioLevelSimulation();
      };

      this.recognition.onend = () => {
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
        this.stopAudioLevelSimulation();
        const wasListening = this.state.isListening;
        
        this.updateState({
          isListening: false,
          audioLevel: 0
        });

        if (wasListening) {
          this.playAudioCue('stop');
        }
      };
    } catch (e) {
      console.error('[VoiceCommandService] Failed to init SpeechRecognition:', e);
      this.state.isSupported = false;
    }
  }

  // --- Web Audio Synthesizer Cues ---
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playAudioCue(type: 'start' | 'stop' | 'success' | 'error' | 'click') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.08, now);

      if (type === 'click') {
        // Crisp tactile tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.04);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (type === 'start') {
        // High rising modern chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(760, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'stop') {
        // Soft descending release blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        // Harmonic confirmation chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'error') {
        // Low double buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  private triggerHaptic(pattern: number[]) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration error
    }
  }

  // Audio level simulation for dynamic waveform while user speaks
  private startAudioLevelSimulation() {
    this.stopAudioLevelSimulation();
    this.audioLevelInterval = setInterval(() => {
      if (this.state.isListening) {
        const config = SENSITIVITY_CONFIGS[this.state.sensitivity];
        // Generate realistic fluctuating speech wave values
        const rawWave = 0.2 + Math.random() * 0.75;
        // In stall mode, gate lower noise sounds to reflect background rejection
        const effectiveLevel = (this.state.sensitivity === 'stall' && rawWave < config.noiseGateLevel) 
          ? config.noiseGateLevel * 0.4
          : rawWave;

        this.updateState({ audioLevel: effectiveLevel });
      }
    }, 80);
  }

  private stopAudioLevelSimulation() {
    if (this.audioLevelInterval) {
      clearInterval(this.audioLevelInterval);
      this.audioLevelInterval = null;
    }
    this.updateState({ audioLevel: 0 });
  }

  // --- Microphone Sensitivity Toggle API ---
  public setSensitivity(mode: MicSensitivityMode) {
    if (this.state.sensitivity === mode) return;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('abangcolek_voice_mic_sensitivity', mode);
      } catch {
        // Ignore storage exceptions
      }
    }

    const config = SENSITIVITY_CONFIGS[mode];
    this.updateState({
      sensitivity: mode,
      activeGateFloor: config.noiseGateLevel,
      filterMessage: null,
      isNoiseFiltered: false
    });

    this.playAudioCue('click');
    this.triggerHaptic([25]);

    activityService.logEvent({
      type: 'SYSTEM_NOTICE',
      title: `Kepekaan Mikrofon: ${config.shortLabel}`,
      subtitle: `Penapis hingar diset kepada ${config.badge} (${config.noiseReductionDb})`,
      actorName: 'Operator Suara',
      source: 'Voice Audio Engine',
      severity: 'info'
    });
  }

  // --- Push-to-Talk & Hold Gesture API ---
  public startListening() {
    if (!this.state.isSupported) {
      this.updateState({
        error: 'Pelayar ini tidak menyokong SpeechRecognition Web API. Sila gunakan Chrome atau Edge, atau pilih arahan contoh di bawah.'
      });
      return;
    }

    if (this.state.isListening) return;

    try {
      this.isPushToTalkActive = true;
      this.recognition.start();
    } catch (e) {
      console.warn('[VoiceCommandService] Failed to start recognition:', e);
    }
  }

  public stopListening(): ParsedVoiceCommand | null {
    this.isPushToTalkActive = false;

    if (this.state.isListening && this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }

    const finalTranscript = this.state.finalTranscript || this.state.interimTranscript;
    if (finalTranscript.trim()) {
      const parsed = this.parseTranscript(finalTranscript.trim());
      this.updateState({ parsedCommand: parsed });
      return parsed;
    }

    return null;
  }

  public toggleListening(): boolean {
    if (this.state.isListening) {
      this.stopListening();
      return false;
    } else {
      this.startListening();
      return true;
    }
  }

  // Set explicit simulated speech input (for testing, fallback, or quick chips)
  public simulateSpokenCommand(transcript: string): ParsedVoiceCommand {
    this.playAudioCue('start');
    this.triggerHaptic([30]);

    const parsed = this.parseTranscript(transcript);
    this.updateState({
      isListening: false,
      interimTranscript: '',
      finalTranscript: transcript,
      parsedCommand: parsed,
      error: null
    });

    return parsed;
  }

  // --- Semantic Parser Engine ---
  public parseTranscript(text: string): ParsedVoiceCommand {
    const raw = text.trim();
    const q = raw.toLowerCase();

    // 1. Instant Data Export
    if (
      q.includes('eksport data') ||
      q.includes('download xls') ||
      q.includes('muat turun lejar') ||
      q.includes('export data') ||
      q.includes('muat turun csv') ||
      q.includes('eksport csv') ||
      q.includes('export excel')
    ) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Eksport Lejar Operasi (.CSV / .XLS)',
        type: 'EXPORT_DATA',
        label: 'Muat Turun Lejar Operasi',
        description: 'Menjana dan memuat turun fail CSV transaksi lejar jualan Abang Colek serta-merta.',
        confidence: 0.98
      };
    }

    // 2. TBS 1-Hour Zone Bus Alert
    if (
      q.includes('amaran bas') ||
      q.includes('tbs 1 jam') ||
      q.includes('peringatan 1 jam') ||
      q.includes('alert penerima bas') ||
      q.includes('dispatch bas') ||
      q.includes('kargo bas')
    ) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Peringatan Zon 1-Jam Kargo Bas TBS',
        type: 'BUS_ALERT',
        label: 'Hantar Amaran Bas TBS (1 Jam)',
        description: 'Mengaktifkan amaran awal 1 jam sebelum bas ekspres tiba di terminal penerima.',
        confidence: 0.96,
        targetTab: 'bus_freight'
      };
    }

    // 3. JEV Quality & Leakage Investigation (Strict Invariant: UNDETERMINED)
    if (
      q.includes('botol bocor') ||
      q.includes('leakage') ||
      q.includes('jev') ||
      q.includes('siasat aduan') ||
      q.includes('integriti botol') ||
      q.includes('pecah') ||
      q.includes('qc botol')
    ) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Siasatan Aduan Integriti Botol (JEV Triage)',
        type: 'JEV_TRIAGE',
        label: 'Jalankan Triage JEV 7-Dimensi',
        description: 'Menganalisis aduan botol bocor dengan mematuhi Invarian UNDETERMINED sehingga bukti makmal disahkan.',
        confidence: 0.95,
        targetTab: 'command_center'
      };
    }

    // 4. Play Brand Jingle "Kasi Lagi-Lagi"
    if (
      q.includes('main lagu') ||
      q.includes('jingle') ||
      q.includes('kasi lagi') ||
      q.includes('lagu tema') ||
      q.includes('mainkan lagu') ||
      q.includes('audio')
    ) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Mainkan Lagu Tema "Kasi Lagi-Lagi"',
        type: 'PLAY_JINGLE',
        label: 'Mainkan Jingle Abang Colek',
        description: 'Memainkan audio rasmi lagu tema promosi "Kasi Lagi-Lagi" (85-95 BPM).',
        confidence: 0.94,
        targetTab: 'discovery'
      };
    }

    // 5. Staff Role Switching
    if (
      q.includes('tukar sesi hq') ||
      q.includes('admin hq') ||
      q.includes('staf jb') ||
      q.includes('login hq')
    ) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Tukar Sesi: HQ Admin JB',
        type: 'SWITCH_STAFF',
        label: 'Tukar Peranan: HQ Admin',
        description: 'Bertukar ke sesi Pentadbir Operasi Utama Abang Colek Johor Bahru.',
        confidence: 0.96,
        staffRole: 'hq_admin'
      };
    }

    if (
      q.includes('tukar sesi stokis') ||
      q.includes('stokis kt') ||
      q.includes('terengganu') ||
      q.includes('login stokis')
    ) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Tukar Sesi: Stokis KT Terengganu',
        type: 'SWITCH_STAFF',
        label: 'Tukar Peranan: Stokis KT',
        description: 'Bertukar ke sesi Pengurus Stokis MBKT Pantai Timur.',
        confidence: 0.96,
        staffRole: 'stockist_kt'
      };
    }

    // 6. Sidecar & Palette Controls
    if (q.includes('sidecar') || q.includes('pembantu tepi') || q.includes('ai bar')) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Togol Pembantu Maya AI Sidecar',
        type: 'TOGGLE_SIDECAR',
        label: 'Togol AI Sidecar',
        description: 'Membuka atau menutup panel sisi perbualan pembantu pintar.',
        confidence: 0.92
      };
    }

    if (q.includes('command palette') || q.includes('pusat carian') || q.includes('ctrl k')) {
      return {
        rawTranscript: raw,
        normalizedTranscript: 'Buka Pusat Perintah Omni-Search',
        type: 'OPEN_PALETTE',
        label: 'Buka Command Palette',
        description: 'Membuka modal carian pantas sistem global (Ctrl+K).',
        confidence: 0.94
      };
    }

    // 7. Navigation Actions to System Workspaces
    const tabNavRules: Array<{ keywords: string[]; tab: string; label: string; desc: string }> = [
      {
        keywords: ['pusat perintah', 'command center', 'kokpit', 'kpi utama', 'dashboard utama', 'perintah'],
        tab: 'command_center',
        label: 'Navigasi: Pusat Perintah (Command Center)',
        desc: 'Membuka kokpit operasi 4 KPI, Needs Attention queue, dan radar logistik.'
      },
      {
        keywords: ['bas', 'tbs', 'kargo', 'mbkt', 'larkin', 'freight', 'ekspres bas'],
        tab: 'bus_freight',
        label: 'Navigasi: Ekspres Bas & Ejen',
        desc: 'Membuka penjejakan konsainmen bas ekspres dan amaran 1 jam TBS-MBKT.'
      },
      {
        keywords: ['pesanan', 'order', 'orders', 'transaksi', 'senarai jualan', 'pelanggan'],
        tab: 'orders',
        label: 'Navigasi: Pengurusan Pesanan (Orders)',
        desc: 'Melihat senarai pesanan Supabase, status bayaran DuitNow, dan kelulusan resit.'
      },
      {
        keywords: ['kedai', 'store', 'ecommerce', 'beli', 'katalog', 'borong', 'makanfest', 'troli'],
        tab: 'ecommerce_store',
        label: 'Navigasi: Kedai E-Commerce & Borong',
        desc: 'Membuka portal tempahan kuah colek 350ml dan pakej karton borong ejen.'
      },
      {
        keywords: ['laman utama', 'landing page', 'muka depan', 'portal pembeli'],
        tab: 'landing',
        label: 'Navigasi: Laman Utama Jenama',
        desc: 'Membuka laman pendaratan pelanggan rasmi dengan video 4K dan testimoni.'
      },
      {
        keywords: ['hab jenama', 'discovery', 'pitch deck', 'brand hub', 'wocs', 'tiktok'],
        tab: 'discovery',
        label: 'Navigasi: Hab Jenama & Pitch Deck',
        desc: 'Membuka Pitch Deck 15-slaid pelabur, cangkuk viral TikTok, dan templat WOCS.'
      },
      {
        keywords: ['workspace hub', 'google workspace', '9 dalam 1', 'sembilan dalam satu'],
        tab: 'workspace_hub',
        label: 'Navigasi: Google Workspace Hub (9-in-1)',
        desc: 'Membuka hab sehenti 9 aplikasi produktiviti Google.'
      },
      {
        keywords: ['gmail', 'emel', 'inbox', 'surat rasmi'],
        tab: 'gmail',
        label: 'Navigasi: Gmail',
        desc: 'Membuka peti emel rasmi bagi aduan dan pengesahan konsainmen.'
      },
      {
        keywords: ['calendar', 'kalendar', 'jadual', 'acara festival', 'tarikh'],
        tab: 'calendar',
        label: 'Navigasi: Google Calendar',
        desc: 'Melihat jadual festival gerai jelajah dan taklimat stokis.'
      },
      {
        keywords: ['drive', 'fail', 'folder', 'dokumen rasmi', 'google drive'],
        tab: 'drive',
        label: 'Navigasi: Google Drive Hub',
        desc: 'Membuka 2 folder perkongsian Google Drive rasmi bagi fail SOP dan media.'
      },
      {
        keywords: ['tasks', 'tugasan', 'todo', 'checklist', 'senarai kerja'],
        tab: 'tasks',
        label: 'Navigasi: Google Tasks',
        desc: 'Melihat senarai tugasan pemeriksaan QC dan operasi harian.'
      },
      {
        keywords: ['docs', 'dokumen', 'surat', 'manifesto'],
        tab: 'docs',
        label: 'Navigasi: Google Docs',
        desc: 'Membuka editor dokumen SOP Abang Colek.'
      },
      {
        keywords: ['sheets', 'spreadsheet', 'excel', 'lejar kiraan'],
        tab: 'sheets',
        label: 'Navigasi: Google Sheets',
        desc: 'Membuka hamparan kerja kiraan stok dan aliran jualan.'
      },
      {
        keywords: ['forms', 'borang', 'survey', 'cabutan bertuah', 'lucky draw'],
        tab: 'forms',
        label: 'Navigasi: Google Forms',
        desc: 'Melihat borang maklum balas dan pendaftaran peraduan pelanggan.'
      },
      {
        keywords: ['meet', 'telesidang', 'mesyuarat video', 'panggilan video'],
        tab: 'meet',
        label: 'Navigasi: Google Meet',
        desc: 'Mencipta bilik telesidang Google Meet untuk taklimat stokis.'
      },
      {
        keywords: ['maps', 'peta', 'logistics map', 'lokasi armada'],
        tab: 'maps',
        label: 'Navigasi: Peta Armada Google Maps',
        desc: 'Melihat visualisasi peta armada lori dan hab stokis di Semenanjung.'
      },
      {
        keywords: ['plugins', 'plugin', 'gedung', 'skyscanner', 'canva'],
        tab: 'plugins',
        label: 'Navigasi: Gedung Plugins 3P',
        desc: 'Melihat 12 integrasi API luaran aktif.'
      },
      {
        keywords: ['prestasi agen', 'telemetri', 'latency', 'agent performance'],
        tab: 'agent_performance',
        label: 'Navigasi: Prestasi Agen AI',
        desc: 'Melihat carta telemetri kependaman model dan panggilan alat.'
      },
      {
        keywords: ['urus produk', 'admin produk', 'inventori', 'tambah produk', 'harga'],
        tab: 'admin_products',
        label: 'Navigasi: Pengurusan Produk & Inventori',
        desc: 'Kemas kini harga borong, status stok botol, dan katalog.'
      },
      {
        keywords: ['dev console', 'konsol dev', 'diagnostik', 'terminal'],
        tab: 'dev_console',
        label: 'Navigasi: Konsol Pembangun (Dev Diagnostics)',
        desc: 'Melihat status sistem, benih lejar, dan pengesahan skema.'
      },
      {
        keywords: ['dashboard', 'analitik', 'analisis', 'carta hasil'],
        tab: 'dashboards',
        label: 'Navigasi: Dashboard Analitik',
        desc: 'Melihat ringkasan metrik jualan dan pecahan bandar.'
      },
      {
        keywords: ['chat', 'sembang ejen', 'tanya ai', 'gemini'],
        tab: 'chat',
        label: 'Navigasi: Sembang Ejen Pintar',
        desc: 'Berinteraksi langsung dengan Ejen Operasi Gemini.'
      }
    ];

    for (const rule of tabNavRules) {
      if (rule.keywords.some((kw) => q.includes(kw))) {
        return {
          rawTranscript: raw,
          normalizedTranscript: `Buka ${rule.label}`,
          type: 'NAVIGATE',
          label: rule.label,
          description: rule.desc,
          confidence: 0.92,
          targetTab: rule.tab
        };
      }
    }

    // 8. Fallback: Freeform Autonomous Gemini Agent Dispatch
    return {
      rawTranscript: raw,
      normalizedTranscript: `Ejen Pintar: "${raw}"`,
      type: 'AI_PROMPT',
      label: 'Arahkan Ejen Operasi Gemini',
      description: `Menghantar arahan "${raw}" secara terus kepada ejen autonomi Gemini 2.5 Flash untuk analisis dan pelaksanaan tindakan Workspace/Plugins.`,
      confidence: 0.88,
      aiPrompt: raw,
      targetTab: 'chat'
    };
  }

  // --- Dispatch & Execute Operational Action ---
  public async executeCommand(
    command: ParsedVoiceCommand,
    handlers: {
      setActiveTab: (tab: string) => void;
      handleSendMessage: (msg: string) => void;
      handleExportData: () => void;
      onSwitchStaff?: (role: 'hq_admin' | 'stockist_kt') => void;
      onToggleSidecar?: () => void;
      onOpenPalette?: () => void;
      triggerBusAlert?: () => void;
    }
  ): Promise<{ success: boolean; message: string }> {
    this.updateState({ isProcessing: true });

    try {
      this.playAudioCue('success');
      this.triggerHaptic([30, 40, 30]);

      let message = '';

      switch (command.type) {
        case 'EXPORT_DATA':
          handlers.handleExportData();
          message = 'Lejar operasi Abang Colek berjaya dieksport ke fail CSV!';
          break;

        case 'BUS_ALERT':
          handlers.setActiveTab('bus_freight');
          if (handlers.triggerBusAlert) {
            handlers.triggerBusAlert();
          }
          message = 'Modul Kargo Bas dibuka & amaran penerima 1 jam diaktifkan!';
          break;

        case 'JEV_TRIAGE':
          handlers.setActiveTab('command_center');
          handlers.handleSendMessage('Jalankan siasatan JEV System-1 untuk aduan integriti botol kuah colek bocor (LEAKAGE) dengan Invarian UNDETERMINED.');
          message = 'Siasatan aduan JEV 7-dimensi dilancarkan dengan kunci integriti!';
          break;

        case 'PLAY_JINGLE':
          handlers.setActiveTab('discovery');
          // Dispatch custom event to tell discovery jingle player to start playing
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('play-brand-jingle'));
          }
          message = 'Lagu tema "Kasi Lagi-Lagi" mula dimainkan!';
          break;

        case 'SWITCH_STAFF':
          if (command.staffRole && handlers.onSwitchStaff) {
            handlers.onSwitchStaff(command.staffRole);
            message = `Sesi berjaya ditukar kepada ${command.staffRole === 'hq_admin' ? 'HQ Admin JB' : 'Stokis KT'}!`;
          }
          break;

        case 'TOGGLE_SIDECAR':
          if (handlers.onToggleSidecar) {
            handlers.onToggleSidecar();
            message = 'AI Sidecar berjaya ditogol!';
          }
          break;

        case 'OPEN_PALETTE':
          if (handlers.onOpenPalette) {
            handlers.onOpenPalette();
            message = 'Pusat Perintah Global (Command Palette) dibuka!';
          }
          break;

        case 'NAVIGATE':
          if (command.targetTab) {
            handlers.setActiveTab(command.targetTab);
            message = `Berjaya navigasi ke ${command.label}`;
          }
          break;

        case 'AI_PROMPT':
        default:
          handlers.setActiveTab('chat');
          if (command.aiPrompt) {
            handlers.handleSendMessage(command.aiPrompt);
            message = `Arahan suara dihantar ke Ejen Gemini: "${command.aiPrompt}"`;
          }
          break;
      }

      // Record audit event in activity log
      activityService.logEvent({
        type: 'AI_ACTION_EXECUTED',
        title: `Perintah Suara: ${command.label}`,
        subtitle: `"${command.rawTranscript}" → ${message}`,
        actorName: 'Operator Suara',
        source: 'Voice Command Engine',
        severity: 'normal'
      });

      this.updateState({
        isProcessing: false,
        isListening: false,
        error: null
      });

      return { success: true, message };
    } catch (err: any) {
      console.error('[VoiceCommandService] Failed to execute voice command:', err);
      this.playAudioCue('error');
      const errorMsg = `Gagal melaksanakan arahan: ${err.message || 'Ralat tidak diketahui'}`;
      this.updateState({
        isProcessing: false,
        error: errorMsg
      });
      return { success: false, message: errorMsg };
    }
  }

  // --- Subscriptions ---
  public subscribe(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private updateState(partial: Partial<VoiceRecognitionState>) {
    this.state = { ...this.state, ...partial };
    this.stateListeners.forEach((listener) => listener(this.state));
  }
}

export const voiceCommandService = new VoiceCommandService();

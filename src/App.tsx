/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Briefcase, 
  Search, 
  Database,
  Loader2,
  Sparkles,
  CheckCircle2,
  Activity,
  MoreHorizontal,
  FileText,
  Mail,
  CheckSquare,
  FolderOpen,
  Calendar,
  FileSpreadsheet,
  MapPin,
  Video,
  MessageSquare,
  Flame,
  Plus,
  AlertCircle,
  Zap,
  Truck,
  Gauge,
  Mic,
  Bell,
  Download,
  Moon,
  Sun,
  Settings,
  Power,
  Share2,
  ChevronDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { sendMessageToAgentStream, ChatMessage, ToolCall, MOCK_DB, AgentStep, subscribeToolExecution } from '@/services/gemini';
import { appStore, OrderItem } from '@/services/store';
import { AbangColekDiscoveryView } from '@/components/AbangColekDiscoveryView';
import { PluginsView } from '@/components/PluginsView';
import { PluginArtifactCard } from '@/components/PluginArtifactCard';
import { JevArtifactCard } from '@/components/JevArtifactCard';
import { FormsView } from '@/components/FormsView';
import { GmailView } from '@/components/GmailView';
import { TasksView } from '@/components/TasksView';
import { DocsView } from '@/components/DocsView';
import { CalendarView } from '@/components/CalendarView';
import { SheetsView } from '@/components/SheetsView';
import { MapsView } from '@/components/MapsView';
import { MeetView } from '@/components/MeetView';
import { ChatWorkspaceView } from '@/components/ChatWorkspaceView';
import { DriveView } from '@/components/DriveView';
import { EcommerceStoreView } from '@/components/EcommerceStoreView';
import { CustomerLandingPage } from '@/components/CustomerLandingPage';
import { AdminProductManager } from '@/components/AdminProductManager';
import { DeveloperConsoleView } from '@/components/DeveloperConsoleView';
import { CommandCenterView } from '@/components/CommandCenterView';
import { WorkspaceHubView } from '@/components/WorkspaceHubView';
import { subscribeAuth } from '@/services/googleAuth';
import { User as FbUser } from 'firebase/auth';
import { OrdersView } from '@/components/OrdersView';
import { useSupabaseAuth } from '@/services/supabaseAuth';
import { BusFreightView } from '@/components/BusFreightView';
import { AgentPerformanceView } from '@/components/AgentPerformanceView';
import { AgentInsightCard } from '@/components/AgentInsightCard';
import { CommandPalette } from '@/components/CommandPalette';
import { ModernBentoDashboard } from '@/components/ModernBentoDashboard';
import { GlobalCommandHeader } from '@/components/GlobalCommandHeader';
import { FloatingNeoDock } from '@/components/FloatingNeoDock';
import { Sidebar } from '@/components/Sidebar';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import { useResponsiveSidebar } from '@/hooks/useResponsiveSidebar';

// --- Components ---

const AgentStepBlock = ({ step }: { step: AgentStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-3.5 rounded-2xl transition-all",
        step.status === 'streaming' 
          ? "bg-[#181B2C] border border-[#CFFF5E]/40 shadow-[0_0_15px_rgba(207,255,94,0.15)]" 
          : "bg-[#141624] border border-white/[0.06]"
      )}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className={cn(
          "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border",
          step.status === 'streaming'
            ? "bg-[#CFFF5E]/20 border-[#CFFF5E]/40 text-[#CFFF5E]"
            : "bg-white/5 border-white/10 text-zinc-300"
        )}>
          {step.type === 'tool' ? <Database size={13} /> : <Bot size={13} />}
        </div>
        <span className="font-bold text-[12.5px] text-zinc-200 truncate">
          {step.type === 'tool' ? `Tool Call: ${step.toolName}` : 'Pemikiran Ejen (Thinking)'}
        </span>
        {step.status === 'streaming' && <Loader2 size={13} className="animate-spin text-[#CFFF5E] ml-auto shrink-0" />}
        {step.status === 'completed' && (
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {step.latencyMs !== undefined && (
              <span className="text-[10px] text-zinc-400 font-mono">
                {(step.latencyMs / 1000).toFixed(2)}s
              </span>
            )}
            <div className="text-[#CFFF5E]">
              <CheckCircle2 size={14} />
            </div>
          </div>
        )}
      </div>
      
      {step.type === 'tool' && step.toolArgs && (
        <pre className="text-[10px] bg-black/60 text-zinc-300 p-2.5 rounded-xl overflow-x-auto mt-2 font-mono whitespace-pre-wrap border border-white/10">
          {JSON.stringify(step.toolArgs, null, 2)}
        </pre>
      )}
      
      {step.type === 'text' && step.content && (
        <div className="text-[12.5px] text-zinc-300 mt-2 line-clamp-2 leading-relaxed italic">"{step.content}"</div>
      )}

      {step.result && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-0.5 text-[11px]">
          <span className="font-bold text-zinc-400 uppercase tracking-wider text-[9px]">Hasil Tindakan</span> 
          <span className="text-zinc-200 truncate font-mono">{step.result.message || 'Berjaya dilaksanakan'}</span>
        </div>
      )}
    </motion.div>
  );
};

const ChatInterface = ({ 
  history, 
  onSendMessage, 
  isProcessing,
  currentTool,
  agentSteps,
  streamingText,
  setActiveTab
}: { 
  history: ChatMessage[], 
  onSendMessage: (msg: string) => void,
  isProcessing: boolean,
  currentTool: ToolCall | null,
  agentSteps: AgentStep[],
  streamingText: string,
  setActiveTab: (tab: string) => void
}) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const leftScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isProcessing, currentTool, streamingText]);

  useEffect(() => {
    if (leftScrollRef.current) {
      leftScrollRef.current.scrollTop = leftScrollRef.current.scrollHeight;
    }
  }, [agentSteps]);

  const isGeneratingReport = agentSteps.some(s => s.type === 'tool' && s.toolName === 'generate_yearly_report');
  const isGeneratingDashboard = agentSteps.some(s => s.type === 'tool' && s.toolName === 'create_operations_dashboard');
  const isGeneratingWidget = isGeneratingReport || isGeneratingDashboard;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-28 md:pb-24 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 min-h-[calc(100vh-180px)] lg:h-[calc(100vh-170px)] select-none">
        {/* Process & Agent Steps (Col span 7 on desktop, 1 col on mobile) */}
        <div className="min-h-[380px] lg:min-h-0 lg:h-full lg:col-span-7 flex flex-col rounded-[24px] sm:rounded-[32px] bg-[#10121C] border border-white/10 shadow-2xl overflow-hidden relative">
          <header className="h-[56px] md:h-[64px] flex items-center justify-between px-4 md:px-6 bg-[#141624] shrink-0 border-b border-white/10">
            <h2 className="font-bold text-white text-[14px] flex items-center gap-2.5">
              {isProcessing ? (
                <Loader2 className="text-[#CFFF5E] animate-spin" size={16} />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Activity className="text-[#CFFF5E]" size={14} />
                </div>
              )}
              <span>Jejak Pelaksanaan Ejen (Execution Trace)</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
              {agentSteps.length} langkah
            </span>
          </header>
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6 pt-4 space-y-3 no-scrollbar" ref={leftScrollRef}>
            {agentSteps.length === 0 && !isProcessing && (
               <div className="text-zinc-500 text-xs font-medium mt-16 text-center flex flex-col items-center gap-2">
                 <Database className="text-zinc-600" size={24} />
                 <span>Mulakan sebarang arahan atau triage untuk melihat jejak pelaksanaan di sini.</span>
               </div>
            )}
            {agentSteps.map((step) => (
              <AgentStepBlock key={step.id} step={step} />
            ))}
          </div>
        </div>

        {/* Chat Panel (Col span 5 on desktop, 1 col on mobile) */}
        <div className="min-h-[450px] lg:min-h-0 lg:h-full lg:col-span-5 flex flex-col rounded-[24px] sm:rounded-[32px] bg-[#10121C] border border-white/10 shadow-2xl overflow-hidden relative">
          {/* Header */}
          <header className="h-[56px] md:h-[64px] flex items-center px-4 md:px-6 justify-between shrink-0 bg-[#141624] border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF4757] to-[#FFA000] flex items-center justify-center text-white shadow-xs">
                <Bot size={14} />
              </div>
              <div>
                <h2 className="font-extrabold text-white text-[14px]">Pembantu Maya Pintar</h2>
                <p className="text-[9.5px] text-[#CFFF5E] font-medium leading-none">Gemini 2.5 Flash • Workspace & JEV Connected</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#CFFF5E] shadow-[0_0_8px_#CFFF5E]" />
          </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 no-scrollbar" ref={scrollRef}>
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 my-auto py-8">
              <div className="w-14 h-14 bg-[#141624] shadow-md border border-white/10 rounded-2xl flex items-center justify-center">
                <Bot size={28} className="text-[#CFFF5E]" />
              </div>
              <p className="font-bold text-white text-sm text-center">Bagaimana saya boleh bantu operasi Abang Colek hari ini?</p>
              <div className="flex flex-wrap justify-center gap-1.5 w-full max-w-xl">
                <button onClick={() => onSendMessage("Jalankan penilaian integriti 7-dimensi JEV System-1 untuk aduan penutup botol kuah colek bocor di Terengganu")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-amber-400/40 text-[#FFC107] font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Flame size={12} className="text-[#FF4444]" />
                  Integriti JEV (7-Dimensi)
                </button>
                <button onClick={() => onSendMessage("Siasat aduan pembungkusan botol kuah colek bocor (LEAKAGE) dan draf emel gantian di Gmail")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-red-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Mail size={12} className="text-red-400" />
                  Aduan Botol Bocor (Gmail)
                </button>
                <button onClick={() => onSendMessage("Jadualkan sesi taklimat stokis Terengganu & selatan dalam Google Calendar")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-amber-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Calendar size={12} className="text-amber-400" />
                  Jadual Taklimat Stokis
                </button>
                <button onClick={() => onSendMessage("Eksport rekod jualan kuah colek dan botol pakej ejen ke Google Sheets")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-emerald-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <FileSpreadsheet size={12} className="text-emerald-400" />
                  Eksport Stokis (Sheets)
                </button>
                <button onClick={() => onSendMessage("Cipta tugasan pemeriksaan QC penutup botol kuah colek pembekal di Google Tasks")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-blue-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <CheckSquare size={12} className="text-blue-400" />
                  Tugasan QC Botol (Tasks)
                </button>
                <button onClick={() => onSendMessage("Cipta SOP kawalan kualiti kuah colek & pembungkusan di Google Docs")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-indigo-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <FileText size={12} className="text-indigo-400" />
                  SOP Kuah Colek (Docs)
                </button>
                <button onClick={() => onSendMessage("Bina borang Google Forms untuk pendaftaran ejen & stokis baharu Abang Colek")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-purple-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <FolderOpen size={12} className="text-purple-400" />
                  Borang Ejen (Forms)
                </button>
                <button onClick={() => onSendMessage("Buka bilik Google Meet untuk krew festival jualan pop-up Johor Bahru")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-teal-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Video size={12} className="text-teal-400" />
                  Bilik Krew Pop-Up (Meet)
                </button>
                <button onClick={() => onSendMessage("Reka poster promosi gerai pop-up Abang Colek di Canva saiz Instagram 1:1")} className="px-3 py-1.5 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-cyan-400 font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <Zap size={12} className="text-cyan-400" />
                  Reka Poster (Canva)
                </button>
              </div>
            </div>
          )}

          {history.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={cn(
                "flex gap-3 max-w-full",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-auto mb-1 border shadow-xs",
                msg.role === 'user' 
                  ? "bg-[#CFFF5E] text-black border-[#CFFF5E] font-black" 
                  : "bg-[#181A2A] border-white/10 text-[#CFFF5E]"
              )}>
                {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
              </div>
              
              <div className={cn(
                "rounded-2xl text-[13.5px] leading-relaxed max-w-[85%] font-medium",
                msg.role === 'user' 
                  ? "p-4 bg-gradient-to-r from-[#1C2032] to-[#252C46] text-white border border-[#CFFF5E]/30 rounded-br-[4px] shadow-md" 
                  : (msg.hasReport || msg.hasDashboard || msg.hasForm || msg.hasEmail || msg.hasTask || msg.hasDoc || msg.hasCalendar || msg.hasSheet || msg.hasMeet || msg.hasChat || msg.hasPlugin || msg.hasJev)
                    ? "p-0" 
                    : "p-4 bg-[#141624] rounded-bl-[4px] text-zinc-100 border border-white/10 shadow-md"
              )}>
                {msg.role === 'model' && (msg.hasReport || msg.hasDashboard || msg.hasForm || msg.hasEmail || msg.hasTask || msg.hasDoc || msg.hasCalendar || msg.hasSheet || msg.hasMeet || msg.hasChat || msg.hasPlugin || msg.hasJev) ? (
                  <div className="flex flex-col gap-2.5 min-w-[220px]">
                    <div className="p-4 bg-[#141624] border border-white/10 rounded-2xl rounded-bl-[4px] shadow-md flex flex-col gap-2.5 text-white">
                      <span className="font-extrabold text-[13.5px] text-white flex items-center gap-2">
                        {msg.hasPlugin ? (
                          <>
                            <Zap size={16} className="text-amber-500 fill-amber-500" />
                            Tindakan Plugin 3P Selesai
                          </>
                        ) : msg.hasJev ? (
                          <>
                            <Flame size={16} className="text-[#E53935]" />
                            Analisis Integriti JEV System-1 Selesai
                          </>
                        ) : msg.hasEmail ? (
                          <>
                            <Mail size={16} className="text-red-600" />
                            Email Delivered via Gmail
                          </>
                        ) : msg.hasCalendar ? (
                          <>
                            <Calendar size={16} className="text-amber-600" />
                            Event Scheduled in Google Calendar
                          </>
                        ) : msg.hasSheet ? (
                          <>
                            <FileSpreadsheet size={16} className="text-emerald-600" />
                            Spreadsheet Created in Google Sheets
                          </>
                        ) : msg.hasTask ? (
                          <>
                            <CheckSquare size={16} className="text-blue-600" />
                            Task Added to Google Tasks
                          </>
                        ) : msg.hasDoc ? (
                          <>
                            <FileText size={16} className="text-indigo-600" />
                            Document Created in Google Docs
                          </>
                        ) : msg.hasForm ? (
                          <>
                            <FolderOpen size={16} className="text-purple-600" />
                            Google Form Created & Published
                          </>
                        ) : msg.hasMeet ? (
                          <>
                            <Video size={16} className="text-teal-600" />
                            Google Meet Room Created
                          </>
                        ) : msg.hasChat ? (
                          <>
                            <MessageSquare size={16} className="text-blue-600" />
                            Message Sent to Google Chat
                          </>
                        ) : msg.hasReport && msg.hasDashboard ? (
                          'Report & Dashboard ready'
                        ) : msg.hasReport ? (
                          'Report now ready'
                        ) : (
                          'Dashboard now ready'
                        )}
                      </span>
                      {msg.formData?.info?.title && (
                        <p className="text-xs text-zinc-600 font-medium">
                          "{msg.formData.info.title}"
                        </p>
                      )}
                      {msg.docData?.title && (
                        <p className="text-xs text-zinc-600 font-medium">
                          "{msg.docData.title}"
                        </p>
                      )}
                      {msg.taskData?.title && (
                        <p className="text-xs text-zinc-600 font-medium">
                          "{msg.taskData.title}"
                        </p>
                      )}
                      {msg.hasPlugin && msg.pluginData && (
                        <PluginArtifactCard pluginType={msg.pluginType || ''} data={msg.pluginData} onOpenStore={() => setActiveTab('plugins')} />
                      )}
                      {msg.hasJev && msg.jevData && (
                        <JevArtifactCard 
                          jevData={msg.jevData} 
                          onOpenDiscovery={() => setActiveTab('discovery')} 
                          onAction={onSendMessage} 
                        />
                      )}
                      {msg.latencyMs && (
                        <div className="text-emerald-600 flex items-center gap-1.5 text-[11px] font-medium">
                          <Activity size={12} className="text-emerald-500" /> Latency {(msg.latencyMs / 1000).toFixed(2)}s
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {msg.hasEmail && (
                        <button 
                          onClick={() => setActiveTab('gmail')}
                          className="bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-red-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <Mail size={14} />
                          Open in Gmail &rarr;
                        </button>
                      )}
                      {msg.hasCalendar && (
                        <button 
                          onClick={() => setActiveTab('calendar')}
                          className="bg-amber-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-amber-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <Calendar size={14} />
                          Open in Calendar &rarr;
                        </button>
                      )}
                      {msg.hasSheet && (
                        <button 
                          onClick={() => setActiveTab('sheets')}
                          className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-emerald-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <FileSpreadsheet size={14} />
                          Open in Sheets &rarr;
                        </button>
                      )}
                      {msg.hasTask && (
                        <button 
                          onClick={() => setActiveTab('tasks')}
                          className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-blue-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <CheckSquare size={14} />
                          View in Google Tasks &rarr;
                        </button>
                      )}
                      {msg.hasDoc && (
                        <button 
                          onClick={() => setActiveTab('docs')}
                          className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-indigo-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <FileText size={14} />
                          Open in Google Docs &rarr;
                        </button>
                      )}
                      {msg.hasForm && (
                        <button 
                          onClick={() => setActiveTab('forms')}
                          className="bg-purple-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-purple-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <FolderOpen size={14} />
                          View in Google Forms Tab &rarr;
                        </button>
                      )}
                      {msg.hasMeet && (
                        <button 
                          onClick={() => setActiveTab('meet')}
                          className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-teal-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <Video size={14} />
                          Open Google Meet &rarr;
                        </button>
                      )}
                      {msg.hasChat && (
                        <button 
                          onClick={() => setActiveTab('chat_workspace')}
                          className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-blue-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <MessageSquare size={14} />
                          Open Google Chat &rarr;
                        </button>
                      )}
                      {msg.hasReport && (
                        <button 
                          onClick={() => setActiveTab('reports')}
                          className="bg-black text-white px-6 py-3 rounded-full font-medium w-max hover:bg-zinc-800 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          go to reports &rarr;
                        </button>
                      )}
                      {msg.hasDashboard && (
                        <button 
                          onClick={() => setActiveTab('dashboards')}
                          className="bg-black text-white px-6 py-3 rounded-full font-medium w-max hover:bg-zinc-800 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          go to dashboards &rarr;
                        </button>
                      )}
                      {msg.hasJev && (
                        <button 
                          onClick={() => setActiveTab('discovery')}
                          className="bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-red-700 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <Flame size={14} />
                          Buka Hab JEV Abang Colek &rarr;
                        </button>
                      )}
                      {msg.hasPlugin && (
                        <button 
                          onClick={() => setActiveTab('plugins')}
                          className="bg-black text-white px-5 py-2.5 rounded-full font-semibold w-max hover:bg-zinc-800 transition-colors text-[13px] shadow-sm flex items-center gap-2"
                        >
                          <Zap size={14} className="text-amber-400" />
                          Buka Gedung Plugins &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={cn("markdown-body", msg.role === 'user' ? "text-white" : "text-zinc-800")}>
                      <ReactMarkdown>{msg.parts?.map((p: any) => p.text || "").join("") || ""}</ReactMarkdown>
                    </div>

                    {msg.hasPlugin && msg.pluginData && (
                      <PluginArtifactCard pluginType={msg.pluginType || ''} data={msg.pluginData} onOpenStore={() => setActiveTab('plugins')} />
                    )}

                    {msg.hasJev && msg.jevData && (
                      <div className="mt-3">
                        <JevArtifactCard 
                          jevData={msg.jevData} 
                          onOpenDiscovery={() => setActiveTab('discovery')} 
                          onAction={onSendMessage} 
                        />
                      </div>
                    )}

                    {msg.role === 'model' && msg.latencyMs !== undefined && (
                      <div className="mt-4 pt-4 border-t border-black/[0.04] flex items-center justify-end text-emerald-600 text-[11px]">
                        <span className="font-mono bg-emerald-50/50 text-emerald-600 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                          <CheckCircle2 size={12} />
                          {(msg.latencyMs / 1000).toFixed(2)}s
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {/* Grounding Sources */}
                {msg.groundingMetadata?.groundingChunks && (
                  <div className="mt-4 pt-4 border-t border-black/[0.04]">
                    <p className="text-[10px] font-semibold text-zinc-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                      <Search size={12} /> Sources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                        <a 
                          key={i} 
                          href={chunk.web?.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[11px] px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 rounded-full text-zinc-500 border border-black/5 transition-colors"
                        >
                          {chunk.web?.title || new URL(chunk.web?.uri).hostname}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isProcessing && streamingText && !isGeneratingWidget && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-full"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto mb-1 bg-white border border-black/5 text-zinc-900 shadow-sm">
                <Bot size={14} />
              </div>
              <div className="p-5 rounded-3xl text-[14px] leading-relaxed max-w-[85%] font-medium bg-white rounded-bl-[8px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-zinc-800 opacity-70">
                <div className="markdown-body text-zinc-800">
                  <ReactMarkdown>{streamingText}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}

          {isProcessing && !streamingText && !isGeneratingWidget && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-[#181A2A] border border-white/10 text-[#CFFF5E] shadow-sm flex items-center justify-center mt-auto mb-1">
                <Bot size={13} />
              </div>
              <div className="bg-[#141624] px-4 py-3 rounded-2xl rounded-bl-[4px] border border-white/10 flex items-center gap-1.5 shadow-md">
                <div className="w-2 h-2 bg-[#CFFF5E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#CFFF5E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#CFFF5E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {isProcessing && isGeneratingWidget && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-full"
            >
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-auto mb-1 bg-[#181A2A] border border-white/10 text-[#CFFF5E] shadow-sm">
                <Bot size={13} />
              </div>
              <div className="flex flex-col gap-2.5 min-w-[200px]">
                <div className="p-4 bg-[#141624] border border-white/10 rounded-2xl rounded-bl-[4px] shadow-md flex flex-col gap-2">
                  <span className="font-bold text-[13px] text-white">
                    {isGeneratingReport && isGeneratingDashboard ? 'Memuktamadkan Laporan & Dashboard...' : isGeneratingReport ? 'Laporan Eksekutif Sedia' : 'Papan Pemuka Sedia'}
                  </span>
                  <div className="text-[#CFFF5E] flex items-center gap-1.5 text-[11px] font-bold">
                    <Loader2 size={12} className="animate-spin" /> Memuktamadkan data...
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {isGeneratingReport && (
                    <button 
                      disabled
                      className="bg-white/10 text-zinc-400 px-5 py-2.5 rounded-full font-bold w-max text-[12px] border border-white/10 cursor-not-allowed"
                    >
                      Buka Laporan &rarr;
                    </button>
                  )}
                  {isGeneratingDashboard && (
                    <button 
                      disabled
                      className="bg-white/10 text-zinc-400 px-5 py-2.5 rounded-full font-bold w-max text-[12px] border border-white/10 cursor-not-allowed"
                    >
                      Buka Papan Pemuka &rarr;
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-5 shrink-0 bg-[#0E101A] border-t border-white/10">
          {/* Active Plugins Bar */}
          <div className="mb-2 px-1 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              <span className="text-[9.5px] font-extrabold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Zap size={11} className="text-[#CFFF5E]" />
                Plugins:
              </span>
              {['Skyscanner', 'Canva', 'GitHub', 'Supabase', 'COROS', 'Gmail'].map((name, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-[#161826] text-zinc-300 font-bold shrink-0 text-[10px] border border-white/5">
                  {name}
                </span>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab('plugins')}
              className="text-[10.5px] font-bold text-[#CFFF5E] hover:underline shrink-0 ml-2 cursor-pointer flex items-center gap-1"
            >
              <span>+ Gedung Plugin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative flex items-center bg-[#141624] rounded-full border border-white/15 p-1.5 focus-within:border-[#CFFF5E]/50 focus-within:shadow-[0_0_20px_rgba(207,255,94,0.15)] transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya arahan operasi, siasat tiket JEV atau lancarkan plugin..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-4 py-2 outline-none placeholder:text-zinc-500 text-white text-[13px] font-medium"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="w-9 h-9 rounded-full bg-[#CFFF5E] text-black font-extrabold flex items-center justify-center disabled:opacity-30 transition-all ml-1 hover:bg-[#d8ff6b] hover:scale-105 cursor-pointer shadow-[0_0_12px_rgba(207,255,94,0.35)] shrink-0"
            >
              {isProcessing ? <Loader2 size={15} className="animate-spin text-black" /> : <Send size={15} className="text-black relative right-0.5 top-0.5" strokeWidth={2.5} />}
            </button>
          </form>

          {history.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-3 w-full">
              <button onClick={() => onSendMessage("Siasat aduan penutup botol kuah colek bocor (LEAKAGE) di Terengganu menggunakan JEV System-1.")} className="px-3 py-1 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-red-400 font-bold text-[10.5px] cursor-pointer">
                Siasat Botol Bocor (JEV)
              </button>
              <button onClick={() => onSendMessage("Cari tiket penerbangan murah ke Tokyo Jepun minggu depan di Skyscanner.")} className="px-3 py-1 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-teal-400 font-bold text-[10.5px] cursor-pointer">
                Tiket Tokyo (Skyscanner)
              </button>
              <button onClick={() => onSendMessage("Reka poster promosi kombo kuah colek di Canva saiz Instagram 1:1.")} className="px-3 py-1 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-cyan-400 font-bold text-[10.5px] cursor-pointer">
                Reka Poster (Canva)
              </button>
              <button onClick={() => onSendMessage("Semak Pull Request dan Issues terkini di GitHub.")} className="px-3 py-1 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-zinc-300 font-bold text-[10.5px] cursor-pointer">
                Semak PR (GitHub)
              </button>
              <button onClick={() => onSendMessage("Semak data latihan COROS dan stamina kecergasan krew gerai hari ini.")} className="px-3 py-1 bg-[#141624] hover:bg-[#1A1E30] rounded-full transition-all border border-white/10 text-orange-400 font-bold text-[10.5px] cursor-pointer">
                Stamina Krew (COROS)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

const ReviewsView = ({ onAction }: { onAction: (msg?: string) => void }) => {
  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-28 md:pb-24 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
        {/* Header Banner - Responsive CSS Grid */}
        <div className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 border border-white/10 bg-[#121420] shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107] animate-pulse" />
              <span className="text-[11px] font-extrabold tracking-wider text-[#FFC107] uppercase">Sistem Maklum Balas Pelanggan</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">Maklum Balas & Ulasan Pelanggan</h2>
            <p className="text-zinc-400 mt-1 text-xs sm:text-sm font-medium">Pantau ulasan kuah colek, aduan kebocoran botol, dan klasifikasi automatik JEV System-1.</p>
          </div>
          <div className="sm:col-span-4 flex justify-start sm:justify-end">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#CFFF5E] font-bold">
              {MOCK_DB.reviews?.length || 0} Ulasan Disahkan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_DB.reviews?.length === 0 ? (
            <div className="text-center py-20 bg-[#121420] rounded-3xl border border-white/10">
              <p className="text-zinc-400 font-medium">Tiada ulasan ditemui buat masa ini.</p>
            </div>
          ) : (
            MOCK_DB.reviews?.map((review, i) => {
              const order = appStore.getOrders().find(o => o.order_id === review.order_id);
              const customerName = order?.customer_id || `Pelanggan #${review.order_id}`;
              const reviewText = review.comment_message;
              const reviewDate = review.creation_date;

              return (
                <div key={review.review_id || i} className="bg-[#121420] p-5 md:p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row justify-between items-start gap-4 transition-all hover:border-[#CFFF5E]/40 group">
                  <div className="flex gap-4 max-w-full sm:max-w-[78%]">
                    <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 mt-0.5 text-[#CFFF5E]">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-extrabold text-[16px] text-white">{customerName}</span>
                        <span className="text-[12px] text-zinc-500">•</span>
                        <span className="text-[12px] text-zinc-400 font-mono">{new Date(reviewDate).toLocaleDateString()}</span>
                        {review.issue_class && (
                          <span className={cn(
                            "text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase",
                            review.issue_class === 'PRAISE' 
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" 
                              : "bg-red-950/80 text-red-400 border border-red-800/40"
                          )}>
                            {review.issue_class}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 mb-2.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Sparkles key={star} size={13} className={star <= review.score ? "text-[#FFC107] fill-[#FFC107]" : "text-zinc-700"} />
                        ))}
                      </div>
                      <p className="text-zinc-200 text-[14.5px] leading-relaxed mb-3 font-medium">"{reviewText}"</p>
                      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                        <span className="flex items-center gap-1.5 text-zinc-400 bg-[#161826] px-3 py-1 rounded-full border border-white/10">
                          Order: <strong className="text-[#CFFF5E]">{review.order_id}</strong>
                        </span>
                        <span className="flex items-center gap-1.5 text-zinc-400 bg-[#161826] px-3 py-1 rounded-full border border-white/10">
                          Kategori: <strong className="text-white capitalize">{review.product_category}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <button 
                      onClick={() => onAction(`Nilaikan maklum balas pelanggan ini menggunakan JEV System-1: "${reviewText}" dan tentukan tindakan operasi.`)} 
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 text-[11.5px] font-bold rounded-full bg-[#FF4757] hover:bg-[#e03847] text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(255,71,87,0.35)] flex items-center justify-center gap-1.5"
                    >
                      <Flame size={13} />
                      <span>JEV Triage</span>
                    </button>
                    <button 
                      onClick={() => onAction(`Draf respons pelanggan di Gmail untuk ulasan ${review.review_id} bagi pesanan ${review.order_id}.`)} 
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 text-[11px] font-bold rounded-full bg-[#181A2A] border border-white/15 text-zinc-300 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center"
                    >
                      Draf Emel
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const ReportsView = ({ onAction }: { onAction: (msg?: string) => void }) => {
  const handleGenerateReport = () => {
    onAction("Jana laporan tahunan terperinci prestasi jualan Kuah Colek Buah Abang Colek bagi tahun 2026.");
  };

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-28 md:pb-24 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
        {/* Header Banner - Responsive CSS Grid */}
        <div className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 border border-white/10 bg-[#121420] shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CFFF5E] animate-pulse" />
              <span className="text-[11px] font-extrabold tracking-wider text-[#CFFF5E] uppercase">Analisis Perniagaan & GMV</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">Laporan Analisis Perniagaan</h2>
            <p className="text-zinc-400 mt-1 text-xs sm:text-sm font-medium">Laporan eksekutif operasi yang dijana secara pintar oleh Gemini 2.5 Flash.</p>
          </div>
          <div className="sm:col-span-4 flex justify-start sm:justify-end">
            <button 
              onClick={handleGenerateReport} 
              className="px-5 py-2.5 bg-[#CFFF5E] text-black rounded-full text-xs font-black hover:bg-[#d8ff6b] transition-all cursor-pointer shadow-[0_0_15px_rgba(207,255,94,0.35)] flex items-center gap-2 active:scale-95"
            >
              <Sparkles size={14} />
              <span>+ Jana Laporan AI</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {MOCK_DB.reports.length === 0 ? (
            <div className="text-center py-20 bg-[#121420] rounded-3xl border border-white/10">
              <p className="text-zinc-400 font-medium">Belum ada laporan dijana. Klik butang di atas untuk meminta ejen menjana laporan.</p>
            </div>
          ) : (
            [...MOCK_DB.reports].reverse().map((report, i) => (
              <div key={i} className="bg-[#121420] rounded-[28px] border border-white/10 shadow-xl overflow-hidden hover:border-[#CFFF5E]/40 transition-all">
                <div className="bg-[#161828] px-6 sm:px-8 py-5 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-extrabold text-[18px] text-white tracking-tight">{report.title}</h3>
                  <span className="text-[11px] font-mono font-bold bg-[#CFFF5E]/15 text-[#CFFF5E] px-3.5 py-1 rounded-full border border-[#CFFF5E]/30">{report.year}</span>
                </div>
                <div className="p-6 sm:p-8">
                  <h4 className="font-bold text-white mb-2 text-[14px] uppercase tracking-wider text-[#CFFF5E]">Ringkasan Eksekutif</h4>
                  <p className="text-zinc-300 leading-relaxed mb-8 font-medium text-[13.5px]">{report.executive_summary}</p>
                  
                  {report.metrics && report.metrics.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-bold text-white mb-4 text-[14px]">Metrik Prestasi Utama</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {report.metrics.filter((m: any) => m.value !== 'N/A' && m.value !== 'n/a').map((m: any, idx: number) => (
                          <div key={idx} className="p-5 bg-[#161826] border border-white/10 rounded-2xl">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">{m.label}</span>
                            <div className="flex items-end gap-2.5">
                              <span className="text-[24px] font-black text-white tracking-tight leading-none">
                                {m.label.toLowerCase().includes('revenue') || m.label.toLowerCase().includes('value') || m.label.toLowerCase().includes('price') || m.label.toLowerCase().includes('cost') || m.label.toLowerCase().includes('amount') ? 'RM ' : ''}
                                {m.value?.toLocaleString() || 0}
                              </span>
                              {m.trend && m.trend !== 'N/A' && m.trend !== 'n/a' && (
                                <span className={cn(
                                  "text-[12px] font-bold mb-0.5",
                                  m.trend.startsWith('+') ? "text-[#CFFF5E]" : m.trend.startsWith('-') ? "text-red-400" : "text-zinc-400"
                                )}>
                                  {m.trend}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.detailed_analysis && (
                    <div className="mb-8 border-t border-white/10 pt-6">
                      <h4 className="font-bold text-white mb-4 text-[14px]">Analisis Terperinci</h4>
                      <div className="markdown-body text-zinc-300 text-[13.5px] leading-relaxed font-medium">
                        <ReactMarkdown>{report.detailed_analysis}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
                    <div>
                      <h4 className="font-bold text-white mb-3 text-[14px]">Wawasan Utama (Insights)</h4>
                      <div className="grid gap-3">
                        {report.key_insights?.map((insight: string, idx: number) => (
                          <div key={idx} className="bg-[#161826] p-4 rounded-2xl flex items-start gap-3 border border-white/5">
                            <div className="w-5 h-5 rounded-full bg-[#CFFF5E]/20 text-[#CFFF5E] flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 size={12} />
                            </div>
                            <span className="text-zinc-300 font-medium leading-relaxed text-[12.5px]">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {report.recommendations && (
                      <div>
                        <h4 className="font-bold text-white mb-3 text-[14px]">Cadangan Strategik</h4>
                        <div className="grid gap-3">
                          {report.recommendations?.map((rec: string, idx: number) => (
                            <div key={idx} className="bg-gradient-to-r from-[#181A2A] to-[#1E2236] text-white p-4 rounded-2xl flex items-start gap-3 border border-[#CFFF5E]/30">
                              <div className="w-5 h-5 rounded-full bg-[#CFFF5E] text-black flex items-center justify-center shrink-0 mt-0.5">
                                <Sparkles size={11} />
                              </div>
                              <span className="text-zinc-100 font-medium leading-relaxed text-[12.5px]">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardsView = ({ 
  onAction,
  setActiveTab 
}: { 
  onAction: (msg?: string) => void;
  setActiveTab?: (tab: string) => void;
}) => {
  return (
    <div className="w-full min-h-full overflow-y-auto">
      {/* 2026 Pinterest & Dribbble Inspired High-Density Bento Grid Dashboard */}
      <ModernBentoDashboard onAction={onAction} setActiveTab={setActiveTab} />

      {/* Dynamic User/Agent-Generated Dashboards (if any exist in MOCK_DB) */}
      {MOCK_DB.dashboards.length > 0 && (
        <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 pb-12 pt-4">
          <div className="pt-8 border-t border-white/10">
            <h3 className="text-xl font-black text-white tracking-tight mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#FFC107]" />
              <span>Laporan Analisis Khas Dijana Ejen AI ({MOCK_DB.dashboards.length})</span>
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {[...MOCK_DB.dashboards].reverse().map((dashboard, i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#121420] border border-white/10 shadow-xl space-y-4 text-white">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-bold text-lg text-white">{dashboard.title}</h4>
                    <span className="text-xs font-mono text-[#CFFF5E]">Custom Report #{i + 1}</span>
                  </div>

                  {dashboard.kpis && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {dashboard.kpis.map((kpi: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-[#161826] border border-white/5">
                          <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">{kpi.label}</span>
                          <span className="text-xl font-black text-white">{kpi.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('command_center');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolCall | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isToolExecuting, setIsToolExecuting] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Responsive Sidebar States: Desktop Collapse & Mobile Slide-Over Drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDockMinimized, setIsDockMinimized] = useState(false);

  // Automatically switch between expanded and collapsed states based on viewport width
  useResponsiveSidebar({
    setIsSidebarCollapsed,
    breakpoint: 768,
    onBreakpointChange: (isMobile) => {
      // Auto-close mobile drawer when transitioning to desktop
      if (!isMobile) {
        setIsMobileMenuOpen(false);
      }
    }
  });

  const { quickStaffSignIn } = useSupabaseAuth();

  // Global Keyboard Shortcuts (Ctrl+K, ?, Alt+1..8, Alt+B, Alt+D, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        (activeElement as HTMLElement).isContentEditable
      );

      // Close modals on Escape
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
        setIsMobileMenuOpen(false);
        return;
      }

      // Omni Command Palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Quick Help Modal: ? (when not typing in an input field)
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Layout Controls
      if (e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
        return;
      }

      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        setIsDockMinimized((prev) => !prev);
        return;
      }

      // Tab Navigation via Alt + Number (1-8)
      if (e.altKey) {
        const tabShortcuts: Record<string, string> = {
          '1': 'command_center',
          '2': 'dashboards',
          '3': 'chat',
          '4': 'bus_freight',
          '5': 'orders',
          '6': 'plugins',
          '7': 'gmail',
          '8': 'calendar',
          '9': 'drive',
          '0': 'discovery',
          'w': 'workspace_hub',
          'W': 'workspace_hub',
          's': 'ecommerce_store',
          'S': 'ecommerce_store',
          'l': 'landing',
          'L': 'landing',
          'p': 'admin_products',
          'P': 'admin_products',
          'c': 'dev_console',
          'C': 'dev_console',
        };
        if (tabShortcuts[e.key]) {
          e.preventDefault();
          setActiveTab(tabShortcuts[e.key]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  useEffect(() => {
    return subscribeToolExecution((executing) => {
      setIsToolExecuting(executing);
    });
  }, []);

  const isToolOrPluginInProgress = Boolean(
    isToolExecuting ||
    (isProcessing && (
      Boolean(currentTool) ||
      agentSteps.some(s => s.type === 'tool' && s.status === 'streaming')
    ))
  );

  const handleSendMessage = async (msg: string) => {
    setIsProcessing(true);
    setStreamingText("");
    setAgentSteps([]);
    setCurrentTool(null);
    try {
      await sendMessageToAgentStream(history, msg, (data) => {
        if (data.isDone) {
          setHistory(data.history);
          setIsProcessing(false);
          setStreamingText("");
          setCurrentTool(null);
          setAgentSteps(data.steps);
        } else {
          setHistory(data.history);
          setAgentSteps(data.steps);
          setStreamingText(data.currentText);
          const activeToolStep = data.steps.find(s => s.type === 'tool' && s.status === 'streaming');
          if (activeToolStep) {
            setCurrentTool({
              id: activeToolStep.id,
              name: activeToolStep.toolName || '',
              args: activeToolStep.toolArgs || {}
            });
          } else {
            setCurrentTool(null);
          }
        }
      });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      setCurrentTool(null);
    }
  };

  const handleAction = (msg?: string) => {
    setActiveTab('chat');
    if (msg) {
      handleSendMessage(msg);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen w-full font-sans text-zinc-100 bg-[#090A10] overflow-hidden selection:bg-[#CFFF5E] selection:text-black relative">
      {quotaExceeded && (
        <div className="bg-amber-950/90 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm shrink-0">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-[#FFC107]"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Global Command Header (Orbital Style) - Grid Row 1 */}
      <GlobalCommandHeader 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAction={handleAction}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebarCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Unified Master Shell: Mobile-First CSS Grid (1-col on mobile, dynamic [76px/295px_1fr] on md:) */}
      <div className={cn(
        "grid min-h-0 h-full w-full overflow-hidden relative transition-[grid-template-columns] duration-300",
        isSidebarCollapsed ? "grid-cols-1 md:grid-cols-[76px_1fr]" : "grid-cols-1 md:grid-cols-[295px_1fr]"
      )}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isToolOrPluginInProgress={isToolOrPluginInProgress}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onAction={handleAction}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        <main className="grid grid-rows-[1fr_auto] min-h-0 h-full w-full overflow-hidden relative p-1.5 sm:p-3 md:p-4 pb-24 md:pb-24 bg-[#090A10]">
          <div className="min-h-0 h-full w-full overflow-y-auto no-scrollbar relative">
            {activeTab === 'command_center' && <CommandCenterView onAction={handleAction} onNavigateTab={setActiveTab} />}
            {activeTab === 'workspace_hub' && <WorkspaceHubView onAction={handleAction} />}
            {activeTab === 'discovery' && <AbangColekDiscoveryView onAction={handleAction} />}
            {activeTab === 'chat' && (
              <ChatInterface 
                history={history} 
                onSendMessage={handleSendMessage} 
                isProcessing={isProcessing}
                currentTool={currentTool}
                agentSteps={agentSteps}
                streamingText={streamingText}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'landing' && (
              <CustomerLandingPage 
                onNavigateToStore={() => setActiveTab('ecommerce_store')}
                onNavigateToCockpit={() => setActiveTab('discovery')}
                onTrackOrder={() => setActiveTab('ecommerce_store')}
                cartCount={0}
                onOpenCart={() => setActiveTab('ecommerce_store')}
                onQuickAddToCart={() => setActiveTab('ecommerce_store')}
              />
            )}
            {activeTab === 'ecommerce_store' && <EcommerceStoreView onAction={handleAction} onNavigateTab={setActiveTab} />}
            {activeTab === 'admin_products' && <AdminProductManager onAction={handleAction} />}
            {activeTab === 'dev_console' && <DeveloperConsoleView onAction={handleAction} />}
            {activeTab === 'bus_freight' && <BusFreightView onAction={handleAction} />}
            {activeTab === 'agent_performance' && <AgentPerformanceView onAction={handleAction} />}
            {activeTab === 'plugins' && <PluginsView onAction={handleAction} />}
            {activeTab === 'gmail' && <GmailView onAction={handleAction} />}
            {activeTab === 'calendar' && <CalendarView onAction={handleAction} />}
            {activeTab === 'drive' && <DriveView onAction={handleAction} />}
            {activeTab === 'tasks' && <TasksView onAction={handleAction} />}
            {activeTab === 'docs' && <DocsView onAction={handleAction} />}
            {activeTab === 'sheets' && <SheetsView onAction={handleAction} />}
            {activeTab === 'forms' && <FormsView onAction={handleAction} />}
            {activeTab === 'meet' && <MeetView onAction={handleAction} />}
            {activeTab === 'chat_workspace' && <ChatWorkspaceView onAction={handleAction} />}
            {activeTab === 'maps' && <MapsView onAction={handleAction} />}
            {activeTab === 'orders' && <OrdersView onAction={handleAction} />}
            {activeTab === 'reviews' && <ReviewsView onAction={handleAction} />}
            {activeTab === 'reports' && <ReportsView onAction={handleAction} />}
            {activeTab === 'dashboards' && <DashboardsView onAction={handleAction} setActiveTab={setActiveTab} />}
          </div>
          
          <div className="mt-1 px-4 text-[10.5px] text-zinc-500 text-center md:text-right shrink-0">
            Intelligence & Discovery via <a href="https://github.com/thisisabangcolek-web/Abang-Colek.git" target="_blank" className="underline hover:text-zinc-400 font-medium">ABANGCOLEK Discovery Engine (v4.2.0)</a>
          </div>
        </main>
      </div>

      {/* Mobile Drawer (Slide-Over Navigation Tree) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 md:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-[84%] max-w-[320px] bg-[#0C0E16] shadow-2xl md:hidden overflow-hidden"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }} 
                isToolOrPluginInProgress={isToolOrPluginInProgress}
                onOpenCommandPalette={() => {
                  setIsMobileMenuOpen(false);
                  setIsCommandPaletteOpen(true);
                }}
                onAction={(prompt) => {
                  setIsMobileMenuOpen(false);
                  handleAction(prompt);
                }}
                isMobile={true}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Neo-Dock (from Image 1 / Smart Cockpit Concept) */}
      <FloatingNeoDock 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isToolOrPluginInProgress={isToolOrPluginInProgress}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isMinimized={isDockMinimized}
        onToggleMinimize={() => setIsDockMinimized(prev => !prev)}
      />

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onTriggerAction={(prompt) => {
          handleAction(prompt);
          setIsCommandPaletteOpen(false);
        }}
        onSwitchStaff={(role) => {
          quickStaffSignIn(role);
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* Keyboard Shortcuts Modal (?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsShortcutsOpen(false);
        }}
      />
    </div>
  );
}

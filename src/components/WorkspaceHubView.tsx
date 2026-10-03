/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Calendar, 
  HardDrive, 
  FileSpreadsheet, 
  CheckSquare, 
  FileText, 
  FolderOpen, 
  Video, 
  MessageSquare,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GmailView } from '@/components/GmailView';
import { CalendarView } from '@/components/CalendarView';
import { DriveView } from '@/components/DriveView';
import { SheetsView } from '@/components/SheetsView';
import { TasksView } from '@/components/TasksView';
import { DocsView } from '@/components/DocsView';
import { FormsView } from '@/components/FormsView';
import { MeetView } from '@/components/MeetView';
import { ChatWorkspaceView } from '@/components/ChatWorkspaceView';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { googleSignIn, subscribeAuth } from '@/services/googleAuth';
import { User as FbUser } from 'firebase/auth';

export interface WorkspaceHubViewProps {
  onAction?: (msg?: string) => void;
  initialSubTab?: string;
}

type WorkspaceTab = 
  | 'gmail' 
  | 'calendar' 
  | 'drive' 
  | 'sheets' 
  | 'tasks' 
  | 'docs' 
  | 'forms' 
  | 'meet' 
  | 'chat_workspace';

interface WorkspaceApp {
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  description: string;
}

const WORKSPACE_APPS: WorkspaceApp[] = [
  { 
    id: 'gmail', 
    label: 'Gmail Rasmi', 
    shortLabel: 'Inbox', 
    icon: Mail, 
    badge: '1 Aduan', 
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    description: 'Emel Rasmi & Aduan Pelanggan' 
  },
  { 
    id: 'calendar', 
    label: 'Google Calendar', 
    shortLabel: 'Jadual', 
    icon: Calendar, 
    badge: '1 Sesi', 
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    description: 'Jadual Hab & Sesi Taklimat Stokis' 
  },
  { 
    id: 'drive', 
    label: 'Google Drive Hub', 
    shortLabel: 'Drive', 
    icon: HardDrive, 
    badge: '2 Folder', 
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    description: 'Aset Jenama & Media TikTok Drive' 
  },
  { 
    id: 'sheets', 
    label: 'Google Sheets', 
    shortLabel: 'Lejar', 
    icon: FileSpreadsheet, 
    badge: 'Auto', 
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Lejar Jualan Terkini Diselaraskan' 
  },
  { 
    id: 'tasks', 
    label: 'Google Tasks', 
    shortLabel: 'Tugasan QC', 
    icon: CheckSquare, 
    badge: '3 Tugas', 
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Tugasan QC Penutup Botol & Inventori' 
  },
  { 
    id: 'docs', 
    label: 'SOP & Dokumen', 
    shortLabel: 'SOP Docs', 
    icon: FileText, 
    badge: 'SOP 2026', 
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Piawaian Kualiti & Pembungkusan Kargo' 
  },
  { 
    id: 'forms', 
    label: 'Borang Ejen', 
    shortLabel: 'Forms', 
    icon: FolderOpen, 
    badge: 'Online', 
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Pendaftaran Ejen & Kaji Selidik' 
  },
  { 
    id: 'meet', 
    label: 'Google Meet', 
    shortLabel: 'Bilik Maya', 
    icon: Video, 
    badge: 'Pop-Up', 
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    description: 'Bilik Sidang Video Google Meet Krew' 
  },
  { 
    id: 'chat_workspace', 
    label: 'Sembang Krew', 
    shortLabel: 'Sembang', 
    icon: MessageSquare, 
    badge: 'Krew TBS', 
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Saluran Sembang Krew Gerai & Pemandu' 
  },
];

export const WorkspaceHubView: React.FC<WorkspaceHubViewProps> = ({ 
  onAction, 
  initialSubTab = 'gmail' 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTab>(initialSubTab as WorkspaceTab);
  const [googleUser, setGoogleUser] = useState<FbUser | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  React.useEffect(() => {
    return subscribeAuth((u) => {
      setGoogleUser(u);
    });
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await googleSignIn();
    } catch (e) {
      console.error('Google Sign-In failed:', e);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="space-y-4 pb-16 text-zinc-100 font-sans max-w-[1560px] mx-auto">
      {/* Workspace Hub Master Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-3xl bg-[#0D0F19] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#141624] border border-white/10 flex items-center justify-center text-[#8C7DFF]">
            <Layers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">
                GOOGLE WORKSPACE HUB
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#8C7DFF]/20 border border-[#8C7DFF]/30 text-[#8C7DFF] text-[10px] font-mono font-bold">
                9 Aplikasi Bersepadu
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Pusat Produktiviti, Komunikasi Rasmi & Pengurusan Rekod Awan Abang Colek
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GoogleSignInButton 
            onClick={handleSignIn} 
            isLoading={isSigningIn}
            label={googleUser ? (googleUser.displayName || 'Google Disambung') : 'Sambung Google'}
          />
        </div>
      </div>

      {/* Horizontal Unified App Switcher Strip (Linear/MacOS Segmented Style) */}
      <div className="p-1.5 rounded-2xl bg-[#0D0F19] border border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {WORKSPACE_APPS.map(app => {
          const isActive = activeSubTab === app.id;
          return (
            <button
              key={app.id}
              onClick={() => setActiveSubTab(app.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0",
                isActive
                  ? "bg-[#1E2238] text-white border border-[#8C7DFF]/50 shadow-md font-black"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <app.icon size={14} className={isActive ? "text-[#CFFF5E]" : "text-zinc-400"} />
              <span>{app.shortLabel}</span>
              {app.badge && (
                <span className={cn(
                  "text-[9px] font-mono px-1.5 py-0.2 rounded border",
                  app.badgeColor || "bg-white/10 text-zinc-300 border-white/10"
                )}>
                  {app.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Embedded Sub-App View Container */}
      <div className="rounded-3xl bg-[#0D0F19] border border-white/10 p-2 sm:p-4 shadow-xl min-h-[600px]">
        {activeSubTab === 'gmail' && <GmailView onAction={onAction} />}
        {activeSubTab === 'calendar' && <CalendarView onAction={onAction} />}
        {activeSubTab === 'drive' && <DriveView onAction={onAction} />}
        {activeSubTab === 'sheets' && <SheetsView onAction={onAction} />}
        {activeSubTab === 'tasks' && <TasksView onAction={onAction} />}
        {activeSubTab === 'docs' && <DocsView onAction={onAction} />}
        {activeSubTab === 'forms' && <FormsView onAction={onAction} />}
        {activeSubTab === 'meet' && <MeetView onAction={onAction} />}
        {activeSubTab === 'chat_workspace' && <ChatWorkspaceView onAction={onAction} />}
      </div>
    </div>
  );
};

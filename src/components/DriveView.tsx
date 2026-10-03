/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Video, 
  Music, 
  File, 
  Copy, 
  Check, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Layers, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  OFFICIAL_DRIVE_FOLDERS, 
  GoogleDriveFile, 
  GoogleDriveFolder, 
  fetchDriveFolderFiles, 
  getFileTypeBadge 
} from '@/services/googleDrive';
import { subscribeAuth, googleSignIn, logout } from '@/services/googleAuth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { User } from 'firebase/auth';

interface DriveViewProps {
  onAction?: (msg?: string) => void;
}

export const DriveView: React.FC<DriveViewProps> = ({ onAction }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Google Auth User State
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  // Subscribe to real Google Auth state
  useEffect(() => {
    const unsub = subscribeAuth((currUser) => {
      setUser(currUser);
    });
    return () => unsub();
  }, []);

  // Fetch files from the selected folder(s)
  const loadFiles = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (selectedFolderId === 'all') {
        const results = await Promise.all(
          OFFICIAL_DRIVE_FOLDERS.map(f => fetchDriveFolderFiles(f.id))
        );
        const merged = results.flatMap(r => r.files);
        const anyLive = results.some(r => r.isLive);
        setFiles(merged);
        setIsLive(anyLive);
        if (!anyLive && results[0]?.error) {
          setErrorMsg(results[0].error);
        }
      } else {
        const res = await fetchDriveFolderFiles(selectedFolderId);
        setFiles(res.files);
        setIsLive(res.isLive);
        if (res.error) setErrorMsg(res.error);
      }
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      setErrorMsg(err?.message || 'Gagal memuat turun senarai fail Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [selectedFolderId, user]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await googleSignIn();
    } catch (err: any) {
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCopyLink = (file: GoogleDriveFile) => {
    const link = file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;
    navigator.clipboard.writeText(link);
    setCopiedFileId(file.id);
    setTimeout(() => setCopiedFileId(null), 2500);
  };

  // Filtered files
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.folderName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    const badge = getFileTypeBadge(f.mimeType);
    return badge.category === selectedCategory;
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('pdf')) {
      return <FileText size={18} className="text-blue-400" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('sheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet size={18} className="text-emerald-400" />;
    }
    if (mimeType.includes('image')) {
      return <ImageIcon size={18} className="text-purple-400" />;
    }
    if (mimeType.includes('video')) {
      return <Video size={18} className="text-rose-400" />;
    }
    if (mimeType.includes('audio')) {
      return <Music size={18} className="text-teal-400" />;
    }
    return <File size={18} className="text-zinc-400" />;
  };

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-28 md:pb-24 text-zinc-100 bg-[#090A10] selection:bg-[#CFFF5E] selection:text-black overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
        
        {/* Header Banner - Orbital Tactical Style */}
        <div className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 border border-white/10 bg-[#121420] shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00F0FF]/10 via-[#CFFF5E]/5 to-transparent blur-3xl pointer-events-none" />

          <div className="lg:col-span-8 space-y-2 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#181B2C] text-[#CFFF5E] border border-[#CFFF5E]/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <HardDrive size={13} className="text-[#CFFF5E]" />
                Pusat Fail Google Drive
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold border flex items-center gap-1.5",
                isLive 
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/40" 
                  : "bg-amber-950/80 text-amber-300 border-amber-800/40"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400")} />
                <span>{isLive ? 'Penyegerakan Google Drive Aktif' : 'Mod Paparan Folder Terpaut'}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              Hab Arkib Google Drive & Folder Rasmi Abang Colek
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              Akses terus fail, aset penjenamaan, SOP kuah colek, video kempen TikTok, dan lejar pengedaran dari dua folder Google Drive yang dikongsi.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 relative z-10 shrink-0">
            {user ? (
              <div className="flex items-center gap-3 p-2 px-3 rounded-2xl bg-[#161828] border border-white/10 w-full sm:w-auto">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-8 h-8 rounded-full border border-[#CFFF5E]" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#CFFF5E] text-black font-extrabold flex items-center justify-center text-xs">
                    {(user.displayName || user.email || 'G')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left min-w-0 flex-1">
                  <span className="text-xs font-bold text-white truncate">{user.displayName || 'Pengguna Google'}</span>
                  <span className="text-[10px] text-zinc-400 truncate font-mono">{user.email}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Log Keluar Google"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 items-start lg:items-end w-full sm:w-auto">
                <GoogleSignInButton onClick={handleSignIn} isLoading={isSigningIn} label="Sambung Google Drive" />
                <span className="text-[10.5px] text-zinc-400">Log masuk untuk segaris kuota penuh Drive</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={loadFiles}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={cn(loading && "animate-spin text-[#CFFF5E]")} />
                <span>Muat Semula</span>
              </button>

              {onAction && (
                <button
                  onClick={() => onAction("Semak fail terkini dalam folder Google Drive Abang Colek dan senaraikan SOP yang berkaitan.")}
                  className="px-4 py-2 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-xs font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(207,255,94,0.3)] cursor-pointer active:scale-95"
                >
                  <Sparkles size={13} />
                  <span>Siasat dengan AI</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two Official Google Drive Folders Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_DRIVE_FOLDERS.map((folder, idx) => {
            const isSelected = selectedFolderId === folder.id;
            const folderFilesCount = files.filter(f => f.folderId === folder.id).length;

            return (
              <div
                key={folder.id}
                onClick={() => setSelectedFolderId(isSelected ? 'all' : folder.id)}
                className={cn(
                  "p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group",
                  isSelected 
                    ? "bg-[#16182A] border-[#CFFF5E] shadow-[0_0_25px_rgba(207,255,94,0.2)]" 
                    : "bg-[#121422] border-white/10 hover:border-white/20 hover:bg-[#151726]"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${folder.color}15`, 
                        borderColor: `${folder.color}40`, 
                        color: folder.color 
                      }}
                    >
                      <FolderOpen size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-[15px] text-white tracking-tight">{folder.name}</h3>
                        <span 
                          className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                        >
                          {folder.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">ID: {folder.id.slice(0, 16)}...</span>
                    </div>
                  </div>

                  <a
                    href={folder.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer group-hover:border-[#CFFF5E]/40"
                    title="Buka terus folder ini dalam Google Drive"
                  >
                    <ExternalLink size={14} className="text-[#CFFF5E]" />
                  </a>
                </div>

                <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-medium">
                  {folder.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-[11px]">
                  <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: folder.color }} />
                    {folderFilesCount} Fail Dijumpai
                  </span>

                  <span className={cn(
                    "font-bold text-[11px] flex items-center gap-1",
                    isSelected ? "text-[#CFFF5E]" : "text-zinc-400 group-hover:text-zinc-200"
                  )}>
                    {isSelected ? 'Folder Aktif Ditapis' : 'Klik untuk tapis folder ini'} &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter & View Controls */}
        <div className="p-4 rounded-3xl bg-[#121422] border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari fail SOP, video TikTok, logo atau spreadsheet..."
              className="w-full bg-[#161828] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-[#CFFF5E]/60 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills & View Mode */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 bg-[#161828] p-1 rounded-2xl border border-white/10 shrink-0">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'documents', label: 'Dokumen' },
                { id: 'sheets', label: 'Helaian' },
                { id: 'images', label: 'Gambar' },
                { id: 'media', label: 'Media/Video' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    selectedCategory === cat.id 
                      ? "bg-[#CFFF5E] text-black shadow-xs" 
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-[#161828] p-1 rounded-2xl border border-white/10 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-xl transition-all cursor-pointer",
                  viewMode === 'grid' ? "bg-[#CFFF5E] text-black" : "text-zinc-400 hover:text-white"
                )}
                title="Paparan Grid"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-xl transition-all cursor-pointer",
                  viewMode === 'list' ? "bg-[#CFFF5E] text-black" : "text-zinc-400 hover:text-white"
                )}
                title="Paparan Senarai"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Files Display Area */}
        {loading ? (
          <div className="py-24 text-center rounded-3xl bg-[#121422] border border-white/10 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={26} className="text-[#CFFF5E] animate-spin" />
            <span className="text-zinc-300 font-bold text-sm">Menyemak fail Google Drive...</span>
            <span className="text-zinc-500 text-xs">Menghubungkan ke API Google Drive v3</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[#121422] border border-white/10 flex flex-col items-center justify-center gap-3">
            <FolderOpen size={36} className="text-zinc-600" />
            <h4 className="text-white font-bold text-base">Tiada Fail Ditemui</h4>
            <p className="text-zinc-400 text-xs max-w-md">
              {searchQuery ? `Tiada fail yang sepadan dengan carian "${searchQuery}".` : 'Tiada fail ditemui dalam folder ini atau penapis kategori yang dipilih.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer mt-2"
              >
                Set Semula Carian
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => {
              const badge = getFileTypeBadge(file.mimeType);
              const isCopied = copiedFileId === file.id;

              return (
                <div
                  key={file.id}
                  className="p-5 rounded-3xl bg-[#121422] border border-white/10 hover:border-[#CFFF5E]/40 transition-all flex flex-col justify-between shadow-xl group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          {getFileIcon(file.mimeType)}
                        </div>
                        <span className={cn("text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-md border", badge.color)}>
                          {badge.label}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md">
                        {file.size}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[14px] text-white tracking-tight leading-snug line-clamp-2 group-hover:text-[#CFFF5E] transition-colors" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 truncate">
                        {file.folderName}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[10.5px] text-zinc-400 font-mono">
                      <Clock size={11} />
                      <span>{new Date(file.modifiedTime || file.createdTime || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyLink(file)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Salin Pautan Fail"
                      >
                        {isCopied ? <Check size={13} className="text-[#CFFF5E]" /> : <Copy size={13} />}
                      </button>

                      <a
                        href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#CFFF5E] text-zinc-200 hover:text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                        title="Buka dalam Google Drive"
                      >
                        <span>Buka</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="rounded-3xl bg-[#121422] border border-white/10 shadow-xl overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#161828] text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Nama Fail</th>
                    <th className="py-3.5 px-4">Jenis</th>
                    <th className="py-3.5 px-4">Folder</th>
                    <th className="py-3.5 px-4">Saiz</th>
                    <th className="py-3.5 px-4">Tarikh Kemaskini</th>
                    <th className="py-3.5 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredFiles.map((file) => {
                    const badge = getFileTypeBadge(file.mimeType);
                    const isCopied = copiedFileId === file.id;

                    return (
                      <tr key={file.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              {getFileIcon(file.mimeType)}
                            </div>
                            <span className="font-bold text-white max-w-xs truncate" title={file.name}>
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={cn("text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border", badge.color)}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-medium">
                          {file.folderName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400">
                          {file.size}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400">
                          {new Date(file.modifiedTime || file.createdTime || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleCopyLink(file)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="Salin Pautan"
                            >
                              {isCopied ? <Check size={12} className="text-[#CFFF5E]" /> : <Copy size={12} />}
                            </button>
                            <a
                              href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-[#CFFF5E]/15 hover:bg-[#CFFF5E] text-[#CFFF5E] hover:text-black font-bold text-[11px] flex items-center gap-1 transition-all"
                            >
                              <span>Buka</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

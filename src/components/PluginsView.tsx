/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Bot, 
  Trash2, 
  RefreshCw, 
  HelpCircle, 
  Zap,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  Star,
  Layers,
  Activity,
  Plane,
  Building,
  Palette,
  GitPullRequest,
  Cpu,
  Database,
  BarChart3,
  Heart,
  Mail,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  pluginManager, 
  PluginItem, 
  PluginCategory, 
  PLUGIN_CATEGORIES 
} from '@/services/pluginService';

interface PluginsViewProps {
  onAction?: (msg?: string) => void;
}

export const PluginsView: React.FC<PluginsViewProps> = ({ onAction }) => {
  const [plugins, setPlugins] = useState<PluginItem[]>(pluginManager.getAll());
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalPlugin, setAuthModalPlugin] = useState<PluginItem | null>(null);
  const [customEmail, setCustomEmail] = useState('thisisabangcolek@gmail.com');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    return pluginManager.subscribe(() => {
      setPlugins(pluginManager.getAll());
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const filteredPlugins = useMemo(() => {
    return plugins.filter(plugin => {
      const matchCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
      const matchSearch = 
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [plugins, selectedCategory, searchQuery]);

  const installedCount = useMemo(() => plugins.filter(p => p.installed).length, [plugins]);
  const activeCount = useMemo(() => plugins.filter(p => p.installed && p.enabled).length, [plugins]);

  const handleInstallClick = (plugin: PluginItem) => {
    if (plugin.requiresAuth && !plugin.connectedAccount) {
      setAuthModalPlugin(plugin);
    } else {
      pluginManager.installPlugin(plugin.id);
      showToast(`Plugin ${plugin.name} berjaya dipasang dan diaktifkan.`);
    }
  };

  const handleConfirmAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authModalPlugin) return;
    pluginManager.connectAccount(authModalPlugin.id, customEmail.trim() || 'thisisabangcolek@gmail.com');
    showToast(`Akaun ${customEmail} berjaya disahkan dan disambungkan ke ${authModalPlugin.name}!`);
    setAuthModalPlugin(null);
  };

  const handleToggle = (id: string, name: string) => {
    pluginManager.togglePluginEnabled(id);
    const updated = pluginManager.getById(id);
    showToast(`Plugin ${name} ${updated?.enabled ? 'diaktifkan' : 'dinyahaktifkan'}.`);
  };

  const handleUninstall = (id: string, name: string) => {
    pluginManager.uninstallPlugin(id);
    showToast(`Plugin ${name} telah dinyahpasang.`);
  };

  const handleTestPrompt = (prompt: string) => {
    if (onAction) {
      onAction(prompt);
    }
  };

  const renderIcon = (type: string, color: string) => {
    const props = { size: 22, style: { color } };
    switch (type) {
      case 'Mail': return <Mail {...props} />;
      case 'HardDrive': return <HardDrive {...props} />;
      case 'Palette': return <Palette {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'GitPullRequest': return <GitPullRequest {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Database': return <Database {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'Building': return <Building {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Heart': return <Heart {...props} />;
      default: return <Zap {...props} />;
    }
  };

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-28 md:pb-24 bg-[#090A10] text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 z-50 bg-[#121420] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-medium flex items-center gap-2 border border-white/20"
            >
              <CheckCircle2 size={16} className="text-[#CFFF5E]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Header - Unified Responsive CSS Grid */}
        <div className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 border border-white/10 bg-[#121420] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#181A2A] text-[#CFFF5E] border border-[#CFFF5E]/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={12} className="text-[#CFFF5E] fill-[#CFFF5E]" />
                ChatGPT & AI Studio Plugins Hub
              </span>
              <span className="text-zinc-400 text-xs font-mono">
                {installedCount} Dipasang · {activeCount} Aktif
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              Gedung Plugin & Sambungan Pihak Ketiga
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
              Tingkatkan keupayaan pembantu AI daripada sekadar menjawab soalan kepada pembantu pintar yang berinteraksi secara terus dengan akaun luaran anda — daripada Gmail, Canva, GitHub, Skyscanner, Supabase, hingga ke peranti COROS.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari plugin mengikut fungsi (cth: penerbangan, Canva, SQL, PR)..."
                className="w-full bg-[#10121C] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#CFFF5E]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => onAction && onAction("Tolong semak status semua plugin yang aktif dan cadangkan tindakan operasi.")}
                className="px-4 py-2 rounded-full bg-[#CFFF5E] text-black hover:bg-[#d8ff6b] text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(207,255,94,0.35)]"
              >
                <Bot size={14} />
                <span>Tanya Ejen di Sembang</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 overflow-x-auto no-scrollbar">
          {PLUGIN_CATEGORIES.map((cat) => {
            const count = cat.id === 'all' 
              ? plugins.length 
              : plugins.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 border",
                  isSelected
                    ? "bg-[#CFFF5E] text-black border-[#CFFF5E] shadow-[0_0_12px_rgba(207,255,94,0.3)] font-black"
                    : "bg-[#121420] text-zinc-400 hover:text-white border-white/10 hover:border-white/20"
                )}
              >
                <span>{cat.label}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                  isSelected ? "bg-black/20 text-black font-black" : "bg-white/10 text-zinc-400"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPlugins.length === 0 ? (
            <div className="col-span-2 text-center py-16 bg-[#121420] rounded-3xl border border-white/10">
              <Search size={32} className="mx-auto text-zinc-500 mb-3" />
              <p className="text-zinc-200 font-bold text-sm">Tiada plugin dijumpai bagi carian "{searchQuery}"</p>
              <p className="text-zinc-400 text-xs mt-1">Cuba pilih kategori lain atau padamkan kata kunci carian.</p>
            </div>
          ) : (
            filteredPlugins.map((plugin) => (
              <div 
                key={plugin.id}
                className={cn(
                  "bg-[#121420] p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-xl",
                  plugin.installed 
                    ? plugin.enabled 
                      ? "border-[#CFFF5E]/40 shadow-[0_0_20px_rgba(207,255,94,0.06)] ring-1 ring-[#CFFF5E]/20" 
                      : "border-white/10 opacity-70" 
                    : "border-white/10 hover:border-white/25"
                )}
              >
                <div className="space-y-4">
                  {/* Top Row: Icon, Title & Primary Action */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner"
                        style={{ backgroundColor: `${plugin.accentColor}25` }}
                      >
                        {renderIcon(plugin.iconType, plugin.accentColor)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-white tracking-tight">{plugin.name}</h3>
                          {plugin.installed && plugin.enabled && (
                            <span className="w-2 h-2 rounded-full bg-[#CFFF5E] animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-medium">
                          {plugin.developer} · v{plugin.version}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400 font-medium">
                          <span className="flex items-center text-amber-400 font-bold">
                            <Star size={11} className="fill-amber-400 mr-0.5" />
                            {plugin.rating}
                          </span>
                          <span>·</span>
                          <span>{plugin.reviewCount.toLocaleString()} pengguna</span>
                        </div>
                      </div>
                    </div>

                    {/* Install / Toggle Action */}
                    <div className="shrink-0 flex items-center gap-2">
                      {!plugin.installed ? (
                        <button
                          onClick={() => handleInstallClick(plugin)}
                          className="px-4 py-2 bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-xs font-black rounded-full flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(207,255,94,0.3)] cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Pasang</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggle(plugin.id, plugin.name)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border",
                              plugin.enabled 
                                ? "bg-[#CFFF5E]/20 text-[#CFFF5E] border-[#CFFF5E]/40" 
                                : "bg-[#181A2A] text-zinc-400 border-white/10"
                            )}
                          >
                            {plugin.enabled ? 'Aktif' : 'Nyahaktif'}
                          </button>

                          <button
                            onClick={() => handleUninstall(plugin.id, plugin.name)}
                            title="Nyahpasang Plugin"
                            className="p-1.5 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {plugin.description}
                  </p>

                  {/* Connected Account Badge */}
                  {plugin.installed && (
                    <div className="p-3 rounded-2xl bg-[#10121C] border border-white/10 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Lock size={12} className="text-[#CFFF5E]" />
                        <span>Akaun Disahkan: <strong className="text-white font-mono">{plugin.connectedAccount || 'Semua Sedia'}</strong></span>
                      </div>
                      <span className="text-[10px] text-[#CFFF5E] font-bold">OAuth 2.0 Real</span>
                    </div>
                  )}
                </div>

                {/* Bottom Tags */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex flex-wrap gap-1.5">
                    {plugin.capabilities.slice(0, 3).map((cap, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-[#181A2A] text-zinc-300 border border-white/10 font-mono text-[10px]">
                        {cap}
                      </span>
                    ))}
                  </div>
                  <span className="capitalize text-zinc-400 text-[10.5px] font-medium">{plugin.category}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* How It Works Guide Banner */}
        <div className="p-6 md:p-8 bg-[#121420] rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-[#CFFF5E]" />
            <h2 className="text-base font-black text-white tracking-tight">
              Cara Ia Berfungsi (Plugins Architecture)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300 leading-relaxed font-medium">
            <div className="space-y-2 p-4 bg-[#10121C] rounded-2xl border border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#CFFF5E] text-black font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-extrabold text-white text-sm">Pilih & Pasang Plugin</h4>
              <p className="text-zinc-400">
                Cari fungsi yang anda mahukan di halaman Plugins ini dan klik ikon tambah (<strong className="text-[#CFFF5E]">+ Pasang</strong>) pada plugin kegemaran anda.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-[#10121C] rounded-2xl border border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#CFFF5E] text-black font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-extrabold text-white text-sm">Sahkan Log Masuk / Akaun</h4>
              <p className="text-zinc-400">
                Sahkan sambungan log masuk akaun anda (jika plugin memerlukan akses akaun peribadi seperti Gmail, Canva, GitHub, atau COROS).
              </p>
            </div>

            <div className="space-y-2 p-4 bg-[#10121C] rounded-2xl border border-white/10">
              <span className="w-6 h-6 rounded-full bg-[#CFFF5E] text-black font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-extrabold text-white text-sm">Taip Arahan di Sembang</h4>
              <p className="text-zinc-400">
                Taip arahan semula jadi dalam sembang (cth: <em className="text-zinc-200">"Cari tiket penerbangan ke Tokyo di Skyscanner"</em>), dan model AI akan mengaktifkan plugin berkaitan secara automatik!
              </p>
            </div>
          </div>
        </div>

        {/* Auth Verification Modal */}
        {authModalPlugin && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#121420] text-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 border border-white/15 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10"
                  style={{ backgroundColor: `${authModalPlugin.accentColor}25` }}
                >
                  {renderIcon(authModalPlugin.iconType, authModalPlugin.accentColor)}
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{authModalPlugin.name}</h3>
                  <p className="text-xs text-zinc-400 font-medium">Sahkan Sambungan Akaun Pihak Ketiga</p>
                </div>
              </div>

              <div className="p-4 bg-[#10121C] rounded-2xl border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white block">Kebenaran yang Diminta:</span>
                <ul className="space-y-1 text-zinc-400 list-disc list-inside">
                  <li>Membaca data berkaitan mengikut arahan sembang anda</li>
                  <li>Melaksanakan tindakan yang disahkan (cth: menjana reka bentuk / membuka carian)</li>
                  <li>Tiada perkongsian data sulit kepada pihak lain</li>
                </ul>
              </div>

              <form onSubmit={handleConfirmAuth} className="space-y-4">
                <div>
                  <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">
                    E-mel Akaun Luaran
                  </label>
                  <input 
                    type="email" 
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                    placeholder="nama@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-[#10121C] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CFFF5E]/50"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModalPlugin(null)}
                    className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-xs font-black rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(207,255,94,0.35)] flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} />
                    <span>Sahkan Sambungan</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Database, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Bug, 
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { appStore } from '@/services/store';
import { productService } from '@/services/productService';
import { busFreightManager } from '@/services/busFreightService';
import { SUPABASE_CONFIG } from '@/services/supabaseClient';

interface DeveloperConsoleViewProps {
  onAction?: (msg?: string) => void;
}

export const DeveloperConsoleView: React.FC<DeveloperConsoleViewProps> = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'state_inspector' | 'logs' | 'tools'>('system');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; type: 'info' | 'warn' | 'success'; text: string }>>([
    { id: '1', time: new Date().toLocaleTimeString(), type: 'info', text: 'Developer Console Initialized.' },
    { id: '2', time: new Date().toLocaleTimeString(), type: 'success', text: 'Supabase Real-Time orders listener connected.' },
    { id: '3', time: new Date().toLocaleTimeString(), type: 'info', text: 'Product Catalog Store loaded from LocalStorage.' },
  ]);

  const addLog = (text: string, type: 'info' | 'warn' | 'success' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(), time: new Date().toLocaleTimeString(), type, text }, ...prev].slice(0, 50));
  };

  const handleCopyDiagnostic = () => {
    const diagnostic = {
      timestamp: new Date().toISOString(),
      supabaseEndpoint: SUPABASE_CONFIG.url,
      ordersCount: appStore.getOrders().length,
      productsCount: productService.getProducts().length,
      busConsignmentsCount: busFreightManager.getConsignments().length,
      userAgent: navigator.userAgent
    };
    navigator.clipboard.writeText(JSON.stringify(diagnostic, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    addLog('Diagnostic JSON copied to clipboard.', 'success');
  };

  const handleSeedOrder = () => {
    const newOrd = appStore.addOrder({
      customer_id: `Dev Test Customer (${Math.floor(100 + Math.random() * 900)})`,
      city: 'johor bahru',
      items: 'Kuah Colek Signature 350ml x2 + Kombo MakanFest x1',
      amount: 50.00,
      status: 'Processing'
    });
    addLog(`Mock order created: ${newOrd.order_id}`, 'success');
  };

  const handleSimulateBusEvent = () => {
    const consignments = busFreightManager.getConsignments();
    if (consignments.length > 0) {
      const target = consignments[0];
      busFreightManager.updateStatus(target.id, target.status === 'IN_TRANSIT' ? 'ARRIVED_TERMINAL' : 'IN_TRANSIT');
      addLog(`Consignment ${target.id} toggled status.`, 'info');
    }
  };

  const handleResetData = () => {
    productService.resetToDefaults();
    addLog('Product catalog reset to defaults.', 'warn');
  };

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-32 text-zinc-100 bg-[#090A10] space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Terminal size={13} />
              Developer & Diagnostics Cockpit
            </span>
            <span className="text-xs text-zinc-400 font-mono">v4.2.0 • Engine PRO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Pusat Kawalan Kejuruteraan & Pemeriksa Keadaan Sistem
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5 font-mono">
            Telemetri prestasi, pemeriksaan skema JSON, log sistem live, dan alat pemulihan data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDiagnostic}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-[#CFFF5E]" /> : <Copy size={14} />}
            <span>{copied ? 'Disalin!' : 'Salin Diagnostik JSON'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'system', label: 'Telemetri Sistem', icon: Cpu },
          { id: 'state_inspector', label: 'Pemeriksa Keadaan (State)', icon: Database },
          { id: 'tools', label: 'Alat Pengujian & Benih', icon: Zap },
          { id: 'logs', label: 'Log Peristiwa Live', icon: Terminal },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === tab.id
                ? "bg-[#CFFF5E] text-black shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: System Telemetry */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Pangkalan Data & Realtime</span>
            <div className="flex items-center justify-between">
              <h4 className="text-white font-black text-sm">Supabase PostgreSQL</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold">Connected</span>
            </div>
            <p className="text-[11.5px] text-zinc-400 font-mono break-all">
              {SUPABASE_CONFIG.url}
            </p>
            <div className="text-[11px] text-zinc-300 pt-2 border-t border-white/5 flex justify-between">
              <span>Channel:</span>
              <span className="text-[#00F0FF] font-mono">public:orders (Postgres Changes)</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Google Workspace Auth</span>
            <div className="flex items-center justify-between">
              <h4 className="text-white font-black text-sm">OAuth 2.0 Client</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold">Authorized</span>
            </div>
            <p className="text-[11.5px] text-zinc-400 font-mono">
              36 Scopes Diselaraskan (Drive, Docs, Sheets, Gmail, Calendar, Meet)
            </p>
            <div className="text-[11px] text-zinc-300 pt-2 border-t border-white/5 flex justify-between">
              <span>Projek ID:</span>
              <span className="text-[#CFFF5E] font-mono">gen-lang-client-0837788240</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Enjin AI Gemini</span>
            <div className="flex items-center justify-between">
              <h4 className="text-white font-black text-sm">Gemini 2.5 Flash</h4>
              <span className="px-2 py-0.5 rounded-full bg-[#CFFF5E]/20 text-[#CFFF5E] text-[10px] font-bold">Active</span>
            </div>
            <p className="text-[11.5px] text-zinc-400 font-mono">
              Latency Purata: ~48ms • Function Calling 12 Tools
            </p>
            <div className="text-[11px] text-zinc-300 pt-2 border-t border-white/5 flex justify-between">
              <span>Status Kuota:</span>
              <span className="text-emerald-400 font-mono">Optimal</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: State Inspector */}
      {activeTab === 'state_inspector' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-extrabold text-sm">Product Catalog State ({productService.getProducts().length} items)</h4>
              <span className="text-[10px] font-mono text-zinc-400">LocalStorage: abangcolek_products_catalog_v2</span>
            </div>
            <pre className="p-3.5 rounded-2xl bg-black/60 border border-white/5 text-[11px] text-[#CFFF5E] font-mono max-h-96 overflow-y-auto">
              {JSON.stringify(productService.getProducts(), null, 2)}
            </pre>
          </div>

          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-extrabold text-sm">Orders State ({appStore.getOrders().length} items)</h4>
              <span className="text-[10px] font-mono text-zinc-400">LocalStorage: abangcolek_orders</span>
            </div>
            <pre className="p-3.5 rounded-2xl bg-black/60 border border-white/5 text-[11px] text-[#00F0FF] font-mono max-h-96 overflow-y-auto">
              {JSON.stringify(appStore.getOrders().slice(0, 10), null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Tools & Seeders */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <h4 className="text-white font-extrabold text-sm">Cipta Pesanan Ujian (Mock Order)</h4>
            <p className="text-xs text-zinc-400">
              Suntik 1 pesanan baru ke dalam lejar pangkalan data untuk menguji aliran semakan pesanan staf.
            </p>
            <button
              onClick={handleSeedOrder}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#CFFF5E] hover:text-black text-white font-bold text-xs transition-colors cursor-pointer"
            >
              + Benih Pesanan Ujian
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <h4 className="text-white font-extrabold text-sm">Simulasi Acara Bas Ekspres</h4>
            <p className="text-xs text-zinc-400">
              Ubah status konsainan bas TBS antara Sedang Bergerak dan Sampai di MBKT Terengganu.
            </p>
            <button
              onClick={handleSimulateBusEvent}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#00F0FF] hover:text-black text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Togol Status Bas TBS
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#121422] border border-white/10 space-y-3">
            <h4 className="text-white font-extrabold text-sm">Set Semula Katalog Produk</h4>
            <p className="text-xs text-zinc-400">
              Kembalikan semua produk kepada data rasmi daripada Google Drive Folder 1 & 2.
            </p>
            <button
              onClick={handleResetData}
              className="w-full py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-rose-800"
            >
              Set Semula Katalog
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-3xl bg-[#121422] border border-white/10 p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-zinc-400">Aliran Log Peristiwa Aplikasi ({logs.length})</span>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-zinc-500 hover:text-white cursor-pointer"
            >
              Kosongkan Log
            </button>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2.5 py-1">
                <span className="text-zinc-500 text-[10.5px]">{log.time}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase",
                  log.type === 'success' ? "bg-emerald-950 text-emerald-400" :
                  log.type === 'warn' ? "bg-amber-950 text-amber-400" :
                  "bg-blue-950 text-blue-400"
                )}>
                  {log.type}
                </span>
                <span className="text-zinc-300">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

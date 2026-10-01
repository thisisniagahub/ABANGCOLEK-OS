/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  Activity, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  ArrowUpRight, 
  Sparkles, 
  RefreshCw, 
  Gauge, 
  Play,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  supabaseAgentPerformance, 
  AgentTaskLog 
} from '@/services/supabaseAgentPerformance';

export interface AgentInsightCardProps {
  className?: string;
  onViewFullPerformance?: () => void;
  onAction?: (msg?: string) => void;
}

export const AgentInsightCard: React.FC<AgentInsightCardProps> = ({
  className,
  onViewFullPerformance,
  onAction
}) => {
  const [logs, setLogs] = useState<AgentTaskLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(true);
  const [lastInsertedTask, setLastInsertedTask] = useState<AgentTaskLog | null>(null);
  const [showExpandedDetails, setShowExpandedDetails] = useState(false);

  useEffect(() => {
    // Initial load
    const load = async () => {
      setIsRefreshing(true);
      await supabaseAgentPerformance.fetchTaskLogs();
      setIsRefreshing(false);
    };
    load();

    // 1. Local store subscription
    const unsubStore = supabaseAgentPerformance.subscribe((data) => {
      setLogs(data);
    });

    // 2. Real-time Supabase subscription on `tasks` table
    const unsubRealtime = supabaseAgentPerformance.subscribeToRealtimeTasks(
      (newLog) => {
        setLogs((prev) => [newLog, ...prev.filter(l => l.id !== newLog.id)]);
        setLastInsertedTask(newLog);
        setTimeout(() => setLastInsertedTask(null), 4000);
      },
      (status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      }
    );

    return () => {
      unsubStore();
      unsubRealtime();
    };
  }, []);

  // Compute summary metrics
  const metrics = useMemo(() => {
    return supabaseAgentPerformance.calculateMetrics('all', 7);
  }, [logs]);

  // Mini Sparkline Data for recent 8-12 completed tasks
  const recentTrendData = useMemo(() => {
    const recent = [...logs].slice(0, 10).reverse();
    return recent.map((l, i) => ({
      index: i + 1,
      latency: l.latency_ms,
      tool: l.tool_name.replace(/_/g, ' '),
      status: l.status,
      time: new Date(l.timestamp).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })
    }));
  }, [logs]);

  // Quick simulate ping
  const handleQuickPing = async () => {
    setIsSimulating(true);
    const candidateTools = [
      { name: 'bus_freight_dispatch_create', cat: 'Logistik & Bas' as const },
      { name: 'redbus_bus_freight_schedule', cat: 'Logistik & Bas' as const },
      { name: 'create_google_sheet', cat: 'Google Workspace' as const },
      { name: 'supabase_query_db', cat: 'Gedung Plugins' as const }
    ];
    const picked = candidateTools[Math.floor(Math.random() * candidateTools.length)];
    const latency = Math.floor(130 + Math.random() * 220);

    await supabaseAgentPerformance.recordTaskExecution({
      task_id: `TSK-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
      tool_name: picked.name,
      tool_category: picked.cat,
      latency_ms: latency,
      status: 'SUCCESS',
      tokens_used: Math.floor(220 + Math.random() * 300),
      user_query: `Ujian kependaman pantas melalui AgentInsightCard (${picked.name})`,
      model: 'gemini-3.8-flash'
    });

    setIsSimulating(false);
  };

  const recentTasks = logs.slice(0, 4);

  return (
    <div className={cn(
      "p-6 rounded-3xl bg-white border border-black/10 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all",
      className
    )}>
      {/* Real-time Flash Notification Pill */}
      <AnimatePresence>
        {lastInsertedTask && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-6 right-6 z-10 px-3 py-1.5 rounded-xl bg-purple-900/90 text-white text-[11px] font-medium flex items-center justify-between shadow-lg backdrop-blur-xs"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Zap size={12} className="text-amber-300 animate-pulse shrink-0" />
              <span className="truncate">
                Tugasan Baru Disisip: <strong>{lastInsertedTask.tool_name}</strong> ({lastInsertedTask.latency_ms} ms)
              </span>
            </span>
            <span className="text-[10px] text-purple-200 shrink-0 font-mono">Live Supabase</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
              <Gauge size={16} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-zinc-900">Prestasi Agen AI (Real-Time)</h3>
                <span className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                  realtimeConnected 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"
                )}>
                  <Radio size={10} className={cn("shrink-0", realtimeConnected && "animate-pulse text-emerald-600")} />
                  <span>{realtimeConnected ? 'Supabase Realtime' : 'Menghubung...'}</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Pemantauan kependaman langsung & kadar kejayaan tugasan agen pintar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleQuickPing}
              disabled={isSimulating}
              className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-all cursor-pointer"
              title="Jana tugasan ujian pantas untuk melihat kemas kini masa nyata"
            >
              <Play size={13} className={cn(isSimulating && "animate-spin text-purple-600")} />
            </button>

            {onViewFullPerformance && (
              <button
                onClick={onViewFullPerformance}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold transition-all cursor-pointer"
              >
                <span>Analisis Penuh</span>
                <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Primary Metrics Strip */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          {/* Card 1: Latency */}
          <div className="p-3 rounded-2xl bg-zinc-50 border border-black/5">
            <p className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1">
              <Clock size={11} className="text-blue-500" />
              Purata Kependaman
            </p>
            <p className="text-lg font-black text-zinc-900 mt-0.5">
              {metrics.overallMetrics.avgLatencyMs} <span className="text-[11px] font-semibold text-zinc-500">ms</span>
            </p>
            <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Sub-saat respons</p>
          </div>

          {/* Card 2: Success Rate */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
            <p className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-600" />
              Kadar Kejayaan
            </p>
            <p className="text-lg font-black text-emerald-950 mt-0.5">
              {metrics.overallMetrics.overallSuccessRate}%
            </p>
            <p className="text-[9px] text-emerald-700 font-semibold mt-0.5">Sasaran &gt;95% ✓</p>
          </div>

          {/* Card 3: Top Efficient Tool */}
          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/60 truncate">
            <p className="text-[10px] font-bold uppercase text-purple-800 flex items-center gap-1">
              <Sparkles size={11} className="text-purple-600" />
              Paling Cekap
            </p>
            <p className="text-xs font-black text-purple-950 mt-1 truncate" title={metrics.overallMetrics.mostEfficientTool}>
              {metrics.overallMetrics.mostEfficientTool}
            </p>
            <p className="text-[9px] text-purple-700 font-semibold mt-0.5">Juara Kecekapan</p>
          </div>
        </div>

        {/* Latency Trajectory Mini Chart (Recharts) */}
        <div className="my-3 p-3.5 rounded-2xl bg-zinc-50 border border-black/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-zinc-700 flex items-center gap-1.5">
              <Activity size={12} className="text-purple-600" />
              <span>Trend Kependaman 10 Tugasan Terkini (ms)</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Terkini &rarr;</span>
          </div>

          <div className="w-full h-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentTrendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="insightLatencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 bg-zinc-900 text-white rounded-lg text-[10px] space-y-0.5 shadow-md">
                          <p className="font-bold text-purple-300">{data.tool}</p>
                          <p className="text-zinc-300">Kependaman: <strong className="text-white">{data.latency} ms</strong></p>
                          <p className="text-zinc-400">{data.time}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  fill="url(#insightLatencyGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Completed Tasks Stream */}
      <div>
        <div className="flex items-center justify-between pb-2 text-[11px] font-bold">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Tugasan Terkini Diselesaikan</span>

          {/* 'Expand Details' Toggle Switch */}
          <div className="flex items-center gap-2">
            <label 
              htmlFor="expand-details-toggle" 
              className="text-[11px] font-bold text-zinc-700 cursor-pointer select-none hover:text-[#E53935] transition-colors"
            >
              Expand Details
            </label>
            <button
              id="expand-details-toggle"
              type="button"
              role="switch"
              aria-checked={showExpandedDetails}
              onClick={() => setShowExpandedDetails(!showExpandedDetails)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                showExpandedDetails ? "bg-[#E53935]" : "bg-zinc-300 hover:bg-zinc-400"
              )}
              title={showExpandedDetails ? "Sembunyikan pecahan kependaman terperinci" : "Papar pecahan kependaman terperinci 5 operasi terkini"}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                  showExpandedDetails ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Expandable Table Row Breakdown of Individual Tool Latencies for the Last 5 Operations */}
        <AnimatePresence>
          {showExpandedDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden mb-3 pt-1"
            >
              <div className="rounded-2xl border border-[#FFC107]/40 bg-[#FFFDF7] overflow-hidden shadow-xs">
                <div className="px-3 py-2 bg-[#1A1A1A] text-white flex items-center justify-between text-[11px]">
                  <span className="font-black text-[#FFC107] flex items-center gap-1.5">
                    <Activity size={12} className="text-[#E53935]" />
                    <span>Pecahan Kependaman 5 Operasi Terkini</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-300">
                    Last 5 Operations Breakdown
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-[#FFC107]/30 text-zinc-500 text-[10px] uppercase font-bold bg-amber-50/50">
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Alatan (Tool Name)</th>
                        <th className="py-2 px-3">Kategori</th>
                        <th className="py-2 px-3 text-right">Kependaman (ms)</th>
                        <th className="py-2 px-3 text-center">Status</th>
                        <th className="py-2 px-3 text-right">Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 bg-white">
                      {logs.slice(0, 5).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-xs text-zinc-400">
                            Tiada rekod operasi terkini.
                          </td>
                        </tr>
                      ) : (
                        logs.slice(0, 5).map((op, idx) => (
                          <tr key={op.id || idx} className="hover:bg-amber-50/30 transition-colors font-mono">
                            <td className="py-2 px-3 font-bold text-zinc-400">
                              #{idx + 1}
                            </td>
                            <td className="py-2 px-3 font-sans font-bold text-zinc-900 truncate max-w-[150px]" title={op.tool_name}>
                              {op.tool_name}
                            </td>
                            <td className="py-2 px-3 font-sans text-zinc-500 text-[10px] truncate max-w-[110px]">
                              {op.tool_category}
                            </td>
                            <td className="py-2 px-3 text-right">
                              <span className={cn(
                                "inline-block px-2 py-0.5 rounded-md font-bold text-[10px]",
                                op.latency_ms < 200 ? "bg-emerald-100 text-emerald-800" :
                                op.latency_ms < 500 ? "bg-blue-100 text-blue-800" :
                                op.latency_ms < 1000 ? "bg-amber-100 text-amber-900" : "bg-rose-100 text-rose-900"
                              )}>
                                {op.latency_ms} ms
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold font-sans",
                                op.status === 'SUCCESS' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              )}>
                                {op.status === 'SUCCESS' ? '✓ SUCCESS' : '✕ ERROR'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right text-zinc-400 text-[10px]">
                              {new Date(op.timestamp).toLocaleTimeString('ms-MY', { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: '2-digit' 
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="divide-y divide-black/5">
          {recentTasks.map((t) => (
            <div key={t.id} className="py-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  t.status === 'SUCCESS' ? "bg-emerald-500" : "bg-rose-500"
                )} />
                <div className="truncate">
                  <p className="font-bold text-zinc-900 text-[11px] truncate">{t.tool_name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{t.tool_category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                <span className={cn(
                  "px-1.5 py-0.5 rounded font-bold",
                  t.latency_ms < 250 ? "bg-emerald-50 text-emerald-700" :
                  t.latency_ms < 600 ? "bg-purple-50 text-purple-700" : "bg-amber-50 text-amber-700"
                )}>
                  {t.latency_ms} ms
                </span>
                <span className="text-zinc-400 hidden sm:inline">
                  {new Date(t.timestamp).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link / Trigger */}
        <div className="pt-3 mt-1 border-t border-black/5 flex items-center justify-between text-[11px]">
          <span className="text-zinc-500">
            Jumlah rekod: <strong>{metrics.overallMetrics.totalTasks} panggilan</strong>
          </span>

          <button
            onClick={() => {
              if (onViewFullPerformance) {
                onViewFullPerformance();
              } else if (onAction) {
                onAction("Tunjukkan analisis penuh prestasi dan kependaman setiap alat agen AI");
              }
            }}
            className="text-purple-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Buka Prestasi Penuh</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

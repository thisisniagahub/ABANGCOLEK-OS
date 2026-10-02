/**
 * Real-Time Supabase Orders View Component
 * Directly interacts with live Supabase `orders` table on bktksvhcgszaoqkdyhil.supabase.co
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Plus, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  RotateCcw,
  X
} from 'lucide-react';
import { 
  fetchSupabaseOrders, 
  insertSupabaseOrder, 
  updateSupabaseOrderStatus, 
  subscribeSupabaseOrders, 
  seedInitialOrdersToSupabase,
  SupabaseOrder 
} from '@/services/supabaseOrders';
import { SUPABASE_CONFIG } from '@/services/supabaseClient';
import { cn } from '@/lib/utils';

export interface OrdersViewProps {
  onAction?: (msg?: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onAction }) => {
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refundConfirmOrder, setRefundConfirmOrder] = useState<{ id: string; amount: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  // Form State
  const [newCust, setNewCust] = useState('');
  const [newCity, setNewCity] = useState('johor bahru');
  const [newItems, setNewItems] = useState('3x Kuah Colek Buah Original (500g)');
  const [newAmount, setNewAmount] = useState('84');

  const loadOrders = async () => {
    setLoading(true);
    const result = await fetchSupabaseOrders();
    setOrders(result.orders);
    setIsLive(result.isLive);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    // Subscribe to live Postgres changes via Supabase WebSocket
    const unsubscribe = subscribeSupabaseOrders(() => {
      loadOrders();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.trim()) return;

    setSyncing(true);
    await insertSupabaseOrder({
      customer_name: newCust.trim(),
      city: newCity,
      items: newItems,
      amount: parseFloat(newAmount) || 0
    });
    setNewCust('');
    setShowAddModal(false);
    setSyncing(false);
    loadOrders();
  };

  const handleExecuteRefund = async (orderId: string) => {
    setSyncing(true);
    await updateSupabaseOrderStatus(orderId, 'Refunded', 'LEAKAGE / Penutup Botol Kurier Longgar');
    setRefundConfirmOrder(null);
    setSyncing(false);
    loadOrders();
  };

  const handleSyncAllToSupabase = async () => {
    setSyncing(true);
    await seedInitialOrdersToSupabase();
    await loadOrders();
    setSyncing(false);
  };

  // Calculations
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || o.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const totalGMV = orders.reduce((sum, o) => sum + (o.status !== 'Refunded' ? o.amount : 0), 0);
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const refundedCount = orders.filter(o => o.status === 'Refunded').length;

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-28 md:pb-24 bg-[#090A10] text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
        {/* Header with Live Supabase Status - Unified Responsive CSS Grid */}
        <div className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 border border-white/10 bg-[#121420] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#CFFF5E]/15 text-[#CFFF5E] border border-[#CFFF5E]/30">
                <span className="w-2 h-2 rounded-full bg-[#CFFF5E] animate-pulse" />
                <span>Supabase Live ({SUPABASE_CONFIG.projectRef})</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400">PostgreSQL RLS Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">Pangkalan Data Pesanan Langsung</h2>
            <p className="text-zinc-400 mt-1 text-xs sm:text-sm font-medium">
              Data pesanan dibaca dan disegerak secara langsung daripada jadual <code className="font-mono text-[#CFFF5E] bg-white/5 px-1.5 py-0.5 rounded text-xs border border-white/10">public.orders</code> di Supabase.
            </p>
          </div>

          <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-2.5 flex-wrap">
            <button
              onClick={handleSyncAllToSupabase}
              disabled={syncing}
              className="px-4 py-2.5 bg-[#181A2A] hover:bg-[#202438] text-zinc-200 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-white/10"
              title="Segerakkan semua pesanan ke pangkalan data awan Supabase"
            >
              <RefreshCw size={13} className={cn(syncing && "animate-spin text-[#CFFF5E]")} />
              <span>Segerak Cloud</span>
            </button>

            <button 
              onClick={() => setShowAddModal(true)} 
              className="px-5 py-2.5 bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black rounded-full text-xs font-black transition-all shadow-[0_0_15px_rgba(207,255,94,0.35)] flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>+ Tambah Pesanan</span>
            </button>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-[#121420] p-4.5 rounded-2xl border border-white/10 shadow-xl">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Jumlah Pesanan</span>
            <div className="text-2xl font-black text-white">{orders.length}</div>
            <span className="text-[11px] text-[#CFFF5E] font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Disegerak Realtime</span>
            </span>
          </div>

          <div className="bg-[#121420] p-4.5 rounded-2xl border border-white/10 shadow-xl">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Nilai Jualan (GMV)</span>
            <div className="text-2xl font-black text-[#CFFF5E]">RM {totalGMV.toLocaleString()}</div>
            <span className="text-[11px] text-zinc-400 font-medium mt-1 block">Hasil pesanan sah</span>
          </div>

          <div className="bg-[#121420] p-4.5 rounded-2xl border border-white/10 shadow-xl">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Berjaya Dihantar</span>
            <div className="text-2xl font-black text-white">{deliveredCount}</div>
            <span className="text-[11px] text-zinc-400 font-medium mt-1 block">Kadar siap {orders.length ? Math.round((deliveredCount/orders.length)*100) : 0}%</span>
          </div>

          <div className="bg-[#121420] p-4.5 rounded-2xl border border-white/10 shadow-xl">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Aduan / Bayar Balik</span>
            <div className="text-2xl font-black text-[#FF4757]">{refundedCount}</div>
            <span className="text-[11px] text-zinc-400 font-medium mt-1 block">Invarian JEV Terpelihara</span>
          </div>
        </div>

        {/* Add Order Modal */}
        {showAddModal && (
          <div className="p-6 bg-[#141624] rounded-3xl border border-white/15 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <h3 className="font-extrabold text-base text-white">Daftar Pesanan Baharu ke Supabase</h3>
                <p className="text-xs text-zinc-400">Rekod akan disimpan terus ke pangkalan data PostgreSQL awan.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-xs font-bold text-zinc-400 hover:text-white cursor-pointer">Tutup</button>
            </div>
            <form onSubmit={handleAddOrder} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Nama / ID Pelanggan</label>
                <input 
                  type="text" 
                  value={newCust} 
                  onChange={(e) => setNewCust(e.target.value)} 
                  placeholder="cth: Kak Mas (Stokis KT)"
                  required
                  className="w-full px-3 py-2 bg-[#10121C] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CFFF5E]/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Bandar / Hab</label>
                <select 
                  value={newCity} 
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#10121C] border border-white/10 rounded-xl text-xs font-medium text-white capitalize focus:outline-none focus:border-[#CFFF5E]/50"
                >
                  <option value="johor bahru">Johor Bahru (HQ / Toppen)</option>
                  <option value="shah alam">Shah Alam (Central Hub)</option>
                  <option value="kuala terengganu">Kuala Terengganu (Stokis)</option>
                  <option value="bangi">Bangi</option>
                  <option value="kota bharu">Kota Bharu</option>
                  <option value="penang">Penang</option>
                  <option value="melaka">Melaka</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Item Produk</label>
                <input 
                  type="text" 
                  value={newItems} 
                  onChange={(e) => setNewItems(e.target.value)} 
                  placeholder="cth: 3x Kuah Colek Buah Original (500g)"
                  required
                  className="w-full px-3 py-2 bg-[#10121C] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CFFF5E]/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Jumlah (RM)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={newAmount} 
                    onChange={(e) => setNewAmount(e.target.value)} 
                    required
                    className="w-full px-3 py-2 bg-[#10121C] border border-white/10 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CFFF5E]/50"
                  />
                  <button 
                    type="submit" 
                    disabled={syncing}
                    className="px-5 py-2 bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black rounded-xl text-xs font-black shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {syncing ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-[#121420] p-3 rounded-2xl border border-white/10 shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text"
              placeholder="Cari ID pesanan, pelanggan atau produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#10121C] rounded-xl text-xs font-medium text-white border border-white/10 focus:outline-none focus:border-[#CFFF5E]/50 placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <Filter size={13} className="text-zinc-400 shrink-0" />
            {['all', 'johor bahru', 'kuala terengganu', 'shah alam', 'bangi', 'penang'].map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 capitalize cursor-pointer",
                  selectedCity === city 
                    ? "bg-[#CFFF5E] text-black shadow-[0_0_12px_rgba(207,255,94,0.35)]" 
                    : "bg-[#181A2A] text-zinc-300 hover:text-white border border-white/10"
                )}
              >
                {city === 'all' ? 'Semua Hab' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table Cards */}
        <div className="grid gap-3.5">
          {loading ? (
            <div className="text-center py-20 bg-[#121420] rounded-3xl border border-white/10">
              <div className="w-8 h-8 border-2 border-[#CFFF5E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-zinc-400 font-medium text-xs">Memuat turun pesanan daripada Supabase PostgreSQL...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-[#121420] rounded-3xl border border-white/10">
              <p className="text-zinc-400 font-medium">Tiada pesanan ditemui sepadan dengan carian.</p>
            </div>
          ) : (
            filteredOrders.map((order, i) => (
              <div 
                key={order.id || order.order_id || i} 
                className="bg-[#121420] p-5 md:p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#CFFF5E]/40 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-black text-base md:text-lg text-white font-mono">{order.order_id}</h3>
                    <span className="px-3 py-0.5 bg-[#181A2A] rounded-full text-xs font-bold text-zinc-300 border border-white/10 capitalize">
                      {order.city}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 text-[11px] font-extrabold rounded-full border",
                      order.status === 'Delivered' ? "bg-emerald-950/80 border-emerald-800/40 text-emerald-400" : 
                      order.status === 'Delayed' ? "bg-red-950/80 border-red-800/40 text-red-400" :
                      order.status === 'Refunded' ? "bg-zinc-800 border-white/10 text-zinc-300" :
                      "bg-blue-950/80 border-blue-800/40 text-blue-400"
                    )}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-zinc-300">
                    <strong className="text-white">Produk:</strong> {order.items}
                  </p>

                  {order.refund_reason && (
                    <p className="text-[11px] font-bold text-amber-300 bg-amber-950/60 p-2 rounded-xl border border-amber-800/40">
                      {order.refund_reason}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-5 text-xs text-zinc-400 pt-1">
                    <div className="flex flex-col">
                      <span className="text-[9.5px] text-zinc-500 font-extrabold uppercase tracking-wider">Pelanggan</span>
                      <strong className="text-white text-xs font-bold">{order.customer_name}</strong>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9.5px] text-zinc-500 font-extrabold uppercase tracking-wider">Jumlah</span>
                      <strong className="text-[#CFFF5E] text-xs font-black">RM {order.amount.toLocaleString()}</strong>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9.5px] text-zinc-500 font-extrabold uppercase tracking-wider">Tarikh Rekod</span>
                      <strong className="text-zinc-300 text-xs font-mono">{new Date(order.created_at).toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {order.status !== 'Refunded' && (
                    <button 
                      onClick={() => setRefundConfirmOrder({ id: order.order_id, amount: order.amount })}
                      className="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw size={12} />
                      <span>Bayar Balik (RM {order.amount})</span>
                    </button>
                  )}
                  <button 
                    onClick={() => onAction && onAction(`Siasat pesanan Supabase ${order.order_id} bagi pelanggan ${order.customer_name} di hab ${order.city} dengan JEV System-1.`)}
                    className="px-3.5 py-1.5 bg-[#181A2A] hover:bg-[#202438] text-white border border-white/10 hover:border-[#CFFF5E]/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Semak di Chat</span>
                    <ArrowUpRight size={12} className="text-[#CFFF5E]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* In-App Refund Confirmation Modal (Replacing window.confirm) */}
      <AnimatePresence>
        {refundConfirmOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141624] border border-red-800/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle size={20} />
                  <h3 className="text-base font-bold text-white">Sahkan Bayar Balik (Refund)</h3>
                </div>
                <button 
                  onClick={() => setRefundConfirmOrder(null)} 
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Adakah anda pasti mahu memproses bayar balik berjumlah <strong className="text-[#CFFF5E]">RM {refundConfirmOrder.amount}</strong> bagi pesanan <strong className="text-white">#{refundConfirmOrder.id}</strong>?
              </p>
              
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-zinc-400">
                Alasan Piawai: <span className="text-amber-300 font-mono">LEAKAGE / Penutup Botol Kurier Longgar</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundConfirmOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={syncing}
                  onClick={() => handleExecuteRefund(refundConfirmOrder.id)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {syncing ? 'Memproses...' : 'Sahkan Bayar Balik'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

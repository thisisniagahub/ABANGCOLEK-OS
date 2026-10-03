/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink,
  Layers,
  Flame,
  CheckCircle2,
  DollarSign,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService, ProductItem } from '@/services/productService';

interface AdminProductManagerProps {
  onAction?: (msg?: string) => void;
}

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({ onAction }) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'retail' as 'retail' | 'combo' | 'wholesale' | 'sides',
    price: 15.00,
    originalPrice: 0,
    unit: 'Botol 350ml',
    image: '/assets/brand/Gemini_Generated_Image_6800ao6800ao6800 (1).png',
    badge: '',
    badgeColor: 'bg-[#CFFF5E] text-black font-black',
    spiceOptionsText: 'Pedas Manis (Original), Extra Pedas Berapi',
    description: '',
    highlightsText: 'Induction Heat Seal (SOP 2026)\nTahan 6 Bulan Suhu Bilik\nTekstur Pekat Likat',
    driveSource: 'Folder 1: SOP Kualiti & Lejar Bas TBS',
    stockStatus: 'IN_STOCK' as 'IN_STOCK' | 'LOW_STOCK' | 'PRE_ORDER',
    inventoryCount: 100
  });

  useEffect(() => {
    setProducts(productService.getProducts());
    const unsub = productService.subscribe(() => {
      setProducts(productService.getProducts());
    });
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      subtitle: '',
      category: 'retail',
      price: 15.00,
      originalPrice: 0,
      unit: 'Botol 350ml',
      image: '/assets/brand/Gemini_Generated_Image_6800ao6800ao6800 (1).png',
      badge: 'Baru 🌟',
      badgeColor: 'bg-[#CFFF5E] text-black font-black',
      spiceOptionsText: 'Pedas Manis (Original), Extra Pedas',
      description: 'Kuah colek resipi warisan buatan Muslim.',
      highlightsText: 'Induction Seal Anti-Bocor\nPekat Likat\nTahan Lama',
      driveSource: 'Folder 1 & 2',
      stockStatus: 'IN_STOCK',
      inventoryCount: 100
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      subtitle: p.subtitle,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      unit: p.unit,
      image: p.image,
      badge: p.badge || '',
      badgeColor: p.badgeColor || 'bg-[#CFFF5E] text-black font-black',
      spiceOptionsText: p.spiceOptions ? p.spiceOptions.join(', ') : '',
      description: p.description,
      highlightsText: p.highlights.join('\n'),
      driveSource: p.driveSource,
      stockStatus: p.stockStatus,
      inventoryCount: p.inventoryCount || 100
    });
    setShowAddEditModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Sila masukkan nama produk.');
      return;
    }

    const spiceOptions = formData.spiceOptionsText
      ? formData.spiceOptionsText.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const highlights = formData.highlightsText
      ? formData.highlightsText.split('\n').map(h => h.trim()).filter(Boolean)
      : [];

    if (editingProduct) {
      // UPDATE
      productService.updateProduct(editingProduct.id, {
        name: formData.name,
        subtitle: formData.subtitle,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        unit: formData.unit,
        image: formData.image,
        badge: formData.badge || undefined,
        badgeColor: formData.badgeColor,
        spiceOptions: spiceOptions.length > 0 ? spiceOptions : undefined,
        description: formData.description,
        highlights,
        driveSource: formData.driveSource,
        stockStatus: formData.stockStatus,
        inventoryCount: Number(formData.inventoryCount)
      });
      showToast(`Produk "${formData.name}" berjaya dikemas kini.`);
    } else {
      // CREATE
      productService.addProduct({
        name: formData.name,
        subtitle: formData.subtitle,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        unit: formData.unit,
        image: formData.image,
        badge: formData.badge || undefined,
        badgeColor: formData.badgeColor,
        spiceOptions: spiceOptions.length > 0 ? spiceOptions : undefined,
        description: formData.description,
        highlights,
        driveSource: formData.driveSource,
        stockStatus: formData.stockStatus,
        inventoryCount: Number(formData.inventoryCount)
      });
      showToast(`Produk "${formData.name}" berjaya ditambah ke katalog.`);
    }

    setShowAddEditModal(false);
  };

  const handleDelete = (id: string) => {
    productService.deleteProduct(id);
    setDeleteConfirmId(null);
    showToast('Produk berjaya dipadam dari sistem.');
  };

  const handleResetDefaults = () => {
    productService.resetToDefaults();
    showToast('Katalog produk telah diset semula kepada data rasmi Google Drive.');
  };

  // Filter
  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-32 text-zinc-100 bg-[#090A10] space-y-6">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#141624] border border-[#CFFF5E]/50 shadow-[0_10px_30px_rgba(207,255,94,0.25)] text-white text-xs font-bold flex items-center gap-2.5"
          >
            <CheckCircle2 size={16} className="text-[#CFFF5E]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#181B2C] text-[#CFFF5E] border border-[#CFFF5E]/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Package size={13} className="text-[#CFFF5E]" />
              Pengurusan Inventori Produk
            </span>
            <span className="text-xs text-zinc-400 font-mono">Mod Staf / Admin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Katalog Produk & Kawalan Harga E-Commerce (CRUD)
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Urus stok kuah colek, harga kombo MakanFest, dan pakej borong karton secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Set semula katalog ke senarai asal Google Drive Folder 1 & 2"
          >
            <RotateCcw size={14} />
            <span>Reset Data Drive</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(207,255,94,0.3)] transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>+ Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="p-4 rounded-3xl bg-[#121422] border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk, unit, atau kategori..."
            className="w-full bg-[#161828] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-[#CFFF5E]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'retail', label: 'Runcit' },
            { id: 'combo', label: 'Kombo' },
            { id: 'wholesale', label: 'Borong' },
            { id: 'sides', label: 'Pelengkap' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                selectedCategory === c.id 
                  ? "bg-[#CFFF5E] text-black" 
                  : "bg-[#161828] text-zinc-400 hover:text-white border border-white/5"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="rounded-3xl bg-[#121422] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161828] text-zinc-400 font-mono text-[11px] uppercase border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga (RM)</th>
                <th className="py-3.5 px-4">Baki Stok</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-contain bg-black/40 p-1 shrink-0" />
                      <div>
                        <span className="font-extrabold text-white text-xs block leading-tight">{p.name}</span>
                        <span className="text-[10.5px] text-zinc-400 block truncate max-w-xs">{p.subtitle}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-zinc-300 uppercase">
                      {p.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white font-mono text-sm">RM{p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-zinc-500 line-through block font-mono">
                        RM{p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-white">{p.inventoryCount ?? 100} unit</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                      p.stockStatus === 'IN_STOCK' ? "bg-emerald-950 text-emerald-400 border-emerald-800" :
                      p.stockStatus === 'LOW_STOCK' ? "bg-amber-950 text-amber-400 border-amber-800" :
                      "bg-rose-950 text-rose-400 border-rose-800"
                    )}>
                      {p.stockStatus === 'IN_STOCK' ? 'Ada Stok' : p.stockStatus === 'LOW_STOCK' ? 'Stok Terhad' : 'Pre-Order'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Produk"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950 hover:text-rose-400 text-zinc-500 transition-colors cursor-pointer"
                        title="Padam Produk"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {showAddEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddEditModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94%] max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#141624] border border-white/20 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-[#CFFF5E]" />
                  <h3 className="font-extrabold text-lg text-white">
                    {editingProduct ? 'Kemas Kini Produk' : 'Tambah Produk Baru'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Nama Produk *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Tagline / Subtitle Ringkas</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                    >
                      <option value="retail">Runcit (Retail)</option>
                      <option value="combo">Pek Kombo</option>
                      <option value="wholesale">Borong / Ejen</option>
                      <option value="sides">Snek / Pelengkap</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Unit Bungkusan</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="cth: Botol 350ml / 1 Karton"
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Harga Jual (RM) *</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Harga Asal (RM)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="Optional"
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Kuantiti Stok</label>
                    <input
                      type="number"
                      value={formData.inventoryCount}
                      onChange={(e) => setFormData({ ...formData, inventoryCount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Pilihan Kepedasan (Asingkan dengan koma)</label>
                  <input
                    type="text"
                    value={formData.spiceOptionsText}
                    onChange={(e) => setFormData({ ...formData, spiceOptionsText: e.target.value })}
                    placeholder="Pedas Manis, Extra Pedas Berapi"
                    className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Penerangan Produk</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Kelebihan Utama (Satu baris setiap satu)</label>
                  <textarea
                    rows={2}
                    value={formData.highlightsText}
                    onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                    className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-[#CFFF5E]"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black font-extrabold cursor-pointer"
                  >
                    Simpan Produk
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm rounded-3xl bg-[#141624] border border-rose-500/40 shadow-2xl p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-950/80 text-rose-400 mx-auto flex items-center justify-center border border-rose-800">
                <Trash2 size={24} />
              </div>
              <h4 className="font-extrabold text-base text-white">Sahkan Padam Produk?</h4>
              <p className="text-zinc-400 text-xs">
                Tindakan ini akan mengeluarkan produk ini dari katalog jualan e-commerce.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Padam Sekarang
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

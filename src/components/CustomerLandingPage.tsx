/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Flame, 
  Star, 
  Volume2, 
  VolumeX, 
  Search, 
  MapPin, 
  Package, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  Play,
  Heart,
  Store,
  ExternalLink,
  MessageCircle,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { productService, ProductItem } from '@/services/productService';

interface CustomerLandingPageProps {
  onNavigateToStore: () => void;
  onNavigateToCockpit: () => void;
  onTrackOrder: (orderId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onQuickAddToCart: (product: ProductItem) => void;
}

export const CustomerLandingPage: React.FC<CustomerLandingPageProps> = ({
  onNavigateToStore,
  onNavigateToCockpit,
  onTrackOrder,
  cartCount,
  onOpenCart,
  onQuickAddToCart
}) => {
  const [isPlayingJingle, setIsPlayingJingle] = useState(false);
  const [audio] = useState(() => {
    const a = new Audio('/audio/kasi-lagi-lagi.mp3');
    a.loop = true;
    a.volume = 0.5;
    return a;
  });

  const [trackInput, setTrackInput] = useState('');
  const [activeTestimonialTab, setActiveTestimonialTab] = useState<'all' | 'kuah' | 'buah'>('all');

  const products = productService.getProducts().slice(0, 4);

  const toggleJingle = () => {
    if (isPlayingJingle) {
      audio.pause();
      setIsPlayingJingle(false);
    } else {
      audio.play().catch(e => console.warn('Audio play restricted:', e));
      setIsPlayingJingle(true);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onTrackOrder(trackInput.trim());
    }
  };

  const testimonials = [
    {
      name: "Nurul Aini (Shah Alam)",
      role: "Pelanggan Setia TikTok",
      quote: "Biasa beli kuah rojak lain cair dan manis gula semata. Kuah Abang Colek ni betul-betul pekat, rasa belacan bakar dia naik gila! Cicah dengan mangga rangup memang tak toleh kiri kanan dah.",
      rating: 5,
      type: 'kuah',
      badge: 'Pembeli Terverifikasi'
    },
    {
      name: "Hafiz & Zulaikha (Johor Bahru)",
      role: "Pengunjung Gerai Toppen JB",
      quote: "Pakej Kombo MakanFest berbaloi sangat, dapat buah segar potong sebekas besar + 1 botol percuma RM20 je. Balik rumah siap buat cicah jambu batu pulak.",
      rating: 5,
      type: 'buah',
      badge: 'Beli di Gerai'
    },
    {
      name: "Kak Siti (Kuala Terengganu)",
      role: "Stokis Daerah MBKT",
      quote: "Ambil karton 24 botol melalui konsainan bas ekspres TBS, sampai hari yang sama elok takde bocor langsung sebab seal induction kuat. 3 hari je habis licin orang booking!",
      rating: 5,
      type: 'kuah',
      badge: 'Stokis Sah'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#090A10] text-zinc-100 selection:bg-[#CFFF5E] selection:text-black font-sans pb-24 overflow-x-hidden">
      
      {/* Top Consumer Announcement Bar */}
      <div className="bg-gradient-to-r from-[#181B2C] via-[#202538] to-[#181B2C] border-b border-white/10 px-4 py-2 text-center text-xs text-zinc-300 flex items-center justify-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-[#CFFF5E] font-bold">
          <Sparkles size={13} />
          PROMOSI KEMPEN TIKTOK:
        </span>
        <span>Set Kombo Buah Crispy + Percuma 1 Botol Kuah Colek 350ml hanya RM20.00!</span>
        <button
          onClick={onNavigateToStore}
          className="text-[#00F0FF] underline hover:text-white font-bold ml-1 cursor-pointer"
        >
          Pesan Sekarang &rarr;
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#CFFF5E]/15 via-[#FF4757]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Punchy Pitch */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161828] border border-[#CFFF5E]/30 text-xs font-black text-[#CFFF5E] shadow-sm">
              <Flame size={14} className="animate-pulse text-[#FF4757]" />
              <span>FORMULA ASLI PANTAI TIMUR • VIRAL DI TIKTOK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Kuah Colek Buah Paling <span className="text-[#CFFF5E] underline decoration-[#CFFF5E]/40">Berhantu</span> Kini Sampai Ke Rumah Anda!
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Adunan pekat likat belacan bakar asli dan gula kabung bermutu tinggi. Dihasilkan segar dengan jaminan penutup <span className="text-[#CFFF5E] font-bold">Induction Seal kalis bocor (SOP 2026)</span>. Sedia dihantar terus ke pintu rumah atau stesen bas ekspres terdekat.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onNavigateToStore}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-sm font-black transition-all flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(207,255,94,0.35)] cursor-pointer active:scale-95 group"
              >
                <ShoppingBag size={18} />
                <span>Beli Kuah Colek Sekarang</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={toggleJingle}
                className={cn(
                  "w-full sm:w-auto px-5 py-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md",
                  isPlayingJingle 
                    ? "bg-[#FF4757] text-white border-[#FF4757] animate-pulse" 
                    : "bg-[#141624] text-zinc-300 border-white/10 hover:border-white/30 hover:text-white"
                )}
              >
                {isPlayingJingle ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{isPlayingJingle ? "Sedang Main: Jingle Kasi Lagi-Lagi 🎵" : "Dengar Jingle Rasmi 🎵"}</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 sm:gap-6 flex-wrap text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#CFFF5E]" />
                <span className="font-medium">Jaminan Ganti Botol Bocor 1-ke-1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={16} className="text-[#00F0FF]" />
                <span className="font-medium">Bas Ekspres Harian TBS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award size={16} className="text-[#FFC107]" />
                <span className="font-medium">100% Resipi Bumiputera</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card (Pinterest Food Aesthetics) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md rounded-[32px] p-4 bg-gradient-to-b from-[#181B2C] to-[#121422] border border-white/15 shadow-2xl overflow-hidden group">
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center p-3">
                <img
                  src="/assets/brand/Gemini_Generated_Image_5lbbwx5lbbwx5lbb.png"
                  alt="Kombo Colek Buah Crispy"
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Badge */}
                <div className="absolute top-3 left-3 bg-[#FF4757] text-white px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                  <Flame size={12} />
                  <span>Kombo Viral MakanFest</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-xs font-mono font-bold border border-white/10">
                  RM 20.00 <span className="line-through text-zinc-500 text-[10px]">RM25.00</span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-extrabold text-base">Set Buah Crispy + Percuma Botol 350ml</h3>
                    <p className="text-zinc-400 text-xs">Mangga Muda, Jambu Kristal & Kuah Pekat</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#FFC107] text-xs font-bold bg-[#FFC107]/10 px-2 py-1 rounded-lg">
                    <Star size={13} fill="#FFC107" />
                    <span>4.9 (1.2k)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const kombo = productService.getProductById('kombo-viral-makanfest');
                    if (kombo) onQuickAddToCart(kombo);
                  }}
                  className="w-full py-3 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingBag size={14} />
                  <span>Masukkan Kombo Ini Ke Beg</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="bg-[#121422] border-y border-white/10 py-3 overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee text-xs font-bold text-zinc-400 uppercase tracking-widest">
          <span className="flex items-center gap-2 text-[#CFFF5E]">
            <CheckCircle2 size={13} />
            Induction Heat Seal SOP 2026
          </span>
          <span>•</span>
          <span className="flex items-center gap-2 text-white">
            <Flame size={13} className="text-[#FF4757]" />
            Formula Pekat Likat Melekat
          </span>
          <span>•</span>
          <span className="flex items-center gap-2 text-[#00F0FF]">
            <Truck size={13} />
            Konsainan Bas Ekspres TBS Harian
          </span>
          <span>•</span>
          <span>•</span>
          <span className="flex items-center gap-2 text-[#FFC107]">
            <Star size={13} />
            Lebih 10,000 Botol Terjual di Karnival
          </span>
          <span>•</span>
          <span className="flex items-center gap-2 text-[#CFFF5E]">
            <CheckCircle2 size={13} />
            Induction Heat Seal SOP 2026
          </span>
        </div>
      </div>

      {/* Best-Sellers Product Shelf (Pinterest Style Grid) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[#CFFF5E] font-bold text-xs uppercase tracking-wider block">PILIHAN PALING LARIS</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Koleksi Kuah Colek & Pakej Borong
            </h2>
          </div>

          <button
            onClick={onNavigateToStore}
            className="text-xs font-bold text-[#CFFF5E] hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Lihat Semua 7 Produk Di Etalase</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map(p => (
            <div
              key={p.id}
              className="rounded-3xl bg-[#121422] border border-white/10 hover:border-[#CFFF5E]/40 p-4 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div className="space-y-3">
                <div className="relative h-44 rounded-2xl bg-black/40 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.badge && (
                    <span className={cn("absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md", p.badgeColor || "bg-[#CFFF5E] text-black")}>
                      {p.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-white group-hover:text-[#CFFF5E] transition-colors line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                    {p.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-white font-mono">RM{p.price.toFixed(2)}</span>
                  <span className="text-[10px] text-zinc-500 block">{p.unit}</span>
                </div>

                <button
                  onClick={() => onQuickAddToCart(p)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-[#CFFF5E] hover:text-black text-zinc-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={13} />
                  <span>+ Beg</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Track My Order Live Search Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#141624] via-[#1B1E32] to-[#141624] border border-white/15 shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] text-xs font-bold border border-[#00F0FF]/30">
            <Truck size={13} />
            <span>SEMBAK PENGHANTARAN MASAKINI</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Dah Pesan? Semak Status Penghantaran Anda
          </h3>
          <p className="text-zinc-400 text-xs max-w-md mx-auto">
            Masukkan ID Pesanan anda (cth: <span className="font-mono text-zinc-200">AC-ORD-1001</span> atau nombor dari resit WhatsApp) untuk semak status logistik kurier / bas TBS.
          </p>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="ID Pesanan cth: AC-ORD-1001"
                className="w-full bg-[#181B2C] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-[#00F0FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-[#4df4ff] text-black font-extrabold text-xs transition-all shrink-0 cursor-pointer shadow-md"
            >
              Kesan Sekarang
            </button>
          </form>
        </div>
      </section>

      {/* Customer Testimonials & Reviews */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[#FFC107] font-bold text-xs uppercase tracking-wider">KOMUNITI PEMINAT COLEK BUAH</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Apa Kata Pelanggan & Stokis Kami?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#121422] border border-white/10 flex flex-col justify-between shadow-lg space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-[#FFC107]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#FFC107" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-[#CFFF5E] border border-[#CFFF5E]/20">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <span className="font-extrabold text-xs text-white block">{t.name}</span>
                <span className="text-[10.5px] text-zinc-500 block">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Physical Pop-Up Locations & Contact */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#121422] border border-white/10 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-bold text-[#FF4757] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} />
              CAWANGAN GERAI FIZIKAL & POP-UP
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Boleh Singgah Terus Di Gerai Kami Hari Ini!
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Selain pesanan pos dan bas TBS, anda boleh rasai terus keenakan buah rangup segar cicah kuah colek panas di gerai pop-up kami:
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#181B2C] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">📍 Gerai Toppen Shopping Centre (Johor Bahru)</span>
                  <span className="text-zinc-400 text-[11px]">Krew Bertugas: Wan • Waktu: 10:00 AM - 10:00 PM</span>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-[10px] font-bold">Dibuka</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#181B2C] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">📍 Kaunter Pengambilan Stokis MBKT (Kuala Terengganu)</span>
                  <span className="text-zinc-400 text-[11px]">Krew Bertugas: Kak Siti • Waktu: 12:00 PM - 8:00 PM</span>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-[10px] font-bold">Dibuka</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-[#17192A] to-[#1D1F34] border border-white/10 text-center space-y-4">
            <Store size={36} className="text-[#CFFF5E]" />
            <div>
              <h4 className="font-black text-white text-base">Berminat Menjadi Ejen / Stokis?</h4>
              <p className="text-zinc-400 text-xs mt-1">
                Pakej permulaan serendah RM264 (24 botol) dengan margin untung sehingga 36%.
              </p>
            </div>
            <a
              href="https://wa.me/60192837465?text=Salam%20HQ%20Abang%20Colek,%20saya%20berminat%20nak%20tanya%20pakej%20ejen%20stokis"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageCircle size={15} />
              <span>Hubungi Pasukan Ejen via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Consumer Footer */}
      <footer className="mt-12 pt-8 border-t border-white/10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>&copy; 2026 ABANGCOLEK™ Enterprise (KT / JB). Hak Cipta Terpelihara.</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateToStore}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Etalase Produk
          </button>
          <span>•</span>
          <button
            onClick={onNavigateToCockpit}
            className="text-[#CFFF5E] hover:underline font-bold transition-colors cursor-pointer"
          >
            Portal Kakitangan & Operasi HQ &rarr;
          </button>
        </div>
      </footer>

    </div>
  );
};

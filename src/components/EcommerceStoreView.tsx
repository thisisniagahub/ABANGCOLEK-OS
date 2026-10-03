/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  QrCode, 
  MessageCircle, 
  FileText, 
  Share2, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Flame, 
  CheckCircle2, 
  Download, 
  Building, 
  X,
  CreditCard,
  Banknote,
  Package,
  Award,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { insertSupabaseOrder } from '@/services/supabaseOrders';
import { OFFICIAL_DRIVE_FOLDERS } from '@/services/googleDrive';

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'retail' | 'combo' | 'wholesale' | 'sides';
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  spiceOptions?: string[];
  description: string;
  highlights: string[];
  driveSource: string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'PRE_ORDER';
  minOrder?: number;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedSpice?: string;
}

export const STORE_PRODUCTS: ProductItem[] = [
  {
    id: 'kuah-colek-signature-350ml',
    name: 'Kuah Colek Buah Signature (350ml)',
    subtitle: 'Formula Pekat Likat Asli Pantai Timur • Anti-Bocor Induction Seal',
    category: 'retail',
    price: 15.00,
    unit: 'Botol 350ml',
    image: '/assets/brand/Gemini_Generated_Image_6800ao6800ao6800 (1).png',
    badge: 'Paling Laris 🔥',
    badgeColor: 'bg-[#FF4757] text-white',
    spiceOptions: ['Pedas Manis (Original)', 'Extra Pedas Berapi 🌶️🌶️'],
    description: 'Kuah rojak buah istimewa diadun pekat dengan belacan bakar aroma tinggi dan gula kabung asli. Mematuhi SOP Piawaian Kualiti Pembungkusan 2026 dengan penutup induction liner anti-bocor.',
    highlights: [
      'Induction Heat Seal (Jaminan Anti-Bocor QC SOP 2026)',
      'Tahan 6 Bulan Suhu Bilik (Tanpa Pengawet Sintetik)',
      'Tekstur Pekat Likat Melekat Pada Buah'
    ],
    driveSource: 'Folder 1: SOP_Piawaian_Kualiti_Pembungkusan_Botol_Kuah_Colek_2026.docx',
    stockStatus: 'IN_STOCK'
  },
  {
    id: 'kombo-viral-makanfest',
    name: 'Set Kombo Viral MakanFest KL',
    subtitle: 'Buah Rangup Segar + Percuma 1 Botol Kuah Colek 350ml',
    category: 'combo',
    price: 20.00,
    originalPrice: 25.00,
    unit: 'Set Kombo Lengkap',
    image: '/assets/brand/Gemini_Generated_Image_5lbbwx5lbbwx5lbb.png',
    badge: 'Viral TikTok 🎬',
    badgeColor: 'bg-[#00F0FF] text-black font-extrabold',
    spiceOptions: ['Pedas Manis (Original)', 'Extra Pedas Berapi'],
    description: 'Set promosi rasmi Canva MakanFest KL Gateway. Mengandungi mangga muda crunchy, jambu batu kristal, nenas MD2 manis, dan 1 botol kuah colek 350ml PERCUMA.',
    highlights: [
      'Jimat RM5.00 daripada harga asal',
      'Termasuk Buah Segar Dihiris Pagi Hari',
      'Seperti Dipromosikan Dalam Video Kempen TikTok 4K'
    ],
    driveSource: 'Folder 2: Poster_Kombo_MakanFest_KL_Gateway_Canva.png & Video_TikTok_Hook_4K.mp4',
    stockStatus: 'IN_STOCK'
  },
  {
    id: 'pek-trio-family-3botol',
    name: 'Pek Trio Kombo Jimat Seisi Rumah',
    subtitle: '3 Botol Kuah Colek 350ml + Free Serbuk Asam Boi Crispy',
    category: 'combo',
    price: 40.00,
    originalPrice: 45.00,
    unit: 'Set 3 Botol + Percuma Snek',
    image: '/assets/brand/Gemini_Generated_Image_o4cz9so4cz9so4cz.png',
    badge: 'Jimat RM5 ⭐',
    badgeColor: 'bg-[#CFFF5E] text-black font-black',
    spiceOptions: ['Campuran (2 Original + 1 Extra Pedas)', 'Semua Pedas Manis', 'Semua Extra Pedas'],
    description: 'Pilihan paling digemari peminat tegar colek buah. Mengandungi 3 botol 350ml serta 1 paket percuma taburan serbuk colek asam boi rangup.',
    highlights: [
      'Harga Purata Hanya RM13.33/botol',
      'Percuma 1 Paket Serbuk Asam Boi 100g',
      'Balutan Bubble Wrap 3 Lapis Percuma'
    ],
    driveSource: 'Folder 2: Bahan Promosi Media Kempen & Lejar Jualan',
    stockStatus: 'IN_STOCK'
  },
  {
    id: 'pakej-borong-stokis-24botol',
    name: 'Pakej Borong Stokis Daerah (1 Karton = 24 Botol)',
    subtitle: 'Hanya RM11.00/botol • Untung Kasar RM96.00 • Layak Konsainan Bas TBS',
    category: 'wholesale',
    price: 264.00,
    originalPrice: 360.00,
    unit: '1 Karton (24 Botol)',
    image: '/assets/brand/Gemini_Generated_Image_zh034qzh034qzh03.PNG',
    badge: 'Margin 36% 💼',
    badgeColor: 'bg-[#FFC107] text-black font-black',
    spiceOptions: ['18 Pedas Manis + 6 Extra Pedas', '12 Pedas Manis + 12 Extra Pedas', '24 Pedas Manis'],
    description: 'Pakej borong rasmi untuk peniaga gerai buah, kantin sekolah, dan stokis daerah. Mengikut terma Surat Perjanjian Ejen rasmi Abang Colek. Pengangkutan pantas melalui konsainan bas ekspres TBS.',
    highlights: [
      'Harga Kos Rendah: RM11.00/botol (Harga Jual Runcit RM15.00)',
      'Untung Bersih Segera RM96.00 setiap karton',
      'Boleh Dituntut di Kaunter Bas MBKT Terengganu & Toppen/Larkin JB'
    ],
    driveSource: 'Folder 1: Lejar_Konsainan_Ekspres_Bas_TBS_Stokis_KT_JB.xlsx & Surat_Perjanjian_Ejen.pdf',
    stockStatus: 'IN_STOCK',
    minOrder: 1
  },
  {
    id: 'pakej-ejen-super-50botol',
    name: 'Pakej Permulaan Ejen Super (50 Botol + Banner Gerai Percuma)',
    subtitle: 'Hanya RM10.00/botol • Untung RM250 • Percuma Tambang Bas TBS + Aset Canva',
    category: 'wholesale',
    price: 500.00,
    originalPrice: 750.00,
    unit: 'Pakej Lengkap Ejen (50 Botol)',
    image: '/assets/brand/founder.png',
    badge: 'Ejen Rasmi HQ 👑',
    badgeColor: 'bg-gradient-to-r from-[#FF4757] to-[#FFA000] text-white font-black',
    spiceOptions: ['Campuran Standard HQ (35 Pedas Manis + 15 Extra Pedas)'],
    description: 'Pakej perniagaan mikro lengkap usahawan muda. Termasuk 50 botol kuah colek, percuma banner meja gerai saiz 6x3 kaki bercetak kalis air, pakej vektor logo HD rasmi, dan sokongan iklan TikTok.',
    highlights: [
      'Harga Paling Murah: Hanya RM10.00 sebotol (Untung Kasar RM250)',
      'Percuma Tambang Bas TBS ke MBKT Terengganu atau Larkin JB',
      'Termasuk Surat Pelantikan Ejen Sah & Pakej Grafik Canva'
    ],
    driveSource: 'Folder 1: Pitch_Deck_Pelabur_Abang_Colek_Series_Seed_2026.pdf & Pakej_Vektor_Logo.ai',
    stockStatus: 'IN_STOCK',
    minOrder: 1
  },
  {
    id: 'kuah-colek-mini-pocket-150ml',
    name: 'Botol Mini Pocket Colek Travel (150ml)',
    subtitle: 'Saiz Poket Mudah Bawa Ke Pejabat / Perkelahan',
    category: 'retail',
    price: 8.00,
    unit: 'Botol 150ml',
    image: '/assets/brand/MASKOT-LOGO.PNG',
    badge: 'Travel Size 🎒',
    badgeColor: 'bg-zinc-800 text-[#CFFF5E] border border-[#CFFF5E]/40',
    spiceOptions: ['Pedas Manis (Original)', 'Extra Pedas'],
    description: 'Versi comel dan padat untuk individu yang gemar colek buah semasa waktu kerja di pejabat atau santai di rumah.',
    highlights: [
      'Saiz 150ml Mesra Beg Tangan & Meja Pejabat',
      'Penutup Fliptop Bersih Tanpa Tumpahan',
      'Pilihan Ideal Sebagai Cenderahati Acara'
    ],
    driveSource: 'Folder 1: Aset & Penjenamaan Logo HD',
    stockStatus: 'IN_STOCK'
  },
  {
    id: 'serbuk-colek-crispy-asam-boi',
    name: 'Serbuk Colek Crispy Asam Boi & Bilis (100g)',
    subtitle: 'Adunan Rangup Asam Boi, Garam Cili & Bilis Bakar Halus',
    category: 'sides',
    price: 6.50,
    unit: 'Pek Zip-lock 100g',
    image: '/assets/brand/MASKOT-1.PNG',
    badge: 'Ranggup Giler 💥',
    badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    description: 'Taburan pelengkap istimewa untuk dinikmati bersama kuah colek buah. Memberikan sensasi rangup krup-krap dan masam manis yang ketagih.',
    highlights: [
      'Pek Kedap Udara Zip-lock Boleh Tutup Semula',
      'Bilis Goreng Garing Tanpa Minyak Berlebihan',
      'Gabungan Sempurna Bersama Jambu Batu & Mangga'
    ],
    driveSource: 'Folder 2: Menu Tambahan Pop-up Gerai Karnival Karat',
    stockStatus: 'IN_STOCK'
  }
];

interface EcommerceStoreViewProps {
  onAction?: (msg?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const EcommerceStoreView: React.FC<EcommerceStoreViewProps> = ({ onAction, onNavigateTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [quickToast, setQuickToast] = useState<string | null>(null);
  
  // Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'bus_tbs' | 'pickup'>('courier');
  const [shippingAddress, setShippingAddress] = useState('');
  const [busDestination, setBusDestination] = useState<'MBKT_KUALA_TERENGGANU' | 'TOPPEN_LARKIN_JB'>('MBKT_KUALA_TERENGGANU');
  const [paymentMethod, setPaymentMethod] = useState<'duitnow' | 'whatsapp' | 'fpx' | 'cod'>('duitnow');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  
  // Jingle audio player
  const [isPlayingJingle, setIsPlayingJingle] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/kasi-lagi-lagi.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    setAudioRef(audio);

    return () => {
      audio.pause();
    };
  }, []);

  const toggleJingle = () => {
    if (!audioRef) return;
    if (isPlayingJingle) {
      audioRef.pause();
      setIsPlayingJingle(false);
    } else {
      audioRef.play().catch(e => console.warn('Audio play prevented:', e));
      setIsPlayingJingle(true);
    }
  };

  const showToast = (msg: string) => {
    setQuickToast(msg);
    setTimeout(() => setQuickToast(null), 3000);
  };

  // Add to cart
  const handleAddToCart = (product: ProductItem, qty = 1, spiceChoice?: string) => {
    const spice = spiceChoice || (product.spiceOptions ? product.spiceOptions[0] : undefined);
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.selectedSpice === spice);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += qty;
        return copy;
      }
      return [...prev, { product, quantity: qty, selectedSpice: spice }];
    });
    showToast(`Ditambah ke troli: ${product.name} (x${qty})`);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Shipping calculation based on method & total
  const shippingFee = deliveryMethod === 'pickup' 
    ? 0 
    : deliveryMethod === 'bus_tbs' 
      ? 15.00 
      : subtotal >= 50 ? 0 : 8.00;

  const totalAmount = subtotal + shippingFee;

  // Filter products
  const filteredProducts = STORE_PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Order Submit
  const handleCompleteOrder = async () => {
    if (!customerName.trim()) {
      showToast('Sila masukkan nama pelanggan.');
      return;
    }
    if (!customerPhone.trim()) {
      showToast('Sila masukkan nombor telefon / WhatsApp.');
      return;
    }
    if (deliveryMethod === 'courier' && !shippingAddress.trim()) {
      showToast('Sila masukkan alamat penghantaran kurier.');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      // Compose item string summary
      const itemsSummary = cart.map(i => `${i.product.name} [${i.selectedSpice || 'Std'}] x${i.quantity}`).join(' + ');
      const destinationCity = deliveryMethod === 'bus_tbs' 
        ? (busDestination === 'MBKT_KUALA_TERENGGANU' ? 'kuala terengganu' : 'johor bahru')
        : (deliveryMethod === 'pickup' ? 'johor bahru' : 'kuala lumpur');

      // Create Supabase & AppStore order
      const result = await insertSupabaseOrder({
        customer_name: customerName,
        city: destinationCity,
        items: `[E-COMMERCE] ${itemsSummary} | Kaedah: ${deliveryMethod.toUpperCase()}`,
        amount: Number(totalAmount.toFixed(2))
      });

      const orderData = {
        orderId: result.data?.order_id || `AC-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName,
        customerPhone,
        items: cart,
        subtotal,
        shippingFee,
        totalAmount,
        deliveryMethod,
        busDestination,
        shippingAddress,
        paymentMethod,
        date: new Date().toLocaleString('ms-MY'),
        status: 'Processing'
      };

      setCompletedOrder(orderData);
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      showToast('🎉 Pesanan anda telah berjaya dihantar ke sistem HQ!');
    } catch (e: any) {
      console.error('Error submitting order:', e);
      showToast('Ralat memproses pesanan. Sila cuba lagi.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // WhatsApp Order Generator
  const generateWhatsAppMessage = () => {
    const itemsText = cart.map(i => `• ${i.product.name} (${i.selectedSpice || 'Standard'}) x${i.quantity} = RM${(i.product.price * i.quantity).toFixed(2)}`).join('\n');
    const msg = `Salam Abang Colek HQ! Saya ingin membuat pesanan rasmi:\n\n*NAMA:* ${customerName || '[Nama Anda]'}\n*TEL:* ${customerPhone || '[No. Telefon]'}\n\n*SENARAI PESANAN:*\n${itemsText}\n\n*Subtotal:* RM${subtotal.toFixed(2)}\n*Penghantaran:* ${deliveryMethod === 'bus_tbs' ? `Bas TBS (${busDestination})` : deliveryMethod === 'pickup' ? 'Ambil di Gerai' : 'Kurier'} (RM${shippingFee.toFixed(2)})\n*JUMLAH KESELURUHAN:* RM${totalAmount.toFixed(2)}\n\nSila sahkan akaun pembayaran DuitNow / nombor tracking. Terima kasih!`;
    return encodeURIComponent(msg);
  };

  return (
    <div className="w-full min-h-full p-2.5 sm:p-4 md:p-6 lg:p-8 pb-32 text-zinc-100 bg-[#090A10] selection:bg-[#CFFF5E] selection:text-black overflow-y-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {quickToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#141624] border border-[#CFFF5E]/50 shadow-[0_10px_30px_rgba(207,255,94,0.25)] text-white text-xs font-bold flex items-center gap-2.5"
          >
            <Sparkles size={16} className="text-[#CFFF5E]" />
            <span>{quickToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto w-full space-y-6">

        {/* Hero Banner - E-Commerce Header with Live Drive Integration */}
        <div className="rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 border border-white/10 bg-[#121422] shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#CFFF5E]/15 via-[#FF4757]/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-[#00F0FF]/10 to-transparent blur-2xl pointer-events-none" />

          <div className="lg:col-span-8 space-y-3 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#181B2C] text-[#CFFF5E] border border-[#CFFF5E]/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <ShoppingBag size={13} className="text-[#CFFF5E]" />
                Kedai E-Commerce Rasmi Abang Colek
              </span>
              <span className="px-3 py-1 rounded-full bg-red-950/80 text-rose-300 border border-red-800/40 text-[10.5px] font-mono font-bold flex items-center gap-1.5">
                <Flame size={12} className="text-[#FF4757] animate-pulse" />
                <span>Katalog Produk Bersepadu Google Drive (2 Folder)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Nikmati Kesegaran Kuah Colek Buah Asli & Tawaran Borong Ejen
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              Pesanan terus dari dapur pusat dengan jaminan penutup kedap <span className="text-[#CFFF5E] font-bold">Induction Seal anti-bocor (QC SOP 2026)</span>. Penghantaran sepantas hari sama menggunakan konsainan bas ekspres TBS ke Pantai Timur & Johor Bahru.
            </p>

            {/* Quick Benefits Bar */}
            <div className="pt-2 flex items-center gap-3 sm:gap-6 flex-wrap text-xs text-zinc-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#CFFF5E]" />
                <span className="font-semibold">Piawaian QC Botol Bebas Bocor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={15} className="text-[#00F0FF]" />
                <span className="font-semibold">Konsainan Ekspres Bas TBS Harian</span>
              </div>
              <div className="flex items-center gap-1.5">
                <QrCode size={15} className="text-[#FFC107]" />
                <span className="font-semibold">DuitNow QR & WhatsApp Auto-Order</span>
              </div>
            </div>
          </div>

          {/* Right Action Widgets */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-3.5 relative z-10 shrink-0">
            {/* Audio Jingle Button */}
            <button
              onClick={toggleJingle}
              className={cn(
                "px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg",
                isPlayingJingle 
                  ? "bg-[#CFFF5E] text-black border-[#CFFF5E] shadow-[0_0_20px_rgba(207,255,94,0.4)] animate-pulse" 
                  : "bg-[#181B2C] text-zinc-300 border-white/10 hover:border-white/30 hover:text-white"
              )}
              title="Mainkan Jingle Rasmi 'Kasi Lagi-Lagi' dari Google Drive Folder 2"
            >
              {isPlayingJingle ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isPlayingJingle ? "Sedang Main: Jingle Kasi Lagi-Lagi 🎵" : "Main Jingle Abang Colek 🎵"}</span>
            </button>

            {/* Floating Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#CFFF5E] to-[#B5F233] hover:from-[#d8ff6b] hover:to-[#CFFF5E] text-black text-sm font-black transition-all flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(207,255,94,0.35)] cursor-pointer active:scale-95"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FF4757] text-white text-[10px] font-black flex items-center justify-center border-2 border-black">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span>Troli Pesanan ({cartItemCount})</span>
              <span className="bg-black/10 px-2 py-0.5 rounded-lg text-xs font-black">
                RM{subtotal.toFixed(2)}
              </span>
            </button>

            {/* Drive Link Shortcut */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span>Bahan rujukan:</span>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('drive')}
                className="underline hover:text-[#CFFF5E] font-medium flex items-center gap-1 cursor-pointer"
              >
                Drive Hub 2 Folder <ExternalLink size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Promo Highlights Banner (MakanFest & Ejen Wholesales) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#17192A] to-[#121422] border border-white/10 hover:border-[#00F0FF]/40 transition-all flex items-center gap-4 shadow-lg group">
            <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center shrink-0 text-[#00F0FF] group-hover:scale-105 transition-transform">
              <Package size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] uppercase">
                  Kempen Canva
                </span>
                <span className="text-xs text-zinc-400 font-mono">Folder 2</span>
              </div>
              <h3 className="text-white font-extrabold text-sm sm:text-base mt-1 truncate">
                Kombo MakanFest: Percuma 1 Botol Kuah 350ml!
              </h3>
              <p className="text-zinc-400 text-xs line-clamp-1">
                Beli set buah potong rangup, bawa pulang sebotol kuah colek hanya RM20.
              </p>
            </div>
            <button
              onClick={() => handleAddToCart(STORE_PRODUCTS[1], 1)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#00F0FF] hover:text-black text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              + Tambah
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#17192A] to-[#121422] border border-white/10 hover:border-[#FFC107]/40 transition-all flex items-center gap-4 shadow-lg group">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC107]/15 border border-[#FFC107]/30 flex items-center justify-center shrink-0 text-[#FFC107] group-hover:scale-105 transition-transform">
              <Building size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFC107]/20 text-[#FFC107] uppercase">
                  Pakej Ejen & Stokis
                </span>
                <span className="text-xs text-zinc-400 font-mono">Folder 1</span>
              </div>
              <h3 className="text-white font-extrabold text-sm sm:text-base mt-1 truncate">
                Karton 24 Botol: Jimat RM96 & Untung Margin 36%
              </h3>
              <p className="text-zinc-400 text-xs line-clamp-1">
                Khas untuk kedai makan & gerai pop-up mengikut Surat Perjanjian Ejen.
              </p>
            </div>
            <button
              onClick={() => handleAddToCart(STORE_PRODUCTS[3], 1)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#FFC107] hover:text-black text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              + Tambah
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-3xl bg-[#121422] border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kuah colek, kombo viral, karton borong..."
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

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
            {[
              { id: 'all', label: 'Semua Produk' },
              { id: 'retail', label: 'Botol Runcit (350ml/150ml)' },
              { id: 'combo', label: 'Pek Kombo Jimat' },
              { id: 'wholesale', label: 'Borong & Ejen (Karton)' },
              { id: 'sides', label: 'Snek & Pelengkap' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                  selectedCategory === cat.id 
                    ? "bg-[#CFFF5E] text-black shadow-[0_0_12px_rgba(207,255,94,0.3)]" 
                    : "bg-[#161828] text-zinc-400 hover:text-white border border-white/5"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="rounded-3xl bg-[#121422] border border-white/10 hover:border-[#CFFF5E]/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl group relative"
              >
                {/* Image Container with Badges */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/40 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/brand/Gemini_Generated_Image_6800ao6800ao6800 (1).png';
                    }}
                  />

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {product.badge && (
                      <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md", product.badgeColor || "bg-[#CFFF5E] text-black")}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-3 right-3 text-[10px] font-mono bg-black/70 backdrop-blur-xs text-zinc-300 px-2 py-0.5 rounded-lg border border-white/10">
                    {product.unit}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white tracking-tight leading-snug group-hover:text-[#CFFF5E] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11.5px] text-zinc-400 mt-1 font-medium leading-relaxed">
                      {product.subtitle}
                    </p>

                    {/* Highlights bullet points */}
                    <div className="mt-3 space-y-1.5 pt-3 border-t border-white/[0.06]">
                      {product.highlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                          <CheckCircle2 size={12} className="text-[#CFFF5E] shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-white">
                          RM{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through">
                            RM{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {product.category === 'wholesale' ? 'Harga Borong Sah' : 'Harga Runcit RRP'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedSpice(product.spiceOptions ? product.spiceOptions[0] : '');
                          setQuantity(1);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                        title="Lihat Butiran Penuh & Pilihan"
                      >
                        <FileText size={15} />
                      </button>

                      <button
                        onClick={() => handleAddToCart(product, 1)}
                        className="px-4 py-2.5 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-xs font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(207,255,94,0.3)] cursor-pointer active:scale-95"
                      >
                        <Plus size={14} />
                        <span>Beli</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Operational Guarantee */}
        <div className="p-6 rounded-3xl bg-[#141624] border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#CFFF5E]/15 border border-[#CFFF5E]/30 flex items-center justify-center shrink-0 text-[#CFFF5E]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Jaminan Anti-Bocor SOP 2026</h4>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Setiap botol melepasi ujian ketat penutup induction heat seal. Jika pecah dalam kurier, kami ganti 1-ke-1 secara percuma.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center shrink-0 text-[#00F0FF]">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Rangkaian Konsainan Bas TBS</h4>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Penghantaran ekspres harian dari Terminal Bersepadu Selatan ke MBKT Terengganu (Kak Siti) dan Larkin/Toppen JB (Wan).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4757]/15 border border-[#FF4757]/30 flex items-center justify-center shrink-0 text-[#FF4757]">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Resipi Warisan Pantai Timur</h4>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Adunan ramuan asli belacan bakar, cili kering gred A, dan gula kabung asli tanpa bahan pewarna sintetik.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#141624] border border-white/20 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/10 p-1 flex items-center justify-center">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{selectedProduct.name}</h3>
                    <span className="text-xs text-[#CFFF5E] font-bold">{selectedProduct.subtitle}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Highlights */}
                <div className="p-3.5 rounded-2xl bg-[#181B2C] border border-white/5 space-y-2">
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">Kelebihan Utama & SOP Kilang:</span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {selectedProduct.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check size={14} className="text-[#CFFF5E]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Drive Reference */}
                <div className="text-[11px] text-zinc-400 font-mono bg-white/5 p-2 rounded-xl flex items-center justify-between">
                  <span>Rujukan Data Google Drive:</span>
                  <span className="text-[#00F0FF]">{selectedProduct.driveSource.split(':')[0]}</span>
                </div>

                {/* Spice Level Option if any */}
                {selectedProduct.spiceOptions && selectedProduct.spiceOptions.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">Pilih Tahap Kepedasan:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProduct.spiceOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSelectedSpice(opt)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer",
                            selectedSpice === opt 
                              ? "bg-[#CFFF5E]/15 border-[#CFFF5E] text-[#CFFF5E]" 
                              : "bg-[#181B2C] border-white/10 text-zinc-400 hover:text-white"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-zinc-300">Kuantiti Pesanan:</span>
                  <div className="flex items-center gap-3 bg-[#181B2C] border border-white/10 px-3 py-1.5 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-mono font-bold text-sm text-white px-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Price & Add to cart */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-zinc-400">Jumlah:</span>
                    <p className="text-xl font-black text-white">
                      RM{(selectedProduct.price * quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, quantity, selectedSpice);
                      setSelectedProduct(null);
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black font-black text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(207,255,94,0.3)] cursor-pointer"
                  >
                    <ShoppingCart size={16} />
                    <span>Masukkan ke Troli</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Slide-Over Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 w-[90%] max-w-md bg-[#121422] border-l border-white/15 shadow-2xl flex flex-col justify-between"
            >
              {/* Cart Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#CFFF5E]/20 text-[#CFFF5E] flex items-center justify-center">
                    <ShoppingCart size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Troli Pesanan Anda</h3>
                    <span className="text-xs text-zinc-400 font-mono">{cartItemCount} item dipilih</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                    <ShoppingBag size={40} className="text-zinc-600" />
                    <h4 className="text-white font-bold text-sm">Troli Anda Masih Kosong</h4>
                    <p className="text-zinc-400 text-xs max-w-xs">
                      Pilih kuah colek signature, set kombo viral MakanFest, atau karton borong untuk memulakan pesanan.
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#161828] border border-white/10 flex items-center justify-between gap-3"
                    >
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-xl object-contain bg-black/40 p-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{item.product.name}</h4>
                        {item.selectedSpice && (
                          <span className="text-[10px] text-[#CFFF5E] block font-medium truncate">{item.selectedSpice}</span>
                        )}
                        <span className="text-xs font-mono font-bold text-zinc-300">
                          RM{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-xl shrink-0">
                        <button
                          onClick={() => updateCartQuantity(idx, -1)}
                          className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-mono font-bold text-xs text-white px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(idx, 1)}
                          className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-white/10 bg-[#161828] space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Jumlah Produk (Subtotal):</span>
                      <span className="font-mono text-white">RM{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Anggaran Penghantaran:</span>
                      <span className="font-mono text-[#00F0FF]">
                        {subtotal >= 50 ? 'PERCUMA (>RM50)' : 'Dihitung di Checkout'}
                      </span>
                    </div>
                    <div className="flex justify-between text-white font-extrabold text-base pt-2 border-t border-white/10">
                      <span>Jumlah:</span>
                      <span className="text-[#CFFF5E] font-mono">RM{subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-sm font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(207,255,94,0.3)] cursor-pointer"
                  >
                    <span>Teruskan Ke Pembayaran</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94%] max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#141624] border border-white/20 shadow-2xl p-6 sm:p-7 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#CFFF5E]/20 text-[#CFFF5E] flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Sahkan Pesanan & Pembayaran</h3>
                    <p className="text-xs text-zinc-400">Pusat Transaksi & Logistik Rasmi Abang Colek</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Checkout Form */}
              <div className="space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Nama Penuh Pelanggan / Ejen *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="cth: Siti Mariam / Wan JB"
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-[#CFFF5E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">No. Telefon WhatsApp *</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="cth: 019-8765432"
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-[#CFFF5E]"
                    />
                  </div>
                </div>

                {/* Delivery Method Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 block">Pilihan Kaedah Penghantaran *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => setDeliveryMethod('courier')}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all cursor-pointer",
                        deliveryMethod === 'courier' 
                          ? "bg-[#CFFF5E]/15 border-[#CFFF5E] text-white" 
                          : "bg-[#181B2C] border-white/10 text-zinc-400 hover:text-white"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Truck size={16} className={deliveryMethod === 'courier' ? "text-[#CFFF5E]" : "text-zinc-400"} />
                        <span className="text-[10px] font-mono font-bold">{subtotal >= 50 ? 'FREE' : 'RM8.00'}</span>
                      </div>
                      <span className="font-extrabold text-xs block text-white">Kurier Pos Laju / J&T</span>
                      <span className="text-[10.5px] text-zinc-400 block leading-tight">Balutan 3 lapis bubble wrap</span>
                    </button>

                    <button
                      onClick={() => setDeliveryMethod('bus_tbs')}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all cursor-pointer",
                        deliveryMethod === 'bus_tbs' 
                          ? "bg-[#00F0FF]/15 border-[#00F0FF] text-white" 
                          : "bg-[#181B2C] border-white/10 text-zinc-400 hover:text-white"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Package size={16} className={deliveryMethod === 'bus_tbs' ? "text-[#00F0FF]" : "text-zinc-400"} />
                        <span className="text-[10px] font-mono font-bold">RM15.00</span>
                      </div>
                      <span className="font-extrabold text-xs block text-white">Konsainan Bas TBS</span>
                      <span className="text-[10.5px] text-zinc-400 block leading-tight">Sama hari / semalaman</span>
                    </button>

                    <button
                      onClick={() => setDeliveryMethod('pickup')}
                      className={cn(
                        "p-3 rounded-2xl border text-left transition-all cursor-pointer",
                        deliveryMethod === 'pickup' 
                          ? "bg-[#FFC107]/15 border-[#FFC107] text-white" 
                          : "bg-[#181B2C] border-white/10 text-zinc-400 hover:text-white"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Building size={16} className={deliveryMethod === 'pickup' ? "text-[#FFC107]" : "text-zinc-400"} />
                        <span className="text-[10px] font-mono font-bold text-emerald-400">PERCUMA</span>
                      </div>
                      <span className="font-extrabold text-xs block text-white">Ambil Di Gerai</span>
                      <span className="text-[10.5px] text-zinc-400 block leading-tight">Toppen JB / Pasar Karat</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Destination Input */}
                {deliveryMethod === 'courier' && (
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Alamat Penuh Penghantaran *</label>
                    <textarea
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Masukkan nombor rumah, jalan, poskod, dan bandar..."
                      className="w-full bg-[#181B2C] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-[#CFFF5E]"
                    />
                  </div>
                )}

                {deliveryMethod === 'bus_tbs' && (
                  <div className="p-3.5 rounded-2xl bg-[#181B2C] border border-white/10 space-y-2">
                    <label className="text-xs font-bold text-white block">Pilih Terminal Bas Pungutan (Lejar Bas TBS):</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => setBusDestination('MBKT_KUALA_TERENGGANU')}
                        className={cn(
                          "p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer",
                          busDestination === 'MBKT_KUALA_TERENGGANU'
                            ? "bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]"
                            : "bg-black/30 border-white/5 text-zinc-400 hover:text-white"
                        )}
                      >
                        📍 Terminal MBKT Kuala Terengganu (Kak Siti)
                      </button>
                      <button
                        onClick={() => setBusDestination('TOPPEN_LARKIN_JB')}
                        className={cn(
                          "p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer",
                          busDestination === 'TOPPEN_LARKIN_JB'
                            ? "bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]"
                            : "bg-black/30 border-white/5 text-zinc-400 hover:text-white"
                        )}
                      >
                        📍 Terminal Larkin / Gerai Toppen JB (Wan)
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 block">Kaedah Pembayaran Pilihan *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'duitnow', label: 'DuitNow QR', icon: QrCode, sub: 'Imbas Segera' },
                      { id: 'whatsapp', label: 'WhatsApp HQ', icon: MessageCircle, sub: 'Pesan Terus' },
                      { id: 'fpx', label: 'Online Banking', icon: CreditCard, sub: 'Maybank/CIMB' },
                      { id: 'cod', label: 'Tunai di Gerai', icon: Banknote, sub: 'Waktu Ambil' },
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={cn(
                          "p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1",
                          paymentMethod === p.id 
                            ? "bg-[#CFFF5E]/15 border-[#CFFF5E] text-white" 
                            : "bg-[#181B2C] border-white/10 text-zinc-400 hover:text-white"
                        )}
                      >
                        <p.icon size={18} className={paymentMethod === p.id ? "text-[#CFFF5E]" : "text-zinc-400"} />
                        <span className="font-extrabold text-xs block mt-1">{p.label}</span>
                        <span className="text-[9.5px] text-zinc-500 font-medium">{p.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive DuitNow QR Preview Box */}
                {paymentMethod === 'duitnow' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17192A] to-[#1D1F34] border border-[#FF4757]/30 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                      {/* DuitNow QR Simulator Graphic */}
                      <div className="w-full h-full border-2 border-red-600 rounded-lg flex flex-col items-center justify-center p-1 bg-white">
                        <span className="text-[7.5px] font-black text-red-600 uppercase">DuitNow</span>
                        <QrCode size={44} className="text-black my-0.5" />
                        <span className="text-[6.5px] font-mono text-zinc-600 font-bold">ABANG COLEK</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-center sm:text-left flex-1">
                      <span className="text-[10px] font-black uppercase text-[#FF4757] tracking-wider">Akaun DuitNow Rasmi:</span>
                      <p className="text-white font-extrabold text-xs">ABANG COLEK ENTERPRISE (MBKT/JB)</p>
                      <p className="text-zinc-400 text-xs font-mono">No. Akaun / ID: 019-2837465 / AC-DUITNOW-HQ</p>
                      <p className="text-[11px] text-zinc-400">
                        Imbas kod QR di atas menggunakan aplikasi bank anda dan masukkan jumlah <span className="text-[#CFFF5E] font-bold">RM{totalAmount.toFixed(2)}</span>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-[#181B2C] border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Subtotal Produk ({cartItemCount} item):</span>
                    <span className="font-mono text-white">RM{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Caj Penghantaran ({deliveryMethod.toUpperCase()}):</span>
                    <span className="font-mono text-[#00F0FF]">
                      {shippingFee === 0 ? 'PERCUMA' : `RM${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-black text-white">
                    <span>Jumlah Perlu Dibayar:</span>
                    <span className="text-xl font-mono text-[#CFFF5E]">RM{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Final Submit & WhatsApp Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/60192837465?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>Hantar Ke WhatsApp HQ</span>
                  </a>

                  <button
                    onClick={handleCompleteOrder}
                    disabled={isSubmittingOrder}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black text-xs font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(207,255,94,0.3)] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingOrder ? (
                      <span>Menghantar Pesanan...</span>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Sahkan Pesanan Rasmi (RM{totalAmount.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order Complete & Receipt Modal */}
      <AnimatePresence>
        {completedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCompletedOrder(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94%] max-w-lg rounded-3xl bg-[#141624] border border-[#CFFF5E]/40 shadow-2xl p-6 sm:p-7 space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#CFFF5E]/20 text-[#CFFF5E] border border-[#CFFF5E]/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-white">Pesanan Berjaya Didaftarkan!</h3>
                <p className="text-xs text-zinc-400">
                  Resit rasmi digital telah dijana dan dihantar secara langsung ke lejar operasi Supabase & HQ Abang Colek.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="p-4 rounded-2xl bg-[#181B2C] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-zinc-400">ID Pesanan:</span>
                  <span className="text-[#CFFF5E] font-bold">{completedOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Pelanggan:</span>
                  <span className="text-white font-bold">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Telefon:</span>
                  <span className="text-zinc-300">{completedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Kaedah:</span>
                  <span className="text-white uppercase">{completedOrder.deliveryMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Tarikh:</span>
                  <span className="text-zinc-300">{completedOrder.date}</span>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <span className="text-zinc-400 text-[10px] block">Item Dipesan:</span>
                  {completedOrder.items.map((it: CartItem, i: number) => (
                    <div key={i} className="flex justify-between text-zinc-300 text-[11px]">
                      <span>{it.product.name} (x{it.quantity})</span>
                      <span>RM{(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-black text-white">
                  <span>Jumlah Bersih:</span>
                  <span className="text-[#CFFF5E]">RM{completedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download size={14} />
                  <span>Cetak Resit</span>
                </button>

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    if (onNavigateTab) onNavigateTab('orders');
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <span>Lihat Di Hab Pesanan</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

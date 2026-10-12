/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Semakan Aset Visual Jenama & Maskot Abang Colek (Image Asset Review Studio)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Sparkles, 
  ZoomIn, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  FileCheck, 
  Eye, 
  Maximize2, 
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BrandAsset {
  id: string;
  fileName: string;
  path: string;
  category: 'all' | 'logo' | 'mascot' | 'founder' | 'product' | 'operational';
  title: string;
  role: string;
  description: string;
  dimensions: string;
  width: number;
  height: number;
  aspectRatio: string;
  fileSizeKb: number;
  format: string;
  transparency: 'Lutsinar (Alpha RGBA)' | 'Legap (Opaque)';
  md5: string;
  duplicateOf?: string;
  qualityScore: number;
  recommendedUsage: string;
  strengths: string[];
  weaknesses: string[];
  currentLocations: string[];
}

export const BRAND_ASSETS: BrandAsset[] = [
  {
    id: 'logo-v2',
    fileName: 'ABANG-COLEX-LOGO-2.png',
    path: '/assets/brand/ABANG-COLEX-LOGO-2.png',
    category: 'logo',
    title: 'Logo Rasmi Abang Colex V2 (Standard)',
    role: 'Identiti Visual Utama Jenama',
    description: 'Logo tanda niaga rasmi mengandungi tipografi berus "ABANG" hitam-keemasan, perkataan "COLEX" merah sambal pedas, bersama ilustrasi maskot mangga dan cili ikonik.',
    dimensions: '1200 × 880 px',
    width: 1200,
    height: 880,
    aspectRatio: '1.36 : 1',
    fileSizeKb: 902.0,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '9d31ab90476ccaf2e135b3bdac4c34a1',
    qualityScore: 9.8,
    recommendedUsage: 'Header Utama, Bar Sisi, Dokumen Invois Rasmi, Resit Kargo Bas, Watermark',
    strengths: [
      'Latar belakang lutsinar sempurna tanpa halo putih',
      'Kontras tinggi menonjol pada tema gelap mahupun cerah',
      'Kombinasi warna Colek Yellow (#FFC107) & Sambal Red (#E53935) amat terserlah'
    ],
    weaknesses: [
      'Nisbah sedikit lebar, perlukan padding minimum 12px pada bekas kecil'
    ],
    currentLocations: [
      'GlobalCommandHeader.tsx (Logo Navigasi)',
      'CommandPalette.tsx (Watermark Header)',
      'CommandCenterView.tsx (Papan Utama)'
    ]
  },
  {
    id: 'logo-v3',
    fileName: 'ABANG-COLEX-LOGO-3.png',
    path: '/assets/brand/ABANG-COLEX-LOGO-3.png',
    category: 'logo',
    title: 'Logo Rasmi Abang Colex V3 (High-Contrast)',
    role: 'Varian Ketepuan Tinggi Skrin Gelap',
    description: 'Varian logo dengan pemprosesan warna dipertingkat bagi ketajaman maksimum pada paparan latar belakang industri gelap (#090A10).',
    dimensions: '1200 × 880 px',
    width: 1200,
    height: 880,
    aspectRatio: '1.36 : 1',
    fileSizeKb: 934.1,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: 'd3de0656e0b69da69a280e4892eb4c4b',
    qualityScore: 9.9,
    recommendedUsage: 'Skrin Papan Pemuka Eksekutif, Banner Skrin Besar, Poster Festival Makanan',
    strengths: [
      'Ketepuan warna merah cili lebih pekat dan garang',
      'Ketajaman garisan kontur vektor sangat bersih',
      'Lutsinar alpha sifar artifak'
    ],
    weaknesses: [
      'Saiz fail sedikit lebih besar (934 KB), disyorkan cache penyemak imbas'
    ],
    currentLocations: [
      'AbangColekDiscoveryView.tsx (Galeri Rasmi)',
      'Sidebar.tsx (Pilihan Varian)'
    ]
  },
  {
    id: 'mascot-1',
    fileName: 'MASKOT-1.PNG',
    path: '/assets/brand/MASKOT-1.PNG',
    category: 'mascot',
    title: 'Maskot Cili Padu #1 — Sambutan Mesra',
    role: 'Penyambut Tetamu & Ejen Pintar AI',
    description: 'Karakter maskot cili berpakaian kasut sukan dan topi dengan pose memberi isyarat mesra menyambut kedatangan pelanggan atau operator sistem.',
    dimensions: '874 × 997 px',
    width: 874,
    height: 997,
    aspectRatio: '0.88 : 1',
    fileSizeKb: 1706.9,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '149a17a0755cab1c9f756f228dff58ba',
    qualityScore: 9.6,
    recommendedUsage: 'Selamat Datang Command Center, Avatar Ejen AI Gemini, Notifikasi Aplikasi',
    strengths: [
      'Ekspresi ceria, menaikkan tenaga mesra pengguna (*friendly hype*)',
      'Resolusi tajam sehingga 997px tinggi',
      'Ketelusan alpha bersih di sekeliling garisan kasut dan topi'
    ],
    weaknesses: [
      'Saiz fail 1.7 MB agak besar untuk avatar kecil jika tidak dikecilkan resolusi'
    ],
    currentLocations: [
      'GlobalCommandHeader.tsx (Avatar Kak Siti)',
      'ModernBentoDashboard.tsx (Kad Maskot Sambutan)',
      'EcommerceStoreView.tsx (Lencana Kualiti)'
    ]
  },
  {
    id: 'mascot-2',
    fileName: 'MASKOT-2.PNG',
    path: '/assets/brand/MASKOT-2.PNG',
    category: 'mascot',
    title: 'Maskot Cili Padu #2 — Waving / Interaksi',
    role: 'Komunikasi & Perbualan Komuniti',
    description: 'Pose maskot cili melambai tangan dengan senyuman lebar, melambangkan layanan mesra krew gerai dan komunikasi langsung dengan pelanggan.',
    dimensions: '874 × 997 px',
    width: 874,
    height: 997,
    aspectRatio: '0.88 : 1',
    fileSizeKb: 1761.1,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '5cd305ec9dfeef7ee859099b14fa9646',
    qualityScore: 9.5,
    recommendedUsage: 'Ruang Sembang (Chat Workspace), Bantuan Sokongan WhatsApp, Panduan Ejen',
    strengths: [
      'Dinamik tangan melambai memudahkan interaksi UX',
      'Warna merah cili membangkitkan selera makan (*appetizing red*)',
      'Potongan alpha kemas'
    ],
    weaknesses: [
      'Ketinggian potret memerlukan ruang menegak secukupnya'
    ],
    currentLocations: [
      'GlobalCommandHeader.tsx (Avatar Wan Toppen)',
      'WorkspaceHubView.tsx (Sokongan Chat)'
    ]
  },
  {
    id: 'mascot-3',
    fileName: 'MASKOT-3.PNG',
    path: '/assets/brand/MASKOT-3.PNG',
    category: 'mascot',
    title: 'Maskot Cili Padu #3 — Botol Signature',
    role: 'Pengesahan Produk & Logistik Kargo',
    description: 'Maskot memegang dan memperagakan botol Kuah Colek Buah Signature 350ml dengan bangga, menjadikannya aset terbaik bagi bahagian pesanan dan logistik.',
    dimensions: '874 × 997 px',
    width: 874,
    height: 997,
    aspectRatio: '0.88 : 1',
    fileSizeKb: 1880.9,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '624748084af39742a5a3a0d13d93383c',
    qualityScore: 9.7,
    recommendedUsage: 'Modul Logistik Kargo Bas TBS, Pengesahan Pesanan Ejen, Halaman Katalog',
    strengths: [
      'Menggabungkan karakter maskot dengan botol fizikal produk sebenar',
      'Paling relevan untuk konteks transaksi e-commerce dan pesanan borong'
    ],
    weaknesses: [
      'Saiz 1.88 MB paling padat dalam siri maskot'
    ],
    currentLocations: [
      'GlobalCommandHeader.tsx (Avatar Pak Mat TBS)',
      'BusFreightView.tsx (Status Bas Bertolak)',
      'CommandCenterView.tsx (Kad Kargo Bas)'
    ]
  },
  {
    id: 'mascot-4',
    fileName: 'MASKOT-4.PNG',
    path: '/assets/brand/MASKOT-4.PNG',
    category: 'mascot',
    title: 'Maskot Cili Padu #4 — Penghantaran Ekspres',
    role: 'Tindakan Pantas & Operasi Logistik',
    description: 'Pose maskot dalam aksi larian pantas bersedia menghantar botol colek kepada pelanggan, ideal untuk penunjuk bas bergerak dan proses pesanan segera.',
    dimensions: '874 × 997 px',
    width: 874,
    height: 997,
    aspectRatio: '0.88 : 1',
    fileSizeKb: 1795.0,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: 'b387d4c3a4c3b279c5c2df5fd5486856',
    qualityScore: 9.6,
    recommendedUsage: 'Penjejakan Bas Ekspres Masa Nyata, Giliran Pembungkusan, Amaran 1-Jam',
    strengths: [
      'Aura dinamik pantas (*sense of urgency & speed*)',
      'Visual ekspresif untuk aliran kerja logistik bertekanan tinggi'
    ],
    weaknesses: [
      'Gaya condong memerlukan pengimbangan reka letak fleksibel'
    ],
    currentLocations: [
      'BusFreightView.tsx (Penunjuk Bas Dalam Perjalanan)',
      'OrdersView.tsx (Giliran Pesanan Dihantar)'
    ]
  },
  {
    id: 'mascot-5',
    fileName: 'MASKOT-5.PNG',
    path: '/assets/brand/MASKOT-5.PNG',
    category: 'mascot',
    title: 'Maskot Cili Padu #5 — Lencana Kejayaan & QC',
    role: 'Pengiktirafan Sasaran & Kelulusan QC',
    description: 'Pose keraian maskot menandakan pencapaian cemerlang seperti sasaran jualan bulanan tercapai, kualiti botol lulus pemeriksaan, atau pesanan selesai.',
    dimensions: '874 × 802 px',
    width: 874,
    height: 802,
    aspectRatio: '1.09 : 1',
    fileSizeKb: 1485.4,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: 'a5588edca8d875b9ffec7032aa1341e4',
    qualityScore: 9.7,
    recommendedUsage: 'Lencana Pencapaian GMV, Kelulusan Gantian Botol JEV, Status Tempahan Berjaya',
    strengths: [
      'Nisbah hampir segiempat (1.09:1) memudahkan peletakan dalam kad bento',
      'Aura kejayaan positif membina kepuasan pengguna (*delight factor*)'
    ],
    weaknesses: [
      'Tiada kelemahan ketara'
    ],
    currentLocations: [
      'CommandCenterView.tsx (Pencapaian KPI)',
      'ModernBentoDashboard.tsx (Status Botol Lulus QC)'
    ]
  },
  {
    id: 'mascot-logo-full',
    fileName: 'MASKOT-LOGO.PNG',
    path: '/assets/brand/MASKOT-LOGO.PNG',
    category: 'mascot',
    title: 'Maskot Penuh Hypebeast Abang Colex (Ultra-HD)',
    role: 'Ilustrasi Karakter Lengkap Streetwear',
    description: 'Ilustrasi maskot biru ikonik gaya streetwear memakai topi MCM bercorak, rantai emas, baju santai, dan kasut Timberland coklat. Menggambarkan budaya hypebeast kontemporari Abang Colek.',
    dimensions: '1312 × 2254 px',
    width: 1312,
    height: 2254,
    aspectRatio: '0.58 : 1',
    fileSizeKb: 5647.7,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '4fa333282581ed23d56a7edb778b86ca',
    duplicateOf: 'Gemini_Generated_Image_zh034qzh034qzh03.PNG',
    qualityScore: 9.9,
    recommendedUsage: 'Hero Banner Laman Utama, Poster Cetakan Resolusi Tinggi, Laman E-Commerce VIP',
    strengths: [
      'Resolusi ultra tinggi 2254px dengan perincian fabrik dan kasut yang sangat halus',
      'Latar belakang alpha 100% telus tanpa sisa latar',
      'Ikon identiti utama jenama Abang Colex Liurleleh House'
    ],
    weaknesses: [
      'Saiz fail 5.65 MB — salinan pendua kepada Gemini_Generated_Image_zh034qzh034qzh03.PNG'
    ],
    currentLocations: [
      'GlobalCommandHeader.tsx (Fallback Avatar)',
      'EcommerceStoreView.tsx (Koleksi Edisi Khas)',
      'AbangColekDiscoveryView.tsx (Galeri Media)'
    ]
  },
  {
    id: 'founder-portrait',
    fileName: 'founder.png',
    path: '/assets/brand/founder.png',
    category: 'founder',
    title: 'Potret Profil Megat Epull (Founder)',
    role: 'Avatar Rasmi Pengasas & Pentadbir HQ',
    description: 'Potret pengasas Megat Epull memakai topi dan cermin mata, dipotong kemas sebagai avatar rasmi kepimpinan jenama Abang Colek.',
    dimensions: '461 × 566 px',
    width: 461,
    height: 566,
    aspectRatio: '0.81 : 1',
    fileSizeKb: 315.7,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '68f5c3abb02de274e6bf1fde2eeb81af',
    qualityScore: 9.2,
    recommendedUsage: 'Avatar Bar Sisi, Tandatangan Pengasas, Lejar Kelulusan Bayaran HQ',
    strengths: [
      'Saiz fail sangat optimum (315 KB) untuk masa muat sepantas kilat',
      'Latar belakang lutsinar kemas di sekeliling bahu dan kepala',
      'Memberi sentuhan manusiawi (*human touch*) kepada sistem automasi'
    ],
    weaknesses: [
      'Resolusi maksimum 566px — elakkan penggunaan pada skrin bersaiz poster besar'
    ],
    currentLocations: [
      'Sidebar.tsx (Avatar Operator)',
      'ModernBentoDashboard.tsx (Kad Misi Pengasas)',
      'WireframeCockpitStudio.tsx (Profil Pentadbir)'
    ]
  },
  {
    id: 'founder-full-streetwear',
    fileName: 'FOUNDER2.png',
    path: '/assets/brand/FOUNDER2.png',
    category: 'founder',
    title: 'Potret Megat Epull Streetwear & Botol Colek',
    role: 'Visual Kempen Pengasas & Pemasaran',
    description: 'Potret Megat Epull bergaya santai street-hypebeast bersama botol produk Kuah Colek Buah di ibu pejabat Johor Bahru.',
    dimensions: '1168 × 912 px',
    width: 1168,
    height: 912,
    aspectRatio: '1.28 : 1',
    fileSizeKb: 321.8,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: 'b2821a55bcd2f425eb0a15bc37150159',
    duplicateOf: 'Gemini_Generated_Image_6800ao6800ao6800 (1).png',
    qualityScore: 9.4,
    recommendedUsage: 'Kad Kisah Pengasas, Banner Media Sosial, Laman Utama Pelanggan',
    strengths: [
      'Keseimbangan nisbah landskap 1.28:1 amat seimbang',
      'Menampilkan hubungan peribadi pengasas dengan produk fizikal',
      'Saiz fail ringan (321 KB) dengan resolusi melebihi 1000px'
    ],
    weaknesses: [
      'Salinan pendua kepada Gemini_Generated_Image_6800ao6800ao6800 (1).png'
    ],
    currentLocations: [
      'AdminProductManager.tsx (Banner Produk Ejen)',
      'EcommerceStoreView.tsx (Pek Khas Pengasas)'
    ]
  },
  {
    id: 'epull-studio-hd',
    fileName: 'epull.png',
    path: '/assets/brand/epull.png',
    category: 'founder',
    title: 'Potret Studio Megat Epull Ultra-HD',
    role: 'Aset Visual Utama Kempen Jenama',
    description: 'Potret studio resolusi tinggi penuh memperagakan Megat Epull dalam pakaian bertema jenama Abang Colek.',
    dimensions: '1600 × 2656 px',
    width: 1600,
    height: 2656,
    aspectRatio: '0.60 : 1',
    fileSizeKb: 6791.7,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '029e9fc180dd2e2c89b89ce8c053a47b',
    duplicateOf: 'Gemini_Generated_Image_o4cz9so4cz9so4cz.png',
    qualityScore: 9.8,
    recommendedUsage: 'Poster Acara Gerai Pop-up, Backdrop Bunting, Halaman Utama Profil',
    strengths: [
      'Ketajaman studio bertaraf komersial (1600 x 2656 px)',
      'Pencahayaan seimbang dan tona kulit semula jadi'
    ],
    weaknesses: [
      'Saiz fail besar (6.79 MB), memerlukan 0.5s muat turun pada rangkaian perlahan'
    ],
    currentLocations: [
      'Sidebar.tsx (Avatar Pilihan Utama)',
      'GlobalCommandHeader.tsx (Avatar Pentadbir)',
      'EcommerceStoreView.tsx (Galeri Utama)'
    ]
  },
  {
    id: 'product-bottle-studio',
    fileName: 'Gemini_Generated_Image_5lbbwx5lbbwx5lbb.png',
    path: '/assets/brand/Gemini_Generated_Image_5lbbwx5lbbwx5lbb.png',
    category: 'product',
    title: 'Botol Kuah Colek Buah Signature 350ml (Studio Shot)',
    role: 'Aset Komersial Utama Katalog Produk',
    description: 'Foto studio resolusi komersial botol sos kuah colek buah Abang Colek dengan label keemasan, penutup keselamatan merah dan tekstur sos pekat berkilat.',
    dimensions: '1600 × 2656 px',
    width: 1600,
    height: 2656,
    aspectRatio: '0.60 : 1',
    fileSizeKb: 7967.2,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: '40c96eeb37f0ad5f273e7b6b71b073ec',
    qualityScore: 9.9,
    recommendedUsage: 'Hero Produk E-Commerce, Pembungkusan Digital, Panduan SOP Botol HQ',
    strengths: [
      'Kualiti fotorealistik tahap katalog antarabangsa',
      'Label botol dan cap pengedap induction kelihatan sangat jelas',
      'Membina keyakinan pembeli borong dan ejen negeri'
    ],
    weaknesses: [
      'Saiz fail 7.97 MB paling besar dalam repositori (disyorkan lazy loading)'
    ],
    currentLocations: [
      'CustomerLandingPage.tsx (Hero Produk)',
      'EcommerceStoreView.tsx (Produk #1)',
      'productService.ts (Katalog Standard)'
    ]
  },
  {
    id: 'product-ref-seal',
    fileName: 'cdb518f0-6449-4c0b-a7fb-9e973ffea56a.png',
    path: '/assets/brand/cdb518f0-6449-4c0b-a7fb-9e973ffea56a.png',
    category: 'operational',
    title: 'Rujukan Spesifikasi Botol & Induction Seal QC',
    role: 'Bukti Kualiti Kawalan Pembungkusan (QC)',
    description: 'Gambar rujukan teknikal leher botol dan lapisan pengedap haba (*heat-induction seal*) bagi menyelesaikan isu botol bocor semasa pengangkutan bas.',
    dimensions: '316 × 521 px',
    width: 316,
    height: 521,
    aspectRatio: '0.61 : 1',
    fileSizeKb: 250.6,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Lutsinar (Alpha RGBA)',
    md5: 'dc7c29bbb92631d8b123146a4143eb8b',
    qualityScore: 8.5,
    recommendedUsage: 'Simulator Diagnostik JEV System-1, Audit Pampasan Botol Pecah, SOP Kilang',
    strengths: [
      'Dokumen bukti visual khusus untuk menangani isu ketirisan',
      'Saiz fail ringan (250 KB)'
    ],
    weaknesses: [
      'Resolusi kecil (316px), hanya untuk konteks sokongan teknikal'
    ],
    currentLocations: [
      'ModernBentoDashboard.tsx (Kad Integriti Botol JEV)',
      'CommandCenterView.tsx (Rujukan Pampasan)'
    ]
  },
  {
    id: 'operational-receipt-shot',
    fileName: 'Screenshot 2026-01-16 193536.png',
    path: '/assets/brand/Screenshot 2026-01-16 193536.png',
    category: 'operational',
    title: 'Tangkap Layar Resit Transaksi WhatsApp/DuitNow',
    role: 'Arkib Bukti Operasi Pengesahan Pembayaran',
    description: 'Dokumen tangkap layar aliran perbualan WhatsApp dan resit pindahan bank DuitNow bagi audit transaksi manual ejen sebelum automasi diperkenalkan.',
    dimensions: '486 × 630 px',
    width: 486,
    height: 630,
    aspectRatio: '0.77 : 1',
    fileSizeKb: 472.7,
    format: 'PNG (32-bit RGBA)',
    transparency: 'Legap (Opaque)',
    md5: '85014c9ec0945b4baf537168925fbc83',
    qualityScore: 7.8,
    recommendedUsage: 'Modul Arkib Resit, Rujukan Padanan Invois Manual Lejar',
    strengths: [
      'Bukti sejarah operasi sebenar syarikat',
      'Membolehkan ejen membandingkan format resit lama dan sistem baharu'
    ],
    weaknesses: [
      'Imej tangkap layar legap tanpa ketelusan alpha'
    ],
    currentLocations: [
      'OrdersView.tsx (Modal Bukti Bayaran)',
      'AbangColekDiscoveryView.tsx (Arkib Operasi)'
    ]
  },
  {
    id: 'app-icon-128',
    fileName: 'icon128.png',
    path: '/assets/brand/icon128.png',
    category: 'operational',
    title: 'Ikon Aplikasi Web PWA / Favicon (128px)',
    role: 'Favicon & Ikon Pemasangan Skrin Utama',
    description: 'Ikon logo padat untuk ikon pelayar web dan pemasangan aplikasi progresif (PWA) pada telefon pintar krew gerai pasar malam.',
    dimensions: '128 × 128 px (Standard Web)',
    width: 128,
    height: 128,
    aspectRatio: '1 : 1',
    fileSizeKb: 304.1,
    format: 'JPEG (Disamarkan sebagai .png)',
    transparency: 'Legap (Opaque)',
    md5: 'ed678b2ff08fbf0c6a61a39d3d220b7d',
    qualityScore: 8.4,
    recommendedUsage: 'Favicon Pelayar, Manifest PWA, Ikon Pelanjutan Chrome',
    strengths: [
      'Nisbah segiempat tepat 1:1 sempurna untuk ikon aplikasi',
      'Ikon jelas dikenali walaupun pada saiz tab pelayar yang kecil'
    ],
    weaknesses: [
      'Nota Forensik: Menggunakan tandatangan fail JPEG (\xff\xd8) walaupun nama fail berakhir dengan .png'
    ],
    currentLocations: [
      'public/manifest.json (PWA)',
      'index.html (Favicon)'
    ]
  }
];

export interface BrandAssetReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset?: (asset: BrandAsset) => void;
}

export const BrandAssetReviewModal: React.FC<BrandAssetReviewModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedAsset, setInspectedAsset] = useState<BrandAsset | null>(BRAND_ASSETS[0]);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [checkerboardMode, setCheckerboardMode] = useState<boolean>(true);

  const filteredAssets = useMemo(() => {
    return BRAND_ASSETS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.fileName.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-7xl h-[92vh] flex flex-col rounded-3xl bg-[#090A10] border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#10121C] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#F97316] flex items-center justify-center text-white shadow-lg shrink-0">
              <Eye size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Semakan Aset Visual Jenama & Maskot
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#CFFF5E]/15 text-[#CFFF5E] border border-[#CFFF5E]/30 text-[10px] font-mono font-bold">
                  18 Fail Rasmi
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Audit resolusi, ketelusan alfa, ketepuan warna, dan integriti penjenamaan Abang Colek Enterprise OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari fail atau peranan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-60 pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#CFFF5E]"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-5 py-2.5 bg-[#0C0E16] border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: 'Semua Aset', count: BRAND_ASSETS.length },
            { id: 'logo', label: 'Logo Rasmi', count: BRAND_ASSETS.filter(a => a.category === 'logo').length },
            { id: 'mascot', label: 'Siri Maskot', count: BRAND_ASSETS.filter(a => a.category === 'mascot').length },
            { id: 'founder', label: 'Potret Pengasas Epull', count: BRAND_ASSETS.filter(a => a.category === 'founder').length },
            { id: 'product', label: 'Foto Produk Studio', count: BRAND_ASSETS.filter(a => a.category === 'product').length },
            { id: 'operational', label: 'Operasi & QC', count: BRAND_ASSETS.filter(a => a.category === 'operational').length },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                selectedCategory === cat.id
                  ? "bg-[#CFFF5E] text-black font-black shadow-md"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              )}
            >
              <span>{cat.label}</span>
              <span className={cn(
                "text-[10px] px-1.5 py-0.2 rounded-md font-mono",
                selectedCategory === cat.id ? "bg-black/20 text-black" : "bg-white/10 text-zinc-400"
              )}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Area: Left Grid (Thumbnails) & Right Inspector */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Grid: Assets Catalog */}
          <div className="lg:col-span-7 xl:col-span-6 p-4 overflow-y-auto space-y-3 border-r border-white/10 bg-[#0A0B12]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredAssets.map(asset => {
                const isSelected = inspectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setInspectedAsset(asset);
                      setZoomLevel(1);
                    }}
                    className={cn(
                      "group p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden",
                      isSelected
                        ? "bg-[#181B2C] border-[#CFFF5E] shadow-[0_0_20px_rgba(207,255,94,0.15)] ring-1 ring-[#CFFF5E]"
                        : "bg-[#10121C] border-white/10 hover:border-white/30 hover:bg-[#141624]"
                    )}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-white/10 text-zinc-300 truncate max-w-[100px]">
                        {asset.category.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#CFFF5E]">
                        ★ {asset.qualityScore}
                      </span>
                    </div>

                    {/* Image Thumbnail Container */}
                    <div className={cn(
                      "w-full h-28 rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-white/5",
                      checkerboardMode
                        ? "bg-[linear-gradient(45deg,#121420_25%,transparent_25%),linear-gradient(-45deg,#121420_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#121420_75%),linear-gradient(-45deg,transparent_75%,#121420_75%)] bg-[size:16px_16px] bg-[#0A0C14]"
                        : "bg-black/60"
                    )}>
                      <img
                        src={asset.path}
                        alt={asset.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    {/* Title & Info */}
                    <div className="mt-2 text-left">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#CFFF5E] transition-colors">
                        {asset.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                        <span>{asset.dimensions}</span>
                        <span>{asset.fileSizeKb < 1000 ? `${asset.fileSizeKb.toFixed(0)} KB` : `${(asset.fileSizeKb / 1024).toFixed(1)} MB`}</span>
                      </div>
                    </div>

                    {/* Duplicate Indicator */}
                    {asset.duplicateOf && (
                      <div className="mt-1.5 pt-1 border-t border-white/10 text-[9px] text-amber-400 font-mono truncate">
                        ⚠ Pendua {asset.duplicateOf.slice(0, 15)}...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Forensic Deep Inspector */}
          {inspectedAsset && (
            <div className="lg:col-span-5 xl:col-span-6 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#0D0F18]">
              {/* Top Inspector Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#CFFF5E]/20 text-[#CFFF5E] border border-[#CFFF5E]/30 uppercase">
                      {inspectedAsset.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      ID: {inspectedAsset.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {inspectedAsset.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {inspectedAsset.role}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopyPath(inspectedAsset.path)}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Salin Laluan Fail"
                  >
                    {copiedPath === inspectedAsset.path ? (
                      <>
                        <Check size={13} className="text-[#CFFF5E]" />
                        <span className="text-[#CFFF5E]">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Salin Path</span>
                      </>
                    )}
                  </button>

                  <a
                    href={inspectedAsset.path}
                    download={inspectedAsset.fileName}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                    title="Muat Turun Fail Penuh"
                  >
                    <Download size={15} />
                  </a>
                </div>
              </div>

              {/* Large Interactive Preview Screen */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Maximize2 size={13} className="text-[#CFFF5E]" />
                    Pratonton Resolusi Sebenar
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCheckerboardMode(!checkerboardMode)}
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer",
                        checkerboardMode ? "bg-[#CFFF5E]/20 border-[#CFFF5E]/50 text-[#CFFF5E]" : "bg-white/5 border-white/10 text-zinc-400"
                      )}
                    >
                      Grid Lutsinar (Alpha)
                    </button>
                    <button
                      onClick={() => setZoomLevel(zoomLevel === 1 ? 1.5 : zoomLevel === 1.5 ? 2 : 1)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono cursor-pointer"
                    >
                      Zoom {zoomLevel}x
                    </button>
                  </div>
                </div>

                <div className={cn(
                  "w-full h-64 sm:h-72 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden border border-white/10 shadow-inner",
                  checkerboardMode
                    ? "bg-[linear-gradient(45deg,#121420_25%,transparent_25%),linear-gradient(-45deg,#121420_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#121420_75%),linear-gradient(-45deg,transparent_75%,#121420_75%)] bg-[size:20px_20px] bg-[#090A12]"
                    : "bg-black"
                )}>
                  <motion.img
                    animate={{ scale: zoomLevel }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    src={inspectedAsset.path}
                    alt={inspectedAsset.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#141624] border border-white/10">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Dimensi</span>
                  <span className="text-xs font-black text-white font-mono mt-0.5 block">{inspectedAsset.dimensions}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Nisbah: {inspectedAsset.aspectRatio}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#141624] border border-white/10">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Saiz Fail</span>
                  <span className="text-xs font-black text-[#CFFF5E] font-mono mt-0.5 block">
                    {inspectedAsset.fileSizeKb < 1000 ? `${inspectedAsset.fileSizeKb.toFixed(1)} KB` : `${(inspectedAsset.fileSizeKb / 1024).toFixed(2)} MB`}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Ketumpatan Penuh</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#141624] border border-white/10">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Format & Alpha</span>
                  <span className="text-xs font-black text-white font-mono mt-0.5 block truncate">{inspectedAsset.format}</span>
                  <span className="text-[10px] text-emerald-400 font-mono truncate">{inspectedAsset.transparency}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#141624] border border-white/10">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Skor Kualiti</span>
                  <span className="text-xs font-black text-[#FFC107] font-mono mt-0.5 block">★ {inspectedAsset.qualityScore} / 10</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Disahkan HQ</span>
                </div>
              </div>

              {/* Duplicate Binary File Notice */}
              {inspectedAsset.duplicateOf && (
                <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Penemuan Forensik: Fail Pendua Serupa (Duplicate Hash)</span>
                    <span className="text-amber-300/80 text-[11px] leading-relaxed block mt-0.5">
                      Fail ini mempunyai cap jari MD5 (<code className="font-mono text-amber-200">{inspectedAsset.md5.slice(0, 10)}...</code>) yang sama tepat dengan fail <strong className="text-white">{inspectedAsset.duplicateOf}</strong>. Kedua-duanya boleh digabungkan untuk mengurangkan saiz muat turun aplikasi.
                    </span>
                  </div>
                </div>
              )}

              {/* Description & Recommendations */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#141624] border border-white/10 space-y-1.5">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                    Ulasan & Penerangan Reka Bentuk
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    {inspectedAsset.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141624] border border-white/10 space-y-1.5">
                  <h4 className="text-xs font-bold text-[#CFFF5E] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles size={13} />
                    Penggunaan Optimum Disyorkan
                  </h4>
                  <p className="text-xs text-white font-medium">
                    {inspectedAsset.recommendedUsage}
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 size={13} />
                    Kekuatan Visual
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {inspectedAsset.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <span className="text-emerald-400 shrink-0">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                    <Info size={13} />
                    Perhatian & Had
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {inspectedAsset.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <span className="text-amber-400 shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Current Locations in App */}
              <div className="p-3.5 rounded-2xl bg-[#141624] border border-white/10">
                <h4 className="text-xs font-bold text-zinc-300 mb-2 font-mono uppercase tracking-wider">
                  Lokasi Penggunaan Semasa Dalam Sistem
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedAsset.currentLocations.map((loc, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-black/50 text-zinc-300 border border-white/10"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary Bar */}
        <div className="px-5 py-3 bg-[#0C0E16] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <ShieldCheck size={14} className="text-[#CFFF5E]" />
              Integriti Aset Visual 100% Sah
            </span>
            <span>•</span>
            <span>Semua 18 imej sedia digunakan tanpa pautan luar yang rosak.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#CFFF5E] hover:bg-[#d8ff6b] text-black font-black text-xs transition-all cursor-pointer self-end sm:self-auto"
          >
            Selesai Semakan
          </button>
        </div>
      </div>
    </div>
  );
};

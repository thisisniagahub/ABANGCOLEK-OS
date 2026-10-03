/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  inventoryCount?: number;
}

export const INITIAL_PRODUCTS: ProductItem[] = [
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
    stockStatus: 'IN_STOCK',
    inventoryCount: 350
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
    stockStatus: 'IN_STOCK',
    inventoryCount: 120
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
    stockStatus: 'IN_STOCK',
    inventoryCount: 85
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
    minOrder: 1,
    inventoryCount: 40
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
    minOrder: 1,
    inventoryCount: 20
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
    stockStatus: 'IN_STOCK',
    inventoryCount: 160
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
    stockStatus: 'IN_STOCK',
    inventoryCount: 220
  }
];

const STORAGE_KEY = 'abangcolek_products_catalog_v2';

class ProductService {
  private products: ProductItem[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.products = this.loadFromStorage();
  }

  private loadFromStorage(): ProductItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read products from localStorage:', e);
    }
    return INITIAL_PRODUCTS;
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products));
    } catch (e) {
      console.warn('Could not write products to localStorage:', e);
    }
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- CRUD API ---

  // READ ALL
  public getProducts(): ProductItem[] {
    return [...this.products];
  }

  // READ ONE
  public getProductById(id: string): ProductItem | undefined {
    return this.products.find(p => p.id === id);
  }

  // CREATE
  public addProduct(item: Omit<ProductItem, 'id'>): ProductItem {
    const newId = `product-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newProduct: ProductItem = {
      ...item,
      id: newId,
      inventoryCount: item.inventoryCount ?? 100
    };
    this.products = [newProduct, ...this.products];
    this.saveToStorage();
    return newProduct;
  }

  // UPDATE
  public updateProduct(id: string, updates: Partial<ProductItem>): boolean {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.products[idx] = {
      ...this.products[idx],
      ...updates
    };
    this.saveToStorage();
    return true;
  }

  // DELETE
  public deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // RESET TO DEFAULTS
  public resetToDefaults() {
    this.products = [...INITIAL_PRODUCTS];
    this.saveToStorage();
  }
}

export const productService = new ProductService();

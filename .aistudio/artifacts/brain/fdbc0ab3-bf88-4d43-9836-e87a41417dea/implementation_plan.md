# Pelan Penambahbaikan Mobile-First: Abang Colek Enterprise OS

Pelan penstrukturan semula antara muka berfokuskan *Mobile-First & Touch Ergonomics* untuk Abang Colek Enterprise OS bagi membolehkan pengasas, pengurus hab, dan staf operasi mengurus pesanan, penghantaran bas TBS, dan tindakan kecemasan dengan lancar menggunakan telefon pintar satu tangan (one-handed thumb zone) tanpa mengorbankan keupayaan penuh paparan desktop.

## Keputusan Pengguna & Pengesahan Kritikal

> [!IMPORTANT]
> Berdasarkan keputusan pengguna dalam sesi temubual fasa pengesahan:

- **Fokus Utama Mobile-First**: Bar navigasi bawah (*Bottom Dock*) & Laci Operasi (*Action Drawer*) berasaskan gerak isyarat sentuh.
- **Gaya Navigasi Mobile**: Bar navigasi bawah dengan 4 tab operasi teras (Pusat Perintah, Pesanan, Bas TBS, Kedai) serta butang pembuka pantas Menu Penuh & Ejen AI.
- **Paparan Pesanan & Tugasan**: Kad ringkas berketumpatan optimum dengan butang tindakan pantas satu sentuhan (*One-Tap Action*) untuk meluluskan gantian, sahkan bayaran DuitNow QR, hubungi WhatsApp pelanggan, dan semakan konsainan.

---

## 1. Gambaran Keseluruhan & Konsep Teras

- **Tujuan Sistem**: Memastikan keseluruhan aliran kerja operasi Abang Colek — dari semakan stok sos colek, lejar pesanan pelanggan, status kargo bas ekspres TBS, hingga pengesahan botol gantian — dapat diakses dan diuruskan dengan pantas semasa staf bergerak di lapangan atau gudang menggunakan telefon pintar (viewport 375px – 430px).
- **Pengguna Sasaran**:
  - *Megat Epull (HQ & Pengasas)*: Memantau metrik jualan langsung, meluluskan gantian kes bocor, dan melihat status operasi semasa dalam perjalanan.
  - *Kak Siti (Hab Stokis Pantai Timur)*: Memeriksa bas tiba, menyemak DuitNow slip pelanggan, dan mengesahkan pesanan dari telefon bimbit.
  - *Pak Mat (Logistik Bas TBS)*: Mengemas kini status pelepasan bas dan waktu ketibaan anggaran (ETA) di terminal bas.
- **Nilai Utama**: Menghapuskan masalah butang kecil sukar ditekan pada skrin telefon, mengelakkan limpahan melintang (*horizontal overflow*), dan memastikan zon ibu jari (*natural thumb zone*) memegang kawalan paling kritikal dengan sasaran sentuh minimum $\ge 44 \times 44\text{px}$.

---

## 2. Pengalaman Pengguna & Reka Bentuk Visual (Mobile-First)

### A. Seni Bina Navigasi Mobile-First (Thumb-Zone & Bottom Dock)

```
┌─────────────────────────────────────────┐  ▲
│ [☰ Menu]  ABANGCOLEK™ [RM Live] [⚡ AI]  │  │ Hard Reach Zone (Top Header: ~52px)
├─────────────────────────────────────────┤  ▼
│ ── [ METRIK PANTAS 2x2 TABULAR ] ───────│  ▲
│  RM 1,280 Jualan  │  14 Pesanan         │  │
│  6 Bas TBS Aktif  │  420 Baki Botol     │  │ Stretch Zone (Paparan Data & Kandungan)
│ ─────────────────────────────────────── │  │
│ [NEEDS ATTENTION: KAD TINDAKAN PANTAS]  │  │
│  • Gantian Botol Bocor (AC-ORD-1023)    │  │
│    [Luluskan RM15]  [WhatsApp Pelanggan]│  │
│                                         │  │
│ [SENARAI PESANAN BERSIH / SATU SENTUHAN]│  ▼
├─────────────────────────────────────────┤  ▲
│ [Perintah]  [Pesanan]  [Bas TBS] [Kedai]│  │ Natural Thumb Zone (Bottom Dock: ~64px)
└─────────────────────────────────────────┘  ▼
```

1. **Top Bar Padat (Mobile Top Header)**:
   - Ketinggian kemas 52px dengan had lekat $\le 15\%$ daripada ketinggian skrin peranti (`max-h-[56px] sticky top-0`).
   - Butang laci menu sebelah kiri (`min-w-[44px] min-h-[44px]`), logo Abang Colek bersaiz jelas, metrik jualan hari ini ringkas, dan butang pantas Ejen AI.
2. **Fixed Bottom Dock (Bar Navigasi Bawah)**:
   - Tersemat kemas di bahagian bawah (`fixed bottom-0 z-40 bg-[#0C0E16]/95 backdrop-blur-xl border-t border-white/10 pb-safe`).
   - 4 tab utama bersaiz sentuhan selesa:
     1. **Kokpit (Command)**: Pusat Perintah utama & ringkasan operasi.
     2. **Pesanan (Orders)**: Lejar jualan dengan lencana bilangan pesanan belum selesai.
     3. **Bas TBS (Logistics)**: Konsainan bas ekspres & makluman zon 1-jam.
     4. **Kedai (Store)**: Katalog produk & tempahan borong.
     5. **Lain-lain (Menu Drawer)**: Membuka laci penuh untuk akses modul Google Workspace, hab jenama, audio, dan konsol sistem.
3. **Kad Tindakan Satu Sentuhan (One-Tap Action Cards)**:
   - Kad operasi berketumpatan tinggi dengan pemisah bersih (`border border-white/10 rounded-2xl p-3.5`).
   - Butang tindakan pantas bersaiz $\ge 44\text{px}$ tinggi:
     - Butang *Luluskan Gantian* satu klik.
     - Butang *Sahkan DuitNow* satu klik.
     - Butang *Hubungi WhatsApp* terus membuka pautan `wa.me` tanpa perlu salin nombor manual.
     - Butang *Tilik Butiran* membuka laci sentuh bawah (*bottom sheet drawer*) yang boleh ditarik atau ditutup dengan luncuran jari.

---

## 3. Keputusan Produk & Pertimbangan Reka Bentuk

- **Keputusan 1: Bottom Navigation Bar Berbanding Menu Atas Sahaja**:
  - *Pilihan*: Menggunakan bar navigasi bawah untuk 4 fungsi paling kerap diguna dan laci penuh untuk fungsi sekunder.
  - *Sebab*: 75% operasi telefon bimbit dilakukan menggunakan satu tangan (ibu jari). Memaksa pengguna menekan menu di penjuru atas skrin menyebabkan keletihan capai (*reach fatigue*).
- **Keputusan 2: Pengekalan Skala Penuh Desktop (Responsive Coexistence)**:
  - *Pilihan*: Pada skrin tablet & desktop (`md:` dan `lg:`), antaramuka mengekalkan bar sisi bertingkat pintar dan dok kokpit lebar sedia ada tanpa sebarang kehilangan ciri.
  - *Sebab*: Mematuhi prinsip asas *frontend-design*: antaramuka mobile-first mesti mengembang secara anggun ke resolusi 1440px multi-kolum dan bukan terperangkap dalam lajur telefon kecil di tengah skrin komputer.
- **Keputusan 3: Pengoptimuman Jadual Pesanan ke Mod Kad Mobile**:
  - *Pilihan*: Pada paparan skrin kecil (`<768px`), jadual pesanan dan senarai konsainan bertukar automatik kepada kad tindakan padat dengan butang tindakan jelas, manakala pada desktop bertukar kepada lejar komprehensif.
  - *Sebab*: Jadual lebar pada telefon pintar memerlukan tatalan mendatar yang menyukarkan staf membaca status pesanan dengan pantas.

---

## 4. Seni Bina Teknikal & Pelan Pelaksanaan

```
┌────────────────────────────────────────────────────────────────────────┐
│                          App.tsx (Root Layout)                         │
├──────────────────────────────────┬─────────────────────────────────────┤
│  Mobile Viewport (<768px)        │  Desktop Viewport (>=768px)         │
│  ─────────────────────────────── │  ────────────────────────────────── │
│  • Compact Top Bar (52px)        │  • Master Command Header            │
│  • Single-Column Fluid Content   │  • Multi-Column Bento / Grid Layout │
│  • Touch Action Cards & Sheets   │  • Smart Nested Sidebar             │
│  • Fixed Bottom Dock (64px)      │  • Floating Neo-Dock / Command Bar  │
│  • Slide-Up Bottom Sheet Drawer  │  • Sidecar Inspector Panels         │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### Langkah Pelaksanaan:

1. **Komponen Mobile Bottom Dock Baru (`MobileBottomNav.tsx`)**:
   - Membina komponen navigasi bawah khas telefon dengan 4 tab teras + butang buka menu penuh.
   - Mengintegrasikan penunjuk aktiviti masa nyata (bilangan pesanan belum diproses & bas belum sampai).
2. **Pengoptimuman Sentuhan & Saiz Minimum 44px (`CommandCenterView.tsx`)**:
   - Menyelaraskan grid metrik KPI kepada `grid-cols-2 sm:grid-cols-4` yang kemas pada telefon.
   - Mengoptimumkan kad *Needs Attention* dan butang tindakan satu sentuhan (*One-Tap actions*) supaya mesra ibu jari tanpa tatalan canggung.
3. **Pengoptimuman Kad Pesanan Mobile (`OrdersView.tsx`)**:
   - Menyediakan mod paparan kad sentuh pantas pada peranti mudah alih dengan butang WhatsApp, salin nombor tracking, dan pengesahan status segera.
4. **Penyelarasan Header & Kontrak Lejar Mobile (`GlobalCommandHeader.tsx` & `App.tsx`)**:
   - Memastikan bajet ketinggian elemen melekat tidak melebihi 15% skrin mobile (`pb-20` pada kontena kandungan utama supaya dok bawah tidak menutup data).
   - Pengesahan kompilasi dan pemeriksaan kualiti visual merentasi saiz skrin.

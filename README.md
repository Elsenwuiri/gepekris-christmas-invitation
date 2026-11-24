# Gepekris Pasar Baru — Jiwa & Nafas Natal

Website undangan Natal publik berbasis React, Vite, Tailwind CSS v4, dan Supabase. Proyek ini sudah disesuaikan dengan poster landscape dan portrait yang diberikan.

## Kebutuhan
- Node.js 20.19+ atau 22.12+
- Project Supabase
- File musik instrumental MP3 dan video teaser MP4 milik gereja

## Instalasi
```bash
npm install
cp .env.example .env
```
Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari Supabase Project Settings → API. Jangan pernah memasukkan `service_role` key ke frontend.

## Database RSVP
1. Buka Supabase → SQL Editor.
2. Jalankan seluruh isi `supabase/schema.sql`.
3. Pastikan tabel `public.rsvps` dan function `public.submit_rsvp` berhasil dibuat.

## Jalankan lokal
```bash
npm run dev
```

## Build produksi
```bash
npm run build
npm run preview
```

## Penempatan aset milik gereja
Aset berikut dapat ditambahkan sendiri tanpa mengubah struktur utama website:

| Aset | Lokasi file |
|---|---|
| Poster desktop (sudah disertakan) | `public/images/hero-landscape.png` |
| Poster mobile (sudah disertakan) | `public/images/hero-portrait.png` |
| Logo gereja (opsional) | `public/images/church-logo.png` |
| Foto pembicara | `public/images/speaker-photo.jpg` |
| Foto teaser video (opsional) | `public/images/christmas-teaser-poster.jpg` |
| Foto dokumentasi | `public/images/` lalu daftarkan di `src/data/gallery.js` |
| Video teaser | `public/videos/christmas-teaser.mp4` |
| Musik instrumental | `public/music/christmas-instrumental.mp3` |

Nama file untuk foto pembicara, poster teaser, video, dan musik harus mengikuti tabel agar otomatis terbaca. Jika nama file ingin berbeda, ubah path di `src/data/event.js`.

### Menambahkan foto dokumentasi
Edit `src/data/gallery.js` dengan format berikut:
```js
export const gallery = [
  { src: "/images/christmas-2025-01.jpg", alt: "Dokumentasi perayaan Natal" },
  { src: "/images/christmas-2025-02.jpg", alt: "Kebersamaan jemaat pada perayaan Natal" }
];
```

### Menambahkan teks ayat
Teks Lukas 2:6–10 Terjemahan Baru dapat dimasukkan pada properti `bibleText` di `src/data/event.js`. Properti tersebut sengaja dibiarkan kosong agar teks TB yang digunakan dapat dimasukkan dari sumber/izin yang sesuai, tanpa mengubah redaksi ayat.

## Fitur yang sudah disiapkan
- Opening invitation dengan overlay dan animasi sinematik.
- Pemilihan poster otomatis: landscape untuk desktop, portrait untuk layar mobile.
- Ayat tema Lukas 2:6–10 (TB), dengan slot teks lengkap di konfigurasi.
- Season of Grace.
- Countdown menuju 13 Desember 2026 pukul 16.00 WIB.
- Informasi acara 16.00–20.00 WIB.
- Unduh kalender `.ics` dan tautan Google Maps.
- Profil pembicara dengan slot foto.
- Galeri dokumentasi dengan lightbox.
- Video teaser MP4 dan Contact Person WhatsApp.
- RSVP publik melalui Supabase.
- Tombol berbagi undangan melalui WhatsApp.
- Musik hanya ditampilkan setelah undangan dibuka; pemutaran dimulai melalui kontrol pengguna.
- Tidak ada halaman admin, login, atau dashboard.

## Deploy gratis ke Vercel
1. Push folder proyek ke GitHub.
2. Import repository di Vercel.
3. Framework preset: Vite; Build Command: `npm run build`; Output Directory: `dist`.
4. Tambahkan Environment Variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
5. Deploy.

## Keamanan RSVP
- RLS aktif pada tabel RSVP.
- Tidak ada policy SELECT untuk anon/authenticated.
- Hak INSERT langsung ke tabel dicabut; pengiriman dilakukan melalui RPC tervalidasi.
- Frontend hanya memakai anon/publishable key.
- Website tidak menyediakan endpoint/halaman untuk membaca data RSVP.
- Untuk produksi dengan risiko spam tinggi, tambahkan Cloudflare Turnstile dan validasi token pada server/Edge Function serta mekanisme rate limit.
# gepekris-christmas-invitation

# UMKMForecast Jabar

![UMKM Forecast Jabar](/public/banner.png)

UMKMForecast Jabar adalah aplikasi web interaktif untuk visualisasi dan prediksi data pertumbuhan UMKM (Usaha Mikro, Kecil, dan Menengah) di Jawa Barat. Aplikasi ini menggunakan metode statistik seperti regresi linear dan interpolasi untuk memprediksi pertumbuhan UMKM di masa mendatang.

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Fitur Utama

- **Dashboard Data UMKM**: Visualisasi jumlah UMKM per tahun dalam bentuk tabel dan grafik interaktif
- **Prediksi Regresi Linear**: Perhitungan dan visualisasi proyeksi jumlah UMKM di masa mendatang
- **Estimasi Interpolasi Linear**: Perhitungan data tahun-tahun yang tidak terdokumentasi
- **Perbandingan Model**: Analisis perbandingan antara model regresi dan interpolasi
- **Evaluasi Akurasi Model**: Perhitungan RMSE, MAE, dan MAPE untuk mengukur akurasi model
- **Sumber Data Resmi**: Informasi tentang sumber data yang digunakan dalam aplikasi
- **Ekspor Laporan**: Fitur untuk mengunduh data dalam format PDF dan Excel

## 💻 Teknologi yang Digunakan

- **Frontend**: React, TypeScript, Tailwind CSS
- **Visualisasi**: Chart.js
- **UI Components**: Shadcn UI
- **Notifikasi**: SweetAlert2
- **State Management**: React Context API

## 🚀 Instalasi dan Penggunaan

### Prasyarat

- Node.js (v14.0.0 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. Clone repositori ini

   ```bash
   git clone https://github.com/grnlogic/umkmforecast-jabar.git
   cd umkmforecast-jabar
   ```

2. Install dependensi

   ```bash
   npm install
   # atau
   yarn install
   ```

3. Jalankan aplikasi dalam mode development

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. Buka aplikasi di browser
   ```
   http://localhost:3000
   ```

## 📊 Cara Penggunaan

1. **Input Data Historis**:

   - Masukkan data tahun dan jumlah UMKM pada form yang tersedia
   - Data akan ditampilkan dalam bentuk tabel dan grafik

2. **Prediksi Jumlah UMKM**:

   - Pilih tab "Prediksi (Regresi)"
   - Masukkan tahun target prediksi
   - Sistem akan menghitung prediksi menggunakan regresi linear

3. **Estimasi Data dengan Interpolasi**:

   - Pilih tab "Estimasi (Interpolasi)"
   - Masukkan data tahun awal, tahun akhir, dan tahun target estimasi
   - Sistem akan menghitung nilai estimasi menggunakan interpolasi linear

4. **Perbandingan Model**:

   - Pilih tab "Perbandingan Model"
   - Masukkan tahun target
   - Sistem akan menampilkan perbandingan hasil dari model regresi dan interpolasi

5. **Evaluasi Akurasi**:
   - Pilih tab "Evaluasi Akurasi"
   - Input data aktual dan prediksi untuk tahun-tahun tertentu
   - Sistem akan menghitung metrik evaluasi (RMSE, MAE, MAPE)

## 📁 Struktur Proyek

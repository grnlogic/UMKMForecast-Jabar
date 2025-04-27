import { Link } from "react-router-dom";
import { ArrowLeft, FileBarChart } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function TentangPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-4 flex items-center shadow-md">
        <Link to="/" className="mr-4">
          <Button className="w-8 h-8 p-0 rounded-full flex items-center justify-center bg-transparent hover:bg-blue-800/50 text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full p-1.5">
            <FileBarChart className="h-6 w-6 text-blue-800" />
          </div>
          <h1 className="text-xl font-bold">UMKMForecast Jabar</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-blue-900">
              Tentang UMKMForecast Jabar
            </h2>
            <p className="text-slate-500 mt-1">
              Solusi Cerdas Prediksi UMKM Jawa Barat
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Konsep Aplikasi</h3>
              <p className="text-muted-foreground">
                UMKMForecast Jabar adalah sebuah aplikasi berbasis web yang
                dirancang untuk memudahkan pemangku kebijakan, peneliti, dan
                masyarakat umum dalam memantau dan memprediksi jumlah Usaha
                Mikro, Kecil, dan Menengah (UMKM) di Provinsi Jawa Barat.
                Aplikasi ini mengintegrasikan data resmi dan menerapkan metode
                prediktif seperti regresi linear dan interpolasi linier untuk
                memproyeksikan pertumbuhan UMKM di masa mendatang.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Fitur Utama</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>
                  <strong>Dashboard Data UMKM:</strong> Menyajikan data jumlah
                  UMKM di Jawa Barat dalam bentuk tabel dan grafik interaktif
                  berdasarkan tahun.
                </li>
                <li>
                  <strong>Prediksi Jumlah UMKM (Regresi):</strong> Menampilkan
                  proyeksi jumlah UMKM di masa mendatang menggunakan metode
                  regresi linear.
                </li>
                <li>
                  <strong>Estimasi Tahun Hilang (Interpolasi):</strong> Mengisi
                  dan menampilkan data pada tahun-tahun yang tidak
                  terdokumentasi secara lengkap menggunakan interpolasi linier.
                </li>
                <li>
                  <strong>Evaluasi Akurasi Model:</strong> Menampilkan nilai
                  akurasi prediksi seperti RMSE, MAE, dan MAPE berdasarkan data
                  aktual.
                </li>
                <li>
                  <strong>Export Laporan:</strong> Fitur untuk mengunduh hasil
                  analisis dan prediksi dalam format CSV.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Tujuan Aplikasi</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>
                  Menyediakan prediksi berbasis data untuk mendukung perencanaan
                  kebijakan UMKM di Jawa Barat.
                </li>
                <li>
                  Mempermudah akses masyarakat terhadap data dan tren
                  pertumbuhan UMKM.
                </li>
                <li>
                  Memberikan gambaran akurat tentang potensi perkembangan UMKM
                  di masa depan.
                </li>
                <li>
                  Mendukung transparansi dan digitalisasi pengelolaan data
                  sektor UMKM.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Target Pengguna</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Pemerintah daerah (Dinas Koperasi dan UMKM)</li>
                <li>Akademisi dan peneliti</li>
                <li>Mahasiswa dan dosen</li>
                <li>Pelaku UMKM</li>
                <li>
                  Masyarakat umum yang tertarik dengan data perkembangan UMKM
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

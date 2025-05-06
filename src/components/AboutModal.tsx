import React from "react";
import { FileBarChart } from "lucide-react";
import { Button } from "./ui/button";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-1.5">
              <FileBarChart className="h-6 w-6 text-blue-800" />
            </div>
            <h1 className="text-xl font-bold">UMKMForecast Jabar</h1>
          </div>
          <Button 
            onClick={onClose}
            className="w-8 h-8 p-0 rounded-full flex items-center justify-center bg-transparent hover:bg-blue-800/50 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">
              Tentang UMKMForecast Jabar
            </h2>
            <p className="text-slate-500 mt-1">
              Solusi Cerdas Prediksi UMKM Jawa Barat
            </p>
          </div>
          
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
        
        <div className="p-4 border-t bg-slate-50 flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-blue-800 hover:bg-blue-700 text-white"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

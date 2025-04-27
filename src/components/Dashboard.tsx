"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "./DataTable";
import { DataChart } from "./DataChart";
import { PredictionSection } from "./Prediction";
import { InterpolationSection } from "./InterpolationSection";
import { ModelComparison } from "./ModelComparison";
import { ModelEvaluation } from "./ModelEvaluation";
import { ExportReport } from "./ExportReport";
import { DataSource } from "./DataSource";
import { Button } from "./ui/button";
import { DataProvider } from "../contexts/DataContext";
import { showInfo } from "../utils/chartUtils";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    showInfo(`Tab Dialihkan`, `Anda beralih ke tab ${tab}`);
  };

  useEffect(() => {
    // Memuat skrip Chart.js dan SweetAlert2 secara dinamis
    const loadScripts = async () => {
      // Hanya memuat jika belum dimuat
      if (typeof window !== "undefined") {
        if (!window.Chart) {
          const chartScript = document.createElement("script");
          chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
          chartScript.async = true;
          document.head.appendChild(chartScript);
        }

        if (!window.Swal) {
          const sweetAlertScript = document.createElement("script");
          sweetAlertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
          sweetAlertScript.async = true;
          document.head.appendChild(sweetAlertScript);
        }
      }
    };

    loadScripts();

    // Pesan selamat datang - tambahkan timeout untuk memastikan skrip telah dimuat
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.Swal) {
        showInfo(
          "Selamat Datang",
          "Selamat datang di aplikasi UMKMForecast Jabar!"
        );
      }
    }, 1000); // Penundaan lebih lama untuk memastikan SweetAlert dimuat

    return () => clearTimeout(timer);
  }, []);

  return (
    <DataProvider>
      <div className="bg-slate-50 min-h-screen pb-8">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 shadow-md mb-6">
          <h1 className="text-2xl font-bold">UMKM Jawa Barat Analytics</h1>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-wrap mb-6 overflow-x-auto gap-1 bg-white p-1 rounded-lg shadow-sm">
            <Button
              onClick={() => handleTabChange("dashboard")}
              className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 ${
                activeTab === "dashboard"
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-100"
              }`}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => handleTabChange("prediction")}
              className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 ${
                activeTab === "prediction"
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-100"
              }`}
            >
              Prediksi
            </Button>
            <Button
              onClick={() => handleTabChange("interpolation")}
              className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 ${
                activeTab === "interpolation"
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-100"
              }`}
            >
              Estimasi (Interpolasi)
            </Button>
            <Button
              onClick={() => handleTabChange("comparison")}
              className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 ${
                activeTab === "comparison"
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-100"
              }`}
            >
              Perbandingan Model
            </Button>
            <Button
              onClick={() => handleTabChange("evaluation")}
              className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 ${
                activeTab === "evaluation"
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-100"
              }`}
            >
              Evaluasi Akurasi
            </Button>
            <Button
              onClick={() => handleTabChange("source")}
              className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 ${
                activeTab === "source"
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-100"
              }`}
            >
              Sumber Data
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                  Dashboard Data UMKM Jawa Barat
                </h2>
                <p className="text-slate-600">
                  Visualisasi data jumlah UMKM di Jawa Barat berdasarkan tahun.
                  Data ini diambil dari sumber resmi seperti BPS dan Dinas
                  Koperasi dan UMKM Jawa Barat.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <DataTable />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <DataChart />
                </div>
                <div className="mt-6">
                  <ExportReport />
                </div>
              </div>
            )}

            {activeTab === "prediction" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                  Prediksi Jumlah UMKM (Regresi Linear)
                </h2>
                <p className="text-slate-600">
                  Proyeksi jumlah UMKM di masa mendatang menggunakan metode
                  regresi linear berdasarkan data historis.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <PredictionSection />
                </div>
              </div>
            )}

            {activeTab === "interpolation" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                  Estimasi Tahun Hilang (Interpolasi Linear)
                </h2>
                <p className="text-slate-600">
                  Estimasi data pada tahun-tahun yang tidak terdokumentasi
                  secara lengkap menggunakan metode interpolasi linear.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <InterpolationSection />
                </div>
              </div>
            )}

            {activeTab === "comparison" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                  Perbandingan Model Prediksi
                </h2>
                <p className="text-slate-600">
                  Perbandingan visual dan numerik antara hasil prediksi regresi
                  dan interpolasi.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <ModelComparison />
                </div>
              </div>
            )}

            {activeTab === "evaluation" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                  Evaluasi Akurasi Model
                </h2>
                <p className="text-slate-600">
                  Nilai akurasi prediksi seperti RMSE, MAE, dan MAPE berdasarkan
                  data aktual.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <ModelEvaluation />
                </div>
              </div>
            )}

            {activeTab === "source" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                  Sumber Data Resmi
                </h2>
                <p className="text-slate-600">
                  Informasi tentang sumber data yang digunakan dalam aplikasi
                  ini.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <DataSource />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DataProvider>
  );
};

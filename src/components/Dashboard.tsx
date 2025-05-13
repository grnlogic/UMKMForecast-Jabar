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
import { CalculationCalculator } from "./CalculationCalculator";
import { Button } from "./ui/button";
import { DataProvider } from "../contexts/DataContext";
import { ModelProvider } from "../contexts/ModelContext";
import { showInfo } from "../utils/chartUtils";
import { CSVImport } from "./CSVImport";
import { RegionalDataTable } from "./RegionalDataTable";
import { AboutModal } from "./AboutModal";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Removed SweetAlert notification when switching tabs
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
      <ModelProvider>
        <div className="bg-slate-50 min-h-screen pb-8">
          

          <div className="container mx-auto px-4">
            <div className="flex flex-wrap mb-6 overflow-x-auto gap-1 bg-gradient-to-r from-blue-50 to-slate-50 p-2 rounded-lg shadow-sm">
              {/* Dashboard Tab */}
              <Button
                onClick={() => handleTabChange("dashboard")}
                className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 flex items-center ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md font-semibold border-b-4 border-blue-500"
                    : "bg-white text-blue-800 hover:bg-blue-100"
                }`}
              >
                {activeTab === "dashboard" && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                )}
                Data & Visualisasi
              </Button>

              {/* Prediction Tab */}
              <Button
                onClick={() => handleTabChange("prediction")}
                className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 flex items-center ${
                  activeTab === "prediction"
                    ? "bg-gradient-to-r from-green-700 to-green-900 text-white shadow-md font-semibold border-b-4 border-green-500"
                    : "bg-white text-blue-800 hover:bg-blue-100"
                }`}
              >
                {activeTab === "prediction" && (
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                )}
                Prediksi Pertumbuhan
              </Button>

              {/* Analysis Tab */}
              <Button
                onClick={() => handleTabChange("analysis")}
                className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 flex items-center ${
                  activeTab === "analysis"
                    ? "bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-md font-semibold border-b-4 border-purple-500"
                    : "bg-white text-blue-800 hover:bg-blue-100"
                }`}
              >
                {activeTab === "analysis" && (
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                )}
                Analisis Model
              </Button>

              {/* Calculator Tab */}
              <Button
                onClick={() => handleTabChange("calculator")}
                className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 flex items-center ${
                  activeTab === "calculator"
                    ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-md font-semibold border-b-4 border-amber-500"
                    : "bg-white text-blue-800 hover:bg-blue-100"
                }`}
              >
                {activeTab === "calculator" && (
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></div>
                )}
                Kalkulator Perhitungan
              </Button>

              {/* Source Tab */}
              <Button
                onClick={() => handleTabChange("source")}
                className={`px-3 py-2 text-sm md:text-base md:px-4 rounded-md transition-all flex-shrink-0 flex items-center ${
                  activeTab === "source"
                    ? "bg-gradient-to-r from-rose-700 to-rose-900 text-white shadow-md font-semibold border-b-4 border-rose-500"
                    : "bg-white text-blue-800 hover:bg-blue-100"
                }`}
              >
                {activeTab === "source" && (
                  <div className="w-2 h-2 bg-rose-400 rounded-full mr-2 animate-pulse"></div>
                )}
                Sumber Data
              </Button>
            </div>

            {/* Page content container with same color accent as active tab */}
            <div
              className={`bg-white rounded-xl shadow-lg p-6 border border-slate-100 ${
                activeTab === "dashboard"
                  ? "border-t-4 border-t-blue-600"
                  : activeTab === "prediction"
                  ? "border-t-4 border-t-green-600"
                  : activeTab === "analysis"
                  ? "border-t-4 border-t-purple-600"
                  : activeTab === "calculator"
                  ? "border-t-4 border-t-amber-600"
                  : activeTab === "source"
                  ? "border-t-4 border-t-rose-600"
                  : ""
              }`}
            >
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                    Dashboard Data UMKM Jawa Barat
                  </h2>
                  <p className="text-slate-600">
                    Visualisasi data jumlah UMKM di Jawa Barat berdasarkan
                    tahun. Data ini diambil dari sumber resmi seperti BPS dan
                    Dinas Koperasi dan UMKM Jawa Barat.
                  </p>

                  <CSVImport />

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <DataTable />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <RegionalDataTable />
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

              {activeTab === "analysis" && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                      Analisis Model UMKM
                    </h2>
                    <p className="text-slate-600 mt-2">
                      Halaman ini menyediakan estimasi, perbandingan model, dan
                      evaluasi akurasi untuk analisis komprehensif data UMKM di
                      Jawa Barat.
                    </p>
                  </div>

                  {/* Section 1: Interpolation */}
                  <div className="pt-4">
                    <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
                      Estimasi Tahun Hilang (Interpolasi Linear)
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Estimasi data pada tahun-tahun yang tidak terdokumentasi
                      secara lengkap menggunakan metode interpolasi linear.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <InterpolationSection />
                    </div>
                  </div>

                  {/* Section 2: Model Comparison */}
                  <div className="pt-4">
                    <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
                      Perbandingan Model Prediksi
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Perbandingan visual dan numerik antara hasil prediksi
                      regresi dan interpolasi.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <ModelComparison />
                    </div>
                  </div>

                  {/* Section 3: Model Evaluation */}
                  <div className="pt-4">
                    <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
                      Evaluasi Akurasi Model
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Nilai akurasi prediksi seperti RMSE, MAE, dan MAPE
                      berdasarkan data aktual.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <ModelEvaluation />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "calculator" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-blue-900 border-b border-blue-100 pb-2">
                    Kalkulator Perhitungan
                  </h2>
                  <p className="text-slate-600">
                    Alat untuk perhitungan manual regresi linear dan interpolasi
                    linear berdasarkan data yang Anda masukkan.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <CalculationCalculator />
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

        {/* About Modal */}
        <AboutModal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
        />
      </ModelProvider>
    </DataProvider>
  );
};

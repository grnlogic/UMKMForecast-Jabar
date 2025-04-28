"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useData } from "../contexts/DataContext";
import Chart from "chart.js/auto";
import { defaultChartOptions, showInfo } from "../utils/chartUtils";

export const DataChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { umkmData } = useData();
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  // Data contoh jika tidak ada data pengguna
  const displayData =
    umkmData.length > 0
      ? umkmData
      : [
          { id: 1, year: 2016, count: 375048 },
          { id: 2, year: 2017, count: 27498 },
          { id: 3, year: 2018, count: 102737 },
          { id: 4, year: 2019, count: 31006 },
          { id: 5, year: 2020, count: 32925 },
          { id: 6, year: 2021, count: 34962 },
          { id: 7, year: 2022, count: 37125 },
          { id: 8, year: 2023, count: 39422 },
        ];

  // Fungsi untuk membuat atau memperbarui grafik
  const updateChart = () => {
    if (!chartRef.current) return;

    // Hancurkan grafik yang ada jika ada
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Siapkan data untuk Chart.js
    const chartData = {
      labels: displayData.map((item) => item.year.toString()),
      datasets: [
        {
          label: "Jumlah UMKM",
          data: displayData.map((item) => item.count),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
          borderRadius: chartType === "bar" ? 4 : 0,
          hoverBackgroundColor: "rgba(37, 99, 235, 0.8)",
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(59, 130, 246, 1)",
          pointRadius: chartType === "line" ? 5 : 0,
          pointHoverRadius: chartType === "line" ? 7 : 0,
          tension: 0.2,
        },
      ],
    };

    // Buat grafik baru
    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        ...defaultChartOptions,
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: "Grafik Jumlah UMKM di Jawa Barat",
            font: {
              size: 16,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
        },
      },
    });
  };

  // Perbarui grafik ketika komponen dipasang atau data/jenis grafik berubah
  useEffect(() => {
    updateChart();
  }, [umkmData, chartType]);

  // Menangani perubahan ukuran jendela
  useEffect(() => {
    const handleResize = () => {
      updateChart();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [umkmData, chartType]);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-900">
          Grafik Data UMKM
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setChartType("bar");
              showInfo("Tipe Grafik", "Grafik diubah ke tipe Batang");
            }}
            className={`px-4 py-2 rounded-md transition-all ${
              chartType === "bar"
                ? "bg-blue-800 text-white shadow-md"
                : "bg-white text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            Grafik Batang
          </Button>
          <Button
            onClick={() => {
              setChartType("line");
              showInfo("Tipe Grafik", "Grafik diubah ke tipe Garis");
            }}
            className={`px-4 py-2 rounded-md transition-all ${
              chartType === "line"
                ? "bg-blue-800 text-white shadow-md"
                : "bg-white text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            Grafik Garis
          </Button>
        </div>
      </div>
      <div className="bg-white p-3 sm:p-5 rounded-lg shadow-md border border-slate-100">
        <div style={{ height: "300px", maxHeight: "400px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
        <p className="text-center text-slate-600 text-xs sm:text-sm mt-4">
          <strong className="text-blue-800">Catatan:</strong> Grafik ini
          menampilkan data UMKM di Jawa Barat berdasarkan tahun. Untuk data
          akurat, silakan masukkan data UMKM Anda di tabel data.
        </p>
      </div>
    </div>
  );
};

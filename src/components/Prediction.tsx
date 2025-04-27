"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useData } from "../contexts/DataContext";
import Chart from "chart.js/auto";
import {
  defaultChartOptions,
  showSuccess,
  showError,
} from "../utils/chartUtils";

export const PredictionSection: React.FC = () => {
  const { umkmData, addData, removeData } = useData();
  const [year, setYear] = useState<string>("");
  const [count, setCount] = useState<string>("");
  const [targetYear, setTargetYear] = useState<string>("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleAddData = () => {
    if (!year || !count) return;

    const yearNum = Number.parseInt(year);
    const countNum = Number.parseInt(count);

    if (isNaN(yearNum) || isNaN(countNum)) return;

    addData(yearNum, countNum);
    setYear("");
    setCount("");
  };

  const calculateLinearRegression = () => {
    if (umkmData.length < 2 || !targetYear) {
      showError(
        "Data Tidak Cukup",
        "Diperlukan minimal 2 data dan tahun target untuk prediksi"
      );
      return;
    }

    const targetYearNum = Number.parseInt(targetYear);
    if (isNaN(targetYearNum)) {
      showError("Input Tidak Valid", "Tahun target harus berupa angka");
      return;
    }

    // Perhitungan regresi linear
    const n = umkmData.length;
    const sumX = umkmData.reduce((sum, point) => sum + point.year, 0);
    const sumY = umkmData.reduce((sum, point) => sum + point.count, 0);
    const sumXY = umkmData.reduce(
      (sum, point) => sum + point.year * point.count,
      0
    );
    const sumXX = umkmData.reduce(
      (sum, point) => sum + point.year * point.year,
      0
    );

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Menghitung prediksi
    const predictedValue = slope * targetYearNum + intercept;
    setPrediction(Math.round(predictedValue));

    // Setelah perhitungan
    showSuccess(
      "Prediksi Selesai",
      `Prediksi untuk tahun ${targetYear} telah berhasil dihitung`
    );

    // Perbarui grafik setelah perhitungan
    updatePredictionChart();
  };

  // Fungsi untuk membuat atau memperbarui grafik prediksi
  const updatePredictionChart = () => {
    if (!chartRef.current || !prediction || !targetYear || umkmData.length < 2)
      return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Get years for all data points including the prediction
    const years = [
      ...umkmData.map((item) => item.year),
      Number(targetYear),
    ].sort((a, b) => a - b);

    // Setup datasets for actual and predicted data
    const actualData = years.map((year) => {
      const match = umkmData.find((item) => item.year === year);
      return match ? match.count : null;
    });

    const predictionData = years.map((year) => {
      return year === Number(targetYear) ? prediction : null;
    });

    // Prepare data for Chart.js
    const chartData = {
      labels: years,
      datasets: [
        {
          label: "Data Aktual",
          data: actualData,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: "Prediksi",
          data: predictionData,
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 10,
          pointStyle: "rectRot",
        },
      ],
    };

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        ...defaultChartOptions,
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: `Prediksi UMKM untuk Tahun ${targetYear}`,
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    });
  };

  // Perbarui grafik ketika prediksi berubah
  useEffect(() => {
    if (prediction !== null) {
      updatePredictionChart();
    }
  }, [prediction, umkmData]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Input Data Historis</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="form-group flex-1">
            <label className="form-label">Tahun</label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Contoh: 2020"
              className="input"
            />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Jumlah UMKM</label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Contoh: 150000"
              className="input"
            />
          </div>
          <div className="form-group sm:mt-auto">
            <Button onClick={handleAddData} className="w-full sm:w-auto button">
              Tambah Data
            </Button>
          </div>
        </div>

        {umkmData.length > 0 ? (
          <table className="mb-6">
            <thead>
              <tr>
                <th>Tahun</th>
                <th>Jumlah UMKM</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {umkmData.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.count.toLocaleString()}</td>
                  <td>
                    <Button
                      onClick={() => removeData(index)}
                      className="button secondary"
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded mb-6">
            Belum ada data. Silakan tambahkan data historis UMKM.
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Prediksi Jumlah UMKM</h3>
        <div className="flex gap-4 mb-4">
          <div className="form-group">
            <label className="form-label">Tahun Target Prediksi</label>
            <Input
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              placeholder="Contoh: 2025"
              className="input"
            />
          </div>
          <div className="form-group flex items-end">
            <Button
              onClick={calculateLinearRegression}
              className="button"
              disabled={umkmData.length < 2}
            >
              Hitung Prediksi
            </Button>
          </div>
        </div>

        {prediction !== null && (
          <div>
            <div className="bg-white p-4 rounded shadow mb-4">
              <canvas ref={chartRef} style={{ height: "400px" }}></canvas>
            </div>
            <h4 className="font-semibold mb-2">Hasil Prediksi:</h4>
            <p>
              Berdasarkan data historis, prediksi jumlah UMKM di Jawa Barat pada
              tahun {targetYear} adalah:
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {prediction.toLocaleString()} UMKM
            </p>
            <p className="text-sm mt-4">
              <strong>Catatan:</strong> Prediksi ini menggunakan metode regresi
              linear sederhana. Akurasi prediksi bergantung pada kualitas dan
              jumlah data historis yang dimasukkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

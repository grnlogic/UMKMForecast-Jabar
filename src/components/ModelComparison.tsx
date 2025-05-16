"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Chart from "chart.js/auto";
import {
  defaultChartOptions,
  showSuccess,
  showError,
} from "../utils/chartUtils";
import { useModelData } from "../contexts/ModelContext";

// Add this type definition
type DataPoint = {
  year: number;
  count: number;
};

export const ModelComparison: React.FC = () => {
  const {
    comparisonData,
    addComparisonDataPoint,
    removeComparisonDataPoint,
    futureYear,
    setFutureYear,
    regressionResult,
    setRegressionResult,
    interpolationComparisonResult: interpolationResult,
    setInterpolationComparisonResult: setInterpolationResult,
    // Interpolation data from context
    startYear,
    startCount,
    endYear,
    endCount,
    // Updated function name
    syncWithUmkmData, // Changed from useUmkmDataForComparison
  } = useModelData();

  const [year, setYear] = useState<string>("");
  const [count, setCount] = useState<string>("");

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleAddData = () => {
    if (!year || !count) return;

    const yearNum = Number.parseInt(year);
    const countNum = Number.parseInt(count);

    if (isNaN(yearNum) || isNaN(countNum)) return;

    // Add data to shared context
    addComparisonDataPoint(yearNum, countNum);
    setYear("");
    setCount("");
  };

  const handleRemoveData = (index: number) => {
    removeComparisonDataPoint(index);
  };

  // Helper function to calculate divided differences table
  const calculateDividedDifferences = (data: DataPoint[]) => {
    const n = data.length;
    const result: { order: number; value: number }[] = [];

    // Zero-order differences (original function values)
    result.push({ order: 0, value: data[0].count });

    // Calculate divided differences of various orders
    const diffs: number[][] = [];

    // First-order differences
    diffs[0] = [];
    for (let i = 0; i < n - 1; i++) {
      diffs[0][i] =
        (data[i + 1].count - data[i].count) / (data[i + 1].year - data[i].year);
    }
    result.push({ order: 1, value: diffs[0][0] });

    // Higher-order differences
    for (let order = 1; order < n - 1; order++) {
      diffs[order] = [];
      for (let i = 0; i < n - order - 1; i++) {
        diffs[order][i] =
          (diffs[order - 1][i + 1] - diffs[order - 1][i]) /
          (data[i + order + 1].year - data[i].year);
      }
      result.push({ order: order + 1, value: diffs[order][0] });
    }

    return result;
  };

  // Fungsi untuk menghitung interpolasi Newton dengan polynomial
  const newtonInterpolation = (
    x: number,
    data: DataPoint[],
    diffTable: { order: number; value: number }[]
  ) => {
    let result = diffTable[0].value; // f[x0]
    let term = 1;

    for (let i = 1; i < diffTable.length; i++) {
      term *= x - data[i - 1].year;
      result += diffTable[i].value * term;
    }

    return result;
  };

  const calculatePredictions = () => {
    if (comparisonData.length < 2 || !futureYear) return;

    const futureYearNum = Number.parseInt(futureYear);
    if (isNaN(futureYearNum)) return;

    // Perhitungan regresi linear
    const n = comparisonData.length;
    const sumX = comparisonData.reduce((sum, point) => sum + point.year, 0);
    const sumY = comparisonData.reduce((sum, point) => sum + point.count, 0);
    const sumXY = comparisonData.reduce(
      (sum, point) => sum + point.year * point.count,
      0
    );
    const sumXX = comparisonData.reduce(
      (sum, point) => sum + point.year * point.year,
      0
    );

    // Rumus regresi linier y = ax + b
    const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX); // slope
    const b = (sumY - a * sumX) / n; // intercept

    // Menghitung prediksi regresi
    const regressionValue = a * futureYearNum + b;
    setRegressionResult(Math.round(regressionValue));

    // --- Perbaikan utama di bawah ini ---
    // Selalu gunakan interpolasi Newton dengan seluruh data jika data >= 2
    const sortedData = [...comparisonData].sort((a, b) => a.year - b.year);

    if (sortedData.length >= 2) {
      // Buat tabel divided differences
      const differencesTable = calculateDividedDifferences(sortedData);

      // Gunakan fungsi Newton Polynomial untuk interpolasi/ekstrapolasi
      const interpolatedValue = newtonInterpolation(
        futureYearNum,
        sortedData,
        differencesTable
      );

      setInterpolationResult(Math.round(interpolatedValue));
    }
    // ...jika ingin tetap mendukung mode dua titik manual, tambahkan else di sini...
  };

  // Fungsi untuk membuat atau memperbarui grafik perbandingan
  const updateComparisonChart = () => {
    if (
      !chartRef.current ||
      !regressionResult ||
      !interpolationResult ||
      !futureYear
    )
      return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Prepare data for Chart.js
    const chartData = {
      labels: ["Regresi Linear", "Interpolasi Polinom Newton"],
      datasets: [
        {
          label: "Jumlah UMKM Prediksi",
          data: [regressionResult, interpolationResult],
          backgroundColor: [
            "rgba(59, 130, 246, 0.7)", // Blue for regression
            "rgba(16, 185, 129, 0.7)", // Green for interpolation
          ],
          borderColor: ["rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)"],
          borderWidth: 2,
          borderRadius: 6,
          hoverOffset: 4,
        },
      ],
    };

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        ...defaultChartOptions,
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: `Perbandingan Prediksi untuk Tahun ${futureYear}`,
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

  // Perbarui grafik ketika hasil regresi dan interpolasi berubah
  useEffect(() => {
    if (regressionResult !== null && interpolationResult !== null) {
      updateComparisonChart();
    }
  }, [regressionResult, interpolationResult, futureYear]);

  // Menangani perubahan ukuran jendela
  useEffect(() => {
    const handleResize = () => {
      if (regressionResult !== null && interpolationResult !== null) {
        updateComparisonChart();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [regressionResult, interpolationResult, futureYear]);

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

        {/* Add this button to load imported data */}
        <div className="mb-4">
          <Button
            onClick={syncWithUmkmData} // Changed from useUmkmDataForComparison
            className="text-sm bg-green-600 hover:bg-green-700 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Gunakan Data Terimpor
          </Button>
        </div>

        {comparisonData.length > 0 ? (
          <table className="mb-6">
            <thead>
              <tr>
                <th>Tahun</th>
                <th>Jumlah UMKM</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.count.toLocaleString()}</td>
                  <td>
                    <Button
                      onClick={() => handleRemoveData(index)}
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
        <h3 className="text-lg font-semibold mb-4">
          Perbandingan Model Prediksi
        </h3>
        <div className="flex gap-4 mb-4">
          <div className="form-group">
            <label className="form-label">Tahun Target</label>
            <Input
              type="number"
              value={futureYear}
              onChange={(e) => setFutureYear(e.target.value)}
              placeholder="Contoh: 2025"
              className="input"
            />
          </div>
          <div className="form-group flex items-end">
            <Button
              onClick={calculatePredictions}
              className="button"
              disabled={comparisonData.length < 2}
            >
              Bandingkan Model
            </Button>
          </div>
        </div>

        {regressionResult !== null && interpolationResult !== null && (
          <div>
            <div className="bg-white p-4 rounded shadow mb-4">
              <canvas
                ref={chartRef}
                style={{ width: "100%", height: "300px", maxHeight: "400px" }}
              ></canvas>
            </div>

            <div className="p-4 bg-gray-50 rounded border mb-4">
              <h4 className="font-semibold mb-2">Hasil Perbandingan:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded">
                  <h5 className="font-medium">Prediksi Regresi Linear</h5>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {regressionResult.toLocaleString()} UMKM
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <h5 className="font-medium">
                    Prediksi Interpolasi Polinom Newton
                  </h5>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {interpolationResult.toLocaleString()} UMKM
                  </p>
                </div>
              </div>
              <p className="text-sm mt-4">
                <strong>Selisih:</strong>{" "}
                {Math.abs(
                  regressionResult - interpolationResult
                ).toLocaleString()}{" "}
                UMKM (
                {(
                  (Math.abs(regressionResult - interpolationResult) /
                    Math.max(regressionResult, interpolationResult)) *
                  100
                ).toFixed(2)}
                %)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

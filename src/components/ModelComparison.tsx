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

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Menghitung prediksi regresi
    const regressionValue = slope * futureYearNum + intercept;
    setRegressionResult(Math.round(regressionValue));

    // Use interpolation data if available
    if (startYear && startCount && endYear && endCount) {
      const startYearNum = Number.parseInt(startYear);
      const startCountNum = Number.parseInt(startCount);
      const endYearNum = Number.parseInt(endYear);
      const endCountNum = Number.parseInt(endCount);

      if (
        !isNaN(startYearNum) &&
        !isNaN(startCountNum) &&
        !isNaN(endYearNum) &&
        !isNaN(endCountNum)
      ) {
        // Calculate interpolation with the data from the interpolation section
        const interpolatedValue =
          startCountNum +
          (futureYearNum - startYearNum) *
            ((endCountNum - startCountNum) / (endYearNum - startYearNum));

        setInterpolationResult(Math.round(interpolatedValue));
      }
    } else {
      // Untuk interpolasi, kita perlu menemukan titik-titik terdekat
      // Jika tahun target berada di luar jangkauan, kita akan menggunakan ekstrapolasi
      const sortedData = [...comparisonData].sort((a, b) => a.year - b.year);

      if (futureYearNum <= sortedData[0].year) {
        // Ekstrapolasi sebelum titik pertama
        const x1 = sortedData[0].year;
        const y1 = sortedData[0].count;
        const x2 = sortedData[1].year;
        const y2 = sortedData[1].count;

        const interpolatedValue =
          y1 + (futureYearNum - x1) * ((y2 - y1) / (x2 - x1));
        setInterpolationResult(Math.round(interpolatedValue));
      } else if (futureYearNum >= sortedData[sortedData.length - 1].year) {
        // Ekstrapolasi setelah titik terakhir
        const x1 = sortedData[sortedData.length - 2].year;
        const y1 = sortedData[sortedData.length - 2].count;
        const x2 = sortedData[sortedData.length - 1].year;
        const y2 = sortedData[sortedData.length - 1].count;

        const interpolatedValue =
          y1 + (futureYearNum - x1) * ((y2 - y1) / (x2 - x1));
        setInterpolationResult(Math.round(interpolatedValue));
      } else {
        // Interpolasi antara titik-titik
        let lowerPoint: DataPoint | null = null;
        let upperPoint: DataPoint | null = null;

        for (let i = 0; i < sortedData.length - 1; i++) {
          if (
            futureYearNum >= sortedData[i].year &&
            futureYearNum <= sortedData[i + 1].year
          ) {
            lowerPoint = sortedData[i];
            upperPoint = sortedData[i + 1];
            break;
          }
        }

        if (lowerPoint && upperPoint) {
          const interpolatedValue =
            lowerPoint.count +
            (futureYearNum - lowerPoint.year) *
              ((upperPoint.count - lowerPoint.count) /
                (upperPoint.year - lowerPoint.year));

          setInterpolationResult(Math.round(interpolatedValue));
        }
      }
    }
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
      labels: ["Regresi Linear", "Interpolasi Linear"],
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
                  <h5 className="font-medium">Prediksi Interpolasi Linear</h5>
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

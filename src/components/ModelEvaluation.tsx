"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface DataPoint {
  year: number;
  actualCount: number;
  predictedCount: number;
}

export const ModelEvaluation: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [year, setYear] = useState<string>("");
  const [actualCount, setActualCount] = useState<string>("");
  const [predictedCount, setPredictedCount] = useState<string>("");
  const [metrics, setMetrics] = useState<{
    rmse: number | null;
    mae: number | null;
    mape: number | null;
  }>({
    rmse: null,
    mae: null,
    mape: null,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleAddData = () => {
    if (!year || !actualCount || !predictedCount) return;

    const yearNum = Number.parseInt(year);
    const actualCountNum = Number.parseInt(actualCount);
    const predictedCountNum = Number.parseInt(predictedCount);

    if (isNaN(yearNum) || isNaN(actualCountNum) || isNaN(predictedCountNum))
      return;

    const newData: DataPoint = {
      year: yearNum,
      actualCount: actualCountNum,
      predictedCount: predictedCountNum,
    };

    setData([...data, newData].sort((a, b) => a.year - b.year));
    setYear("");
    setActualCount("");
    setPredictedCount("");
  };

  const handleRemoveData = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const calculateMetrics = () => {
    if (data.length === 0) return;

    // Calculate RMSE (Root Mean Square Error)
    const squaredErrors = data.map((item) =>
      Math.pow(item.actualCount - item.predictedCount, 2)
    );
    const mse =
      squaredErrors.reduce((sum, error) => sum + error, 0) / data.length;
    const rmse = Math.sqrt(mse);

    // Calculate MAE (Mean Absolute Error)
    const absoluteErrors = data.map((item) =>
      Math.abs(item.actualCount - item.predictedCount)
    );
    const mae =
      absoluteErrors.reduce((sum, error) => sum + error, 0) / data.length;

    // Calculate MAPE (Mean Absolute Percentage Error)
    const percentageErrors = data.map(
      (item) =>
        Math.abs((item.actualCount - item.predictedCount) / item.actualCount) *
        100
    );
    const mape =
      percentageErrors.reduce((sum, error) => sum + error, 0) / data.length;

    setMetrics({
      rmse,
      mae,
      mape,
    });
  };

  // Draw evaluation chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const chartWidth = canvas.width - 80;
    const chartHeight = canvas.height - 80;
    const marginLeft = 60;
    const marginTop = 30;
    const marginBottom = 50;

    // Find min and max values for scaling
    const minYear = Math.min(...data.map((d) => d.year));
    const maxYear = Math.max(...data.map((d) => d.year));
    const yearRange = maxYear - minYear;

    const allCounts = [
      ...data.map((d) => d.actualCount),
      ...data.map((d) => d.predictedCount),
    ];
    const maxCount = Math.max(...allCounts) * 1.1; // Add 10% padding
    const minCount = Math.min(...allCounts) * 0.9; // Subtract 10% padding

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, marginTop + chartHeight);
    ctx.lineTo(marginLeft + chartWidth, marginTop + chartHeight);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw y-axis grid lines and labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#64748b";
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
      const y = marginTop + chartHeight - (i / yTickCount) * chartHeight;
      const value = Math.round(
        minCount + (i / yTickCount) * (maxCount - minCount)
      );

      // Grid line
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(marginLeft + chartWidth, y);
      ctx.stroke();

      // Label
      ctx.fillText(value.toLocaleString(), marginLeft - 10, y);
    }

    // Draw x-axis labels and grid lines
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#1e293b";

    const xTickCount = data.length - 1;
    for (let i = 0; i <= xTickCount; i++) {
      const x = marginLeft + (i / xTickCount) * chartWidth;
      const year = data[i].year;

      // Grid line
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, marginTop + chartHeight);
      ctx.strokeStyle = "#e2e8f0";
      ctx.stroke();

      // Label
      ctx.fillStyle = "#1e293b";
      ctx.fillText(year.toString(), x, marginTop + chartHeight + 10);
    }

    // Draw chart title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Perbandingan Data Aktual vs Prediksi", canvas.width / 2, 15);

    // Draw actual data line
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = marginLeft + (index / xTickCount) * chartWidth;
      const y =
        marginTop +
        chartHeight -
        ((point.actualCount - minCount) / (maxCount - minCount)) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw predicted data line
    ctx.beginPath();
    data.forEach((point, index) => {
      const x = marginLeft + (index / xTickCount) * chartWidth;
      const y =
        marginTop +
        chartHeight -
        ((point.predictedCount - minCount) / (maxCount - minCount)) *
          chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw data points for actual data
    data.forEach((point, index) => {
      const x = marginLeft + (index / xTickCount) * chartWidth;
      const y =
        marginTop +
        chartHeight -
        ((point.actualCount - minCount) / (maxCount - minCount)) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw data points for predicted data
    data.forEach((point, index) => {
      const x = marginLeft + (index / xTickCount) * chartWidth;
      const y =
        marginTop +
        chartHeight -
        ((point.predictedCount - minCount) / (maxCount - minCount)) *
          chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw legend
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Data Aktual", marginLeft + 10, marginTop + 20);
    ctx.fillText("Data Prediksi", marginLeft + 10, marginTop + 40);

    // Draw legend symbols
    ctx.beginPath();
    ctx.arc(marginLeft + 100, marginTop + 20, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(marginLeft + 100, marginTop + 40, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw y-axis title
    ctx.save();
    ctx.translate(15, marginTop + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px Arial";
    ctx.fillText("Jumlah UMKM", 0, 0);
    ctx.restore();

    // Draw x-axis title
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Tahun",
      marginLeft + chartWidth / 2,
      marginTop + chartHeight + 35
    );
  }, [data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Adjust canvas size based on container
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 400;
        // This will trigger the useEffect above to redraw
        if (data.length > 0) {
          setData([...data]);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial sizing

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Input Data Aktual dan Prediksi
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="form-group">
            <label className="form-label">Tahun</label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Contoh: 2020"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Jumlah UMKM Aktual</label>
            <Input
              type="number"
              value={actualCount}
              onChange={(e) => setActualCount(e.target.value)}
              placeholder="Contoh: 150000"
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Jumlah UMKM Prediksi</label>
            <Input
              type="number"
              value={predictedCount}
              onChange={(e) => setPredictedCount(e.target.value)}
              placeholder="Contoh: 155000"
              className="input"
            />
          </div>
        </div>

        <div className="mb-4">
          <Button onClick={handleAddData} className="button">
            Tambah Data
          </Button>
        </div>

        {data.length > 0 ? (
          <table className="mb-6">
            <thead>
              <tr>
                <th>Tahun</th>
                <th>Jumlah UMKM Aktual</th>
                <th>Jumlah UMKM Prediksi</th>
                <th>Selisih</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.actualCount.toLocaleString()}</td>
                  <td>{item.predictedCount.toLocaleString()}</td>
                  <td>
                    {Math.abs(
                      item.actualCount - item.predictedCount
                    ).toLocaleString()}
                  </td>
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
            Belum ada data. Silakan tambahkan data aktual dan prediksi.
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "400px" }}
          ></canvas>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Evaluasi Akurasi Model</h3>
        <div className="mb-4">
          <Button
            onClick={calculateMetrics}
            className="button"
            disabled={data.length === 0}
          >
            Hitung Metrik Akurasi
          </Button>
        </div>

        {metrics.rmse !== null && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold mb-1 text-blue-100">RMSE</h4>
                  <p className="text-2xl font-bold text-white">
                    {metrics.rmse !== null
                      ? Math.round(metrics.rmse).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="p-2 bg-blue-700 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs mt-2 text-gray-600">
                Root Mean Square Error (Akar Rata-rata Kesalahan Kuadrat)
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold mb-1 text-blue-100">MAE</h4>
                  <p className="text-2xl font-bold text-white">
                    {metrics.mae !== null
                      ? Math.round(metrics.mae).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="p-2 bg-blue-700 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs mt-3 text-blue-100 opacity-80">
                Mean Absolute Error (Rata-rata Kesalahan Absolut)
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-indigo-900 to-indigo-800 border border-indigo-700">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold mb-1 text-indigo-100">MAPE</h4>
                  <p className="text-2xl font-bold text-white">
                    {metrics.mape !== null ? metrics.mape.toFixed(2) : "N/A"}%
                  </p>
                </div>
                <div className="p-2 bg-indigo-700 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs mt-3 text-indigo-100 opacity-80">
                Mean Absolute Percentage Error (Rata-rata Persentase Kesalahan
                Absolut)
              </p>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded mt-4">
          <h4 className="font-semibold mb-2">Interpretasi Metrik:</h4>
          <ul className="list-disc pl-5 text-sm">
            <li className="mb-2">
              <strong>RMSE (Root Mean Square Error):</strong> Mengukur akar
              rata-rata dari kesalahan kuadrat. Nilai yang lebih rendah
              menunjukkan model yang lebih akurat.
            </li>
            <li className="mb-2">
              <strong>MAE (Mean Absolute Error):</strong> Mengukur rata-rata
              kesalahan absolut. Nilai yang lebih rendah menunjukkan model yang
              lebih akurat.
            </li>
            <li>
              <strong>MAPE (Mean Absolute Percentage Error):</strong> Mengukur
              rata-rata persentase kesalahan. Nilai di bawah 10% umumnya
              dianggap sebagai prediksi yang sangat baik.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

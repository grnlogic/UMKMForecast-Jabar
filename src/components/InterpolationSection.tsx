"use client";

import { useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useModelData } from "../contexts/ModelContext";

export const InterpolationSection: React.FC = () => {
  const {
    startYear,
    setStartYear,
    startCount,
    setStartCount,
    endYear,
    setEndYear,
    endCount,
    setEndCount,
    targetYearInterpolation: targetYear,
    setTargetYearInterpolation: setTargetYear,
    interpolationResult,
    setInterpolationResult,
  } = useModelData();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateInterpolation = () => {
    if (!startYear || !startCount || !endYear || !endCount || !targetYear)
      return;

    const startYearNum = Number.parseInt(startYear);
    const startCountNum = Number.parseInt(startCount);
    const endYearNum = Number.parseInt(endYear);
    const endCountNum = Number.parseInt(endCount);
    const targetYearNum = Number.parseInt(targetYear);

    if (
      isNaN(startYearNum) ||
      isNaN(startCountNum) ||
      isNaN(endYearNum) ||
      isNaN(endCountNum) ||
      isNaN(targetYearNum)
    )
      return;

    // Check if target year is between start and end years
    if (targetYearNum <= startYearNum || targetYearNum >= endYearNum) {
      alert("Tahun target harus berada di antara tahun awal dan tahun akhir.");
      return;
    }

    // Linear interpolation formula: y = y1 + (x - x1) * ((y2 - y1) / (x2 - x1))
    const interpolatedValue =
      startCountNum +
      (targetYearNum - startYearNum) *
        ((endCountNum - startCountNum) / (endYearNum - startYearNum));

    setInterpolationResult(Math.round(interpolatedValue));
  };

  // Draw interpolation chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !startYear || !startCount || !endYear || !endCount) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Parse input values
    const startYearNum = Number.parseInt(startYear);
    const startCountNum = Number.parseInt(startCount);
    const endYearNum = Number.parseInt(endYear);
    const endCountNum = Number.parseInt(endCount);
    const targetYearNum = targetYear ? Number.parseInt(targetYear) : null;

    if (
      isNaN(startYearNum) ||
      isNaN(startCountNum) ||
      isNaN(endYearNum) ||
      isNaN(endCountNum) ||
      (targetYear && isNaN(targetYearNum!))
    )
      return;

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
    const minYear = Math.min(startYearNum, endYearNum) - 1;
    const maxYear = Math.max(startYearNum, endYearNum) + 1;
    const yearRange = maxYear - minYear;

    const minCount = Math.min(startCountNum, endCountNum) * 0.9; // 10% padding
    const maxCount = Math.max(startCountNum, endCountNum) * 1.1; // 10% padding
    const countRange = maxCount - minCount;

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
      const value = Math.round(minCount + (i / yTickCount) * countRange);

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

    const xTickCount = yearRange;
    for (let i = 0; i <= xTickCount; i++) {
      const x = marginLeft + (i / xTickCount) * chartWidth;
      const year = minYear + Math.round((i / xTickCount) * yearRange);

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
    ctx.fillText("Interpolasi Linear UMKM", canvas.width / 2, 15);

    // Draw start and end points
    const startX =
      marginLeft + ((startYearNum - minYear) / yearRange) * chartWidth;
    const startY =
      marginTop +
      chartHeight -
      ((startCountNum - minCount) / countRange) * chartHeight;
    const endX = marginLeft + ((endYearNum - minYear) / yearRange) * chartWidth;
    const endY =
      marginTop +
      chartHeight -
      ((endCountNum - minCount) / countRange) * chartHeight;

    // Draw points
    ctx.beginPath();
    ctx.arc(startX, startY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(endX, endY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw line between points
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw labels for start and end points
    ctx.fillStyle = "#1e293b";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `${startYearNum}: ${startCountNum.toLocaleString()}`,
      startX,
      startY - 15
    );
    ctx.fillText(
      `${endYearNum}: ${endCountNum.toLocaleString()}`,
      endX,
      endY - 15
    );

    // Draw interpolation point if available
    if (interpolationResult !== null && targetYearNum) {
      const targetX =
        marginLeft + ((targetYearNum - minYear) / yearRange) * chartWidth;
      const targetY =
        marginTop +
        chartHeight -
        ((interpolationResult - minCount) / countRange) * chartHeight;

      // Draw point
      ctx.beginPath();
      ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${targetYearNum}: ${interpolationResult.toLocaleString()}`,
        targetX,
        targetY - 20
      );

      // Draw dashed vertical line to show target year
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(targetX, marginTop + chartHeight);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw legend
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Data Aktual", marginLeft + 10, marginTop + 20);
    if (interpolationResult !== null) {
      ctx.fillText("Interpolasi", marginLeft + 10, marginTop + 40);
    }

    // Draw legend symbols
    ctx.beginPath();
    ctx.arc(marginLeft + 100, marginTop + 20, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (interpolationResult !== null) {
      ctx.beginPath();
      ctx.arc(marginLeft + 100, marginTop + 40, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

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
  }, [
    startYear,
    startCount,
    endYear,
    endCount,
    targetYear,
    interpolationResult,
  ]);

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
        if (interpolationResult !== null) {
          setInterpolationResult(interpolationResult);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial sizing

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [interpolationResult]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
          Data Tahun Awal dan Akhir
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tahun Awal
            </label>
            <Input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              placeholder="Contoh: 2015"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jumlah UMKM Tahun Awal
            </label>
            <Input
              type="number"
              value={startCount}
              onChange={(e) => setStartCount(e.target.value)}
              placeholder="Contoh: 120000"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tahun Akhir
            </label>
            <Input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              placeholder="Contoh: 2020"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jumlah UMKM Tahun Akhir
            </label>
            <Input
              type="number"
              value={endCount}
              onChange={(e) => setEndCount(e.target.value)}
              placeholder="Contoh: 175000"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {startYear && startCount && endYear && endCount && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            Visualisasi Interpolasi
          </h3>
          <div className="bg-slate-50 p-4 rounded-lg">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "400px" }}
            ></canvas>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
          Estimasi Tahun Hilang
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tahun Target Estimasi
            </label>
            <Input
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              placeholder="Contoh: 2017"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Masukkan tahun antara {startYear || "..."} dan {endYear || "..."}
            </p>
          </div>
          <div className="flex items-end">
            <Button
              onClick={calculateInterpolation}
              className="px-6 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
              disabled={
                !startYear ||
                !startCount ||
                !endYear ||
                !endCount ||
                !targetYear
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Hitung Estimasi
            </Button>
          </div>
        </div>

        {interpolationResult !== null && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-blue-800">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-800 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <h4 className="font-semibold text-lg text-blue-900">
                Hasil Estimasi
              </h4>
            </div>
            <p className="text-slate-600 mb-3">
              Berdasarkan interpolasi linear, estimasi jumlah UMKM di Jawa Barat
              pada tahun {targetYear} adalah:
            </p>
            <div className="bg-white p-4 rounded-lg text-center mb-4 shadow-sm">
              <p className="text-3xl font-bold text-blue-800">
                {interpolationResult.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">UMKM</p>
            </div>
            <div className="flex items-start text-sm text-slate-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                Estimasi ini menggunakan metode interpolasi linear sederhana,
                yang mengasumsikan pertumbuhan linear antara dua titik data yang
                diketahui. Hasil estimasi dapat berbeda dengan data aktual.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

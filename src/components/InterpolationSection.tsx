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
      alert(
        "Perhatian: Nilai target berada di luar rentang data yang dimasukkan. Hasil merupakan prediksi menggunakan interpolasi polinom Newton."
      );
    }

    // Data points for interpolation
    const points = [
      { x: startYearNum, y: startCountNum },
      { x: endYearNum, y: endCountNum },
    ];

    // Calculate divided differences table - inti dari metode polinom Newton
    const n = points.length;
    const dividedDiff: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0));

    // Isi kolom pertama dengan nilai-nilai f(x)
    for (let i = 0; i < n; i++) {
      dividedDiff[i][0] = points[i].y;
    }

    // Hitung tabel divided differences
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        dividedDiff[i][j] =
          (dividedDiff[i + 1][j - 1] - dividedDiff[i][j - 1]) /
          (points[i + j].x - points[i].x);
      }
    }

    // Aplikasi formula Newton untuk interpolasi/ekstrapolasi
    let result = dividedDiff[0][0]; // f[x₀]
    let term = 1;

    for (let i = 1; i < n; i++) {
      term *= targetYearNum - points[i - 1].x;
      result += dividedDiff[0][i] * term;
    }

    setInterpolationResult(Math.round(result));

    // Detail perhitungan untuk developer
    console.log(`Prediksi dengan Interpolasi Polinom Newton:
      - Tabel divided differences:
        ${JSON.stringify(dividedDiff)}
      - Titik data: ${JSON.stringify(points)}
      - Titik prediksi: ${targetYearNum}
      - Formula umum: P(x) = f[x₀] + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁) + ... 
      - Untuk 2 titik: P(x) = ${dividedDiff[0][0]} + ${dividedDiff[0][1]}(x-${
      points[0].x
    })
      - Hasil: ${result}
    `);
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

    // Canvas setup with high-resolution scaling for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Improved chart dimensions with better margins
    const chartWidth = rect.width - 100;
    const chartHeight = 320;
    const marginLeft = 70;
    const marginTop = 50;
    const marginBottom = 60;
    const marginRight = 30;

    // Find min and max values for scaling with improved padding
    const minYear = Math.min(startYearNum, endYearNum) - 1;
    const maxYear = Math.max(startYearNum, endYearNum) + 1;
    const yearRange = maxYear - minYear;

    const allCounts = [startCountNum, endCountNum];
    if (interpolationResult !== null && targetYearNum) {
      allCounts.push(interpolationResult);
    }
    const minCount = Math.min(...allCounts) * 0.9; // 10% padding
    const maxCount = Math.max(...allCounts) * 1.1; // 10% padding
    const countRange = maxCount - minCount;

    // Draw background grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const yTickCount = 6;
    for (let i = 0; i <= yTickCount; i++) {
      const y = marginTop + ((yTickCount - i) / yTickCount) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(marginLeft + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    const xTickCount = yearRange > 5 ? yearRange : 5;
    for (let i = 0; i <= xTickCount; i++) {
      const x = marginLeft + (i / xTickCount) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, marginTop + chartHeight);
      ctx.stroke();
    }

    // Draw axes with improved styling
    ctx.beginPath();
    ctx.moveTo(marginLeft, marginTop);
    ctx.lineTo(marginLeft, marginTop + chartHeight);
    ctx.lineTo(marginLeft + chartWidth, marginTop + chartHeight);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw y-axis grid lines and labels with improved styling
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#475569";

    for (let i = 0; i <= yTickCount; i++) {
      const y = marginTop + ((yTickCount - i) / yTickCount) * chartHeight;
      const value = Math.round(
        minCount + (i / yTickCount) * (maxCount - minCount)
      );

      // Tick mark
      ctx.beginPath();
      ctx.moveTo(marginLeft - 5, y);
      ctx.lineTo(marginLeft, y);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillText(value.toLocaleString(), marginLeft - 10, y);
    }

    // Draw x-axis labels and tick marks with improved styling
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#475569";
    ctx.font = "12px Inter, system-ui, sans-serif";

    const yearStep = yearRange > 5 ? Math.ceil(yearRange / 5) : 1;
    for (let year = minYear; year <= maxYear; year += yearStep) {
      const x = marginLeft + ((year - minYear) / yearRange) * chartWidth;

      // Tick mark
      ctx.beginPath();
      ctx.moveTo(x, marginTop + chartHeight);
      ctx.lineTo(x, marginTop + chartHeight + 5);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillText(year.toString(), x, marginTop + chartHeight + 10);
    }

    // Draw chart title with improved styling
    ctx.fillStyle = "#1e40af"; // Dark blue color
    ctx.font = "bold 16px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "Prediksi dengan Interpolasi Polinom Newton",
      marginLeft + chartWidth / 2,
      marginTop - 25
    );

    // Draw start and end points
    const getX = (year: number) =>
      marginLeft + ((year - minYear) / yearRange) * chartWidth;

    const getY = (count: number) =>
      marginTop + chartHeight - ((count - minCount) / countRange) * chartHeight;

    const startX = getX(startYearNum);
    const startY = getY(startCountNum);
    const endX = getX(endYearNum);
    const endY = getY(endCountNum);

    // Draw line between points with gradient
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, "#3b82f6");
    gradient.addColorStop(1, "#2563eb");

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw data points with improved styling
    const drawPoint = (
      x: number,
      y: number,
      color: string,
      size: number = 7
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawPoint(startX, startY, "#3b82f6");
    drawPoint(endX, endY, "#3b82f6");

    // Draw labels for start and end points with improved styling
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";

    // Data point labels with background
    const drawPointLabel = (x: number, y: number, text: string) => {
      const padding = 4;
      const textWidth = ctx.measureText(text).width;
      const textHeight = 16;

      // Draw background
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(
        x - textWidth / 2 - padding,
        y - 24 - padding,
        textWidth + padding * 2,
        textHeight + padding * 2
      );

      // Draw border
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        x - textWidth / 2 - padding,
        y - 24 - padding,
        textWidth + padding * 2,
        textHeight + padding * 2
      );

      // Draw text
      ctx.fillStyle = "#1e293b";
      ctx.fillText(text, x, y - 24);
    };

    drawPointLabel(
      startX,
      startY,
      `${startYearNum}: ${startCountNum.toLocaleString()}`
    );

    drawPointLabel(
      endX,
      endY,
      `${endYearNum}: ${endCountNum.toLocaleString()}`
    );

    // Draw extrapolation/interpolation point if available
    if (interpolationResult !== null && targetYearNum) {
      const targetX = getX(targetYearNum);
      const targetY = getY(interpolationResult);

      // Draw dashed line from axis to prediction point
      ctx.beginPath();
      ctx.setLineDash([5, 3]);
      ctx.moveTo(targetX, marginTop + chartHeight);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw horizontal dashed line to y-axis
      ctx.beginPath();
      ctx.setLineDash([5, 3]);
      ctx.moveTo(marginLeft, targetY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw prediction point
      drawPoint(targetX, targetY, "#10b981", 8);

      // Draw prediction label
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 14px Inter, system-ui, sans-serif";

      drawPointLabel(
        targetX,
        targetY,
        `${targetYearNum}: ${interpolationResult.toLocaleString()}`
      );
    }

    // Draw legend with improved styling
    const legendY = marginTop + 20;
    const legendX = marginLeft + chartWidth - 150;

    // Legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(legendX - 10, legendY - 10, 160, 70);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 10, legendY - 10, 160, 70);

    // Legend items
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText("Data Aktual", legendX + 20, legendY);
    drawPoint(legendX + 10, legendY, "#3b82f6", 6);

    if (interpolationResult !== null) {
      ctx.fillText("Data Prediksi", legendX + 20, legendY + 30);
      drawPoint(legendX + 10, legendY + 30, "#10b981", 6);
    }

    // Draw y-axis title with improved styling
    ctx.save();
    ctx.translate(15, marginTop + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#334155";
    ctx.font = "14px Inter, system-ui, sans-serif";
    ctx.fillText("Jumlah UMKM", 0, 0);
    ctx.restore();

    // Draw x-axis title with improved styling
    ctx.fillStyle = "#334155";
    ctx.font = "14px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "Tahun",
      marginLeft + chartWidth / 2,
      marginTop + chartHeight + 45
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
          Data Tahun Referensi
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
            Visualisasi Prediksi dengan Interpolasi Polinom Newton
          </h3>
          <div className="bg-slate-50 p-4 rounded-lg shadow-inner">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "400px" }}
            ></canvas>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
          Prediksi Data UMKM
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tahun Target Prediksi
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
              Hitung Prediksi
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
                Hasil Prediksi
              </h4>
            </div>
            <p className="text-slate-600 mb-3">
              Berdasarkan metode interpolasi polinom Newton dengan divided
              differences, prediksi jumlah UMKM di Jawa Barat pada tahun{" "}
              {targetYear} adalah:
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
                Prediksi ini menggunakan metode interpolasi polinom Newton
                dengan divided differences. Untuk dua titik data, formula yang
                digunakan adalah P(x) = f[x₀] + f[x₀,x₁](x-x₀), di mana:
                <br />- f[x₀] adalah nilai UMKM di tahun awal
                <br />- f[x₀,x₁] adalah koefisien beda terbagi pertama
                <br />- x adalah tahun target prediksi
                <br />
                <br />
                Metode ini dapat digunakan untuk interpolasi (prediksi di antara
                data) maupun ekstrapolasi (prediksi di luar data) dan memberikan
                hasil yang akurat terutama untuk pola data yang polinom.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

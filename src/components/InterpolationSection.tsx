"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useModelData } from "../contexts/ModelContext";

export const InterpolationSection: React.FC = () => {
  // State untuk data dinamis
  const [dataRows, setDataRows] = useState<{ year: string; count: string }[]>([
    { year: "", count: "" },
    { year: "", count: "" },
  ]);
  const [targetYear, setTargetYear] = useState<string>("");
  const [interpolationResult, setInterpolationResult] = useState<number | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fungsi tambah/hapus baris data
  const addRow = () => setDataRows([...dataRows, { year: "", count: "" }]);
  const removeRow = (idx: number) => {
    if (dataRows.length <= 2) return;
    setDataRows(dataRows.filter((_, i) => i !== idx));
  };
  const updateRow = (idx: number, field: "year" | "count", value: string) => {
    setDataRows(
      dataRows.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  // Perhitungan interpolasi Newton (divided differences)
  function dividedDiff(x: number[], y: number[]) {
    const n = x.length;
    const coef = [...y];
    for (let j = 1; j < n; j++) {
      for (let i = n - 1; i >= j; i--) {
        coef[i] = (coef[i] - coef[i - 1]) / (x[i] - x[i - j]);
      }
    }
    return coef;
  }
  function newtonPoly(coef: number[], xData: number[], xVal: number) {
    let result = coef[0];
    let term = 1;
    for (let i = 1; i < coef.length; i++) {
      term *= xVal - xData[i - 1];
      result += coef[i] * term;
    }
    return result;
  }

  // Hitung prediksi
  const calculateInterpolation = () => {
    const x = dataRows.map((r) => Number(r.year));
    const y = dataRows.map((r) => Number(r.count));
    const tYear = Number(targetYear);
    if (
      x.some(isNaN) ||
      y.some(isNaN) ||
      isNaN(tYear) ||
      new Set(x).size !== x.length // tahun tidak boleh duplikat
    ) {
      setInterpolationResult(null);
      return;
    }
    // Urutkan data berdasarkan tahun
    const zipped = x
      .map((v, i) => ({ year: v, count: y[i] }))
      .sort((a, b) => a.year - b.year);
    const xSorted = zipped.map((z) => z.year);
    const ySorted = zipped.map((z) => z.count);
    const coef = dividedDiff(xSorted, ySorted);
    const result = newtonPoly(coef, xSorted, tYear);
    setInterpolationResult(Math.round(result));
  };

  // Otomatis hitung jika data berubah
  useEffect(() => {
    if (targetYear && dataRows.every((r) => r.year && r.count)) {
      calculateInterpolation();
    } else {
      setInterpolationResult(null);
    }
    // eslint-disable-next-line
  }, [dataRows, targetYear]);

  // Draw interpolation chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dataRows.every((r) => r.year && r.count)) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Parse input values
    const xData = dataRows.map((r) => Number(r.year));
    const yData = dataRows.map((r) => Number(r.count));
    const targetYearNum = targetYear ? Number.parseInt(targetYear) : null;

    if (
      xData.some(isNaN) ||
      yData.some(isNaN) ||
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
    const minYear = Math.min(...xData) - 1;
    const maxYear = Math.max(...xData) + 1;
    const yearRange = maxYear - minYear;

    const allCounts = [...yData];
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

    // Draw line between points with gradient
    const gradient = ctx.createLinearGradient(
      marginLeft,
      marginTop + chartHeight,
      marginLeft + chartWidth,
      marginTop
    );
    gradient.addColorStop(0, "#3b82f6");
    gradient.addColorStop(1, "#2563eb");

    ctx.beginPath();
    ctx.moveTo(getX(xData[0]), getY(yData[0]));
    ctx.lineTo(getX(xData[xData.length - 1]), getY(yData[yData.length - 1]));
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

    xData.forEach((year, i) => {
      drawPoint(getX(year), getY(yData[i]), "#3b82f6");
    });

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

    xData.forEach((year, i) => {
      drawPointLabel(
        getX(year),
        getY(yData[i]),
        `${year}: ${yData[i].toLocaleString()}`
      );
    });

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
  }, [dataRows, targetYear, interpolationResult]);

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
        {/* Tabel input dinamis */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-[320px] w-full border border-slate-200 rounded text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-3 py-2 border-b border-slate-200">Tahun</th>
                <th className="px-3 py-2 border-b border-slate-200">
                  Jumlah UMKM
                </th>
                <th className="px-3 py-2 border-b border-slate-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 border-b border-slate-100">
                    <Input
                      type="number"
                      value={row.year}
                      onChange={(e) => updateRow(idx, "year", e.target.value)}
                      placeholder="Tahun"
                    />
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    <Input
                      type="number"
                      value={row.count}
                      onChange={(e) => updateRow(idx, "count", e.target.value)}
                      placeholder="Jumlah UMKM"
                    />
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    <Button
                      onClick={() => removeRow(idx)}
                      className="text-xs bg-red-100 text-red-700 hover:bg-red-200"
                      disabled={dataRows.length <= 2}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            onClick={addRow}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            Tambah Baris
          </Button>
        </div>
      </div>

      {/* Rumus dan chart tetap */}
      {dataRows.every((r) => r.year && r.count) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            Visualisasi Prediksi dengan Interpolasi Polinom Newton
          </h3>
          {/* Rumus asli interpolasi Newton */}
          <div className="mb-4">
            <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded">
              <div className="font-semibold text-blue-900 mb-2">
                Rumus Interpolasi Polinom Newton:
              </div>
              <div className="text-slate-700 text-base font-mono">
                <span>
                  P(x) = f[x₀] + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁) + ...
                  <br />
                  <span className="text-xs text-slate-500">
                    Untuk n data: gunakan semua titik tahun & jumlah UMKM
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg shadow-inner">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "400px" }}
            ></canvas>
          </div>
          {/* Tabel data awal dan hasil prediksi */}
          <div className="mt-6">
            <h4 className="font-semibold text-blue-900 mb-2">
              Tabel Data & Hasil Prediksi
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-[320px] w-full border border-slate-200 rounded text-sm">
                <thead>
                  <tr className="bg-blue-50 text-blue-900">
                    <th className="px-3 py-2 border-b border-slate-200">
                      Tahun
                    </th>
                    <th className="px-3 py-2 border-b border-slate-200">
                      Jumlah UMKM
                    </th>
                    <th className="px-3 py-2 border-b border-slate-200">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 border-b border-slate-100">
                      {dataRows[0].year}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      {Number(dataRows[0].count).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      Data Awal
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 border-b border-slate-100">
                      {dataRows[1].year}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      {Number(dataRows[1].count).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      Data Akhir
                    </td>
                  </tr>
                  {interpolationResult !== null && targetYear && (
                    <tr className="bg-green-50 font-semibold">
                      <td className="px-3 py-2 border-b border-slate-100">
                        {targetYear}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-green-700">
                        {Number(interpolationResult).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100">
                        Hasil Prediksi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
              placeholder="Contoh: 2025"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Masukkan tahun target prediksi (boleh di luar data)
            </p>
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
              Berdasarkan interpolasi polinom Newton, prediksi jumlah UMKM pada
              tahun {targetYear} adalah:
            </p>
            <div className="bg-white p-4 rounded-lg text-center mb-4 shadow-sm">
              <p className="text-3xl font-bold text-blue-800">
                {interpolationResult.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">UMKM</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useModelData } from "../contexts/ModelContext";
// Tambahkan import recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

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

  const { comparisonData } = useModelData();

  // Fungsi untuk mengisi dataRows dari comparisonData
  const useImportedData = () => {
    if (comparisonData.length >= 2) {
      setDataRows(
        comparisonData.map((d) => ({
          year: d.year.toString(),
          count: d.count.toString(),
        }))
      );
    }
  };

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
    // Buat tabel 2D untuk divided differences
    const table: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      table[i][0] = y[i];
    }
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] =
          (table[i + 1][j - 1] - table[i][j - 1]) / (x[i + j] - x[i]);
      }
    }
    // Ambil koefisien diagonal atas (f[x0], f[x0,x1], f[x0,x1,x2], ...)
    return Array.from({ length: n }, (_, i) => table[0][i]);
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

  // Siapkan data untuk recharts
  // Ambil data aktual, lalu tambahkan prediksi hanya jika tahun prediksi belum ada di data aktual
  const actualData = dataRows
    .filter((r) => r.year && r.count)
    .map((r) => ({
      year: Number(r.year),
      count: Number(r.count),
      type: "actual",
    }));

  // Cek apakah tahun prediksi sudah ada di data aktual
  const predYearNum = targetYear ? Number(targetYear) : null;
  const hasPrediksi =
    interpolationResult !== null &&
    predYearNum !== null &&
    !actualData.some((d) => d.year === predYearNum);

  // Gabungkan data aktual dan prediksi (prediksi hanya di tahun target)
  const chartData = [
    ...actualData,
    ...(hasPrediksi
      ? [
          {
            year: predYearNum,
            count: interpolationResult,
            type: "prediksi",
          },
        ]
      : []),
  ].sort((a, b) => a.year - b.year);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
          Data Tahun Referensi
        </h3>
        {/* Tombol gunakan data terimpor */}
        <div className="mb-4">
          <Button
            onClick={useImportedData}
            className="text-sm bg-green-600 hover:bg-green-700 text-white"
            disabled={comparisonData.length < 2}
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
          {/* Ganti canvas dengan recharts */}
          <div
            className="bg-slate-50 p-4 rounded-lg shadow-inner"
            style={{ height: 400 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[
                    Math.min(...chartData.map((d) => d.year)),
                    Math.max(...chartData.map((d) => d.year)),
                  ]}
                  tick={{ fill: "#334155", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  allowDuplicatedCategory={false}
                  interval={0}
                >
                  <Label
                    value="Tahun"
                    offset={20}
                    position="insideBottom"
                    fill="#334155"
                    fontSize={14}
                  />
                </XAxis>
                <YAxis
                  tick={{ fill: "#334155", fontSize: 12 }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  width={90}
                  tickFormatter={(v) => v.toLocaleString()}
                >
                  <Label
                    value="Jumlah UMKM"
                    angle={-90}
                    position="insideLeft"
                    fill="#334155"
                    fontSize={14}
                  />
                </YAxis>
                <Tooltip
                  formatter={(value: any) => value.toLocaleString()}
                  labelFormatter={(label) => `Tahun: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Data Aktual"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    fill: "#2563eb",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                  connectNulls
                  data={chartData.filter((d) => d.type === "actual")}
                />
                {hasPrediksi && (
                  <Line
                    type="linear"
                    dataKey="count"
                    name="Data Prediksi"
                    stroke="#10b981"
                    strokeWidth={3}
                    strokeDasharray="8 4"
                    dot={{
                      r: 7,
                      fill: "#10b981",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                    connectNulls
                    data={[
                      chartData[chartData.length - 2], // titik aktual terakhir
                      chartData[chartData.length - 1], // titik prediksi
                    ]}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
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
                  {/* Tampilkan seluruh data tahun referensi */}
                  {dataRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 border-b border-slate-100">
                        {row.year}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100">
                        {Number(row.count).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100">
                        {idx === 0
                          ? "Data Awal"
                          : idx === dataRows.length - 1
                          ? "Data Akhir"
                          : "Data Antara"}
                      </td>
                    </tr>
                  ))}
                  {/* Baris hasil prediksi */}
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

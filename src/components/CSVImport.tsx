"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useData } from "../contexts/DataContext";
import { useModelData } from "../contexts/ModelContext";
import { showSuccess, showError } from "../utils/chartUtils";

export const CSVImport: React.FC = () => {
  const { importCSVData } = useData();
  const { setComparisonData } = useModelData();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file extension
    if (!file.name.endsWith(".csv")) {
      showError("Format File Salah", "Harap unggah file dalam format CSV");
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const rows = text.split("\n");

      // Extract headers and normalize them
      const headers = rows[0].split(",").map(
        (header) =>
          header
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]/gi, "") // Remove special chars
      );

      // Validate required columns exist
      const requiredColumns = [
        "nama_provinsi",
        "nama_kabupaten_kota",
        "proyeksi_jumlah_umkm",
        "tahun",
      ];
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      );

      if (missingColumns.length > 0) {
        showError(
          "Kolom Tidak Lengkap",
          `File CSV harus memiliki kolom: ${missingColumns.join(", ")}`
        );
        return;
      }

      // Parse data rows
      const csvData = rows
        .slice(1)
        .filter((row) => row.trim())
        .map((row) => {
          const values = row.split(",");
          const rowData: Record<string, string> = {};

          headers.forEach((header, index) => {
            rowData[header] = values[index]?.trim() || "";
          });

          return {
            provinsi: rowData.nama_provinsi,
            kabupaten: rowData.nama_kabupaten_kota,
            jumlahUMKM: parseInt(rowData.proyeksi_jumlah_umkm),
            tahun: parseInt(rowData.tahun),
          };
        });

      // Filter out rows with invalid data
      const validData = csvData.filter(
        (item) =>
          !isNaN(item.jumlahUMKM) &&
          !isNaN(item.tahun) &&
          item.provinsi &&
          item.kabupaten
      );

      if (validData.length === 0) {
        showError(
          "Data Tidak Valid",
          "Tidak ada data valid yang dapat diimpor dari file CSV"
        );
        return;
      }

      // Get unique years for the message
      const years = Array.from(
        new Set(validData.map((item) => item.tahun))
      ).sort();

      // Import the data to DataContext
      importCSVData(validData);

      // Also update the comparison data for the analysis tab
      // Group by year and aggregate
      const yearlyData = years.map((year) => {
        const yearData = validData.filter((item) => item.tahun === year);
        const totalCount = yearData.reduce(
          (sum, item) => sum + item.jumlahUMKM,
          0
        );
        return { year, count: totalCount };
      });

      // Update the ModelContext with this aggregated data
      setComparisonData(yearlyData);

      showSuccess(
        "Impor Berhasil",
        `${validData.length} data dari ${years.length} tahun berhasil diimpor`
      );
    } catch (error) {
      console.error("Error parsing CSV:", error);
      showError(
        "Error",
        "Gagal mengimpor file CSV. Silakan periksa format file Anda."
      );
    } finally {
      setIsLoading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 mb-6">
      <h4 className="font-medium mb-3">Import Data CSV</h4>
      <p className="text-slate-600 text-sm mb-4">
        Unggah file CSV dengan format kolom: nama_provinsi, nama_kabupaten_kota,
        proyeksi_jumlah_umkm, tahun
      </p>

      <label className="flex flex-col items-center px-4 py-6 bg-slate-50 text-slate-500 rounded-lg border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-100">
        <div className="flex flex-col items-center">
          <svg
            className="w-8 h-8 mb-3 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm font-semibold">
            Klik untuk memilih file CSV
          </p>
          <p className="text-xs text-slate-500">Format: .csv (maks. 2MB)</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
      </label>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
          <span className="ml-2">Mengimpor data...</span>
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          Data yang diimpor akan tersedia di semua tab termasuk prediksi dan
          analisis
        </span>
      </div>
    </div>
  );
};

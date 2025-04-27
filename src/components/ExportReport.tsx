"use client";

import React from "react";
import { Button } from "./ui/button";
import { showInfo } from "../utils/chartUtils";
import { useData } from "../contexts/DataContext";

export const ExportReport: React.FC = () => {
  const { umkmData } = useData();

  const handleExportPDF = () => {
    if (umkmData.length === 0) {
      showInfo(
        "Perhatian",
        "Tidak ada data untuk diekspor. Silakan tambahkan data terlebih dahulu."
      );
      return;
    }
    showInfo("Ekspor PDF", "Fitur ekspor PDF akan segera tersedia.");
  };

  const handleExportExcel = () => {
    if (umkmData.length === 0) {
      showInfo(
        "Perhatian",
        "Tidak ada data untuk diekspor. Silakan tambahkan data terlebih dahulu."
      );
      return;
    }
    showInfo("Ekspor Excel", "Fitur ekspor Excel akan segera tersedia.");
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
        Ekspor Laporan
      </h3>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
        <p className="text-slate-600 mb-4">
          Unduh data dalam format PDF atau Excel untuk analisis lebih lanjut
          atau pelaporan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleExportPDF}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white transition-colors flex items-center justify-center px-4 py-2 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clipRule="evenodd"
              />
            </svg>
            Ekspor ke PDF
          </Button>

          <Button
            onClick={handleExportExcel}
            className="w-full bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center justify-center px-4 py-2 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Ekspor ke Excel
          </Button>
        </div>

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
          Data yang diekspor akan mencakup semua informasi yang terlihat di
          dashboard
        </div>
      </div>
    </div>
  );
};

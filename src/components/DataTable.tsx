"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useData } from "../contexts/DataContext";
import { showError, showInfo } from "../utils/chartUtils";

export const DataTable: React.FC = () => {
  const { umkmData, addData, removeData, clearData } = useData();
  const [year, setYear] = useState<string>("");
  const [count, setCount] = useState<string>("");

  const handleAddData = () => {
    if (!year || !count) {
      showError("Input Tidak Lengkap", "Tahun dan jumlah UMKM harus diisi");
      return;
    }

    const yearNum = Number.parseInt(year);
    const countNum = Number.parseInt(count);

    if (isNaN(yearNum) || isNaN(countNum)) {
      showError(
        "Input Tidak Valid",
        "Tahun dan jumlah UMKM harus berupa angka"
      );
      return;
    }

    addData(yearNum, countNum);
    setYear("");
    setCount("");
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
        Data Historis UMKM
      </h3>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 mb-6">
        <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
          Tambah Data Baru
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tahun
            </label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Contoh: 2020"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jumlah UMKM
            </label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Contoh: 150000"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-4">
            <Button
              onClick={handleAddData}
              className="w-full bg-blue-800 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 inline-block"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Tambah Data
            </Button>
          </div>
        </div>
      </div>

      {umkmData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tahun
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Jumlah UMKM
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {umkmData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                        {item.year}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-700">
                        {item.count.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-700">
                        <Button
                          onClick={() => removeData(item.id)}
                          className="inline-flex items-center px-2 py-1 text-xs md:text-sm md:px-3 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1 md:h-4 md:w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-slate-700 mb-2">
            Belum ada data
          </h4>
          <p className="text-slate-500">
            Silakan tambahkan data UMKM menggunakan form di atas.
          </p>
        </div>
      )}
    </div>
  );
};

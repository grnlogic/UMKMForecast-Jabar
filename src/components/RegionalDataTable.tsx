"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useData } from "../contexts/DataContext";

export const RegionalDataTable: React.FC = () => {
  const { regionalData } = useData();
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterProvinsi, setFilterProvinsi] = useState<string>("");
  const [filterKabupaten, setFilterKabupaten] = useState<string>("");
  const [groupByYear, setGroupByYear] = useState<boolean>(true);

  // Get unique years, provinces, and districts for filtering
  const years = Array.from(
    new Set(regionalData.map((item) => item.tahun))
  ).sort((a, b) => a - b);
  const provinces = Array.from(
    new Set(regionalData.map((item) => item.provinsi))
  ).sort();

  // Filter data based on user input
  const filteredData = regionalData.filter((item) => {
    if (filterYear && item.tahun !== parseInt(filterYear)) return false;
    if (
      filterProvinsi &&
      !item.provinsi.toLowerCase().includes(filterProvinsi.toLowerCase())
    )
      return false;
    if (
      filterKabupaten &&
      !item.kabupaten.toLowerCase().includes(filterKabupaten.toLowerCase())
    )
      return false;
    return true;
  });

  // Group by year if enabled
  const groupedByYear = years.map((year) => ({
    year,
    count: regionalData.filter((item) => item.tahun === year).length,
    totalUMKM: regionalData
      .filter((item) => item.tahun === year)
      .reduce((sum, item) => sum + item.jumlahUMKM, 0),
  }));

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4">
        Data Regional UMKM
      </h3>

      {regionalData.length > 0 ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Filter Data</h4>
              <Button
                onClick={() => setGroupByYear(!groupByYear)}
                className="text-sm bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
              >
                {groupByYear ? "Tampilkan Detail" : "Tampilkan Ringkasan Tahun"}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tahun
                </label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua Tahun ({years.length} tahun)</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {!groupByYear && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Provinsi
                    </label>
                    <Input
                      type="text"
                      value={filterProvinsi}
                      onChange={(e) => setFilterProvinsi(e.target.value)}
                      placeholder="Cari nama provinsi..."
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Kabupaten/Kota
                    </label>
                    <Input
                      type="text"
                      value={filterKabupaten}
                      onChange={(e) => setFilterKabupaten(e.target.value)}
                      placeholder="Cari nama kabupaten/kota..."
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              {groupByYear ? (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Tahun
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Jumlah Kabupaten/Kota
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Total UMKM
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {groupedByYear.map((item) => (
                      <tr
                        key={item.year}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                          {item.year}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-700 text-right">
                          {item.count}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-700 text-right">
                          {item.totalUMKM.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-center">
                          <Button
                            onClick={() => setFilterYear(item.year.toString())}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Lihat Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Tahun
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Provinsi
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Kabupaten/Kota
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Jumlah UMKM
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                          {item.tahun}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-700">
                          {item.provinsi}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-700">
                          {item.kabupaten}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-slate-700 text-right">
                          {item.jumlahUMKM.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="px-3 py-3 bg-slate-50 text-xs text-slate-500 flex justify-between">
              <span>
                Total: {regionalData.length} data dari {years.length} tahun
              </span>
              <span>
                {!groupByYear &&
                  `Menampilkan ${filteredData.length} dari ${regionalData.length} data`}
              </span>
            </div>
          </div>
        </>
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
            Belum ada data regional
          </h4>
          <p className="text-slate-500">
            Silakan impor data regional menggunakan fitur Import Data CSV di
            atas.
          </p>
        </div>
      )}
    </div>
  );
};

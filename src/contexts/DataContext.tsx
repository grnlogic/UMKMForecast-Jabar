"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  showSuccess,
  showError,
  showConfirmation,
  showWarning,
} from "../utils/chartUtils";

interface DataPoint {
  id: number;
  year: number;
  count: number;
}

interface RegionalDataPoint {
  provinsi: string;
  kabupaten: string;
  jumlahUMKM: number;
  tahun: number;
}

interface DataContextType {
  umkmData: DataPoint[];
  regionalData: RegionalDataPoint[];
  addData: (year: number, count: number) => void;
  removeData: (id: number) => void;
  clearData: () => void;
  importCSVData: (data: RegionalDataPoint[]) => void;
  getRegionalDataForYear: (year: number) => RegionalDataPoint[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [umkmData, setUmkmData] = useState<DataPoint[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalDataPoint[]>([]);
  const [nextId, setNextId] = useState(1);

  const addData = (year: number, count: number) => {
    const newData = [...umkmData, { id: nextId, year, count }];
    setUmkmData(newData.sort((a, b) => a.year - b.year));
    setNextId(nextId + 1);
  };

  const removeData = async (id: number) => {
    const itemToRemove = umkmData.find((item) => item.id === id);
    if (!itemToRemove) return;

    const result = await showConfirmation(
      "Hapus Data",
      `Apakah Anda yakin ingin menghapus data untuk tahun ${itemToRemove.year}?`
    );

    if (result.isConfirmed) {
      setUmkmData((prevData) => prevData.filter((item) => item.id !== id));
      showSuccess(
        "Data Dihapus",
        `Data untuk tahun ${itemToRemove.year} telah berhasil dihapus.`
      );
    }
  };

  const clearData = async () => {
    if (umkmData.length === 0) return;

    const result = await showConfirmation(
      "Hapus Semua Data",
      "Apakah Anda yakin ingin menghapus semua data?"
    );

    if (result.isConfirmed) {
      setUmkmData([]);
      showSuccess("Data Dihapus", "Semua data telah berhasil dihapus.");
    }
  };

  const importCSVData = (data: RegionalDataPoint[]) => {
    setRegionalData([...regionalData, ...data]);

    // Also aggregate the data by year and add to umkmData
    const yearlyTotals = new Map<number, number>();

    // Sum up all UMKM counts by year
    data.forEach((item) => {
      const currentTotal = yearlyTotals.get(item.tahun) || 0;
      yearlyTotals.set(item.tahun, currentTotal + item.jumlahUMKM);
    });

    // Add aggregated yearly data to umkmData
    yearlyTotals.forEach((count, year) => {
      // Check if the year already exists
      const existingIndex = umkmData.findIndex((d) => d.year === year);

      if (existingIndex >= 0) {
        // Update existing year
        const updatedData = [...umkmData];
        updatedData[existingIndex].count = count;
        setUmkmData(updatedData);
      } else {
        // Add new year
        addData(year, count);
      }
    });
  };

  const getRegionalDataForYear = (year: number) => {
    return regionalData.filter((item) => item.tahun === year);
  };

  const value = {
    umkmData,
    regionalData,
    addData,
    removeData,
    clearData,
    importCSVData,
    getRegionalDataForYear,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

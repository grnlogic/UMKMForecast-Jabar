"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { showSuccess, showError, showConfirmation, showWarning } from "../utils/chartUtils";

export interface UMKMData {
  id: number;
  year: number;
  count: number;
}

interface DataContextType {
  umkmData: UMKMData[];
  addData: (year: number, count: number) => void;
  removeData: (id: number) => void;
  clearData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [umkmData, setUmkmData] = useState<UMKMData[]>([]);

  const addData = (year: number, count: number) => {
    // Cek apakah tahun sudah ada
    const existingData = umkmData.find((item) => item.year === year);
    if (existingData) {
      showWarning(
        "Data Duplikat",
        `Data untuk tahun ${year} sudah ada. Silakan gunakan tahun yang berbeda.`
      );
      return;
    }

    const newData: UMKMData = {
      id: Date.now(),
      year,
      count,
    };
    setUmkmData((prevData) =>
      [...prevData, newData].sort((a, b) => a.year - b.year)
    );

    showSuccess(
      "Data Ditambahkan",
      `Data untuk tahun ${year} telah berhasil ditambahkan.`
    );
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

  return (
    <DataContext.Provider value={{ umkmData, addData, removeData, clearData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData harus digunakan dalam DataProvider");
  }
  return context;
}

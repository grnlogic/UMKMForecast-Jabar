"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { showSuccess, showError } from "../utils/chartUtils";

export const CalculationCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<
    "regression" | "interpolation"
  >("regression");

  // Regression calculation state
  const [regressionInputs, setRegressionInputs] = useState<{
    x: string[];
    y: string[];
    targetX: string;
  }>({
    x: ["", ""],
    y: ["", ""],
    targetX: "",
  });

  // Interpolation calculation state
  const [interpolationInputs, setInterpolationInputs] = useState<{
    x1: string;
    y1: string;
    x2: string;
    y2: string;
    targetX: string;
  }>({
    x1: "",
    y1: "",
    x2: "",
    y2: "",
    targetX: "",
  });

  const [result, setResult] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");

  // Add a value pair to regression inputs
  const addRegressionInputPair = () => {
    setRegressionInputs({
      ...regressionInputs,
      x: [...regressionInputs.x, ""],
      y: [...regressionInputs.y, ""],
    });
  };

  // Remove a value pair from regression inputs
  const removeRegressionInputPair = (index: number) => {
    if (regressionInputs.x.length <= 2) {
      showError(
        "Minimal 2 Data",
        "Diperlukan minimal 2 data untuk perhitungan regresi"
      );
      return;
    }

    const newX = [...regressionInputs.x];
    const newY = [...regressionInputs.y];
    newX.splice(index, 1);
    newY.splice(index, 1);

    setRegressionInputs({
      ...regressionInputs,
      x: newX,
      y: newY,
    });
  };

  // Handle regression input changes
  const handleRegressionInputChange = (
    index: number,
    field: "x" | "y",
    value: string
  ) => {
    const newValues = [...regressionInputs[field]];
    newValues[index] = value;

    setRegressionInputs({
      ...regressionInputs,
      [field]: newValues,
    });
  };

  // Handle interpolation input changes
  const handleInterpolationInputChange = (
    field: keyof typeof interpolationInputs,
    value: string
  ) => {
    setInterpolationInputs({
      ...interpolationInputs,
      [field]: value,
    });
  };

  // Calculate linear regression
  const calculateRegression = () => {
    try {
      // Validate inputs
      const xValues = regressionInputs.x.map((x) => {
        const parsed = parseFloat(x);
        if (isNaN(parsed)) throw new Error("Terdapat nilai X yang bukan angka");
        return parsed;
      });

      const yValues = regressionInputs.y.map((y) => {
        const parsed = parseFloat(y);
        if (isNaN(parsed)) throw new Error("Terdapat nilai Y yang bukan angka");
        return parsed;
      });

      const targetX = parseFloat(regressionInputs.targetX);
      if (isNaN(targetX)) throw new Error("Nilai target X bukan angka");

      // Calculate regression
      const n = xValues.length;
      const sumX = xValues.reduce((sum, val) => sum + val, 0);
      const sumY = yValues.reduce((sum, val) => sum + val, 0);
      const sumXY = xValues.reduce((sum, val, i) => sum + val * yValues[i], 0);
      const sumXX = xValues.reduce((sum, val) => sum + val * val, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const predictedValue = slope * targetX + intercept;

      setResult(Math.round(predictedValue * 100) / 100);
      setExplanation(`
        Persamaan Regresi Linear: Y = ${slope.toFixed(
          4
        )}X + ${intercept.toFixed(4)}
        
        Langkah Perhitungan:
        1. Jumlah data (n) = ${n}
        2. Jumlah X = ${sumX}
        3. Jumlah Y = ${sumY}
        4. Jumlah X×Y = ${sumXY}
        5. Jumlah X² = ${sumXX}
        6. Slope (b) = (n×ΣXY - ΣX×ΣY) / (n×ΣX² - (ΣX)²) = ${slope.toFixed(4)}
        7. Intercept (a) = (ΣY - b×ΣX) / n = ${intercept.toFixed(4)}
        8. Prediksi: Y = ${slope.toFixed(4)} × ${targetX} + ${intercept.toFixed(
        4
      )} = ${predictedValue.toFixed(4)}
      `);

      showSuccess("Perhitungan Selesai", "Perhitungan regresi linear berhasil");
    } catch (error) {
      showError(
        "Error",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan dalam perhitungan"
      );
    }
  };

  // Calculate linear interpolation
  const calculateInterpolation = () => {
    try {
      // Validate inputs
      const x1 = parseFloat(interpolationInputs.x1);
      const y1 = parseFloat(interpolationInputs.y1);
      const x2 = parseFloat(interpolationInputs.x2);
      const y2 = parseFloat(interpolationInputs.y2);
      const targetX = parseFloat(interpolationInputs.targetX);

      if ([x1, y1, x2, y2, targetX].some(isNaN)) {
        throw new Error("Semua input harus berupa angka");
      }

      if (x1 === x2) {
        throw new Error("Nilai X1 dan X2 tidak boleh sama");
      }

      if (targetX <= Math.min(x1, x2) || targetX >= Math.max(x1, x2)) {
        showError(
          "Peringatan",
          "Nilai target X berada di luar rentang X1 dan X2. Hasil adalah ekstrapolasi, bukan interpolasi."
        );
      }

      // Calculate interpolation: y = y1 + (x - x1) * ((y2 - y1) / (x2 - x1))
      const interpolatedValue = y1 + (targetX - x1) * ((y2 - y1) / (x2 - x1));

      setResult(Math.round(interpolatedValue * 100) / 100);
      setExplanation(`
        Rumus Interpolasi Linear: y = y₁ + (x - x₁) × [(y₂ - y₁) / (x₂ - x₁)]
        
        Langkah Perhitungan:
        1. Titik 1: (${x1}, ${y1})
        2. Titik 2: (${x2}, ${y2})
        3. Target x: ${targetX}
        4. Interpolasi: y = ${y1} + (${targetX} - ${x1}) × [(${y2} - ${y1}) / (${x2} - ${x1})]
        5. y = ${y1} + (${targetX - x1}) × [${(y2 - y1) / (x2 - x1)}]
        6. y = ${y1} + ${(targetX - x1) * ((y2 - y1) / (x2 - x1))}
        7. y = ${interpolatedValue.toFixed(4)}
      `);

      showSuccess(
        "Perhitungan Selesai",
        "Perhitungan interpolasi linear berhasil"
      );
    } catch (error) {
      showError(
        "Error",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan dalam perhitungan"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-4">Pilih Jenis Kalkulator</h3>
        <div className="flex gap-4 mb-4">
          <Button
            onClick={() => setCalculationType("regression")}
            className={`flex-1 ${
              calculationType === "regression"
                ? "bg-blue-800 text-white"
                : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            Kalkulator Regresi Linear
          </Button>
          <Button
            onClick={() => setCalculationType("interpolation")}
            className={`flex-1 ${
              calculationType === "interpolation"
                ? "bg-blue-800 text-white"
                : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            Kalkulator Interpolasi Linear
          </Button>
        </div>
      </div>

      {calculationType === "regression" && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4">
            Kalkulator Regresi Linear
          </h3>
          <p className="text-slate-600 mb-4">
            Masukkan data X dan Y untuk menghitung persamaan regresi linear dan
            prediksi.
          </p>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Data Input</h4>
              <Button
                onClick={addRegressionInputPair}
                className="text-sm bg-green-600 hover:bg-green-700 text-white"
              >
                Tambah Baris
              </Button>
            </div>

            <div className="border rounded-md p-3 space-y-2">
              <div className="grid grid-cols-12 gap-2 font-semibold text-slate-700 mb-1">
                <div className="col-span-1">No</div>
                <div className="col-span-4">Nilai X</div>
                <div className="col-span-4">Nilai Y</div>
                <div className="col-span-3">Aksi</div>
              </div>

              {regressionInputs.x.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-1 text-center">{index + 1}</div>
                  <div className="col-span-4">
                    <Input
                      type="number"
                      value={regressionInputs.x[index]}
                      onChange={(e) =>
                        handleRegressionInputChange(index, "x", e.target.value)
                      }
                      placeholder="X"
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="number"
                      value={regressionInputs.y[index]}
                      onChange={(e) =>
                        handleRegressionInputChange(index, "y", e.target.value)
                      }
                      placeholder="Y"
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-3">
                    <Button
                      onClick={() => removeRegressionInputPair(index)}
                      className="text-sm bg-red-100 text-red-700 hover:bg-red-200"
                      disabled={regressionInputs.x.length <= 2}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Nilai X yang ingin diprediksi:
            </label>
            <Input
              type="number"
              value={regressionInputs.targetX}
              onChange={(e) =>
                setRegressionInputs({
                  ...regressionInputs,
                  targetX: e.target.value,
                })
              }
              placeholder="Contoh: 2025"
              className="w-full"
            />
          </div>

          <Button
            onClick={calculateRegression}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white"
          >
            Hitung Regresi Linear
          </Button>
        </div>
      )}

      {calculationType === "interpolation" && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4">
            Kalkulator Interpolasi Linear
          </h3>
          <p className="text-slate-600 mb-4">
            Masukkan dua titik data dan nilai target untuk menghitung
            interpolasi linear.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium mb-2">Titik Data 1</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Nilai X1:</label>
                  <Input
                    type="number"
                    value={interpolationInputs.x1}
                    onChange={(e) =>
                      handleInterpolationInputChange("x1", e.target.value)
                    }
                    placeholder="Contoh: 2015"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nilai Y1:</label>
                  <Input
                    type="number"
                    value={interpolationInputs.y1}
                    onChange={(e) =>
                      handleInterpolationInputChange("y1", e.target.value)
                    }
                    placeholder="Contoh: 120000"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Titik Data 2</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Nilai X2:</label>
                  <Input
                    type="number"
                    value={interpolationInputs.x2}
                    onChange={(e) =>
                      handleInterpolationInputChange("x2", e.target.value)
                    }
                    placeholder="Contoh: 2020"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Nilai Y2:</label>
                  <Input
                    type="number"
                    value={interpolationInputs.y2}
                    onChange={(e) =>
                      handleInterpolationInputChange("y2", e.target.value)
                    }
                    placeholder="Contoh: 150000"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Nilai X target untuk interpolasi:
            </label>
            <Input
              type="number"
              value={interpolationInputs.targetX}
              onChange={(e) =>
                handleInterpolationInputChange("targetX", e.target.value)
              }
              placeholder="Contoh: 2017"
              className="w-full"
            />
          </div>

          <Button
            onClick={calculateInterpolation}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white"
          >
            Hitung Interpolasi Linear
          </Button>
        </div>
      )}

      {result !== null && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-3">Hasil Perhitungan</h3>

          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h4 className="font-semibold text-lg">Hasil:</h4>
            </div>
            <p className="text-3xl font-bold text-blue-800">
              {result.toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Penjelasan Perhitungan:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-line font-mono">
              {explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

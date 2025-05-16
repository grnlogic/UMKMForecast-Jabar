/**
 * Utility functions for mathematical calculations used in the application
 */

export interface DataPoint {
  year: number;
  count: number;
}

/**
 * Calculates linear regression coefficients (y = ax + b)
 * @param data Array of data points
 * @returns Object containing slope (a) and intercept (b)
 */
export function calculateLinearRegression(data: DataPoint[]) {
  if (data.length < 2) {
    throw new Error("Minimal 2 data diperlukan untuk perhitungan regresi");
  }

  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.year, 0);
  const sumY = data.reduce((sum, point) => sum + point.count, 0);
  const sumXY = data.reduce((sum, point) => sum + point.year * point.count, 0);
  const sumXX = data.reduce((sum, point) => sum + point.year * point.year, 0);

  // Rumus regresi linier: y = ax + b
  const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX); // slope
  const b = (sumY - a * sumX) / n; // intercept

  return { a, b };
}

/**
 * Predicts a value using linear regression
 * @param data Array of data points
 * @param targetX The x value to predict
 * @returns The predicted y value
 */
export function predictLinearRegression(data: DataPoint[], targetX: number) {
  const { a, b } = calculateLinearRegression(data);
  return a * targetX + b;
}

/**
 * Calculates divided differences table for Newton interpolation
 * @param data Array of data points sorted by x values
 * @returns Array of divided differences with their orders
 */
export function calculateDividedDifferences(data: DataPoint[]) {
  const n = data.length;
  const result: { order: number; value: number }[] = [];

  // Zero-order differences (original function values)
  result.push({ order: 0, value: data[0].count });

  // Calculate divided differences of various orders
  const diffs: number[][] = [];

  // First-order differences
  diffs[0] = [];
  for (let i = 0; i < n - 1; i++) {
    diffs[0][i] =
      (data[i + 1].count - data[i].count) / (data[i + 1].year - data[i].year);
  }
  result.push({ order: 1, value: diffs[0][0] });

  // Higher-order differences
  for (let order = 1; order < n - 1; order++) {
    diffs[order] = [];
    for (let i = 0; i < n - order - 1; i++) {
      diffs[order][i] =
        (diffs[order - 1][i + 1] - diffs[order - 1][i]) /
        (data[i + order + 1].year - data[i].year);
    }
    result.push({ order: order + 1, value: diffs[order][0] });
  }

  return result;
}

/**
 * Calculates Newton polynomial interpolation
 * @param x The x value to interpolate
 * @param data Array of data points sorted by x values
 * @returns The interpolated y value
 */
export function newtonInterpolation(x: number, data: DataPoint[]) {
  if (data.length < 2) {
    throw new Error("Minimal 2 data diperlukan untuk interpolasi");
  }

  // Hitung tabel divided differences
  const diffTable = calculateDividedDifferences(data);

  let result = diffTable[0].value; // f[x0]
  let term = 1;

  for (let i = 1; i < diffTable.length; i++) {
    term *= x - data[i - 1].year;
    result += diffTable[i].value * term;
  }

  return result;
}

/**
 * Simple Newton interpolation for two points
 * @param x1 First x value
 * @param y1 First y value
 * @param x2 Second x value
 * @param y2 Second y value
 * @param targetX Target x value for interpolation
 * @returns The interpolated y value
 */
export function simpleNewtonInterpolation(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  targetX: number
) {
  // First divided difference
  const firstDividedDiff = (y2 - y1) / (x2 - x1);

  // Newton's interpolation formula (for two points)
  return y1 + firstDividedDiff * (targetX - x1);
}

/**
 * Calculates model evaluation metrics
 * @param actual Actual values
 * @param predicted Predicted values
 * @returns Object containing RMSE, MAE, and MAPE
 */
export function calculateModelMetrics(actual: number[], predicted: number[]) {
  if (actual.length !== predicted.length || actual.length === 0) {
    throw new Error("Array harus memiliki panjang yang sama dan tidak kosong");
  }

  const n = actual.length;

  // Calculate RMSE (Root Mean Square Error)
  const squaredErrors = actual.map((val, i) => Math.pow(val - predicted[i], 2));
  const mse = squaredErrors.reduce((sum, val) => sum + val, 0) / n;
  const rmse = Math.sqrt(mse);

  // Calculate MAE (Mean Absolute Error)
  const absoluteErrors = actual.map((val, i) => Math.abs(val - predicted[i]));
  const mae = absoluteErrors.reduce((sum, val) => sum + val, 0) / n;

  // Calculate MAPE (Mean Absolute Percentage Error)
  const percentageErrors = actual.map(
    (val, i) => Math.abs((val - predicted[i]) / val) * 100
  );
  const mape = percentageErrors.reduce((sum, val) => sum + val, 0) / n;

  return { rmse, mae, mape };
}

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useData } from "./DataContext";

interface DataPoint {
  year: number;
  count: number;
}

interface EvaluationDataPoint {
  year: number;
  actualCount: number;
  predictedCount: number;
}

interface ModelContextType {
  // Interpolation data
  startYear: string;
  startCount: string;
  endYear: string;
  endCount: string;
  targetYearInterpolation: string;
  interpolationResult: number | null;
  setStartYear: (value: string) => void;
  setStartCount: (value: string) => void;
  setEndYear: (value: string) => void;
  setEndCount: (value: string) => void;
  setTargetYearInterpolation: (value: string) => void;
  setInterpolationResult: (value: number | null) => void;

  // Comparison models data
  comparisonData: DataPoint[];
  futureYear: string;
  regressionResult: number | null;
  interpolationComparisonResult: number | null;
  setComparisonData: (data: DataPoint[]) => void;
  addComparisonDataPoint: (year: number, count: number) => void;
  removeComparisonDataPoint: (index: number) => void;
  setFutureYear: (value: string) => void;
  setRegressionResult: (value: number | null) => void;
  setInterpolationComparisonResult: (value: number | null) => void;
  
  // Use data from DataContext in ModelContext
  useUmkmDataForComparison: () => void;

  // Evaluation data
  evaluationData: EvaluationDataPoint[];
  metrics: {
    rmse: number | null;
    mae: number | null;
    mape: number | null;
  };
  addEvaluationDataPoint: (point: EvaluationDataPoint) => void;
  removeEvaluationDataPoint: (index: number) => void;
  setMetrics: (metrics: {
    rmse: number | null;
    mae: number | null;
    mape: number | null;
  }) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const useModelData = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModelData must be used within a ModelProvider");
  }
  return context;
};

export const ModelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get umkmData from DataContext for integration
  const { umkmData } = useData();

  // Interpolation state
  const [startYear, setStartYear] = useState<string>("");
  const [startCount, setStartCount] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [endCount, setEndCount] = useState<string>("");
  const [targetYearInterpolation, setTargetYearInterpolation] =
    useState<string>("");
  const [interpolationResult, setInterpolationResult] = useState<number | null>(
    null
  );

  // Comparison models state
  const [comparisonData, setComparisonData] = useState<DataPoint[]>([]);
  const [futureYear, setFutureYear] = useState<string>("");
  const [regressionResult, setRegressionResult] = useState<number | null>(null);
  const [interpolationComparisonResult, setInterpolationComparisonResult] =
    useState<number | null>(null);

  // Evaluation state
  const [evaluationData, setEvaluationData] = useState<EvaluationDataPoint[]>(
    []
  );
  const [metrics, setMetrics] = useState<{
    rmse: number | null;
    mae: number | null;
    mape: number | null;
  }>({
    rmse: null,
    mae: null,
    mape: null,
  });

  // Function to use umkmData from DataContext in comparisonData
  const useUmkmDataForComparison = () => {
    if (umkmData.length > 0) {
      const formattedData = umkmData.map(item => ({
        year: item.year,
        count: item.count
      }));
      setComparisonData(formattedData);
      
      // If there's data, also update the interpolation data with the min and max years
      const sorted = [...umkmData].sort((a, b) => a.year - b.year);
      if (sorted.length >= 2) {
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        
        setStartYear(first.year.toString());
        setStartCount(first.count.toString());
        setEndYear(last.year.toString());
        setEndCount(last.count.toString());
      }
    }
  };

  const addComparisonDataPoint = (year: number, count: number) => {
    setComparisonData([...comparisonData, { year, count }]);
  };

  const removeComparisonDataPoint = (index: number) => {
    const newData = [...comparisonData];
    newData.splice(index, 1);
    setComparisonData(newData);
  };

  const addEvaluationDataPoint = (point: EvaluationDataPoint) => {
    setEvaluationData([...evaluationData, point]);
  };

  const removeEvaluationDataPoint = (index: number) => {
    const newData = [...evaluationData];
    newData.splice(index, 1);
    setEvaluationData(newData);
  };

  // When umkmData changes, give option to update model data
  useEffect(() => {
    if (umkmData.length > 0 && comparisonData.length === 0) {
      // Auto-populate on first load
      useUmkmDataForComparison();
    }
  }, [umkmData]);

  const value = {
    // Interpolation
    startYear,
    startCount,
    endYear,
    endCount,
    targetYearInterpolation,
    interpolationResult,
    setStartYear,
    setStartCount,
    setEndYear,
    setEndCount,
    setTargetYearInterpolation,
    setInterpolationResult,

    // Comparison
    comparisonData,
    futureYear,
    regressionResult,
    interpolationComparisonResult,
    setComparisonData,
    addComparisonDataPoint,
    removeComparisonDataPoint,
    setFutureYear,
    setRegressionResult,
    setInterpolationComparisonResult,
    useUmkmDataForComparison,

    // Evaluation
    evaluationData,
    metrics,
    addEvaluationDataPoint,
    removeEvaluationDataPoint,
    setMetrics,
  };

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};

import { Chart as ChartType } from "chart.js";

declare global {
  interface Window {
    Chart?: typeof ChartType;
    Swal?: any;
  }
}

export {};

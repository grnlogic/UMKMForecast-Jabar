import Chart from "chart.js/auto";
import Swal from "sweetalert2";

// Konfigurasi grafik default
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      padding: 10,
      cornerRadius: 8,
      usePointStyle: true,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: "rgba(226, 232, 240, 0.6)",
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        color: "rgba(226, 232, 240, 0.6)",
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
};

// Konfigurasi SweetAlert
export const showSuccess = (title: string, text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#1e40af",
    confirmButtonText: "OK",
  });
};

export const showError = (title: string, text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#1e40af",
    confirmButtonText: "OK",
  });
};

export const showInfo = (title: string, text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "info",
    confirmButtonColor: "#1e40af",
    confirmButtonText: "OK",
  });
};

export const showWarning = (title: string, text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonColor: "#1e40af",
    confirmButtonText: "OK",
  });
};

export const showConfirmation = (title: string, text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1e40af",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  });
};

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMonthlyAssistanceData } from "@/hooks/useMonthlyAssistanceData";
import {
  getBackgroundColor,
  getBorderTranslatedColor,
} from "@/utils/chartUtilsFunctions";

// Registro dos componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyAssistanceChart: React.FC = () => {
  const { monthlyAssistanceData, isLoading, error } =
    useMonthlyAssistanceData();

  // Identificando todos os status únicos
  const statusList = monthlyAssistanceData
    ?.map((data) => data.status)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Preparando os labels do gráfico (meses)
  const chartLabels = monthlyAssistanceData
    ?.map((data) => `${data.month}`)
    .filter((value, index, self) => self.indexOf(value) === index);

  const chartDatasets = statusList?.map((status) => ({
    label: status,
    data: chartLabels?.map((label) => {
      const item = monthlyAssistanceData?.find(
        (data) => data.month === label && data.status === status
      );
      return item ? item.count : 0;
    }),
    borderColor: getBorderTranslatedColor(status),
    backgroundColor: getBackgroundColor(status, 0.2),
  }));

  const chartData = {
    labels: chartLabels,
    datasets: chartDatasets || [],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,
          max: 100,
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: "Mês/ano",
        },
        border: {
          color: "red",
        },
      },
    },
  };

  if (isLoading) return <p className="text-black">Carregando...</p>;
  if (error)
    return <p className="text-black">Ocorreu um erro ao carregar os dados.</p>;

  return (
    <div className="text-black">
      <h3>Assistências por Mês</h3>
      <div className="w-full h-[400px] relative">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyAssistanceChart;

import { Bar, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  BarElement,
  BarController,
} from "chart.js";
import { DataForChartJS } from "../../../features/metricGraph/transformForChartJS";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  BarElement,
  BarController
);

const getMaxTicks = () => {
  if (typeof window === "undefined") {
    return 24;
  }
  let width = window.innerWidth;
  switch (true) {
    case width > 1200:
      return 24;
    case width > 800:
      return 18;
    default:
      return 8;
  }
};

export const options = {
  responsive: true,
  // Can't use animation because we're polling
  animation: {
    duration: 0,
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Recorded Errors",
      font: {
        size: 21,
        family: "Basis Grotesque",
      },
    },
  },
  scales: {
    y: {
      min: -1,
      max: 1,
      ticks: {
        callback: function (value, index) {
          if (value === 1) {
            return "success";
          } else if (value === -1) {
            return "fail";
          }
          return "";
        },
      },
    },
    x: {
      ticks: {
        // callback: (value, index, tick) => tickCallBack(value, index, tick), // Replace null with "" to show gridline
        autoSkip: true,
        maxTicksLimit: getMaxTicks(),
      },
      title: {
        display: true,
        text: "Your Local Time",
      },
    },
  },
};

export const Dashboard = ({ data }: { data: DataForChartJS[] }) => {
  return (
    <div className={"h-[300px] sm:h-[400px]"}>
      <Chart
        options={options}
        type={"bar"}
        datasetIdKey={"combined"}
        data={{
          labels: data[0]?.labels,
          datasets: data,
        }}
      />
    </div>
  );
};

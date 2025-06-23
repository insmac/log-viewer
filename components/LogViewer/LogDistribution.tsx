import type { ILogRecord } from "@/lib/types";
import { groupLogsByDay } from "./utils";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const LogDistribution = ({ logs }: { logs: ILogRecord[] }) => {
  const groupedData = groupLogsByDay(logs);
  const sortedDates = Object.keys(groupedData).sort();

  const chartData = {
    categories: sortedDates,
    series: [
      {
        name: "Log Count",
        data: sortedDates.map((date) => groupedData[date]),
      },
    ],
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 150,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "80%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#9ca3af"], // gray-400
    xaxis: {
      categories: chartData.categories,
      labels: {
        formatter: function (value: string) {
          // Format date to show only month and day (MM-DD)
          const parts = value.split("-");
          return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
        },
        style: {
          colors: "#9CA3AF", // text-neutral-400
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Logs",
        style: {
          color: "#9CA3AF", // text-neutral-400
        },
      },
      labels: {
        style: {
          colors: "#9CA3AF", // text-neutral-400
        },
      },
    },
    grid: {
      borderColor: "#374151", // neutral-700
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value: number) {
          return `${value} logs`;
        },
      },
      theme: "dark",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="mb-4 p-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md">
      <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
        Log Distribution by day
      </h3>
      <div className="h-40">
        <Chart
          options={chartOptions}
          series={chartData.series}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
};

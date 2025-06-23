import { ILogRecord } from "@/lib/types";

export const getSeverityStyles = (
  severity: ILogRecord["severityText"]
): string => {
  if (!severity) {
    return "bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
  }
  switch (severity.toUpperCase()) {
    case "ERROR":
    case "FATAL":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800";
    case "WARN":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
    case "INFO":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800";
    case "DEBUG":
      return "bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
    default:
      return "bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
  }
};

export const formatTimestamp = (nanoTime: string | number): string => {
  const millis = Number(nanoTime) / 1e6;
  return new Date(millis).toLocaleString();
};

export const groupLogsByDay = (logs: ILogRecord[]) => {
  const groupedByDay: Record<string, number> = {};

  logs.forEach((log) => {
    if (log.timeUnixNano) {
      const date = new Date(Number(log.timeUnixNano) / 1e6);
      // Format: YYYY-MM-DD
      const day = date.toISOString().split("T")[0];

      if (!groupedByDay[day]) {
        groupedByDay[day] = 0;
      }

      groupedByDay[day]++;
    }
  });

  return groupedByDay;
};

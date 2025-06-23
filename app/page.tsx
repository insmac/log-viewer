"use client";

import { IExportLogsServiceRequest, ILogRecord } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { LogViewer } from "@/components/LogViewer/LogViewer";

export default function Home() {
  const { data, isLoading, error, refetch } = useQuery<
    IExportLogsServiceRequest,
    Error,
    ILogRecord[] | undefined
  >({
    queryKey: ["logs"],
    queryFn: async () => {
      const response = await fetch("/api/logs");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }
      return response.json();
    },
    select: (data) => {
      return data.resourceLogs
        ? data.resourceLogs
            .flatMap((resource) =>
              resource.scopeLogs.flatMap((scope) => scope.logRecords ?? [])
            )
            .sort(
              (a, b) =>
                Number(a.timeUnixNano ?? 0) - Number(b.timeUnixNano ?? 0)
            )
        : undefined;
    },
  });

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          OTLP Log Viewer
        </h1>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          aria-label="Refresh logs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
      <LogViewer logs={data} isLoading={isLoading} error={error} />
    </div>
  );
}

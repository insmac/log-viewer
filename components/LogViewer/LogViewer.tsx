import React, { useReducer, useEffect, useRef } from "react";
import { ILogRecord } from "@/lib/types";
import { getSeverityStyles, formatTimestamp } from "./utils";
import { Loading } from "./Loading";
import { LoadingError } from "./LoadingError";
import { NoData } from "./NoData";
import { LogDistribution } from "./LogDistribution";

type ViewState =
  | { status: "loading" }
  | { status: "no-data" }
  | { status: "with-data"; logs: ILogRecord[] }
  | { status: "error"; error: Error };

type Action =
  | { type: "LOADING" }
  | { type: "SET_LOGS"; logs: ILogRecord[] }
  | { type: "SET_ERROR"; error: Error };

const logViewerReducer = (state: ViewState, action: Action): ViewState => {
  switch (action.type) {
    case "LOADING":
      return { status: "loading" };
    case "SET_LOGS":
      return action.logs.length > 0
        ? { status: "with-data", logs: action.logs }
        : { status: "no-data" };
    case "SET_ERROR":
      return { status: "error", error: action.error };
    default:
      return state;
  }
};

export const LogViewer = ({
  logs,
  isLoading,
  error,
}: {
  logs?: ILogRecord[];
  isLoading: boolean;
  error: Error | null;
}) => {
  const [state, dispatch] = useReducer(logViewerReducer, { status: "loading" });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      dispatch({ type: "SET_ERROR", error });
    } else if (isLoading) {
      dispatch({ type: "LOADING" });
    } else if (logs) {
      dispatch({ type: "SET_LOGS", logs });
    }
  }, [logs, isLoading, error]);

  useEffect(() => {
    if (state.status === "with-data" && containerRef.current && logs) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [state.status, logs]);

  return (
    <div className="log-viewer-container">
      {state.status === "with-data" && <LogDistribution logs={state.logs} />}

      <div
        ref={containerRef}
        className="log-viewer overflow-auto h-96 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900"
      >
        {state.status === "loading" ? (
          <Loading />
        ) : state.status === "no-data" ? (
          <NoData />
        ) : state.status === "error" ? (
          <LoadingError error={state.error} />
        ) : (
          <table className="min-w-full">
            <thead className="bg-neutral-100 dark:bg-neutral-800 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider w-24">
                  Severity
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider w-32">
                  Time
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
              {state.logs.map((log) => (
                <tr
                  key={log.timeUnixNano as string}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityStyles(
                        log.severityText
                      )}`}
                    >
                      {log.severityText}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 dark:text-neutral-400 font-mono whitespace-nowrap">
                    {formatTimestamp(log.timeUnixNano as string)}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-700 dark:text-white font-mono break-all">
                    {log.body?.stringValue || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

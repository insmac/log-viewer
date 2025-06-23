export const LoadingError = ({ error }: { error: Error }) => (
  <div className="flex justify-center items-center h-full">
    <div className="error-message flex flex-col items-center text-center px-4">
      <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mb-4">
        <svg
          className="w-6 h-6 text-red-600 dark:text-red-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
        Error loading logs
      </h3>
      <p className="text-red-600 dark:text-red-300">
        {error.message || "An unknown error occurred."}
      </p>
    </div>
  </div>
);

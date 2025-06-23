export const Loading = () => (
  <div className="flex justify-center items-center h-full">
    <div className="spinner flex flex-col items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-500 dark:border-neutral-300 mb-2"></div>
      <span className="text-neutral-600 dark:text-neutral-400">
        Loading logs...
      </span>
    </div>
  </div>
);

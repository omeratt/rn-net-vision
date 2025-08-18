// Central configuration for log retention & UI limits.
// Override via Vite env variables: VITE_DB_MAX_LOGS, VITE_UI_MAX_LOGS.
// For unlimited DB logs set VITE_DB_MAX_LOGS=0 (be cautious: disk usage & performance implications).

// Maximum number of logs to keep in IndexedDB. 0 or negative => unlimited.
export const DB_MAX_LOGS: number = (() => {
  const raw = (import.meta as any).env?.VITE_DB_MAX_LOGS;
  console.log({ raw });
  const parsed = raw != null ? parseInt(raw, 10) : NaN;
  if (!isNaN(parsed)) return parsed;
  return 20000; // default increased from 5000
})();

// Maximum number of logs to keep in-memory for UI rendering (newest N).
// Increase cautiously; large arrays impact rendering unless list is virtualized.
export const UI_MAX_LOGS: number = (() => {
  const raw = (import.meta as any).env?.VITE_UI_MAX_LOGS;
  const parsed = raw != null ? parseInt(raw, 10) : NaN;
  if (!isNaN(parsed)) return parsed;
  return 5000; // default increased from 1000
})();

export const isUnlimitedDb = () => DB_MAX_LOGS <= 0;

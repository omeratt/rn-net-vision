// Central configuration for log retention & UI limits.
// Set to 0 for unlimited logs (be cautious: disk usage & performance implications).

// Maximum number of logs to keep in IndexedDB. 0 or negative => unlimited.
export const DB_MAX_LOGS: number = 0; // unlimited logs

// Maximum number of logs to keep in-memory for UI rendering (newest N).
// Increase cautiously; large arrays impact rendering unless list is virtualized.
export const UI_MAX_LOGS: number = 0; // unlimited logs

export const isUnlimitedDb = () => DB_MAX_LOGS <= 0;

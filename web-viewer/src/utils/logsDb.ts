import Dexie, { Table } from 'dexie';
import type { NetVisionLog } from '../types';
import { getLocalStorageLogs, LOGS_STORAGE_KEY } from './networkUtils';
import { DB_MAX_LOGS, UI_MAX_LOGS, isUnlimitedDb } from './logsConfig';

// We keep bodies potentially large; consider truncation upstream if needed
export interface PersistedLog extends NetVisionLog {
  // Add secondary indexed fields if queries expand later
  // e.g. method, status, deviceId, timestamp numeric
  ts?: number; // numeric timestamp for sorting
}

class LogsDatabase extends Dexie {
  public logs!: Table<PersistedLog, string>;

  constructor() {
    super('NetVisionLogsDB');
    // schema: primary key id, indexes
    this.version(1).stores({
      logs: 'id, ts, status, method, deviceId',
    });
  }
}

export const logsDb = new LogsDatabase();

// Configuration for retention now externalized (DB_MAX_LOGS <= 0 => unlimited)

export async function addLog(log: NetVisionLog) {
  const toStore: PersistedLog = {
    ...log,
    ts: Date.parse(log.timestamp || new Date().toISOString()) || Date.now(),
  };
  await logsDb.logs.put(toStore);
  // Retention: if count exceeds, delete oldest batch
  if (!isUnlimitedDb()) {
    const count = await logsDb.logs.count();
    if (count > DB_MAX_LOGS) {
      const overflow = count - DB_MAX_LOGS;
      const oldIds: string[] = [];
      await logsDb.logs
        .orderBy('ts')
        .limit(overflow)
        .each((l: PersistedLog) => oldIds.push(l.id));
      if (oldIds.length) {
        await logsDb.logs.bulkDelete(oldIds);
      }
    }
  }
}

export async function bulkAddLogs(logs: NetVisionLog[]) {
  if (!logs.length) return;
  const mapped: PersistedLog[] = logs.map((l) => ({
    ...l,
    ts: Date.parse(l.timestamp || new Date().toISOString()) || Date.now(),
  }));
  await logsDb.logs.bulkPut(mapped);
  if (!isUnlimitedDb()) {
    const count = await logsDb.logs.count();
    if (count > DB_MAX_LOGS) {
      const overflow = count - DB_MAX_LOGS;
      const oldIds: string[] = [];
      await logsDb.logs
        .orderBy('ts')
        .limit(overflow)
        .each((l: PersistedLog) => oldIds.push(l.id));
      if (oldIds.length) await logsDb.logs.bulkDelete(oldIds);
    }
  }
}

export async function getRecentLogs(
  limit = UI_MAX_LOGS
): Promise<NetVisionLog[]> {
  // If unlimited requested (limit <= 0) return all
  if (limit <= 0) {
    const rows = await logsDb.logs.orderBy('ts').toArray();
    return rows; // already ascending by ts
  }
  const rows = await logsDb.logs.orderBy('ts').reverse().limit(limit).toArray();
  return rows.reverse();
}

export async function clearAllLogs() {
  await logsDb.logs.clear();
  localStorage.removeItem(LOGS_STORAGE_KEY);
}

export async function clearDeviceLogs(deviceId: string) {
  await logsDb.logs.where('deviceId').equals(deviceId).delete();
}

let migrationDone = false;
export async function migrateFromLocalStorage() {
  if (migrationDone) return;
  migrationDone = true;
  try {
    const existing = getLocalStorageLogs();
    if (existing.length) {
      // Avoid duplicate IDs already present
      const ids = new Set(
        (await logsDb.logs.toCollection().primaryKeys()) as string[]
      );
      const toInsert = existing.filter((l) => !ids.has(l.id));
      if (toInsert.length) await bulkAddLogs(toInsert);
      // After migrating, optionally clear localStorage to reclaim space
      localStorage.removeItem(LOGS_STORAGE_KEY);
    }
  } catch (e) {
    // Non-fatal
    console.warn('Migration from localStorage failed', e);
  }
}

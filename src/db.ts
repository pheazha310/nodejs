import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRecord {
  id: number;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LeaveStatus;
  created_at: string;
  updated_at: string;
}

export interface LeavePayload {
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason?: string | null;
  status?: LeaveStatus;
}

const sqlite = sqlite3.verbose();
const dbPath =
  process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), "database", "leaveManagement.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite.Database(dbPath);

const run = (
  sql: string,
  params: unknown[] = [],
): Promise<{ lastID: number; changes: number }> =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });

const get = <T>(sql: string, params: unknown[] = []): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row as T | undefined);
    });
  });

const all = <T>(sql: string, params: unknown[] = []): Promise<T[]> =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows as T[]);
    });
  });

export const initializeDatabase = async (): Promise<void> => {
  await run(`
    CREATE TABLE IF NOT EXISTS leave_management (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_name TEXT NOT NULL,
      leave_type TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const findAllLeaves = async (): Promise<LeaveRecord[]> =>
  all<LeaveRecord>("SELECT * FROM leave_management ORDER BY id DESC");

export const findLeaveById = async (id: number): Promise<LeaveRecord | undefined> =>
  get<LeaveRecord>("SELECT * FROM leave_management WHERE id = ?", [id]);

export const createLeave = async (payload: LeavePayload): Promise<LeaveRecord | undefined> => {
  const result = await run(
    `
      INSERT INTO leave_management (
        employee_name,
        leave_type,
        start_date,
        end_date,
        reason,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      payload.employee_name,
      payload.leave_type,
      payload.start_date,
      payload.end_date,
      payload.reason ?? null,
      payload.status ?? "pending",
    ],
  );

  return findLeaveById(result.lastID);
};

export const updateLeave = async (
  id: number,
  payload: LeavePayload,
): Promise<LeaveRecord | undefined> => {
  const result = await run(
    `
      UPDATE leave_management
      SET
        employee_name = ?,
        leave_type = ?,
        start_date = ?,
        end_date = ?,
        reason = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      payload.employee_name,
      payload.leave_type,
      payload.start_date,
      payload.end_date,
      payload.reason ?? null,
      payload.status ?? "pending",
      id,
    ],
  );

  if (result.changes === 0) {
    return undefined;
  }

  return findLeaveById(id);
};

export const deleteLeave = async (id: number): Promise<boolean> => {
  const result = await run("DELETE FROM leave_management WHERE id = ?", [id]);
  return result.changes > 0;
};

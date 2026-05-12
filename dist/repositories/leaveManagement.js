"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite = sqlite3_1.default.verbose();
const dbPath = process.env.SQLITE_DB_PATH || path_1.default.resolve(process.cwd(), "database", "leaveManagement.db");
fs_1.default.mkdirSync(path_1.default.dirname(dbPath), { recursive: true });
const db = new sqlite.Database(dbPath);
const createTableSql = `
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
`;
const run = (sql, params = []) => new Promise((resolve, reject) => {
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
const get = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(row);
    });
});
const all = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(rows);
    });
});
const initializeDatabase = async () => {
    await run(createTableSql);
};
exports.initializeDatabase = initializeDatabase;
class LeaveManagementRepository {
    async findAll() {
        return all(`SELECT * FROM leave_management ORDER BY id DESC`);
    }
    async findById(id) {
        return get(`SELECT * FROM leave_management WHERE id = ?`, [id]);
    }
    async create(payload) {
        const result = await run(`
        INSERT INTO leave_management (
          employee_name,
          leave_type,
          start_date,
          end_date,
          reason,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
            payload.employee_name,
            payload.leave_type,
            payload.start_date,
            payload.end_date,
            payload.reason ?? null,
            payload.status ?? "pending",
        ]);
        return this.findById(result.lastID);
    }
    async update(id, payload) {
        const result = await run(`
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
      `, [
            payload.employee_name,
            payload.leave_type,
            payload.start_date,
            payload.end_date,
            payload.reason ?? null,
            payload.status,
            id,
        ]);
        if (result.changes === 0) {
            return undefined;
        }
        return this.findById(id);
    }
    async delete(id) {
        const result = await run(`DELETE FROM leave_management WHERE id = ?`, [id]);
        return result.changes > 0;
    }
}
const leaveManagementRepository = new LeaveManagementRepository();
exports.default = leaveManagementRepository;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leaveManagement_1 = __importDefault(require("../repositories/leaveManagement"));
const VALID_STATUSES = ["pending", "approved", "rejected"];
class LeaveManagementService {
    validateDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new Error("start_date and end_date must be valid dates");
        }
        if (start > end) {
            throw new Error("start_date cannot be later than end_date");
        }
    }
    validateRequiredFields(payload) {
        if (!payload.employee_name?.trim()) {
            throw new Error("employee_name is required");
        }
        if (!payload.leave_type?.trim()) {
            throw new Error("leave_type is required");
        }
        if (!payload.start_date?.trim()) {
            throw new Error("start_date is required");
        }
        if (!payload.end_date?.trim()) {
            throw new Error("end_date is required");
        }
        if (payload.status && !VALID_STATUSES.includes(payload.status)) {
            throw new Error("status must be pending, approved, or rejected");
        }
        this.validateDateRange(payload.start_date, payload.end_date);
    }
    async getAll() {
        return leaveManagement_1.default.findAll();
    }
    async getById(id) {
        return leaveManagement_1.default.findById(id);
    }
    async create(payload) {
        this.validateRequiredFields(payload);
        return leaveManagement_1.default.create(payload);
    }
    async update(id, payload) {
        this.validateRequiredFields(payload);
        return leaveManagement_1.default.update(id, payload);
    }
    async delete(id) {
        return leaveManagement_1.default.delete(id);
    }
}
const leaveManagementService = new LeaveManagementService();
exports.default = leaveManagementService;

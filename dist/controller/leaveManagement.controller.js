"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = __importDefault(require("./base.controller"));
const leaveManagement_1 = __importDefault(require("../service/leaveManagement"));
class LeaveManagementController extends base_controller_1.default {
    constructor() {
        super(...arguments);
        this.getAll = async (_req, res) => {
            try {
                const records = await leaveManagement_1.default.getAll();
                this.ok(res, records, "Leave records fetched successfully");
            }
            catch (error) {
                this.fail(res, error);
            }
        };
        this.getById = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (Number.isNaN(id)) {
                    this.badRequest(res, "Invalid leave record id");
                    return;
                }
                const record = await leaveManagement_1.default.getById(id);
                if (!record) {
                    this.notFound(res, "Leave record not found");
                    return;
                }
                this.ok(res, record, "Leave record fetched successfully");
            }
            catch (error) {
                this.fail(res, error);
            }
        };
        this.create = async (req, res) => {
            try {
                const record = await leaveManagement_1.default.create(req.body);
                this.created(res, record, "Leave record created successfully");
            }
            catch (error) {
                this.badRequest(res, error instanceof Error ? error.message : "Invalid request payload");
            }
        };
        this.update = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (Number.isNaN(id)) {
                    this.badRequest(res, "Invalid leave record id");
                    return;
                }
                const record = await leaveManagement_1.default.update(id, req.body);
                if (!record) {
                    this.notFound(res, "Leave record not found");
                    return;
                }
                this.ok(res, record, "Leave record updated successfully");
            }
            catch (error) {
                this.badRequest(res, error instanceof Error ? error.message : "Invalid request payload");
            }
        };
        this.delete = async (req, res) => {
            try {
                const id = Number(req.params.id);
                if (Number.isNaN(id)) {
                    this.badRequest(res, "Invalid leave record id");
                    return;
                }
                const deleted = await leaveManagement_1.default.delete(id);
                if (!deleted) {
                    this.notFound(res, "Leave record not found");
                    return;
                }
                this.ok(res, null, "Leave record deleted successfully");
            }
            catch (error) {
                this.fail(res, error);
            }
        };
    }
}
const leaveManagementController = new LeaveManagementController();
exports.default = leaveManagementController;

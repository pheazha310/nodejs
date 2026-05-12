"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
const VALID_STATUSES = ["pending", "approved", "rejected"];
const isValidPayload = (payload) => {
    if (!payload.employee_name?.trim())
        return "employee_name is required";
    if (!payload.leave_type?.trim())
        return "leave_type is required";
    if (!payload.start_date?.trim())
        return "start_date is required";
    if (!payload.end_date?.trim())
        return "end_date is required";
    if (payload.status && !VALID_STATUSES.includes(payload.status)) {
        return "status must be pending, approved, or rejected";
    }
    const start = new Date(payload.start_date);
    const end = new Date(payload.end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "start_date and end_date must be valid dates";
    }
    if (start > end) {
        return "start_date cannot be later than end_date";
    }
    return null;
};
router.get("/", async (_req, res) => {
    try {
        const records = await (0, db_1.findAllLeaves)();
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const record = await (0, db_1.findLeaveById)(id);
        if (!record) {
            res.status(404).json({ message: "Leave record not found" });
            return;
        }
        res.json(record);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
router.post("/", async (req, res) => {
    try {
        const errorMessage = isValidPayload(req.body);
        if (errorMessage) {
            res.status(400).json({ message: errorMessage });
            return;
        }
        const record = await (0, db_1.createLeave)(req.body);
        res.status(201).json(record);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const errorMessage = isValidPayload(req.body);
        if (errorMessage) {
            res.status(400).json({ message: errorMessage });
            return;
        }
        const record = await (0, db_1.updateLeave)(id, req.body);
        if (!record) {
            res.status(404).json({ message: "Leave record not found" });
            return;
        }
        res.json(record);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const deleted = await (0, db_1.deleteLeave)(id);
        if (!deleted) {
            res.status(404).json({ message: "Leave record not found" });
            return;
        }
        res.json({ message: "Leave record deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.default = router;

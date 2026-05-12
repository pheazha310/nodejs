"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveManagement_route_1 = __importDefault(require("./routes/leaveManagement.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({
        message: "Leave Management API is running",
    });
});
app.use("/api/leave-management", leaveManagement_route_1.default);
exports.default = app;

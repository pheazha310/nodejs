"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    ok(res, data, message = "Success") {
        res.status(200).json({
            success: true,
            message,
            data,
        });
    }
    created(res, data, message = "Created") {
        res.status(201).json({
            success: true,
            message,
            data,
        });
    }
    notFound(res, message = "Record not found") {
        res.status(404).json({
            success: false,
            message,
        });
    }
    badRequest(res, message) {
        res.status(400).json({
            success: false,
            message,
        });
    }
    fail(res, error, message = "Internal server error") {
        res.status(500).json({
            success: false,
            message,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
exports.default = BaseController;

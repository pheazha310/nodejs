import express from "express";
import leaveManagementRouter from "./routes/leaveManagement.route";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Leave Management API is running",
  });
});

app.use("/api/leave-management", leaveManagementRouter);

export default app;

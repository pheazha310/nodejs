import dotenv from "dotenv";
import app from "./app";
import { initializeDatabase } from "./db";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

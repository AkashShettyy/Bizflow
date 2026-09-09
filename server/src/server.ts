import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/database.js";

const PORT = process.env.PORT || 5001;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`BizFlow API running on http://localhost:${PORT}`);
  });
};

startServer();
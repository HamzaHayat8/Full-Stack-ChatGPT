import app from "./app.js";
import { connectionc } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

function start() {
  connectionc(process.env.MONGO_URL);

  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
}

start();

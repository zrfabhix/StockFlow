import { configDotenv } from "dotenv";
configDotenv();
import app from "./src/app.js";
import mongoose from "mongoose";

const port = 80 || process.env.PORT;

async function db() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connection established");
  } catch (e) {
    console.error("Couldn't connect to Database", e);
  }
}

db();
app.listen(port, () => {
  console.log("App Listening on port", port);
});

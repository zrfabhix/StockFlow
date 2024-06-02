import dotenv from "dotenv";
import cors from "cors";

import express from "express";
import auth from "../src/routes/auth/auth.js";
import stock from "../src/routes/stocks/stock.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/", express.static("public"));
app.use("/api/v1/auth", auth);
app.use("/api/v1/stock", stock);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;

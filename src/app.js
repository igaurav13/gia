import express from "express";
import scan from "./routes/scan.js";
import analyze from "./routes/analyze.js";

const app = express();
app.use(express.json());

app.use("/scan", scan);
app.use("/analyze", analyze);

export default app;
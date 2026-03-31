/*jshint esversion: 8 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pinoLogger = require("./logger");
const { loadData } = require("./util/import-mongo/index");
const connectToDatabase = require("./models/db");

const app = express();

app.use(cors({
  origin: 'https://mariachernov-9000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai',
  credentials: true
}));

const port = 3060;

connectToDatabase()
  .then( async () => {
    pinoLogger.info("Connected to DB");

    await loadData();
  })
  .catch((e) => console.error("Failed to connect to DB", e));

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const giftRoutes = require("./routes/giftRoutes");
const searchRoutes = require("./routes/searchRoutes");
const pinoHttp = require("pino-http");
const logger = require("./logger");

app.use(pinoHttp({ logger }));

app.use("/api/gifts", giftRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { register, Counter, Histogram } = require("prom-client");
const setupWebSocket = require("./websocket/socket");

const questionRoutes = require("./routes/question.routes");
const answerRoutes = require("./routes/answer.routes");
const sessionRoutes = require("./routes/session.routes");

const app = express();
const server = http.createServer(app);

// Prometheus Metrics Setup
const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Middleware
app.use(cors());
app.use(express.json());

// Metrics collection middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get("/metrics", (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(register.metrics());
});

// Routes
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/sessions", sessionRoutes);

// Database Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/chat-widget";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// WebSocket Setup
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

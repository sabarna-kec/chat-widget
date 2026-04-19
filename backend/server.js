require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const setupWebSocket = require("./websocket/socket");

const questionRoutes = require("./routes/question.routes");
const answerRoutes = require("./routes/answer.routes");
const sessionRoutes = require("./routes/session.routes");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

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
const WEBSOCKET_PATH = process.env.WEBSOCKET_PATH || "/ws";
setupWebSocket(server, WEBSOCKET_PATH);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

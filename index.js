import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./server/db.js";

import userRoutes from "./server/routes/users.js";
import gameRoutes from "./server/routes/game.js";
import stripeRoutes from "./server/routes/stripe.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к базе MongoDB
connectDB(); // ✅ через db.js

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/stripe", stripeRoutes);

// Тестовый маршрут
app.get("/", (req, res) => {
  res.send("🎉 Сервер QuizTime работает!");
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

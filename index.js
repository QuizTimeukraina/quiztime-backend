import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/users.js";
import gameRoutes from "./routes/game.js";
import stripeRoutes from "./routes/stripe.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к базе MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("❌ Ошибка MongoDB:", err));

// Роуты
app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/stripe", stripeRoutes);

// Тестовая корневая страница
app.get("/", (req, res) => {
  res.send("🎉 Сервер QuizTime работает!");
});

// Запуск
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

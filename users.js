import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Модель игрока
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// 📌 POST /api/users/auth — сохраняем Telegram ID и имя
router.post("/auth", async (req, res) => {
  const { telegramId, name } = req.body;

  if (!telegramId || !name) {
    return res.status(400).json({ error: "Нужен telegramId и имя" });
  }

  try {
    let user = await User.findOne({ telegramId });

    if (!user) {
      user = new User({ telegramId, name });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Ошибка при авторизации:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

export default router;

// server/routes/users.js

import express from "express";
const router = express.Router();

// Telegram авторизация
router.post("/auth", async (req, res) => {
  const { telegramId, name } = req.body;

  if (!telegramId) return res.status(400).json({ error: "Нет Telegram ID" });

  // В будущем можно сохранить в MongoDB
  return res.json({ message: "Авторизация прошла", telegramId, name });
});

export default router;

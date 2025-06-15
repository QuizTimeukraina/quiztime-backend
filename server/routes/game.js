import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Модель вопроса
const questionSchema = new mongoose.Schema({
  category: String,
  text: String,
  answers: [String],
  correctIndex: Number,
  difficulty: String, // например: "easy", "medium", "hard"
});

const Question = mongoose.model("Question", questionSchema);

// Модель результатов
const resultSchema = new mongoose.Schema({
  telegramId: String,
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", resultSchema);

// 📌 GET /api/game/questions — получить случайные 10 вопросов
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    res.json(questions);
  } catch (err) {
    console.error("Ошибка получения вопросов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 📌 POST /api/game/result — сохранить очки
router.post("/result", async (req, res) => {
  const { telegramId, score } = req.body;

  if (!telegramId || score === undefined) {
    return res.status(400).json({ error: "Нужен telegramId и score" });
  }

  try {
    const result = new Result({ telegramId, score });
    await result.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка сохранения результата:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;

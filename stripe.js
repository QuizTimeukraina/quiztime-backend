import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Модель подписки
const subscriptionSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  stripeCustomerId: String,
  active: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

// 📌 POST /api/stripe/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  const { telegramId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            recurring: {
              interval: "week",
            },
            product_data: {
              name: "Підписка QuizTime (щотижнево)",
            },
            unit_amount: 99, // $0.99
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: process.env.FRONTEND_URL + "/game.html",
      cancel_url: process.env.FRONTEND_URL + "/index.html",
      metadata: { telegramId },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Ошибка создания сессии:", err);
    res.status(500).json({ error: "Ошибка Stripe" });
  }
});

// 📌 POST /api/stripe/webhook — для приёма событий от Stripe
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook ошибка:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Подтверждение подписки
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const telegramId = session.metadata.telegramId;
    const customerId = session.customer;

    try {
      await Subscription.findOneAndUpdate(
        { telegramId },
        { active: true, stripeCustomerId: customerId },
        { upsert: true }
      );
      console.log("✅ Подписка активирована для", telegramId);
    } catch (err) {
      console.error("Ошибка записи подписки:", err);
    }
  }

  res.json({ received: true });
});

// 📌 GET /api/stripe/status/:telegramId — проверить подписку
router.get("/status/:telegramId", async (req, res) => {
  const { telegramId } = req.params;

  try {
    const sub = await Subscription.findOne({ telegramId });
    res.json({ active: sub?.active || false });
  } catch (err) {
    console.error("Ошибка проверки подписки:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;

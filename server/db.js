const connectDB = async () => {
  try {
    console.log("🔄 Подключение к MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Успешно подключено к MongoDB");
  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error.message);
    process.exit(1); // Завершить сервер при ошибке
  }
};

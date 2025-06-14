const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
const { MongoClient } = require("mongodb");

// ✅ MongoDB connection string — Mật khẩu mã hóa đúng
const uri = "mongodb+srv://truongdomanh:truongdmdm@test.mqvbxmg.mongodb.net/chatbot_db?retryWrites=true&w=majority&appName=test";

const client = new MongoClient(uri);
const dbName = "chatbot_db";
const collectionName = "chat_history";

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11 nên +1
  const dd = String(date.getDate()).padStart(2, '0');

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
  }
}

// ✅ API lưu chatHistory
app.post("/saveChat", async (req, res) => {
  try {
    const { chatHistory } = req.body;
    const formattedTime = formatDate(new Date());

    chatDocument = {
    chatHistory: chatHistory,
    timestamp: formattedTime,
    createdAt: formattedTime
    };

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(chatDocument);

    res.status(200).json({
      message: "✅ Chat history đã được lưu thành công!",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lưu dữ liệu:", error);
    res.status(500).json({
      error: "Lỗi khi lưu dữ liệu vào MongoDB!",
      details: error.message,
    });
  }
});

// ✅ Khởi động server
app.listen(3000, async () => {
  console.log("🚀 Server chạy trên port 3000");
  await connectDB();
});

// ✅ Đóng kết nối MongoDB khi dừng server
process.on("SIGINT", async () => {
  await client.close();
  console.log("🛑 MongoDB connection closed.");
  process.exit();
});

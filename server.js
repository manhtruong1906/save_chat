const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
const { MongoClient } = require("mongodb"); 

// MongoDB connection string 
const uri = "mongodb+srv://truongdomanh:truongdomanh123!@test.mqvbxmg.mongodb.net/?retryWrites=true&w=majority&appName=test"; 
const client = new MongoClient(uri); // 
// Database và collection name 

const dbName = "chatbot_db"; 
const collectionName = "chat_history"; 
async function connectDB() { 
    try { await client.connect(); console.log("Kết nối MongoDB thành công!"); 

    } catch (error) { console.error("Lỗi kết nối MongoDB:", error); } 
}
 
// API để lưu chatHistory vào file txt
app.post("/saveChat", async (req, res) => {
    try {
        const { chatHistory } = req.body; 
        // Tạo document để lưu const 
        chatDocument = { chatHistory: chatHistory, timestamp: new Date(), createdAt: new Date().toISOString() };
        // Lấy database và collection 
        const db = client.db(dbName); const collection = db.collection(collectionName); 
        //Insert document vào MongoDB 
        const result = await collection.insertOne(chatDocument); 
        res.status(200).json({ message: "Chat history đã được lưu thành công!", id: result.insertedId }); 
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error); 
        res.status(500).json({ error: "Lỗi khi lưu dữ liệu vào MongoDB!", details: error.message }); 
    } }); 

// Khởi động server
app.listen(3000, async () => {
    console.log("Server chạy trên port 3000");
    await connectDB();
});

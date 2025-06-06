const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

// API để lưu chatHistory vào file txt
app.post("/saveChat", (req, res) => {
    const chatHistory = req.body.chatHistory;
    
    // Ghi vào file chat_history.txt
    fs.appendFile("chat_history.txt", chatHistory + "\n", (err) => {
        if (err) {
            return res.status(500).send("Lỗi khi lưu dữ liệu!");
        }
        res.send("Chat history đã được lưu!");
    });
});

// Khởi động server
app.listen(3000, () => {
    console.log("Server chạy trên port 3000");
});

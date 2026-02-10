const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/smartshedule")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema (collection = teacherlogin)
const teacherSchema = new mongoose.Schema({
  username: String,
  password: String
  
});

const Teacher = mongoose.model("teacherlogin", teacherSchema);

// LOGIN API
app.post("/teacher-login", async (req, res) => {
  const { username, password } = req.body;

  const teacher = await Teacher.findOne({ username, password });

  if (!teacher) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // SUCCESS
  res.json({
    message: "Login successful",
    name: teacher.name
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.static("public")); // serve teacher.html and student.html from public folder

// ---------------- MongoDB Connection ----------------
mongoose.connect("mongodb://127.0.0.1:27017/smartSchedule")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// ---------------- Schemas ----------------
const lectureSchema = new mongoose.Schema({
  day: String,
  time: String,
  lecture: String
});

const notificationSchema = new mongoose.Schema({
  type: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Lecture = mongoose.model("Lecture", lectureSchema);
const Notification = mongoose.model("Notification", notificationSchema);

// ---------------- Routes ----------------

// Fetch all lectures
app.get("/timetable", async (req, res) => {
  const lectures = await Lecture.find();
  const result = {};
  lectures.forEach(l => {
    if (!result[l.day]) result[l.day] = {};
    result[l.day][l.time] = l.lecture;
  });
  res.json(result);
});

// Update or insert a lecture
app.post("/update", async (req, res) => {
  const { day, time, lecture } = req.body;
  if(!day || !time || !lecture) return res.json({ success: false, msg: "Missing data" });

  await Lecture.findOneAndUpdate(
    { day, time },
    { lecture },
    { upsert: true }
  );

  // Notify students via socket
  io.emit("scheduleUpdate", { day, time, lecture });
  res.json({ success: true });
});

// Fetch notifications
app.get("/notifications", async (req, res) => {
  const notifications = await Notification.find().sort({ date: -1 });
  res.json(notifications);
});

// Send a new notification
app.post("/send-notification", async (req, res) => {
  const { type, message } = req.body;
  if(!type || !message) return res.json({ success: false, msg: "Missing data" });

  const notif = await Notification.create({ type, message });
  io.emit("newNotification", { type, message, date: notif.date });
  res.json({ success: true });
});
app.post("/delete", async (req, res) => {
  const { day, time } = req.body;

  if (!day || !time) {
    return res.json({ success: false, msg: "Missing data" });
  }

  const deleted = await Lecture.findOneAndDelete({ day, time });

  if (!deleted) {
    return res.json({ success: false, msg: "Lecture not found" });
  }

  // 🔔 notify all students
  io.emit("scheduleUpdate", {
    day,
    time,
    lecture: null
  });

  // optional notification log
  await Notification.create({
    type: "delete",
    message: `Lecture removed on ${day} at ${time}`
  });

  res.json({ success: true });
});




// ---------------- Socket.io ----------------
io.on("connection", socket => {
  console.log("🟢 User connected:", socket.id);
  socket.on("disconnect", () => console.log("🔴 User disconnected:", socket.id));
});



// Schema (collection = teacherlogin)
const TeacherSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Teacher = mongoose.model(
  "Teacher",
  TeacherSchema,
  "teacherlogin"
);

// LOGIN API
app.post("/teachlogin", async (req, res) => {
  console.log("LOGIN DATA RECEIVED:", req.body); // 👈 ADD THIS

  const { username, password } = req.body;

  const teacher = await Teacher.findOne({ username, password });

  if (!teacher) {
    console.log("❌ No match found in DB");
    return res.status(401).json({ message: "Invalid username or password" });
  }

  console.log("✅ Login success for:", teacher.username);

  res.json({
    message: "Login successful",
    username: teacher.username
  });
});



// ---------------- Start Server ----------------
const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

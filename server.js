const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.static("public"));

// ---------------- MongoDB Connection ----------------
mongoose.connect("mongodb://127.0.0.1:27017/smartSchedule")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

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

const teacherSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Lecture = mongoose.model("Lecture", lectureSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Teacher = mongoose.model("Teacher", teacherSchema, "teacherlogin");

// ---------------- Standard Time Slots ----------------
const standardSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-01:00",
  "01:00-02:00",
  "02:00-03:00",
  "03:00-04:00"
];

// ---------------- Routes ----------------

// 📌 Fetch Timetable
app.get("/timetable", async (req, res) => {
  try {
    const lectures = await Lecture.find();
    const result = {};

    lectures.forEach(l => {
      if (!result[l.day]) result[l.day] = {};
      result[l.day][l.time] = l.lecture;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});


// 📌 Add / Update Lecture (with Overlap Detection)
app.post("/update", async (req, res) => {
  try {
    const { day, time, lecture } = req.body;

    if (!day || !time || !lecture)
      return res.json({ success: false, msg: "Missing data" });

    // Check conflict
    const existing = await Lecture.findOne({ day, time });

    if (existing) {
      const usedSlots = await Lecture.find({ day }).distinct("time");
      const freeSlots = standardSlots.filter(slot => !usedSlots.includes(slot));

      return res.json({
        success: false,
        slotFull: true,
        msg: "⚠️ Slot already taken",
        freeSlots
      });
    }

    // Insert lecture
    const newLecture = await Lecture.create({ day, time, lecture });

    // Real-time update
    io.emit("scheduleUpdate", { day, time, lecture });

    // Save notification
    await Notification.create({
      type: "update",
      message: `New lecture added on ${day} at ${time}`
    });

    res.json({ success: true, lecture: newLecture });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// 📌 Delete Lecture
app.post("/delete", async (req, res) => {
  try {
    const { day, time } = req.body;

    if (!day || !time)
      return res.json({ success: false, msg: "Missing data" });

    const deleted = await Lecture.findOneAndDelete({ day, time });

    if (!deleted)
      return res.json({ success: false, msg: "Lecture not found" });

    io.emit("scheduleUpdate", { day, time, lecture: null });

    await Notification.create({
      type: "delete",
      message: `Lecture removed on ${day} at ${time}`
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// 📌 Fetch Notifications
app.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// 📌 Send Notification
app.post("/send-notification", async (req, res) => {
  try {
    const { type, message } = req.body;

    if (!type || !message)
      return res.json({ success: false, msg: "Missing data" });

    const notif = await Notification.create({ type, message });

    io.emit("newNotification", {
      type,
      message,
      date: notif.date
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/Calendar.html");
});


// 📌 Teacher Login
app.post("/teachlogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const teacher = await Teacher.findOne({ username, password });

    if (!teacher)
      return res.status(401).json({ message: "Invalid username or password" });

    res.json({ message: "Login successful", username: teacher.username });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Socket.io ----------------
io.on("connection", socket => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ---------------- Start Server ----------------
const PORT = 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const Student = require("./models/Student");

const app = express();
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/smartschedule")
  .then(() => console.log("MongoDB connected"));

const serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Save FCM token
app.post("/save-token", async (req, res) => {
  const { token } = req.body;

  // demo: save to first student
  await Student.updateOne({}, { fcmToken: token });

  res.send("Token saved");
});

// Test notification
app.get("/send-test", async (req, res) => {
  const student = await Student.findOne({ fcmToken: { $ne: null } });

  await admin.messaging().send({
    token: student.fcmToken,
    notification: {
      title: "📅 Smart Schedule",
      body: "This is WhatsApp-like notification!"
    }
  });

  res.send("Notification sent");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

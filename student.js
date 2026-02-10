const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  mobile: String,
  fcmToken: String
});

module.exports = mongoose.model("Student", studentSchema);

const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
  homeworkType: {
    type: String,
    required: true
  },
  classId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "class",
    required: true
  }],
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  HomeworkTitle: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  maxMarks: {
    type: Number,
    default: 0
  },
  attachmentUrl: {
    type: String // Cloudinary/S3 URL for uploaded file
  },
  urlLinks: {
    type: String 
  },
 
}, { timestamps: true });

module.exports = mongoose.model("Homework", homeworkSchema, "Homework");

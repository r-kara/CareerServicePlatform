const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  status: {
    type: String,
  },
  jobPostingId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  resume: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  company: {
    type: String,
  },
  title: {
    type: String,
  },
  companyImageUrl: {
    type: String,
  },
  companyDescription: {
    type: String,
  }
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
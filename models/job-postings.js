const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema for job-postings
const jobPostingSchema = new Schema({
  company: {
    type: String,
    required: [true, "The company field is required"],
  },
  title: {
    type: String,
    required: [true, "The title field is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "The imageUrl field is required"],
  },
  description: {
    type: String
  }
});

// Create model for job-postings
const jobPosting = mongoose.model("job-postings", jobPostingSchema);

module.exports = jobPosting;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema for job-postings
const MailingListSchema = new Schema({
  email: {
    type: String,
    required: [true, "The email field is required"],
  },
});

// Create model for job-postings
const MailingList = mongoose.model("mailing-lists", MailingListSchema);

module.exports = MailingList;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    username: {
      type: String,
      required: [true, "The company name is required"],
    },
    email: {
      type: String,
      required: [true, "A valid email is required"],
    },
    password: {
      type: String,
      required: [true, ""],
    },
    usertype: {
      type: String,
      required: true,
      default: "user",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    imageUrl: {
      type: String,
      required: false,
      default: "default.jpg"
    },
    notification: {
      type: Boolean,
      default: false,
    },
    resume: {
      type: String,
    },
  });
  
  // Create model for employer profile
  const userProfile = mongoose.model("UserProfile", userProfileSchema);
  module.exports = userProfile;
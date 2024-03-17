const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employerProfileSchema = new Schema({
    cname: {
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
      default: "employer",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    imageUrl: {
      type: String,
      required: false,
      default: "default-employer.jpg"
    }
  });
  
  // Create model for employer profile
  const employerProfile = mongoose.model("EmployerProfile", employerProfileSchema);
  module.exports = employerProfile;
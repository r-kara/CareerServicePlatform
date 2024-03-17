const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminProfileSchema = new Schema({
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    userrole: {
      type: String,
      default: "admin",
    },
    permissions: {
      type: String,
      default: "all",
    }
  });
  
  const adminProfile = mongoose.model("AdminProfile", adminProfileSchema);
  module.exports = adminProfile;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // Add email validation if needed
  },
  password: {
    type: String,
    required: true,
    // Password should be hashed before saving
  },
  birthday: {
    type: Date,
    default: Date.now,
  },
  lastLoginDate: {
    type: Date,
    default: Date.now, // No login yet
  },
  phone: {
    type: String,
    // required: true,
  },
  bio: {
    type: String,
    default: "", // Optional description
  },
  address: {
    type: String,
    // required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  lastLoginDate: {
    type: Date,
    default: Date.now, // No login yet
  },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;

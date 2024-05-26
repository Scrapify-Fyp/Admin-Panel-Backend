const express = require("express");
const router = express.Router();
const Admin = require("../models/AdminSchema");
const bcrypt = require("bcrypt");

const saltRounds = 10; // for password hashing, 10 is a good number

// GET all users
router.get("/Admins", async (req, res) => {
  try {
    const Admins = await Admin.find();
    res.json(Admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/Admins", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const admin = new Admin({
      username: req.body.username,
      password: hashedPassword,
      createdDate: req.body.createdDate || new Date(),
      lastLoginDate: req.body.lastLoginDate || null,
    });
  
    try {
      const newAdmin = await admin.save();
      res.status(201).json({
        message: "Admin created successfully",
        Admin: newAdmin,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
// GET a single user by ID
router.get("/Admin/:id", getUser, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const sanitizedUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      imageUrl: user.imageUrl,
    };
    res.json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

module.exports = router;

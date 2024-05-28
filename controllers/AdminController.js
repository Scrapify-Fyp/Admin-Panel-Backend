const express = require("express");
const router = express.Router();
const Admin = require("../models/AdminSchema");
const bcrypt = require("bcrypt");

const saltRounds = 10; 

// GET admins
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

module.exports = router;

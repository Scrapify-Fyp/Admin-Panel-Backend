const express = require("express");
const router = express.Router();
const Admin = require("../models/AdminSchema");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// GET admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST admin
router.post("/admins", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const admin = new Admin({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    imageUrl: req.body.imageUrl,
    lastLoginDate: req.body.lastLoginDate || null,
  });

  try {
    const newAdmin = await admin.save();
    res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH admin
router.patch("/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { username, email, phone, address, imageUrl } = req.body;
    if (username) admin.username = username;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;
    if (address) admin.address = address;
    if (imageUrl) admin.imageUrl = imageUrl;

    await admin.save();
    // console.log("done.........");
    res.json({ message: "Profile updated successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/admins/update-password", async (req, res) => {
  const { adminId, oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    admin.password = hashedNewPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

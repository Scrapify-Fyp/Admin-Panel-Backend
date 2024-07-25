const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../models/AdminSchema")
router.post("/Adminlogin", async (req, res) => {
  const { username, password } = req.body;
  console.log(username , password);
  try {
    if (!username || !password) {
      return res.status(400).json({ msg: "Please provide username and password" });
    }

    let admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ msg: "Username not found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    const payload = {
      admin: {
        id: admin.id,
        username: admin.username, 
        imageUrl:admin. imageUrl,
      },
    };

    // Sign the JWT
    const token = jwt.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: '900s' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 900000, 
    });
    res.json({ token, admin: payload.admin });

    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

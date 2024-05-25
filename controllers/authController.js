const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/userSchema");

// User registration (signup)
router.post("/signup", async (req, res) => {
  const { firstName, lastName, phone, birthday, email, password } = req.body;
  console.log(firstName, lastName, phone);

  try {
    let user = await User.findOne({ firstName, lastName });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ firstName, lastName, birthday, phone, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("err:", err.message);
    res.status(500).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User Not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
      },
    };

    

    jwt.sign(
      payload,
      process.env.JWT_SECRETKEY,
      { expiresIn: "900s" },
      (err, token) => {
        // console.log(
        //   "🚀 ~ jwt.sign ~ JWT_SECRETKEY:",
        //   process.env.JWT_SECRETKEY
        // );
        if (err) throw err;

        // Set token in cookies (example using cookie-parser middleware)
        res.cookie("token", token, {
          httpOnly: false,
        });
        // Set token in response body (JSON)
        res.json({ token, user: payload.user });

        // Set token in local storage (example using localStorage)
        localStorage.setItem("token", token);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

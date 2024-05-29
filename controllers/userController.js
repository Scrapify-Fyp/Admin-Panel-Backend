const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Product = require("../models/productsSchema");

const saltRounds = 10; // for password hashing, 10 is a good number

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single user by ID
router.get("/users/:id", getUser, async (req, res) => {
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
      // Add other non-sensitive fields as needed
    };
    res.json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new user
router.post("/users", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    createdDate: req.body.createdDate || new Date(),
    lastLoginDate: req.body.lastLoginDate || null,
  });

  try {
    const newUser = await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/:id/products", async (req, res) => {
  const userId = req.params.id;

  try {
    const products = await Product.find({ vendorId: userId }).exec();

    if (!products) {
      return res.status(404).json({ msg: "No products found for this user" });
    }

    res.json({ msg: "API hit successful!", products: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// PATCH update a user by ID
router.patch("/users/:id", async (req, res) => {
  const userId = req.params.id;
  // console.log("🚀 ~ router.patch ~ userId:", userId)
  const userDataToUpdate = req.body;
  console.log("🚀 ~ router.patch ~ userDataToUpdate:", userDataToUpdate);

  try {
    // Find user by ID and update fields directly in one operation
    const updatedUser = await User.findByIdAndUpdate(userId, userDataToUpdate, {
      new: true, // Return the updated document after update
      runValidators: true, // Run validators (e.g., required, minlength) on update
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const sanitizedUser = {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      bio: updatedUser.bio,
      imageUrl: updatedUser.imageUrl,
      // Add other non-sensitive fields as needed
    };

    // Respond with the updated user object
    res.json(sanitizedUser);
  } catch (error) {
    // Handle validation errors or other database errors
    res.status(400).json({ message: error.message });
  }
});

// DELETE delete a user by ID
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      // If the user with the given ID doesn't exist, send a 404 Not Found response
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user is successfully deleted, send a 200 OK response
    res.json({ message: 'User deleted', deletedUser });
  } catch (error) {
    // If an error occurs during the deletion process, send a 500 Internal Server Error response
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

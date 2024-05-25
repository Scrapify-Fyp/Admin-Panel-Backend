const express = require("express");
const router = express.Router();
const Shop = require("../models/shopSchema");
const Product = require("../models/productsSchema");
const { ObjectId } = require("mongodb");
// Route to create a new shop
router.post("/shop", async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    // Create a new shop
    const newShop = new Shop({
      name,
      description,
      userId,
    });

    // Save the new shop to the database
    const savedShop = await newShop.save();

    res.status(201).json(savedShop); // Send the saved shop as the response
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all shops
router.get("/shop", async (req, res) => {
  try {
    const shops = await Shop.find();

    res.status(200).json(shops); // Send the shops found as the response
  } catch (error) {
    console.error("Error getting shops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get a shop by ID
router.get("/shop/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.status(200).json(shop); // Send the shop found as the response
  } catch (error) {
    console.error("Error getting shop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update a shop by ID
router.put("/shop/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const updatedShop = await Shop.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedShop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.status(200).json(updatedShop); // Send the updated shop as the response
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a shop by ID
router.delete("/shop/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedShop = await Shop.findByIdAndDelete(id);

    if (!deletedShop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.status(200).json(deletedShop); // Send the deleted shop as the response
  } catch (error) {
    console.error("Error deleting shop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get a user's shop by user ID
router.get("/user/:id/shop", async (req, res) => {
  // console.log("Api Hit success!");
  try {
    const userId = req.params.id;
    // console.log("🚀 ~ router.get ~ userId:", req.params);
    const userShops = await Shop.find({ userId });
    // console.log("🚀 ~ router.get ~ userShops:", userShops);

    res.status(200).json(userShops); // Send the user's shops as the response
  } catch (error) {
    console.error("Error getting user's shops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// router.get("/user/:id/shop/products", async (req, res) => {
//   console.log("Api Hit success!");
//   try {
//     const userId = req.params.id;
//     console.log("🚀 ~ router.get ~ userId:", req.params);
//     const userShops = await Shop.find({ userId });
//     console.log("🚀 ~ router.get ~ userShops:", userShops);

//     res.status(200).json(userShops); // Send the user's shops as the response
//   } catch (error) {
//     console.error("Error getting user's shops:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/user/:id/shop/products", async (req, res) => {
  // console.log("Api Hit success!");
  try {
    const userId = req.params.id;
    // console.log("🚀 ~ router.get ~ userId:", req.params);

    // Find the shop(s) belonging to the user
    const userShops = await Shop.find({ userId });
    // console.log("🚀 ~ router.get ~ userShops:", userShops);

    // Extract productIds from the userShops
    const productIds = userShops.flatMap((shop) => shop.productIds);

    // Retrieve all products associated with the extracted productIds
    // Assuming you have a Product model and a corresponding collection in your database
    const products = await Product.find({
      _id: { $in: productIds.map((id) => new ObjectId(id)) },
    });

    res.status(200).json(products); // Send the products as the response
  } catch (error) {
    console.error("Error getting user's shops and products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

module.exports = router;

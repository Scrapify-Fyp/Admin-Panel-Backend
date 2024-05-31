const express = require("express");
const router = express.Router();
const Product = require("../models/productsSchema");
const Shop = require("../models/shopSchema");
const User = require("../models/userSchema");

// GET all products
router.get("/products", async (req, res) => {
  try {
    // const products = await Product.find();
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single product by ID
router.get("/products/:id", getProduct, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {}
});

// router.get("/user/:id/products", (req, res) => {
//   const userId = req.params.id;
//   console.log("🚀 ~ router.get ~ userId:", userId);
//   res.json({ msg: "API hit successful!", userId: userId });
// });

// router.post("/products", async (req, res) => {
//   const existingProduct = await Product.findOne({
//     name: req.body.name,
//     vendorId: req.body.vendorId,
//   });
//   if (existingProduct) {
//     return res
//       .status(400)
//       .json({ message: "Product from the same vendor already exists" });
//   }

//   const product = new Product({
//     name: req.body.name,
//     description: req.body.description,
//     price: req.body.price,
//     category: req.body.category,
//     stockQuantity: req.body.stockQuantity,
//     imageURL: req.body.imageURL,
//     brand: req.body.brand,
//     weight: req.body.weight,
//     dimensions: req.body.dimensions,
//     color: req.body.color,
//     material: req.body.material,
//     keywords: req.body.keywords,
//     rating: req.body.rating,
//     relatedProducts: req.body.relatedProducts,
//     discounts: req.body.discounts,
//     availabilityStatus: req.body.availabilityStatus,
//     vendorId: req.body.vendorId,
//   });

//   // console.log(product);
//   try {
//     const newProduct = await product.save();
//     const savedInShop = await Shop.findById({userId : req.body.vendorId});
//     const res = savedInShop.products.push(newProduct._id);
//     res.status(201).json({
//       message: "Data Successfully Saved to the DB!",
//       product: newProduct,res
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

router.post("/products", async (req, res) => {
  try {
    // Check if the product already exists for the vendor
    const existingProduct = await Product.findOne({
      name: req.body.name,
      vendorId: req.body.vendorId,
    });
    console.log("🚀 ~ router.post ~ existingProduct:", existingProduct)
    
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product from the same vendor already exists" });
    }

    // Create a new product
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stockQuantity: req.body.stockQuantity,
      imageURL: req.body.imageURL,
      brand: req.body.brand,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      color: req.body.color,
      material: req.body.material,
      keywords: req.body.keywords,
      rating: req.body.rating,
      relatedProducts: req.body.relatedProducts,
      discounts: req.body.discounts,
      availabilityStatus: req.body.availabilityStatus,
      vendorId: req.body.vendorId,
    });

    // Save the new product to the database
    const newProduct = await product.save();

    // Find the shop by userId
    let shop = await Shop.findOne({ userId: req.body.vendorId });
    let user = await User.findOne({ _id: req.body.vendorId });

    // If shop doesn't exist, create a new shop
    if (!shop) {
      shop = new Shop({
        name: `${user.firstName}'s Shop`,
        description: "Hello! Welcome to My Shop!",
        userId: req.body.vendorId,
        productIds: [newProduct._id],
      });
    } else {
      // If shop exists, add the new product's ID to the shop's products array
      shop.productIds.push(newProduct._id);
    }

    // Save the shop
    await shop.save();

    // Send a success response
    res.status(201).json({
      message: "Product successfully saved to the database!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH update a product by ID
router.patch("/products/:id", getProduct, async (req, res) => {
  // console.log("🚀 ~ router.post ~ product:", product);
  
  try {
    if (!res.product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (req.body.name != null) {
      res.product.name = req.body.name;
    }
    if (req.body.description != null) {
      res.product.description = req.body.description;
    }
    if (req.body.price != null) {
      res.product.price = req.body.price;
    }
    if (req.body.category != null) {
      res.product.category = req.body.category;
    }
    if (req.body.stockQuantity != null) {
      res.product.stockQuantity = req.body.stockQuantity;
    }
    if (req.body.imageURL != null) {
      res.product.imageURL = req.body.imageURL;
    }
    if (req.body.brand != null) {
      res.product.brand = req.body.brand;
    }
    if (req.body.weight != null) {
      res.product.weight = req.body.weight;
    }
    if (req.body.dimensions != null) {
      if (req.body.dimensions.length != null) {
        res.product.dimensions.length = req.body.dimensions.length;
      }
      if (req.body.dimensions.width != null) {
        res.product.dimensions.width = req.body.dimensions.width;
      }
      if (req.body.dimensions.height != null) {
        res.product.dimensions.height = req.body.dimensions.height;
      }
    }
    if (req.body.color != null) {
      res.product.color = req.body.color;
    }
    if (req.body.material != null) {
      res.product.material = req.body.material;
    }
    if (req.body.keywords != null) {
      res.product.keywords = req.body.keywords;
    }
    if (req.body.rating != null) {
      res.product.rating = req.body.rating;
    }
    if (req.body.relatedProducts != null) {
      res.product.relatedProducts = req.body.relatedProducts;
    }
    if (req.body.discounts != null) {
      res.product.discounts = req.body.discounts;
    }
    if (req.body.availabilityStatus != null) {
      res.product.availabilityStatus = req.body.availabilityStatus;
    }
  
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE delete a product by ID
router.delete("/products/:id", getProduct, async (req, res) => {
  const productId = req.params.id;
  const vendorId = req.body.vendorId;
  console.log("🚀 ~ router.delete ~ vendorId:", vendorId);

  try {
    // Find the product by ID and remove it from the database
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // If product not found, return 404 Not Found response
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the shop by vendorId and remove the product ID from the productIds array
    const shop = await Shop.findOne({ userId: vendorId });
    if (shop) {
      shop.productIds = shop.productIds.filter(
        (id) => id.toString() !== productId
      );
      await shop.save();
    }

    // Send success response
    res.json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.get('/products/user/:id',(req,res)=>{
//   console.log("Request hit" , req.params.id);
//   res.status(400).json({msg:"No Products found!"});
// })

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.product = product;
  next();
}

module.exports = router;

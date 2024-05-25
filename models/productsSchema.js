const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: [String],
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  brand: String,
  weight: String,
  dimensions: {
    type: {
      length: Number,
      width: Number,
      height: Number,
    },
    default: {},
  },
  color: String,
  material: String,
  keywords: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  // relatedProducts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Product",
  //   },
  // ],
  discounts: {
    type: String,
  },
  availabilityStatus: {
    type: String,
    enum: ["available", "outOfStock", "discontinued"],
    default: "available",
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    // type: String,
    ref: "User",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

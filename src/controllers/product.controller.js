const Product = require("../models/product.model");
const redisClient = require("../config/redis");

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      productId: product._id
    });

  } catch (error) {
    next(error); // send to error handler
  }
};

// Search Products
exports.searchProducts = async (req, res, next) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required"
      });
    }

    

    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    next(error);
  }
};
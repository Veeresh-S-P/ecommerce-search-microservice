const Product = require("../models/product.model");
const { redisClient } = require("../config/redis");

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

    const cacheKey = `search:${query.toLowerCase()}`;

    //Check Redis First
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning from Redis cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    //Fetch from MongoDB
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(200)
      .lean();

    const responseData = {
      success: true,
      count: products.length,
      data: products
    };

    // Store in Redis (5 minutes TTL)
    await redisClient.set(
      cacheKey,
      JSON.stringify(responseData),
      { EX: 300 }
    );

    return res.status(200).json(responseData);

  } catch (error) {
    next(error);
  }
};
const Product = require("../models/product.model");
const { redisClient } = require("../config/redis");
const parseQuery = require("../services/queryParser.service");


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
    const rawQuery = req.query.query;

    if (!rawQuery) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required"
      });
    }

    const { cleanedQuery, filters, sortOption } = parseQuery(rawQuery);

    // Better cache key (include full query)
    const cacheKey = `search:${rawQuery.toLowerCase().trim()}`;

    //Check Redis First
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("⚡ Returning from Redis cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    //Built Mongo Query
    const mongoQuery = {
      ...filters,
      $text: { $search: cleanedQuery }
    };

    let mongoSearch = Product.find(
      mongoQuery,
      { score: { $meta: "textScore" } }
    )
      .limit(200)
      .lean();

    // Applied Sorting
    if (sortOption) {
      mongoSearch = mongoSearch.sort(sortOption);
    } else {
      mongoSearch = mongoSearch.sort({ score: { $meta: "textScore" } });
    }

    const products = await mongoSearch;

    const responseData = {
      success: true,
      count: products.length,
      data: products
    };

    // Store in Redis (5 minutes)
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
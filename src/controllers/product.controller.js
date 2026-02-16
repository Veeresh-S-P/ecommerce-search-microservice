const Product = require("../models/product.model");
const { redisClient } = require("../config/redis");
const {parseQuery} = require("../services/queryParser.service");
const fuzzyMatch = require("../services/fuzzy.service");
const { getCache, setCache } = require("../services/cache.service");
const { RANKING_WEIGHTS, MAX_PRICE_NORMALIZATION } = require("../utils/constants");
const { buildRankingStages } = require("../services/ranking.service");


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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const rawQuery = req.query.query;

    if (!rawQuery) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required"
      });
    }

    const { cleanedQuery, filters, sortOption } = parseQuery(rawQuery);

    const cacheKey = `search:${rawQuery.toLowerCase().trim()}:page=${page}:limit=${limit}`;

    //Redis Check
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log("⚡ Returning from Redis cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    let finalSearchTerm = cleanedQuery;

    const initialCount = await Product.countDocuments({
      ...filters,
      $text: { $search: cleanedQuery }
    });

    if (initialCount === 0 && cleanedQuery) {
      finalSearchTerm = await fuzzyMatch(cleanedQuery);
    }

    const mongoQuery = {
      ...filters,
      $text: { $search: finalSearchTerm }
    };

   const aggregationPipeline = [
  { $match: mongoQuery },

  {
    $addFields: {
      textScore: { $meta: "textScore" }
    }
  },

  ...buildRankingStages()
];
    if (sortOption) {
      aggregationPipeline.push({ $sort: sortOption });
    } else {
      aggregationPipeline.push({ $sort: { finalScore: -1 } });
    }

    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });

    const products = await Product.aggregate(aggregationPipeline);

    const total = await Product.countDocuments(mongoQuery);

    const responseData = {
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      data: products
    };

    await setCache(cacheKey, responseData);

    return res.status(200).json(responseData);

  } catch (error) {
    next(error);
  }
};
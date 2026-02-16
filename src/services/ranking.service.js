const { RANKING_WEIGHTS, MAX_PRICE_NORMALIZATION } = require("../utils/constants");

/**
 * Builds aggregation ranking stages
 * @returns {Array} MongoDB aggregation stages
 */
const buildRankingStages = () => {
  return [
    // Add scoring components
    {
      $addFields: {
        ratingScore: { $divide: ["$rating", 5] },

        ratingConfidence: {
          $log10: { $add: ["$ratingCount", 1] }
        },

        salesScore: {
          $log10: { $add: ["$unitsSold", 1] }
        },

        priceScore: {
          $subtract: [
            1,
            { $divide: ["$price", MAX_PRICE_NORMALIZATION] }
          ]
        },

        stockScore: {
          $cond: [{ $gt: ["$stock", 0] }, 1, -1]
        },

        returnPenalty: "$returnRate"
      }
    },

    // Compute final weighted score
    {
      $addFields: {
        finalScore: {
          $subtract: [
            {
              $add: [
                { $multiply: ["$textScore", RANKING_WEIGHTS.TEXT] },
                { $multiply: ["$ratingScore", RANKING_WEIGHTS.RATING] },
                { $multiply: ["$ratingConfidence", RANKING_WEIGHTS.RATING_CONFIDENCE] },
                { $multiply: ["$salesScore", RANKING_WEIGHTS.SALES] },
                { $multiply: ["$priceScore", RANKING_WEIGHTS.PRICE] },
                { $multiply: ["$stockScore", RANKING_WEIGHTS.STOCK] }
              ]
            },
            { $multiply: ["$returnPenalty", RANKING_WEIGHTS.RETURN_PENALTY] }
          ]
        }
      }
    }
  ];
};

module.exports = { buildRankingStages };
const express = require("express");
const { body } = require("express-validator");
const { createProduct, searchProducts  } = require("../controllers/product.controller");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("rating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be between 0 and 5"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be positive integer"),
    body("category")
      .optional()
      .isIn(["mobile","laptop","accessory","headphone","tablet"])
      .withMessage("Invalid category")
  ],
  validateRequest,
  createProduct
);

router.get("/search", searchProducts);

module.exports = router;
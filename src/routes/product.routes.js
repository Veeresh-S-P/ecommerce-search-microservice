const express = require("express");
const { body } = require("express-validator");
const { createProduct, searchProducts  } = require("../controllers/product.controller");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isNumeric().withMessage("Price must be number"),
    body("rating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be between 0 and 5"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be positive integer")
  ],
  validateRequest,
  createProduct
);

router.get("/search", searchProducts);

module.exports = router;
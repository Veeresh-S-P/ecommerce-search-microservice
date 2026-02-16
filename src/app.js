const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimiter = require("./middlewares/rateLimiter");
const productRoutes = require("./routes/product.routes");


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimiter);

app.use("/api/v1/product", productRoutes);
// Health check route
app.get("/", (req, res) => {
  res.send("Ecommerce Search Service Running");
});

module.exports = app;
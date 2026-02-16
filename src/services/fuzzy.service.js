const Fuse = require("fuse.js");
const Product = require("../models/product.model");

const fuzzyMatch = async (searchTerm) => {
  const products = await Product.find(
  { $text: { $search: searchTerm } },
  { title: 1 }
).limit(50).lean();

  const list = products.map(p => ({
  title: p.title,
  brand: p.brand
}));

const fuse = new Fuse(list, {
  keys: ["title", "brand"],
  threshold: 0.4
});

  const result = fuse.search(searchTerm);

  if (result.length > 0) {
    return result[0].item; // Best match
  }

  return searchTerm;
};

module.exports = fuzzyMatch;
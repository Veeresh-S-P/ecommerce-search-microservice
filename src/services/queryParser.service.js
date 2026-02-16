const CHEAP_KEYWORDS = [
  "cheap","low price","budget","best price","offer","deal","under","below",
  "sasta","sasti","kam daam","kam price","kam rate","saste mein","kam paisa",
  "kadime duddu","kadime bele","swalpa bele","kammi bele","kadime rate",
  "kurai vilai","kammi vilai","kuraindha vilai","cheap ah","low vilai",
  "takkuva dhara","takkuva rate","takkuva price","chinna budget","kammi rate",
  "kuranja vila","kurav vila","low vila","kurav rate",
  "swasta","kami daam","kami kimat","kami rate"
];

const parseQuery = (rawQuery) => {
  let cleanedQuery = rawQuery.toLowerCase().trim();

  let filters = {};
  let sortOption = null;

  // Cheap intent
  for (let word of CHEAP_KEYWORDS) {
    if (cleanedQuery.includes(word)) {
      sortOption = { price: 1 };
      cleanedQuery = cleanedQuery.replace(word, "").trim();
    }
  }

  // Price detection
  const kMatch = cleanedQuery.match(/(\d+)\s?k/);
  if (kMatch) {
    filters.price = { $lte: parseInt(kMatch[1]) * 1000 };
    cleanedQuery = cleanedQuery.replace(kMatch[0], "").trim();
  }

  const underMatch = cleanedQuery.match(/under\s?(\d+)/);
  if (underMatch) {
    filters.price = { $lte: parseInt(underMatch[1]) };
    cleanedQuery = cleanedQuery.replace(underMatch[0], "").trim();
  }

  const belowMatch = cleanedQuery.match(/below\s?(\d+)/);
  if (belowMatch) {
    filters.price = { $lte: parseInt(belowMatch[1]) };
    cleanedQuery = cleanedQuery.replace(belowMatch[0], "").trim();
  }

  const lakhMatch = cleanedQuery.match(/(\d+)\s?lakh/);
  if (lakhMatch) {
    filters.price = { $lte: parseInt(lakhMatch[1]) * 100000 };
    cleanedQuery = cleanedQuery.replace(lakhMatch[0], "").trim();
  }

  // Color detection
  const COLORS = [
    "red","blue","black","white","green",
    "gold","silver","grey","gray","purple","pink"
  ];

  for (let color of COLORS) {
    if (cleanedQuery.includes(color)) {
      filters["metadata.color"] = color;
      cleanedQuery = cleanedQuery.replace(color, "").trim();
    }
  }

  // Storage detection
  const storageMatch = cleanedQuery.match(/(\d+)\s?(gb|tb)/);
  if (storageMatch) {
    const size = storageMatch[1];
    const unit = storageMatch[2].toUpperCase();
    filters["metadata.storage"] = `${size}${unit}`;
    cleanedQuery = cleanedQuery.replace(storageMatch[0], "").trim();
  }

  return {
    cleanedQuery,
    filters,
    sortOption
  };
};

module.exports = { parseQuery };
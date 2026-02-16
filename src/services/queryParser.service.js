const CHEAP_KEYWORDS = [
  // English
  "cheap",
  "low price",
  "budget",
  "best price",
  "offer",
  "deal",
  "under",
  "below",

  // Hindi
  "sasta",
  "sasti",
  "kam daam",
  "kam price",
  "kam rate",
  "saste mein",
  "kam paisa",

  // Kannada
  "kadime duddu",
  "kadime bele",
  "swalpa bele",
  "kammi bele",
  "kadime rate",

  // Tamil
  "kurai vilai",
  "kammi vilai",
  "kuraindha vilai",
  "cheap ah",
  "low vilai",

  // Telugu
  "takkuva dhara",
  "takkuva rate",
  "takkuva price",
  "chinna budget",
  "kammi rate",

  // Malayalam
  "kuranja vila",
  "kurav vila",
  "low vila",
  "kurav rate",

  // Marathi
  "swasta",
  "kami daam",
  "kami kimat",
  "kami rate",

  // Konkani
  "kami daam",
  "kami rate"
];

const parseQuery = (rawQuery) => {
  let query = rawQuery.toLowerCase().trim();

  let filters = {};
  let sortOption = null;
  let cleanedQuery = query;

  // 🔥 Detect cheap intent multi-language
  for (let word of CHEAP_KEYWORDS) {
    if (query.includes(word)) {
      sortOption = { price: 1 };
      cleanedQuery = cleanedQuery.replace(word, "").trim();
    }
  }

  return {
    cleanedQuery,
    filters,
    sortOption
  };
};

module.exports = parseQuery;
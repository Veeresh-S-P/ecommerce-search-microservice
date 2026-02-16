# 🛒 E-Commerce Search Microservice

A high-performance search microservice built using **Node.js, Express, MongoDB, and Redis** for ranking and retrieving electronic products targeting Tier-2 and Tier-3 cities in India.

---

## 📌 Features

- 🔍 Full-text product search (MongoDB Text Index)
- 🌎 Multi-language query intent detection (English + Indian languages)
- 💰 Budget detection (`50k`, `under 30000`, `1 lakh`)
- 🎨 Color filtering
- 💾 Storage filtering (`128GB`, `1TB`)
- 🔤 Typo correction using Fuse.js
- 🧠 Weighted ranking algorithm (Aggregation-based scoring)
- ⚡ Redis caching for repeated queries
- 📄 Pagination support
- 🛡 Input validation and error handling
- 🏗 Clean microservice architecture

---

## 🏗 Architecture

```
src/
│
├── controllers/
│   └── product.controller.js
│
├── services/
│   ├── cache.service.js
│   ├── fuzzy.service.js
│   ├── ranking.service.js
│   └── queryParser.service.js
│
├── models/
│   └── product.model.js
│
├── utils/
│   └── constants.js
│
├── middlewares/
│   ├── validateRequest.js
│   └── errorHandler.js
│
└── routes/
    └── product.routes.js
```

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (Caching)
- Fuse.js (Fuzzy Search)
- express-validator

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd ecommerce-search-microservice
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables (.env)

Create a `.env` file in root directory:

```env
PORT=8810
MONGO_URI=<your-mongo-uri>
REDIS_URL=redis://127.0.0.1:6379
```

### 4️⃣ Start Redis Server

```bash
redis-server
```

### 5️⃣ Start Application

```bash
npm run dev
```

Server runs on:

```
http://localhost:8810
```

---

# 📦 API Documentation

## 1️⃣ Create Product

**Endpoint**

```
POST /api/v1/product
```

**Sample Request Body**

```json
{
  "title": "iPhone 16",
  "description": "128GB black color",
  "brand": "Apple",
  "category": "mobile",
  "price": 60000,
  "mrp": 79999,
  "rating": 4.5,
  "stock": 50,
  "metadata": {
    "ram": "8GB",
    "storage": "128GB",
    "color": "black"
  }
}
```

---

## 2️⃣ Search Products

**Endpoint**

```
GET /api/v1/product/search
```

### Query Parameters

| Parameter | Description |
|------------|------------|
| query | Search keyword |
| page | Page number (default: 1) |
| limit | Results per page (default: 10) |

---

### Example Queries

```
/search?query=iphone
/search?query=sasta iphone
/search?query=iphone 50k
/search?query=red iphone 128gb
/search?query=ifone
/search?query=iphone&page=2&limit=5
```

---

# 🧠 Ranking Logic

Ranking is implemented using a weighted scoring model inside MongoDB aggregation.

### Scoring Formula

```
finalScore =
(TEXT * 0.35) +
(RATING * 0.20) +
(RATING_CONFIDENCE * 0.10) +
(SALES * 0.10) +
(PRICE * 0.10) +
(STOCK * 0.10) -
(RETURN_PENALTY * 0.05)
```

### Signals Used

- Text relevance score (`$meta: textScore`)
- Rating quality
- Rating confidence (log normalization of rating count)
- Units sold (log normalization)
- Price attractiveness
- Stock availability
- Return rate penalty

All ranking weights are configurable via `utils/constants.js`.

---

# 🌎 Multi-Language Query Parsing

The system extracts structured filters from unstructured queries.

Supports:

- English: `cheap`, `under`, `below`
- Hindi: `sasta`, `kam daam`
- Kannada: `kadime bele`
- Tamil, Telugu, Malayalam, Marathi, Konkani budget terms
- Budget formats: `50k`, `1 lakh`
- Color detection (`red`, `black`, etc.)
- Storage detection (`128GB`, `1TB`)

---

# ⚡ Performance Optimization

- Redis caching for repeated queries
- Page-aware cache keys
- Aggregation-based ranking inside MongoDB
- Indexed fields for fast filtering
- Text index for full-text search

Example latency improvement observed:

```
Without Redis: ~300-400ms
With Redis: ~4-10ms
```

---

# 📊 Database Indexing

- Text index on `title`, `description`, `brand`
- Index on `price`
- Index on `category`
- Index on `metadata.color`

---

# 📄 License

MIT License

# 🛒 E-Commerce Search Microservice

A high-performance search engine microservice built using **Node.js, Express, MongoDB, and Redis** for ranking and retrieving electronic products targeting Tier-2 and Tier-3 cities in India.

---

## 📌 Features

- 🔍 Full-text product search  
- 🌎 Multi-language query intent detection (English + Indian languages)  
- 💰 Budget detection (e.g., `50k`, `under 30000`, `1 lakh`)  
- 🎨 Color filtering  
- 💾 Storage filtering (e.g., `128GB`, `1TB`)  
- 🔤 Typo correction using Fuse.js  
- 🧠 Advanced weighted ranking algorithm  
- ⚡ Redis caching (~99% latency reduction for repeated queries)  
- 📄 Pagination support  
- 🏗 Clean microservice architecture  
- 🛡 Input validation and error handling  

---

## 🏗 Architecture


src/
│
├── controllers/
│ └── product.controller.js
│
├── services/
│ ├── cache.service.js
│ ├── fuzzy.service.js
│ ├── ranking.service.js
│ └── queryParser.service.js
│
├── models/
│ └── product.model.js
│
├── utils/
│ └── constants.js
│
├── middlewares/
│ ├── validateRequest.js
│ └── errorHandler.js
│
└── routes/
└── product.routes.js


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
git clone https://github.com/Veeresh-S-P/ecommerce-search-microservice/
cd ecommerce-search-microservice
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment Variables (.env)
PORT=8810
MONGO_URI=<your-mongo-uri>
REDIS_URL=<your-redis-url>
4️⃣ Start Redis Server
redis-server
5️⃣ Start Application
npm run dev

Server runs on:

http://localhost:8810
📦 API Documentation
1️⃣ Create Product

Endpoint

POST /api/v1/product

Body Example

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
2️⃣ Search Products

Endpoint

GET /api/v1/product/search
Query Parameters
Parameter	Description
query	Search keyword
page	Page number
limit	Results per page
Example Queries
/search?query=iphone
/search?query=sasta iphone
/search?query=iphone 50k
/search?query=red iphone 128gb
/search?query=ifone
/search?query=iphone&page=2&limit=5
🧠 Ranking Logic

Ranking is based on weighted scoring using MongoDB aggregation.

Formula
finalScore =
(TEXT * 0.35) +
(RATING * 0.20) +
(RATING_CONFIDENCE * 0.10) +
(SALES * 0.10) +
(PRICE * 0.10) +
(STOCK * 0.10) -
(RETURN_PENALTY * 0.05)
Signals Used

Text relevance score

Rating quality

Rating confidence (log normalization)

Units sold (popularity)

Price attractiveness

Stock availability

Return rate penalty

All weights are configurable via constants.js.

🌎 Multi-Language Query Parsing

Supports:

English (cheap, under, below)

Hindi (sasta, kam daam)

Kannada (kadime bele)

Tamil, Telugu, Malayalam, Marathi, Konkani

Budget formats: 50k, 1 lakh

Color detection

Storage detection

⚡ Performance Optimization

Redis caching for repeated queries

Page-aware cache keys

Aggregation-based ranking inside MongoDB

Indexed fields for fast filtering

Text index for full-text search

Latency Improvement
Without Redis: ~360ms
With Redis: ~4ms
~99% latency reduction
📊 Database Indexing

Text index on title, description, brand

Index on price

Index on category

Index on metadata.color

🛠 Future Improvements

Elasticsearch integration

Learning-based ranking (click tracking)

Synonym expansion

Filter relaxation strategy

Horizontal scaling support
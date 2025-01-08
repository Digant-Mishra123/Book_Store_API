# Book Store API

## Overview
The Book Store API provides functionality for managing books with key features:
- **Rate Limiting**: Limits users to a maximum number of API requests per minute.
- **Caching**: Optimizes performance by caching GET request responses.
- **Role-Based Access Control (RBAC)**: Secures endpoints based on user roles (Admin or User).

## Setup and Installation

### Prerequisites
- **Node.js** (v14.x or later)
- **Redis** (running locally or via a cloud provider)
- A terminal or command-line tool

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dibya47/Book-Store-API.git
   cd Book-Store-API
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Redis**:
   If Redis is installed locally, start it:
   ```bash
   redis-server
   ```

   Alternatively, configure the connection to a remote Redis instance by updating the Redis service file (`services/redisService.js`).

4. **Run the API**:
   ```bash
   npm start
   ```

   The API will run at `http://localhost:3000`.

5. **Run Tests (Optional)**:
   To verify functionality:
   ```bash
   npm test
   ```

---

## Features Explained

### Rate Limiting
- **Purpose**: Prevents abuse by limiting the number of API requests a user can make within a minute.
- **Implementation**: The `express-rate-limit` middleware is used.
- **Configuration**:
  - **Window Duration**: 1 minute.
  - **Maximum Requests**: 10 requests per user per minute.
  - **Key**: Identified using the `x-user-id` header.

#### Code Snippet:
```javascript
const rateLimit = require('express-rate-limit');

exports.rateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  keyGenerator: (req) => req.headers['x-user-id'] || 'anonymous',
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});
```

### Caching
- **Purpose**: Reduces latency and improves performance by storing GET request responses temporarily.
- **Implementation**:
  - Uses Redis as the caching layer.
  - Cached data is set to expire after 60 seconds.
- **Flow**:
  - Before processing a request, the middleware checks if the response is cached.
  - If cached, it serves the cached response.
  - Otherwise, it processes the request and caches the response.

#### Code Snippet:
```javascript
const { getAsync, setAsync } = require('../services/redisService');

exports.cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl;
  const cachedData = await getAsync(cacheKey);

  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  res.sendResponse = res.json;
  res.json = async (data) => {
    await setAsync(cacheKey, JSON.stringify(data), 'EX', 60); 
    res.sendResponse(data);
  };

  next();
};
```

### Role-Based Access Control (RBAC)
- **Purpose**: Secures endpoints by restricting access based on user roles.
- **Roles**:
  - **Admin**: Full access (create, read, update, delete books).
  - **User**: Read-only access (view books).
- **Implementation**:
  - The role is passed in the `x-role` header.
  - Middleware checks if the user role matches the allowed roles for an endpoint.

#### Code Snippet:
```javascript
exports.rbacMiddleware = (allowedRoles) => (req, res, next) => {
  const role = req.headers['x-role'];

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};
```

---

## API Endpoints

### 1. **POST /books**
- **Description**: Create a new book (Admin only).
- **Headers**:
  - `x-user-id`: User identifier.
  - `x-role`: Role (`Admin`).
- **Body**:
  ```json
  {
    "title": "Book Title",
    "author": "Author Name"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Book Title",
    "author": "Author Name"
  }
  ```

### 2. **GET /books**
- **Description**: Fetch all books (Admin and User).
- **Headers**:
  - `x-user-id`: User identifier.
  - `x-role`: Role (`Admin` or `User`).
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Book Title",
      "author": "Author Name"
    }
  ]
  ```

### 3. **PUT /books/:id**
- **Description**: Update a book by ID (Admin only).
- **Headers**:
  - `x-user-id`: User identifier.
  - `x-role`: Role (`Admin`).
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "author": "Updated Author"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Updated Title",
    "author": "Updated Author"
  }
  ```

### 4. **DELETE /books/:id**
- **Description**: Delete a book by ID (Admin only).
- **Headers**:
  - `x-user-id`: User identifier.
  - `x-role`: Role (`Admin`).
- **Response**:
  - Status: `204 No Content`

# Old Age Home Care Backend API

A clean and minimal backend API for a Charity (Old Age Home) website built with Node.js, Express.js, and MongoDB.

## Features

- **Admin Authentication**: Simple JWT-based admin login system
- **Gallery Management**: Full CRUD operations for gallery items
- **Image Upload**: Multer-based image handling with file validation
- **Clean Architecture**: Minimal, focused codebase

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- multer for file uploads
- dotenv for environment variables

## Project Structure

```
├── server.js                 # Main entry point
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── seed.js          # Admin seed script
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── gallery.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── admin.model.js
│   │   └── gallery.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── gallery.routes.js
│   │   └── index.routes.js
│   ├── uploads/             # Image storage
│   └── utils/
│       └── generate-token.js
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/oldage-home-care
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@oldagehome.com
ADMIN_PASSWORD=Admin@123
```

### 3. Seed Default Admin

Run the seed script to create a default admin:

```bash
npm run seed
```

### 4. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Admin Authentication

#### POST /api/admin/login
Admin login endpoint.

**Request Body:**
```json
{
  "email": "admin@oldagehome.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Gallery Management

#### POST /api/gallery
Create a new gallery item (Protected - Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request (multipart/form-data):**
- `name` (string, required)
- `description` (string, optional)
- `category` (string, required) - One of: `events`, `residents`, `activities`
- `image` (file, required) - Image file (JPEG, PNG, WebP, SVG)

**Response:**
```json
{
  "success": true,
  "message": "Gallery item created successfully",
  "data": {
    "_id": "...",
    "name": "Event Name",
    "description": "Event description",
    "image": "/uploads/1234567890-image.jpg",
    "category": "events",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/gallery
Get all gallery items (Public)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

#### GET /api/gallery/:id
Get a single gallery item (Public)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Event Name",
    "description": "Event description",
    "image": "/uploads/1234567890-image.jpg",
    "category": "events",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/gallery/:id
Update a gallery item (Protected - Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request (multipart/form-data):**
- `name` (string, optional)
- `description` (string, optional)
- `category` (string, optional) - One of: `events`, `residents`, `activities`
- `image` (file, optional) - New image file

**Response:**
```json
{
  "success": true,
  "message": "Gallery item updated successfully",
  "data": {...}
}
```

#### DELETE /api/gallery/:id
Delete a gallery item (Protected - Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Gallery item deleted successfully"
}
```

## Postman Testing Examples

### 1. Admin Login
- **Method:** POST
- **URL:** `http://localhost:5000/api/admin/login`
- **Body (raw JSON):**
```json
{
  "email": "admin@oldagehome.com",
  "password": "Admin@123"
}
```

### 2. Create Gallery Item
- **Method:** POST
- **URL:** `http://localhost:5000/api/gallery`
- **Headers:**
  - `Authorization: Bearer <your-token>`
- **Body (form-data):**
  - `name`: "Annual Charity Event"
  - `description`: "Our annual charity event for residents"
  - `category`: "events"
  - `image`: [Select File]

### 3. Get All Gallery Items
- **Method:** GET
- **URL:** `http://localhost:5000/api/gallery`
- **No authentication required**

### 4. Update Gallery Item
- **Method:** PUT
- **URL:** `http://localhost:5000/api/gallery/<gallery-id>`
- **Headers:**
  - `Authorization: Bearer <your-token>`
- **Body (form-data):**
  - `name`: "Updated Event Name"
  - `description`: "Updated description"

### 5. Delete Gallery Item
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/gallery/<gallery-id>`
- **Headers:**
  - `Authorization: Bearer <your-token>`

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes for admin operations
- File type validation for uploads
- File size limits (2MB)

## Notes

- Images are stored in `src/uploads/` directory
- JWT tokens expire after 30 days
- Admin credentials can be changed in `.env` file
- Run seed script after changing admin credentials to update the database


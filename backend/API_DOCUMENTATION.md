# ImpactTrace Backend - API Documentation

## Authentication Endpoints

### 1. User Signup
**Endpoint:** `POST /api/users/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "donor"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "donor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 409):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. User Login
**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "donor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get User Profile (Protected)
**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "donor",
      "created_at": "2025-10-05T10:30:00.000Z"
    }
  }
}
```

---

### 4. Update User Profile (Protected)
**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+0987654321"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "changes": 1
  }
}
```

---

### 5. Get All Users (Admin Only)
**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "role": "donor",
        "created_at": "2025-10-05T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "role": "donor"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (Replace TOKEN with actual token)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## User Roles

- **admin**: Full access to all features
- **donor**: Can make donations and view projects
- **beneficiary**: Can view benefits and impact

---

## Error Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid credentials)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate email)
- **500**: Internal Server Error

---

## Notes

1. **JWT Token**: Save the token returned from signup/login and include it in the `Authorization` header for protected routes
2. **Token Expiry**: Tokens expire after 7 days
3. **Password Security**: Passwords are hashed using bcrypt before storage
4. **Database**: SQLite database is automatically created at `backend/database/impacttrace.db`

# Backend Setup and Installation Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Environment File (Optional)

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 4. Verify Server is Running

Open your browser and go to: `http://localhost:5000`

You should see:
```json
{
  "success": true,
  "message": "Welcome to ImpactTrace API",
  "version": "1.0.0",
  "endpoints": {
    "users": "/api/users",
    "beneficiaries": "/api/beneficiaries",
    "donations": "/api/donations",
    "projects": "/api/projects",
    "impact": "/api/impact",
    "health": "/api/health"
  }
}
```

## Database

The SQLite database is automatically created at:
```
backend/database/impacttrace.db
```

The following tables are created automatically:
- **users** - User authentication and profiles
- **beneficiaries** - Beneficiary information
- **donations** - Donation records
- **projects** - Project information
- **impact_tracking** - Impact tracking records

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/api/health
```

### User Authentication
- `POST /api/users/signup` - Create new user account
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users` - Get all users (admin only)

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "donor"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Import the API endpoints
2. Set the base URL to `http://localhost:5000/api`
3. For protected routes, add Authorization header: `Bearer <your-token>`

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, you can change it in `server.js`:
```javascript
const PORT = 5001; // or any available port
```

### Database Locked Error

If you see "database is locked" error, make sure:
1. Only one instance of the server is running
2. Close any database browser tools

### CORS Issues

The server is configured to allow requests from:
- http://localhost:8081 (Expo)
- exp://localhost:19000 (Expo)
- http://localhost:19006 (Expo Web)

To add more origins, update the CORS configuration in `server.js`.

## Security Notes

⚠️ **Important for Production:**

1. Change the JWT_SECRET to a strong, random string
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Add rate limiting
5. Implement proper input validation
6. Use a production-grade database (PostgreSQL, MySQL)

## Dependencies

- **express**: Web framework
- **sqlite3**: Database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **morgan**: HTTP request logger
- **dotenv**: Environment variables

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── userController.js    # User authentication logic
│   ├── donationController.js
│   ├── projectController.js
│   ├── impactController.js
│   └── BeneficiaryController.js
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js
│   └── validation.js
├── models/
│   ├── User.js             # User model
│   ├── Donation.js
│   ├── Project.js
│   ├── impact.js
│   └── Beneficiary.js
├── routes/
│   ├── users.js            # User routes
│   ├── donations.js
│   ├── projects.js
│   ├── impact.js
│   └── beneficiaries.js
├── database/
│   └── impacttrace.db      # SQLite database (auto-generated)
├── server.js               # Main server file
├── package.json
└── .env                    # Environment variables (create this)
```

## Next Steps

After setting up the backend:

1. Start the backend server
2. Test the API endpoints using cURL or Postman
3. Update the frontend API base URL if needed
4. Run the mobile app and test signup/login

## Support

For issues or questions, please check:
- API Documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Server logs in the terminal
- Database file at `backend/database/impacttrace.db`

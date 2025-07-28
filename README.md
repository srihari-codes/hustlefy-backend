# hustlefy Backend API

A complete backend API for the hustlefy job platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Separate profiles for job providers and seekers
- **Job Management**: Full CRUD operations for job postings
- **Application System**: Apply, accept, and reject job applications
- **Role-based Access**: Provider and seeker specific endpoints
- **Auto Job Fulfillment**: Jobs automatically marked as fulfilled when capacity reached

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS enabled

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hustlefy
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Start MongoDB service

4. Run the server:

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Jobs

- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get single job (public)
- `POST /api/jobs` - Create job (provider only)
- `GET /api/jobs/my/jobs` - Get provider's jobs
- `DELETE /api/jobs/:id` - Delete job (provider only)

### Applications

- `POST /api/jobs/:id/apply` - Apply for job (seeker only)
- `GET /api/jobs/:id/applicants` - Get job applicants (provider only)
- `POST /api/jobs/:id/accept/:applicationId` - Accept applicant
- `POST /api/jobs/:id/reject/:applicationId` - Reject applicant
- `GET /api/jobs/my/applications` - Get user's applications (seeker only)

## Data Models

### User

- name, email, password (hashed)
- phone, location, workCategories, bio
- role (provider/seeker)
- timestamps

### Job

- title, description, location, category
- peopleNeeded, peopleAccepted, duration, payment
- providerId, providerName, status
- acceptedUsers array
- timestamps

### Application

- jobId, seekerId, seekerName, seekerBio
- seekerCategories, message, status
- timestamps

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Error handling middleware

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Environment (development/production)

### Encrypted devil

```
9bFhlvTMPqUGwf6LrmeRGWdBQUFBQUJvZkwyclpFWWd6R25zand5UjV2NzM4cmthdmpwczd5ZEcyV0hiUHp0ejU4QVlNOXdjb2wyYXhzREs3LTVySG9GM19tU3B0a2V1VVI4d3VxTUxSY1U3dENTdDJyZ1NXX1dyZVdQRXNOR3Y4VkpMMHpMb0dBZXQxeVBLVEdNLU5XbU43S054eGJOUmJRckZnV2pCSDVEdUFEOXpza0Q2blFGZGhYVGFQZFdIaG5QQkN1ajY5ZWJKUDNHRUVFOE5ITXBsbEdtOGIwZkV5SkZ3cnFTNlJNVU5WV2RZU1BYMlVQSHh2WWw4RFFqcGNGdXRYRGNrTVBUdXdOYUhMZHFWNERWRVlRd0V1T29DQzF2TWQxVzQ0VTlSNmpIQTFTU1JaSzRkWHgyMVREeGVhcFJXRjdaMW1qLTFlSnVUbDZydTZib2dKLWZyNUlHY3VSRVRDVDVpSTFfU0I2eGdacTFSdXZPUU5OQU8yMWk0eUp2M1VwbEtSWHF4ejNHSk5iOXlqREhHaGx6cThNRmhucmRxRzVpNzlxV0plaTF5U2dQLXFDeWZKQ0dBaUwyZThGSUd4RDdfT0FyZlpoN0V4aXgwZ1lUQ2NZaFM3WkQ1WjhtdndHdFBaM1BoTG13cXRjNXpZQ2d3R1NJQXdOZU4tM0NMSmhrPQ==
```

# Space Invaders Backend Server

A Node.js Express backend server with Socket.io support for the Space Invaders game.

## Project Structure

```
├── server.js                    # Main server file
├── src/
│   ├── controllers/            # Route controllers
│   ├── services/               # Business logic
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── models/                 # Data models
│   ├── utils/                  # Utility functions
│   └── websocket/              # Socket.io handlers
├── data/
│   ├── highscores/             # High scores storage
│   ├── settings/               # Game settings
│   └── config/                 # Configuration files
├── tests/
│   ├── unit/                   # Unit tests
│   └── integration/            # Integration tests
├── .env                        # Environment variables
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
└── package.json               # Project dependencies

```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   The `.env` file contains:
   ```
   NODE_ENV=development
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:4200
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon (auto-reload)
- `npm test` - Run the test suite with Jest

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns server health status
  - Response: `{ "status": "OK" }`

## Testing

This project follows Test-Driven Development (TDD) practices. Tests are written using Jest and Supertest.

Run tests:
```bash
npm test
```

## Development

The server uses:
- **Express 4.x** - Web framework
- **Socket.io 4.x** - Real-time bidirectional communication
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

Dev tools:
- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart during development

## License

ISC

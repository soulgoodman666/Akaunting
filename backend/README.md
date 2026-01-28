# Akaunting Backend

Backend API untuk aplikasi Akaunting yang dibangun dengan Go dan framework Gin.

## Tech Stack

- **Go 1.22** - Bahasa pemrograman
- **Gin** - Web framework
- **GORM** - ORM untuk database
- **MySQL** - Database
- **JWT** - Authentication
- **Godotenv** - Environment variables

## Setup

### Prerequisites

- Go 1.22 atau lebih tinggi
- MySQL database
- Git

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd akaunting/backend
```

2. Install dependencies:
```bash
go mod download
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Konfigurasi database di file `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=akaunting
```

5. Jalankan aplikasi:
```bash
go run cmd/main.go
```

Server akan berjalan di `http://localhost:8080`

## API Endpoints

- `GET /` - Health check
- `POST /api/auth/login` - Login
- `GET /api/users` - Get users (authenticated)
- `POST /api/users` - Create user (authenticated)

## Environment Variables

Lihat file `.env.example` untuk daftar lengkap variabel environment yang diperlukan.

## Project Structure

```
backend/
├── cmd/           # Application entry point
├── config/        # Database and app configuration
├── handlers/      # HTTP handlers
├── routes/        # Route definitions
├── models/        # Data models
├── middleware/    # Custom middleware
├── utils/         # Utility functions
├── go.mod         # Go module file
├── go.sum         # Go dependencies checksum
└── README.md      # This file
```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
# User Management API

A comprehensive Spring Boot REST API for user management with full CRUD operations, validation, exception handling, and security features.

## Features

- ✅ Full CRUD operations for User management
- ✅ Input validation using Bean Validation
- ✅ Global exception handling
- ✅ Password encryption using BCrypt
- ✅ PostgreSQL database integration
- ✅ RESTful API design
- ✅ Comprehensive unit tests
- ✅ CORS configuration
- ✅ Health check endpoints
- ✅ Docker support

## Technology Stack

- **Java 18**
- **Spring Boot 3.4.12**
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL**
- **Maven**
- **JUnit 5**
- **Mockito**
- **Hibernate Validator**
- **Docker**

## Project Structure

```
src/
├── main/
│   ├── java/com/example/user/
│   │   ├── config/           # Configuration classes
│   │   ├── controller/       # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Custom exceptions & global handler
│   │   ├── repository/      # JPA repositories
│   │   ├── service/         # Business logic layer
│   │   │   └── impl/        # Service implementations
│   │   └── util/            # Utility classes
│   └── resources/
│       └── application.properties
└── test/
    └── java/com/example/user/
        ├── controller/      # Controller tests
        └── service/         # Service tests
```

## API Endpoints

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create a new user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| GET | `/api/users/username/{username}` | Get user by username |
| GET | `/api/users/email/{email}` | Get user by email |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| GET | `/api/users/search/username?q={query}` | Search users by username |
| GET | `/api/users/search/email?q={query}` | Search users by email |
| GET | `/api/users/ordered` | Get all users ordered by username |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/info` | API information |
| GET | `/api/users/{id}/exists` | Check if user exists |
| GET | `/api/users/check/username/{username}` | Check username availability |
| GET | `/api/users/check/email/{email}` | Check email availability |

## Request/Response Examples

### Create User
```http
POST /api/users
Content-Type: application/json

{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
}
```

**Response:**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
}
```

### Update User
```http
PUT /api/users/1
Content-Type: application/json

{
    "username": "johnsmith",
    "email": "johnsmith@example.com",
    "password": "newPassword123"
}
```

### Get All Users
```http
GET /api/users
```

**Response:**
```json
[
    {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com"
    },
    {
        "id": 2,
        "username": "janedoe",
        "email": "jane@example.com"
    }
]
```

## Setup Instructions

### Prerequisites
- Java 18 or higher
- Maven 3.6+
- PostgreSQL 12+
- Docker (optional)

### Database Setup
1. Install PostgreSQL
2. Create a database named `mydb`
3. Update database credentials in `application.properties`

### Running the Application

1. Clone the repository
2. Navigate to project directory
3. Update database configuration in `src/main/resources/application.properties`
4. Run the application:

```bash
# Using Maven
./mvnw spring-boot:run

# Or using Docker
docker-compose up
```

The application will start on `http://localhost:8080`

### Running Tests

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceImplTest

# Run with coverage
./mvnw test jacoco:report
```

## Configuration

### Database Configuration
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=secret
```

### Security Configuration
- BCrypt password encoding
- CORS enabled for all origins (development only)
- Basic authentication disabled for API endpoints

## Validation Rules

### User Creation
- **Username**: Required, 3-50 characters
- **Email**: Required, valid email format
- **Password**: Required, 6-100 characters

### User Update
- All fields are optional
- Same validation rules apply when provided

## Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Unexpected errors

### Error Response Format
```json
{
    "status": 404,
    "message": "User not found with id: 1",
    "timestamp": "2024-12-08T10:30:00",
    "path": "uri=/api/users/1"
}
```

## Sample Data

The application automatically creates sample users on first run:
- Username: `admin`, Email: `admin@example.com`, Password: `admin123`
- Username: `john`, Email: `john@example.com`, Password: `john123`
- Username: `jane`, Email: `jane@example.com`, Password: `jane123`

## Docker Support

### Using Docker Compose
```bash
docker-compose up
```

This will start both the application and PostgreSQL database.

## Testing with Postman

A Postman collection is available with pre-configured requests for all endpoints. Import the collection and test all functionality:

1. Health check
2. Create users
3. Get users
4. Update users
5. Delete users
6. Search functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

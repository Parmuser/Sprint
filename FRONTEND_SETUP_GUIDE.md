# Zomato Clone - Full Stack Application

A comprehensive full-stack food delivery application built with Spring Boot microservices and React frontend.

## 🏗️ Architecture Overview

This project demonstrates a modern microservices architecture with:

### Backend Services
- **User Service** (Port 8080) - User management and authentication
- **Restaurant Service** (Port 8081) - Restaurant data and management  
- **Order Service** (Port 8082) - Order processing and tracking
- **Notification Service** (Port 8083) - Real-time notifications via WebSocket
- **Eureka Server** (Port 8761) - Service discovery and registration

### Frontend Application
- **React Frontend** (Port 3000) - Modern web application with Material-UI

### Infrastructure
- **PostgreSQL** - Primary database for all services
- **Kafka** - Message broker for inter-service communication
- **ELK Stack** - Logging and monitoring
- **SonarQube** - Code quality analysis

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Docker (optional, for infrastructure services)

### 1. Start Infrastructure Services (Optional)
```bash
# Start PostgreSQL, Kafka, ELK stack
docker-compose up -d

# Or use the provided scripts
./start-infrastructure.bat
```

### 2. Start Backend Services

#### Option A: Using Maven (Recommended)
```bash
# Start Eureka Server first
cd eureka-server
./mvnw spring-boot:run

# Start User Service
cd ../User
./mvnw spring-boot:run

# Start Restaurant Service  
cd ../restaurant-service
./mvnw spring-boot:run

# Start Notification Service
cd ../notification-service
./mvnw spring-boot:run
```

#### Option B: Using VS Code Tasks
1. Open the workspace in VS Code
2. Run the task: **"Build and Run Spring Boot App"**

### 3. Start Frontend Application
```bash
cd frontend
npm install
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **User Service**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

## 📱 Frontend Features

### Dashboard
- Real-time statistics and metrics
- Service health monitoring  
- Quick actions and navigation
- Recent orders overview

### User Management
- Complete CRUD operations for users
- Form validation and error handling
- Search and filtering capabilities
- Responsive design

### Restaurant Management
- Restaurant information management
- Cuisine-based filtering
- Operating hours and pricing
- Image support and ratings
- Active/inactive status toggle

### Order Management
- Multi-item order creation
- Customer and restaurant selection
- Real-time total calculation
- Order status tracking
- Detailed order views with timeline

### Live Tracking
- Real-time order status updates via WebSocket
- Visual order progress timeline
- Notification system with toast messages
- Simulation mode for testing
- Automatic fallback when services are unavailable

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2** - Microservices framework
- **Spring Data JPA** - Database abstraction
- **Spring Security** - Authentication and authorization  
- **Spring Cloud** - Microservices tooling
- **PostgreSQL** - Relational database
- **Apache Kafka** - Message streaming
- **WebSocket** - Real-time communication
- **Maven** - Build tool

### Frontend
- **React 18** - Frontend framework
- **Material-UI (MUI)** - Component library
- **React Router v6** - Client-side routing
- **Formik & Yup** - Form handling and validation
- **Axios** - HTTP client
- **STOMP.js & SockJS** - WebSocket communication
- **React Query** - Data fetching and caching
- **React Toastify** - Toast notifications

### DevOps & Monitoring
- **Docker** - Containerization
- **ELK Stack** - Logging (Elasticsearch, Logstash, Kibana)
- **SonarQube** - Code quality analysis
- **Actuator** - Health checks and metrics

## 🔄 API Endpoints

### User Service (8080)
```
GET    /api/users                    # Get all users
POST   /api/users                    # Create new user
GET    /api/users/{id}              # Get user by ID
PUT    /api/users/{id}              # Update user
DELETE /api/users/{id}              # Delete user
GET    /api/users/search/username   # Search users by username
GET    /api/users/search/email      # Search users by email
```

### Restaurant Service (8081)
```
GET    /api/restaurants             # Get all restaurants
POST   /api/restaurants             # Create new restaurant
GET    /api/restaurants/{id}        # Get restaurant by ID
PUT    /api/restaurants/{id}        # Update restaurant
DELETE /api/restaurants/{id}        # Delete restaurant
GET    /api/restaurants/cuisine/{type} # Get by cuisine
```

### Order Service (8082)
```
GET    /api/orders                  # Get all orders
POST   /api/orders                  # Create new order
GET    /api/orders/{id}            # Get order by ID
PUT    /api/orders/{id}            # Update order
GET    /api/orders/user/{userId}   # Get orders by user
GET    /api/orders/status/{status} # Get orders by status
```

### Notification Service (8083)
```
WebSocket: /ws                      # WebSocket connection
/app/subscribe                      # Subscribe to notifications
/app/track                         # Track specific order
/topic/status                      # General status updates
/topic/delivery/{orderId}          # Order-specific updates
```

## 🏃‍♂️ Development Workflow

### Backend Development
1. **Service Discovery**: All services register with Eureka
2. **Database**: Each service has its own database schema
3. **Communication**: Services communicate via REST APIs and Kafka
4. **Configuration**: Externalized configuration with application.properties
5. **Monitoring**: Health checks and metrics via Spring Actuator

### Frontend Development
1. **Service Integration**: Dedicated service clients for each backend service
2. **State Management**: React state with hooks and context
3. **Error Handling**: Comprehensive error handling with user feedback
4. **Responsive Design**: Mobile-first responsive design
5. **Real-time Updates**: WebSocket integration with fallback simulation

## 🧪 Testing the Application

### Manual Testing Scenarios

#### 1. User Management
- Create a new user with username "john_doe" and email "john@example.com"
- Search for users by username or email
- Update user information
- Delete a user (with confirmation)

#### 2. Restaurant Management  
- Add a new restaurant with complete information
- Filter restaurants by cuisine type
- Toggle restaurant active/inactive status
- Update restaurant operating hours

#### 3. Order Management
- Create a multi-item order
- Select customer and restaurant from dropdowns
- Add/remove order items dynamically
- View order details and timeline

#### 4. Live Tracking
- Start tracking for an order ID
- Watch real-time status updates
- Test simulation mode when WebSocket is unavailable
- Observe notifications and progress timeline

### Service Health Checks
Visit these URLs to verify service status:
- User Service: http://localhost:8080/actuator/health
- Restaurant Service: http://localhost:8081/actuator/health  
- Eureka Server: http://localhost:8761
- Frontend Health: http://localhost:3000/health

## 🐳 Docker Deployment

### Build Docker Images
```bash
# Backend services
docker build -t zomato-user-service ./User
docker build -t zomato-restaurant-service ./restaurant-service
docker build -t zomato-notification-service ./notification-service

# Frontend
docker build -t zomato-frontend ./frontend
```

### Run with Docker Compose
```bash
# Full stack deployment
docker-compose up -d
```

## 📊 Monitoring and Observability

### Application Monitoring
- **Health Checks**: `/actuator/health` endpoints
- **Metrics**: Prometheus metrics via `/actuator/prometheus`
- **Service Discovery**: Eureka dashboard at http://localhost:8761

### Logging
- **ELK Stack**: Centralized logging with Elasticsearch, Logstash, Kibana
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: Configurable per service

### Code Quality
- **SonarQube**: Static code analysis
- **Quality Gates**: Automated quality checks
- **Coverage Reports**: Test coverage metrics

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=postgres  
DB_PASSWORD=secret

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Eureka
EUREKA_SERVER_URL=http://localhost:8761/eureka

# Frontend
REACT_APP_API_BASE_URL=http://localhost
REACT_APP_NOTIFICATION_SERVICE_URL=http://localhost:8083
```

### Application Properties
Each service has its own `application.properties` with:
- Database configuration
- Server port
- Eureka registration
- Kafka configuration
- Logging levels

## 🚨 Troubleshooting

### Common Issues

#### Backend Services Won't Start
1. Check if PostgreSQL is running on port 5432
2. Verify database credentials in application.properties
3. Ensure ports 8080-8083 and 8761 are available
4. Check Java version (requires Java 17+)

#### Frontend Issues
1. **Services not connecting**: Verify backend services are running
2. **CORS errors**: Check backend CORS configuration
3. **Build errors**: Clear node_modules and reinstall dependencies
4. **WebSocket issues**: Notification service provides simulation fallback

#### Database Issues
1. **Connection refused**: Start PostgreSQL service
2. **Authentication failed**: Check username/password
3. **Database not found**: Create databases manually if needed

### Debug Commands
```bash
# Check service status
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health

# View service registrations
curl http://localhost:8761/eureka/apps

# Check frontend build
npm run build --verbose

# Database connection test
psql -h localhost -p 5432 -U postgres -d mydb
```

## 🎯 Future Enhancements

### Planned Features
- [ ] **Authentication & Authorization**: JWT-based security
- [ ] **Payment Integration**: Stripe/PayPal integration  
- [ ] **Menu Management**: Restaurant menu CRUD operations
- [ ] **Rating & Reviews**: Customer feedback system
- [ ] **Geographic Services**: Location-based restaurant search
- [ ] **Mobile App**: React Native mobile application
- [ ] **Admin Dashboard**: Advanced analytics and reporting
- [ ] **API Gateway**: Centralized routing and rate limiting

### Technical Improvements
- [ ] **CI/CD Pipeline**: GitHub Actions or Jenkins
- [ ] **Performance Testing**: JMeter or Gatling
- [ ] **Security Scanning**: OWASP dependency checks
- [ ] **Load Balancing**: NGINX or AWS ALB
- [ ] **Caching**: Redis for performance optimization
- [ ] **Message Queues**: Dead letter queues and retry logic

## 📄 License

This project is created for demonstration and learning purposes. Feel free to use it as a reference for building microservices applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow existing code patterns
4. Add proper error handling and logging  
5. Test thoroughly
6. Submit a pull request

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review the troubleshooting section
3. Check service health endpoints
4. Examine application logs
5. Test with simulation mode for frontend features

# Zomato Clone - Microservices Architecture

A food delivery application built with Spring Boot microservices, Kafka messaging, and service discovery.

## 🏗️ Architecture Overview

This application follows a microservices architecture pattern with the following services:

### Core Services
1. **User Service** (Port: 8080) - User management and authentication
2. **Restaurant Service** (Port: 8081) - Restaurant information and management
3. **Menu Service** (Port: 8082) - Menu items and categories
4. **Order Service** (Port: 8083) - Order processing and management
5. **Payment Service** (Port: 8084) - Payment processing
6. **Notification Service** (Port: 8085) - Email/SMS notifications
7. **Delivery Service** (Port: 8086) - Delivery tracking
8. **API Gateway** (Port: 8000) - Single entry point for clients

### Infrastructure Services
- **Eureka Server** (Port: 8761) - Service discovery and registration
- **Apache Kafka** (Port: 9092) - Message broker for inter-service communication
- **PostgreSQL** - Database for each service (separate databases)
- **Redis** (Port: 6379) - Caching layer
- **Kafka UI** (Port: 8090) - Kafka monitoring dashboard

## 🚀 Getting Started

### Prerequisites
- Java 18+
- Maven 3.6+
- Docker & Docker Compose
- Node.js (for frontend development)

### 1. Start Infrastructure Services
```bash
# Start all infrastructure services (Kafka, PostgreSQL, Eureka, Redis)
cd c:\sprint\Sprint
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 2. Start Microservices

#### User Service (already configured)
```bash
cd User
mvn spring-boot:run
```

#### Restaurant Service
```bash
cd restaurant-service
mvn spring-boot:run
```

#### Order Service
```bash
cd order-service
mvn spring-boot:run
```

#### Notification Service
```bash
cd notification-service
mvn spring-boot:run
```

### 3. Access Services

- **Eureka Dashboard**: http://localhost:8761
- **Kafka UI**: http://localhost:8090
- **User Service**: http://localhost:8080
- **Restaurant Service**: http://localhost:8081

## 📊 Service Communication

### Synchronous Communication
- REST API calls between services
- Service discovery via Eureka

### Asynchronous Communication (Kafka Topics)
- `order-events` - Order lifecycle events
- `payment-events` - Payment processing events
- `user-events` - User registration/updates
- `restaurant-events` - Restaurant updates
- `delivery-events` - Delivery status updates

## 🗄️ Database Schema

Each service has its own PostgreSQL database:
- **mydb** (User Service) - Port 5432
- **restaurant_db** (Restaurant Service) - Port 5433
- **order_db** (Order Service) - Port 5434
- **payment_db** (Payment Service) - Port 5435

## 🔧 Configuration

### Kafka Topics
Topics are auto-created when first used. Key topics include:
```
- order-events
- payment-events  
- notification-events
- delivery-events
- user-events
- restaurant-events
```

### Service Discovery
All services register with Eureka Server for:
- Load balancing
- Service discovery
- Health monitoring
- Failover support

## 🔍 Monitoring & Observability

### Available Dashboards
- **Eureka Dashboard**: Service health and registration status
- **Kafka UI**: Message flow, topic management, consumer lag
- **Application Logs**: Detailed logging for each service

### Health Checks
Each service exposes health endpoints:
- `http://localhost:8080/actuator/health` (User Service)
- `http://localhost:8081/actuator/health` (Restaurant Service)
- etc.

## 📱 API Documentation

### User Service APIs
```
GET    /api/users           - Get all users
GET    /api/users/{id}      - Get user by ID
POST   /api/users           - Create new user
PUT    /api/users/{id}      - Update user
DELETE /api/users/{id}      - Delete user
```

### Restaurant Service APIs
```
GET    /api/restaurants               - Get all restaurants
GET    /api/restaurants/{id}          - Get restaurant by ID
GET    /api/restaurants/search?q=     - Search restaurants
POST   /api/restaurants               - Create restaurant
PUT    /api/restaurants/{id}          - Update restaurant
```

### Order Service APIs
```
GET    /api/orders                    - Get all orders
GET    /api/orders/{id}               - Get order by ID
GET    /api/orders/user/{userId}      - Get user orders
POST   /api/orders                    - Create new order
PUT    /api/orders/{id}/status        - Update order status
```

## 🔄 Event Flow Example

### Order Placement Flow
1. **User places order** → Order Service
2. **Order Service** publishes `ORDER_CREATED` event
3. **Notification Service** sends confirmation email/SMS
4. **Payment Service** processes payment
5. **Payment Service** publishes `PAYMENT_SUCCESSFUL` event
6. **Order Service** updates status to `CONFIRMED`
7. **Restaurant Service** receives order notification
8. **Delivery Service** gets notified for delivery assignment

## 🛠️ Development

### Adding New Service
1. Create new Spring Boot project with dependencies:
   ```xml
   <dependency>
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
   </dependency>
   <dependency>
       <groupId>org.springframework.kafka</groupId>
       <artifactId>spring-kafka</artifactId>
   </dependency>
   ```

2. Add database configuration to `docker-compose.yml`
3. Register with Eureka using `@EnableDiscoveryClient`
4. Configure Kafka producers/consumers as needed

### Environment Variables
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/database_name
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=secret

# Kafka
SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Eureka
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://localhost:8761/eureka
```

## 🚨 Troubleshooting

### Common Issues

1. **Service not registering with Eureka**
   - Check Eureka server is running: `http://localhost:8761`
   - Verify `@EnableDiscoveryClient` annotation
   - Check application.properties for correct Eureka URL

2. **Kafka connection issues**
   - Ensure Kafka is running: `docker-compose ps`
   - Check bootstrap servers configuration
   - Verify topic creation in Kafka UI

3. **Database connection failures**
   - Check PostgreSQL containers are running
   - Verify port mappings in docker-compose.yml
   - Confirm database names and credentials

### Logs
```bash
# View service logs
docker-compose logs -f kafka
docker-compose logs -f eureka-server

# Application logs are in console output
```

## 📈 Scalability

The architecture supports:
- **Horizontal scaling**: Multiple instances of each service
- **Load balancing**: Via Eureka and client-side load balancing
- **Message reliability**: Kafka ensures message delivery
- **Database partitioning**: Separate databases per service
- **Caching**: Redis for frequently accessed data

## 🔐 Security Considerations

For production deployment, consider:
- API Gateway authentication/authorization
- Service-to-service authentication (JWT)
- Database connection encryption
- Kafka security (SASL/SSL)
- Network segmentation
- Secrets management

---

**Note**: This is a development setup. For production, additional considerations like monitoring, logging aggregation, security hardening, and deployment automation are recommended.

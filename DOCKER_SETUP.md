# Zomato Clone - Docker Configuration Guide

## Overview

This project now includes comprehensive Docker configuration for running the entire Zomato microservices architecture using Docker Compose. The setup includes all microservices, databases, message queues, and monitoring tools.

## Architecture Components

### Microservices
- **Eureka Server** (Port 8761) - Service Discovery
- **User Service** (Port 8080) - User management
- **Restaurant Service** (Port 8081) - Restaurant management  
- **Order Service** (Port 8082) - Order processing
- **Notification Service** (Port 8083) - Real-time notifications

### Frontend Applications
- **React Frontend** (Port 3000) - React-based web interface
- **Angular Frontend** (Port 4200) - Angular-based web interface

### Infrastructure Services
- **PostgreSQL Databases**
  - User DB (Port 5432)
  - Restaurant DB (Port 5433)
  - Order DB (Port 5434)
  - Payment DB (Port 5435)
  - SonarQube DB (Port 5436)
- **Apache Kafka** (Port 9092) - Message streaming
- **Zookeeper** (Port 2181) - Kafka coordination
- **Redis** (Port 6379) - Caching
- **Kafka UI** (Port 8090) - Kafka monitoring
- **SonarQube** (Port 9000) - Code quality analysis
- **ELK Stack**
  - Elasticsearch (Port 9200)
  - Logstash (Port 5044)
  - Kibana (Port 5601)

## Prerequisites

1. **Docker** (version 20.10 or later)
2. **Docker Compose** (version 2.0 or later)
3. **8GB+ RAM** recommended
4. **10GB+ free disk space**

## Quick Start

### Option 1: Using Batch Script (Windows)
```batch
./start-full-stack.bat
```

### Option 2: Using Bash Script (Linux/Mac/WSL)
```bash
chmod +x start-full-stack.sh
./start-full-stack.sh
```

### Option 3: Manual Docker Compose
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View service status
docker-compose ps

# View logs for specific service
docker-compose logs -f user-service
```

## Service Dependencies

The services start in the following order:
1. Infrastructure services (databases, Kafka, Redis)
2. Eureka Server
3. Microservices (User, Restaurant, Order, Notification)
4. Frontend applications

## Configuration

### Environment Variables
Each service uses Docker environment variables for configuration:

- **Database URLs** - Point to containerized PostgreSQL instances
- **Kafka Bootstrap Servers** - `kafka:29092` (internal Docker network)
- **Eureka URL** - `http://eureka-server:8761/eureka/`
- **Service Profiles** - `docker` profile is activated

### Network Configuration
All services run on a custom Docker network `zomato-network` for internal communication.

## Health Checks

All microservices include health checks that monitor:
- Application startup status
- Database connectivity  
- External service dependencies

## Monitoring and Management

### Kafka UI
- **URL**: http://localhost:8090
- **Purpose**: Monitor Kafka topics, messages, and consumer groups

### SonarQube
- **URL**: http://localhost:9000
- **Default Login**: admin/admin
- **Purpose**: Code quality analysis and metrics

### Kibana (ELK Stack)
- **URL**: http://localhost:5601  
- **Purpose**: Log aggregation and analysis

### Eureka Dashboard
- **URL**: http://localhost:8761
- **Purpose**: Service discovery and registration status

## Application Access

### Frontend Applications
- **React App**: http://localhost:3000
- **Angular App**: http://localhost:4200

### API Services
- **User Service**: http://localhost:8080/api/users
- **Restaurant Service**: http://localhost:8081/api/restaurants
- **Order Service**: http://localhost:8082/api/orders
- **Notification Service**: http://localhost:8083 (WebSocket endpoints)

### Database Access
Direct database connections (for development):
```
User DB:        localhost:5432 (mydb/postgres/secret)
Restaurant DB:  localhost:5433 (restaurant_db/postgres/secret) 
Order DB:       localhost:5434 (order_db/postgres/secret)
Redis Cache:    localhost:6379
```

## Development Workflow

### Starting Services
```bash
# Start infrastructure only
docker-compose up -d zookeeper kafka user-postgres restaurant-postgres order-postgres redis

# Start specific service
docker-compose up -d user-service

# Start frontend only  
docker-compose up -d frontend frontend-angular
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service

# Last 100 lines
docker-compose logs --tail=100 order-service
```

### Rebuilding Services
```bash
# Rebuild specific service
docker-compose build user-service

# Rebuild and restart
docker-compose up -d --build user-service
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down --volumes

# Stop specific service
docker-compose stop user-service
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 8080-8083, 3000, 4200, 5432-5436, 6379, 8090, 8761, 9000, 9200 are available
   - Use `docker-compose down` to stop existing containers

2. **Memory Issues**
   - Increase Docker memory allocation to at least 8GB
   - Monitor with `docker stats`

3. **Service Startup Order**
   - Services have dependency management built-in
   - Wait for health checks to pass before accessing services

4. **Database Connection Issues**
   - Verify database containers are running: `docker-compose ps`
   - Check service logs for connection errors

### Health Check Commands
```bash
# Check all services status
docker-compose ps

# Test service health endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health  
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
```

### Cleanup Commands
```bash
# Remove all containers and volumes
docker-compose down --volumes --remove-orphans

# Clean up Docker system
docker system prune -a --volumes

# Reset everything (USE WITH CAUTION)
docker-compose down --volumes --rmi all
docker system prune -a --volumes -f
```

## Performance Optimization

### Resource Limits
The Docker Compose configuration includes reasonable resource limits. For production, consider:

- Increasing JVM heap sizes via `JAVA_OPTS`
- Adjusting database connection pools
- Configuring Kafka partitions based on load

### Scaling Services
```bash
# Scale specific service
docker-compose up -d --scale user-service=3

# Scale with load balancer (requires additional configuration)
docker-compose up -d --scale restaurant-service=2
```

## Security Considerations

### Development vs Production
This configuration is optimized for **development**. For production:

1. Use Docker secrets for passwords
2. Enable SSL/TLS termination
3. Configure proper firewall rules
4. Use non-root database users
5. Enable authentication for Kafka and Redis

### Default Credentials
- **PostgreSQL**: postgres/secret
- **SonarQube**: admin/admin
- **Redis**: No authentication (development only)

## File Structure
```
├── docker-compose.yml          # Main Docker Compose configuration
├── start-full-stack.bat       # Windows startup script
├── start-full-stack.sh        # Linux/Mac startup script
├── User/
│   └── Dockerfile             # User service container
├── restaurant-service/
│   └── Dockerfile             # Restaurant service container  
├── order-service/
│   ├── Dockerfile             # Order service container
│   └── pom.xml                # Maven configuration (created)
├── notification-service/
│   └── Dockerfile             # Notification service container
├── eureka-server/
│   └── Dockerfile             # Eureka server container
├── frontend/
│   └── Dockerfile             # React frontend container
├── frontend-angular/
│   ├── Dockerfile             # Angular frontend container
│   └── nginx.conf             # Nginx configuration
└── elk/
    └── logstash.conf          # Logstash configuration
```

## Next Steps

1. **Test the Setup**: Run `./start-full-stack.bat` and verify all services start successfully
2. **Configure Monitoring**: Set up custom dashboards in Kibana
3. **API Testing**: Use tools like Postman to test the microservice APIs  
4. **Load Testing**: Consider tools like JMeter for performance testing
5. **CI/CD Integration**: Integrate with build pipelines for automated deployment

For more specific service configurations, refer to the individual service documentation and properties files.

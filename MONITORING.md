# Zomato Microservices - Logging & Code Quality

## 📊 Comprehensive Monitoring Setup

This setup includes:
- **SonarQube** for code quality analysis
- **ELK Stack** (Elasticsearch, Logstash, Kibana) for log aggregation
- **Prometheus & Micrometer** for metrics
- **JaCoCo** for code coverage
- **Structured JSON logging** for better log analysis

## 🚀 Quick Start

### 1. Start Quality & Monitoring Tools
```bash
# Start SonarQube, ELK Stack, and monitoring tools
.\start-quality-tools.bat

# Or manually with Docker Compose
docker-compose up -d sonarqube sonar-postgres elasticsearch logstash kibana
```

### 2. Run Code Quality Analysis
```bash
# Run analysis on all services
.\run-sonar-analysis.bat

# Or analyze individual services
cd User && mvn clean test jacoco:report sonar:sonar
```

## 📋 Available Tools & Dashboards

| Tool | URL | Credentials | Purpose |
|------|-----|-------------|---------|
| SonarQube | http://localhost:9000 | admin/admin | Code Quality Analysis |
| Kibana | http://localhost:5601 | - | Log Analysis & Visualization |
| Elasticsearch | http://localhost:9200 | - | Log Storage & Search |
| Kafka UI | http://localhost:8090 | - | Message Broker Monitoring |
| Eureka | http://localhost:8761 | - | Service Discovery |

## 🔍 Code Quality Features

### SonarQube Analysis Includes:
- **Code Smells** detection
- **Security Vulnerabilities** scanning
- **Code Coverage** reporting (70% minimum)
- **Duplications** detection
- **Maintainability** ratings
- **Technical Debt** estimation

### JaCoCo Coverage Reports:
- Line coverage
- Branch coverage  
- Method coverage
- Class coverage
- Instruction coverage

## 📝 Logging Features

### Structured JSON Logging:
```json
{
  "timestamp": "2024-12-10T10:15:30.123Z",
  "level": "INFO",
  "logger": "com.example.user.service.UserServiceImpl",
  "message": "Successfully created user with ID: 123",
  "mdc": {
    "operation": "createUser",
    "username": "john_doe"
  }
}
```

### Log Levels Configuration:
- **DEBUG**: Detailed application flow
- **INFO**: General application events
- **WARN**: Potential issues
- **ERROR**: Error conditions with stack traces

### MDC (Mapped Diagnostic Context):
- Operation tracking
- User context
- Request IDs
- Service names

## 🎯 Log Analysis in Kibana

### Pre-configured Indexes:
- `zomato-logs-*` - All application logs
- Service-specific filtering available

### Common Queries:
```
# Find all errors
level:ERROR

# Find user service logs
service:"user-service"

# Find specific operation
mdc.operation:"createUser"

# Find logs with exceptions
message:Exception OR message:Error
```

## 📊 Metrics & Monitoring

### Actuator Endpoints:
- `/actuator/health` - Application health
- `/actuator/metrics` - Application metrics  
- `/actuator/prometheus` - Prometheus metrics
- `/actuator/loggers` - Dynamic log level changes

### Custom Metrics Tracked:
- Request counts and durations
- Database connection pool metrics
- Kafka consumer/producer metrics
- Custom business metrics

## 🔧 Running Analysis Commands

### Individual Service Analysis:
```bash
# User Service
cd User
mvn clean test jacoco:report sonar:sonar \
  -Dsonar.projectKey=user-service \
  -Dsonar.projectName="User Service" \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=admin \
  -Dsonar.password=admin

# Restaurant Service  
cd restaurant-service
mvn clean test jacoco:report sonar:sonar \
  -Dsonar.projectKey=restaurant-service \
  -Dsonar.projectName="Restaurant Service"

# Order Service
cd order-service  
mvn clean test jacoco:report sonar:sonar \
  -Dsonar.projectKey=order-service \
  -Dsonar.projectName="Order Service"
```

### Coverage Reports:
```bash
# Generate coverage report
mvn jacoco:report

# View coverage report
# Open: target/site/jacoco/index.html
```

## 🎛️ Quality Gates

### Default Quality Gates:
- **Coverage**: Minimum 70%
- **Duplications**: Maximum 3%
- **Maintainability Rating**: A
- **Reliability Rating**: A
- **Security Rating**: A

### Custom Rules:
- No System.out.println allowed (use logger)
- Proper exception handling required
- Code complexity limits enforced

## 🔄 CI/CD Integration

### Pipeline Commands:
```bash
# Build and test
mvn clean compile test

# Generate coverage report
mvn jacoco:report

# Run SonarQube analysis
mvn sonar:sonar

# Check quality gate status
mvn sonar:sonar -Dsonar.qualitygate.wait=true
```

## 📈 Log Retention & Management

### File Rotation:
- **Max file size**: 10MB
- **History**: 30 days
- **Total size cap**: 1GB per service

### Log Locations:
```
logs/
├── user-service.log
├── user-service-json.log
├── restaurant-service.log
├── restaurant-service-json.log
├── order-service.log
├── order-service-json.log
└── notification-service.log
```

## 🚨 Alerting & Monitoring

### Health Checks:
All services expose health endpoints for monitoring:
```bash
curl http://localhost:8080/actuator/health  # User Service
curl http://localhost:8081/actuator/health  # Restaurant Service
curl http://localhost:8083/actuator/health  # Order Service
```

### Log-based Alerts:
Configure alerts in Kibana for:
- Error rate spikes
- Response time degradation
- Service unavailability
- Security events

## 🛠️ Troubleshooting

### Common Issues:

1. **SonarQube not starting**:
   ```bash
   docker logs zomato-sonarqube
   # Ensure PostgreSQL is running and accessible
   ```

2. **Logs not appearing in Kibana**:
   ```bash
   docker logs zomato-logstash
   # Check if log files are being generated
   # Verify logstash.conf configuration
   ```

3. **Coverage reports not generated**:
   ```bash
   # Ensure tests are running
   mvn test
   # Check if jacoco plugin is configured correctly
   ```

---

**Note**: This monitoring setup is designed for development and testing. For production, consider additional security, performance tuning, and high availability configurations.

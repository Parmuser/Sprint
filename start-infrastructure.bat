@echo off
echo ================================
echo   ZOMATO MICROSERVICES STARTUP
echo ================================
echo.

echo Starting infrastructure services (Docker Compose)...
docker-compose up -d

echo.
echo Waiting for services to initialize...
timeout /t 30 /nobreak > nul

echo.
echo Services Status:
docker-compose ps

echo.
echo ================================
echo Infrastructure services started!
echo ================================
echo.
echo Available Services:
echo - Eureka Server: http://localhost:8761
echo - Kafka UI: http://localhost:8090
echo - PostgreSQL User DB: localhost:5432
echo - PostgreSQL Restaurant DB: localhost:5433
echo - PostgreSQL Order DB: localhost:5434
echo - Redis: localhost:6379
echo.
echo To start application services, run:
echo.
echo 1. User Service:
echo    cd User ^&^& mvn spring-boot:run
echo.
echo 2. Restaurant Service:
echo    cd restaurant-service ^&^& mvn spring-boot:run
echo.
echo 3. Order Service:
echo    cd order-service ^&^& mvn spring-boot:run
echo.
echo 4. Notification Service:
echo    cd notification-service ^&^& mvn spring-boot:run
echo.
echo ================================
pause

@echo off
setlocal enabledelayedexpansion

echo =================================================================
echo                   Zomato Clone - Docker Full Stack Setup
echo =================================================================
echo This script will build and run the complete Zomato microservices architecture
echo.

:: Function to check if Docker is running
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)
echo ✅ Docker is running

:: Ask user if they want to clean up
echo.
set /p cleanup_choice=Do you want to clean up existing containers and images? (y/N): 
if /i "%cleanup_choice%"=="y" (
    echo 🧹 Cleaning up existing containers and images...
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    echo ✅ Cleanup completed
) else (
    echo Skipping cleanup...
)

echo.
echo 🏗️ Building and starting all services...

:: Build all services
echo 📦 Building services...
docker-compose build --no-cache
if errorlevel 1 (
    echo ❌ Build failed. Please check the error messages above.
    pause
    exit /b 1
)

echo 🚀 Starting services...
docker-compose up -d
if errorlevel 1 (
    echo ❌ Failed to start services. Please check the error messages above.
    pause
    exit /b 1
)

echo ✅ All services are starting up...
echo.
echo ⏳ Waiting for services to be healthy...
timeout /t 30 /nobreak >nul

echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo =================================================================
echo                            🌐 Access Points
echo =================================================================
echo    • Eureka Dashboard: http://localhost:8761
echo    • User Service: http://localhost:8080
echo    • Restaurant Service: http://localhost:8081
echo    • Order Service: http://localhost:8082
echo    • Notification Service: http://localhost:8083
echo    • React Frontend: http://localhost:3000
echo    • Angular Frontend: http://localhost:4200
echo    • Kafka UI: http://localhost:8090
echo    • SonarQube: http://localhost:9000
echo    • Kibana: http://localhost:5601
echo.
echo =================================================================
echo                          🗄️ Database Access
echo =================================================================
echo    • User DB: localhost:5432 (mydb/postgres/secret)
echo    • Restaurant DB: localhost:5433 (restaurant_db/postgres/secret)
echo    • Order DB: localhost:5434 (order_db/postgres/secret)
echo    • Redis Cache: localhost:6379
echo.
echo =================================================================
echo 🎉 Setup complete! All services should be running.
echo 💡 Tip: Use 'docker-compose logs [service-name]' to check individual service logs
echo 💡 Tip: Use 'docker-compose down' to stop all services
echo =================================================================

pause

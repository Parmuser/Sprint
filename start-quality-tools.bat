@echo off
echo ================================
echo   CODE QUALITY ANALYSIS SETUP
echo ================================
echo.

echo Starting SonarQube and supporting services...
docker-compose up -d sonarqube sonar-postgres elasticsearch logstash kibana

echo.
echo Waiting for SonarQube to initialize (this may take a few minutes)...
timeout /t 60 /nobreak > nul

echo.
echo ================================
echo Services Started Successfully!
echo ================================
echo.
echo Available Quality Tools:
echo - SonarQube: http://localhost:9000 (admin/admin)
echo - Kibana (Logs): http://localhost:5601
echo - Elasticsearch: http://localhost:9200
echo.
echo To run code analysis on services:
echo.
echo 1. User Service:
echo    cd User ^&^& mvn clean test jacoco:report sonar:sonar
echo.
echo 2. Restaurant Service:
echo    cd restaurant-service ^&^& mvn clean test jacoco:report sonar:sonar
echo.
echo 3. Order Service:
echo    cd order-service ^&^& mvn clean test jacoco:report sonar:sonar
echo.
echo ================================
pause

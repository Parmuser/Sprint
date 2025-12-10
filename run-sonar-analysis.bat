@echo off
echo ================================
echo   RUNNING CODE QUALITY ANALYSIS
echo ================================
echo.

set SONAR_HOST_URL=http://localhost:9000
set SONAR_LOGIN=admin
set SONAR_PASSWORD=admin

echo Analyzing User Service...
cd User
call mvn clean test jacoco:report sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_LOGIN% -Dsonar.password=%SONAR_PASSWORD% -Dsonar.projectKey=user-service -Dsonar.projectName="User Service"
cd ..

echo.
echo Analyzing Restaurant Service...
cd restaurant-service
call mvn clean test jacoco:report sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_LOGIN% -Dsonar.password=%SONAR_PASSWORD% -Dsonar.projectKey=restaurant-service -Dsonar.projectName="Restaurant Service"
cd ..

echo.
echo Analyzing Order Service...
cd order-service
call mvn clean test jacoco:report sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_LOGIN% -Dsonar.password=%SONAR_PASSWORD% -Dsonar.projectKey=order-service -Dsonar.projectName="Order Service"
cd ..

echo.
echo Analyzing Notification Service...
cd notification-service
call mvn clean test jacoco:report sonar:sonar -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_LOGIN% -Dsonar.password=%SONAR_PASSWORD% -Dsonar.projectKey=notification-service -Dsonar.projectName="Notification Service"
cd ..

echo.
echo ================================
echo Code Quality Analysis Complete!
echo ================================
echo.
echo Check results at: http://localhost:9000
echo Default credentials: admin/admin
echo.
pause

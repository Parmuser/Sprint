#!/bin/bash

echo "=== Zomato Clone - Docker Full Stack Setup ==="
echo "This script will build and run the complete Zomato microservices architecture"
echo ""

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to clean up existing containers and images (optional)
cleanup() {
    echo "🧹 Cleaning up existing containers and images..."
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    echo "✅ Cleanup completed"
}

# Function to build and start services
build_and_start() {
    echo "🏗️ Building and starting all services..."
    
    # Build all services
    echo "📦 Building services..."
    docker-compose build --no-cache
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please check the error messages above."
        exit 1
    fi
    
    echo "🚀 Starting services..."
    docker-compose up -d
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to start services. Please check the error messages above."
        exit 1
    fi
    
    echo "✅ All services are starting up..."
}

# Function to show service status
show_status() {
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
    echo "🌐 Access Points:"
    echo "   • Eureka Dashboard: http://localhost:8761"
    echo "   • User Service: http://localhost:8080"
    echo "   • Restaurant Service: http://localhost:8081"
    echo "   • Order Service: http://localhost:8082"
    echo "   • Notification Service: http://localhost:8083"
    echo "   • React Frontend: http://localhost:3000"
    echo "   • Angular Frontend: http://localhost:4200"
    echo "   • Kafka UI: http://localhost:8090"
    echo "   • SonarQube: http://localhost:9000"
    echo "   • Kibana: http://localhost:5601"
    echo ""
    echo "🗄️ Database Access:"
    echo "   • User DB: localhost:5432 (mydb/postgres/secret)"
    echo "   • Restaurant DB: localhost:5433 (restaurant_db/postgres/secret)"
    echo "   • Order DB: localhost:5434 (order_db/postgres/secret)"
    echo "   • Redis Cache: localhost:6379"
}

# Main execution
echo "🔍 Checking prerequisites..."
check_docker

# Ask user if they want to clean up
echo ""
read -p "Do you want to clean up existing containers and images? (y/N): " cleanup_choice
case $cleanup_choice in
    [Yy]* ) cleanup;;
    * ) echo "Skipping cleanup...";;
esac

echo ""
build_and_start

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 30

show_status

echo ""
echo "🎉 Setup complete! All services should be running."
echo "💡 Tip: Use 'docker-compose logs [service-name]' to check individual service logs"
echo "💡 Tip: Use 'docker-compose down' to stop all services"

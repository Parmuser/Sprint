# Project Notes & Scratch Pad

Use this file for rough notes, comments, and reminders. This file won't be compiled.

---

## Services Overview

| Service | Port | Database | DB Port |
|---------|------|----------|---------|
| Eureka Server | 8761 | - | - |
| User Service | 8080 | mydb | 5432 |
| Restaurant Service | 8081 | restaurant_db | 5433 |
| Order Service | 8082 | order_db | 5434 |
| Notification Service | 8084 | - (uses Kafka) | - |

---

## TODO / Reminders

- [ ] 
- [ ] 
- [ ] 

---

## My Notes

Add your notes here...




---

## Commands Reference

```powershell
# Start all Docker containers
docker-compose up -d

# Start specific containers
docker-compose up -d user-postgres restaurant-postgres order-postgres kafka zookeeper

# Stop all containers
docker-compose down

# View logs
docker-compose logs -f <service-name>

# Run a specific service
cd <service-folder>
mvn spring-boot:run
```

---

## Issues / Bugs Found



---

## Ideas / Improvements



---

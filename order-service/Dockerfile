# syntax=docker/dockerfile:1

# -------- Build stage --------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Leverage Docker layer caching for dependencies
COPY order-service/pom.xml ./pom.xml
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -e -DskipTests dependency:go-offline

# Copy source and build
COPY order-service/src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -e -DskipTests package

# -------- Runtime stage --------
FROM eclipse-temurin:21-jre AS runtime
ENV TZ=UTC
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy fat jar from build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose port for order service
EXPOSE 8082

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8082/actuator/health || exit 1

# Default JVM flags can be overridden at runtime via JAVA_OPTS
ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

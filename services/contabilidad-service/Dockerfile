FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/contabilidad-service-0.1.0-SNAPSHOT.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]

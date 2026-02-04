FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/seguridad-service-0.1.0-SNAPSHOT.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]

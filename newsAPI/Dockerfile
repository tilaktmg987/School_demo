# Use Maven with JDK 8 for the build stage
FROM maven:3.8.6-openjdk-8-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use OpenJDK 8 for the runtime stage
FROM openjdk:8-jdk-slim
WORKDIR /app
COPY --from=build /app/target/newsAPI-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/isrgrootx1.pem /app/isrgrootx1.pem
RUN \
    cd /app && \
    keytool -import -trustcacerts -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt -alias mysql-ca -file isrgrootx1.pem
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Use Maven with Eclipse Temurin JDK 8 for the build stage
FROM maven:3.9-eclipse-temurin-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use Eclipse Temurin JRE 8 for the runtime stage (lighter and supported)
FROM eclipse-temurin:8-jre-jammy
WORKDIR /app
COPY --from=build /app/target/newsAPI-0.0.1-SNAPSHOT.jar app.jar
COPY src/main/resources/isrgrootx1.pem /app/isrgrootx1.pem

# Import the certificate into the Java Truststore
# Note: Eclipse Temurin images use different paths sometimes, but JAVA_HOME is usually set correctly.
RUN \
    keytool -import -trustcacerts -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt -alias mysql-ca -file /app/isrgrootx1.pem
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

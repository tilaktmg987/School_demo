package com.example.newsAPI;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;

@SpringBootApplication
public class NewsApiApplication {

	public static void main(String[] args) {
		String envDir = "./";
		if (new File("./newsAPI/.env").exists()) {
			envDir = "./newsAPI";
			System.out.println("Found .env in ./newsAPI");
		} else if (new File("./.env").exists()) {
			System.out.println("Found .env in ./");
		} else {
			System.out.println("Could not find .env file, checking classpath or system env...");
		}

		Dotenv dotenv = Dotenv.configure().directory(envDir).ignoreIfMissing().load();
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		SpringApplication.run(NewsApiApplication.class, args);
	}

}

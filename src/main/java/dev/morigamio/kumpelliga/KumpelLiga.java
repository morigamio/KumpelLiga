package dev.morigamio.kumpelliga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class KumpelLiga {

	public static void main(String[] args) {
		SpringApplication.run(KumpelLiga.class, args);
	}

}

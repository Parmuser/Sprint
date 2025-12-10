package com.zomato.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.kafka.annotation.EnableKafka;
import java.util.TimeZone;

@SpringBootApplication
@EnableDiscoveryClient
@EnableKafka
public class RestaurantServiceApplication {

	public static void main(String[] args) {
		// Override system timezone to prevent timezone issues
		System.setProperty("user.timezone", "UTC");
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		
		SpringApplication.run(RestaurantServiceApplication.class, args);
	}

}

package com.example.textile;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.textile.model.User;
import com.example.textile.repository.ProductRepository;
import com.example.textile.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class TextileBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(TextileBackendApplication.class, args);
    }

    // seed some data
    @Bean
    CommandLineRunner runner(ProductRepository productRepo, UserRepository userRepo) {
        return args -> {
            if (userRepo.count()==0) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                String hashedPassword = encoder.encode("admin");
                System.out.println("Hashed password: " + hashedPassword);
                userRepo.save(new User("admin", hashedPassword, "ROLE_ADMIN"));
            }
//            if (productRepo.count()==0) {
//                productRepo.save(new Product("Blue Shirt", "Comfort cotton shirt", 499.0, "BC1001"));
//                productRepo.save(new Product("Denim Jeans", "Slim fit denim", 999.0, "BC1002"));
//                productRepo.save(new Product("Silk Scarf", "Designer scarf", 299.0, "BC1003"));
//            }
        };
    }
}

package com.example.textile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.textile.model.User;
import com.example.textile.repository.UserRepository;
import com.example.textile.security.JwtUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5200")
public class AuthController {
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String,String> login(@RequestBody Map<String,String> body){
        String username = body.get("username");
        String password = body.get("password");
        User u = userRepo.findByUsername(username).orElseThrow(()-> new RuntimeException("Invalid credentials"));
        if (passwordEncoder.matches(password, u.getPassword())) {
            String token = jwtUtil.generateToken(username);
            return Map.of("token", token, "username", username);
        } else throw new RuntimeException("Invalid credentials");
    }

    @PostMapping("/register")
    public Map<String,String> register(@RequestBody Map<String,String> body){
        String username = body.get("username");
        String password = body.get("password");
        
        if (userRepo.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        User u = new User(username, passwordEncoder.encode(password), "ROLE_USER");
        userRepo.save(u);
        return Map.of("status","ok", "message", "User registered successfully");
    }
}

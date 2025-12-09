package com.example.textile.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET = "replace_this_with_strong_secret_key_please_change_at_least_256_bits";
    private final long EXPIRATION = 1000L * 60 * 60 * 24; // 24h
    private final SecretKey key;

    public JwtUtil() {
        // Create a secure key from the secret string
        this.key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username){
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public String extractUsername(String token){
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch(Exception ex){
            return null;
        }
    }
}

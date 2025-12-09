package com.example.textile.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Customers {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String phoneNumber;
    private String email;
    private LocalDate dob;
    private String address;
    private String martialStatus;
    private LocalDate dom;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Customers(){}
}

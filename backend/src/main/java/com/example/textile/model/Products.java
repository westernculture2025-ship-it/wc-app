package com.example.textile.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
public class Products {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String supplierName;
    private String supplierGstNumber;
    private String productName;
    private Double wholesalePrice;
    private Double retailPrice;
    private String fabricType;
    private String pattern;
    private String size;
    private Integer quantity;
    private String hsnCode;
    @Column(unique=true)
    private String barcode;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Products() {}

}

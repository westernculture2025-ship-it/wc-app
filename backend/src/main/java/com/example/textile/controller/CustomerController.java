package com.example.textile.controller;

import com.example.textile.model.Customers;
import com.example.textile.model.Products;
import com.example.textile.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * @author z038343 - Karthikraja P
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5200")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;

    @PostMapping("/upsert")
    public Customers createOrUpdate(@RequestBody Customers c) {
        Optional<Customers> existingCustomerOpt = customerRepository.findByPhoneNumber(c.getPhoneNumber());
        if (existingCustomerOpt.isPresent()) {
            Customers existingCustomer = existingCustomerOpt.get();
            existingCustomer.setName(c.getName());
            existingCustomer.setEmail(c.getEmail());
            existingCustomer.setDob(c.getDob());
            existingCustomer.setAddress(c.getAddress());
            existingCustomer.setMartialStatus(c.getMartialStatus());
            existingCustomer.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(existingCustomer);
        } else {
            c.setCreatedAt(LocalDateTime.now());
            c.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(c);
        }
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<Customers> getByPhoneNumber(@PathVariable String phoneNumber) {
        Optional<Customers> product = customerRepository.findByPhoneNumber(phoneNumber);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

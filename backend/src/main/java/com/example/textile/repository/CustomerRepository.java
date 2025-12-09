package com.example.textile.repository;
import com.example.textile.model.Customers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customers, Long> {
    Optional<Customers> findByPhoneNumber(String phoneNumber);
}

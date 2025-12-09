package com.example.textile.repository;
import com.example.textile.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Products, Long> {

    Optional<Products> findByBarcode(String barcode);

    @Query(value = "SELECT nextval('product_barcode_seq')", nativeQuery = true)
    Long getNextBarcode();

    List<Products> findByProductNameContainingIgnoreCase(String productName);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END FROM Products p WHERE p.barcode = :barcode")
    boolean existsByBarcode(@Param("barcode") String barcode);

    List<Products> findAllByOrderByIdDesc();
}

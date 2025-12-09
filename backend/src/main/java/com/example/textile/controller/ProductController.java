package com.example.textile.controller;

import com.example.textile.model.Products;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.textile.repository.ProductRepository;
import com.example.textile.service.BarcodeService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5200")
@AllArgsConstructor
public class ProductController {
     private final ProductRepository productRepo;
     private final BarcodeService barcodeService;

    @GetMapping
    public List<Products> all() {
        return productRepo.findAllByOrderByIdDesc();
    }

    @PostMapping
    public Products create(@RequestBody Products p) {
        Long seq = productRepo.getNextBarcode();
        String barcode = "WC" + String.format("%06d", seq);
        p.setBarcode(barcode);
        p.setBarcode(barcode);
        LocalDateTime now = LocalDateTime.now();
        p.setCreatedAt(now);
        p.setUpdatedAt(now);
        return productRepo.save(p);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Products> get(@PathVariable Long id) {
        Optional<Products> product = productRepo.findById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Products> update(@PathVariable Long id, @RequestBody Products p) {
        if (!productRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        p.setId(id);
        p.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(productRepo.save(p));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/barcode/{code}")
    public ResponseEntity<Products> getByBarcode(@PathVariable String code) {
        Optional<Products> product = productRepo.findByBarcode(code);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/barcode/{code}/image")
    public byte[] barcodeImage(@PathVariable String code) throws Exception {
        return barcodeService.generateBarcodeImage(code, 300, 80);
    }
    
    @GetMapping("/search")
    public List<Products> search(@RequestParam String q) {
        // Simple search by product name - can be enhanced with more fields
        return productRepo.findByProductNameContainingIgnoreCase(q);
    }
}

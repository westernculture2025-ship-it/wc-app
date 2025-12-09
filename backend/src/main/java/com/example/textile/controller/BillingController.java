package com.example.textile.controller;

import com.example.textile.model.InvoiceItems;
import com.example.textile.model.Invoices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.example.textile.repository.InvoiceRepository;
import com.example.textile.service.InvoiceService;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:5200")
public class BillingController {
    @Autowired private InvoiceRepository invoiceRepo;
    @Autowired private InvoiceService invoiceService;

    @PostMapping("/invoice")
    public Invoices createInvoice(@RequestBody Invoices invoice){
        LocalDateTime now = LocalDateTime.now();
        if (invoice.getInvoiceItems() != null) {
            for (InvoiceItems item : invoice.getInvoiceItems()) {
                item.setCreatedAt(now);
                item.setUpdatedAt(now);
                item.setInvoice(invoice);
            }
        }
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        }
        invoice.setCreatedAt(now);
        invoice.setUpdatedAt(now);
        invoice.setInvoiceDateTime(now);
        return invoiceRepo.save(invoice);
    }
    
    @GetMapping("/invoices")
    public List<Invoices> getAllInvoices() {
        return invoiceRepo.findAllByOrderByIdDesc();
    }

    @GetMapping("/invoice/{id}")
    public ResponseEntity<Invoices> getInvoice(@PathVariable Long id) {
        Optional<Invoices> invoice = invoiceRepo.findById(id);
        return invoice.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/invoice/{id}/pdf")
    public ResponseEntity<byte[]> invoicePdf(@PathVariable Long id) throws Exception {
        Invoices inv = invoiceRepo.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found"));
        byte[] pdf = invoiceService.generateInvoicePdf(inv);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment").filename("invoice-"+id+".pdf").build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}

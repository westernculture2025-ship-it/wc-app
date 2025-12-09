package com.example.textile.service;

import com.example.textile.model.Invoices;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;

@Service
public class InvoiceService {

    public byte[] generateInvoicePdf(Invoices invoice) throws Exception {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();
//        Font f = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
//        document.add(new Paragraph("Invoice", f));
//        document.add(new Paragraph("Invoice ID: " + invoice.getId()));
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//        document.add(new Paragraph("Date: " + sdf.format(invoice.getDate())));
//        if (invoice.getCustomerName() != null) {
//            document.add(new Paragraph("Customer: " + invoice.getCustomerName()));
//        }
//        document.add(new Paragraph(" "));
//        document.add(new Paragraph("Items:"));
//        document.add(new Paragraph(invoice.getItemsJson()!=null ? invoice.getItemsJson() : "[]"));
//        document.add(new Paragraph(" "));
//        document.add(new Paragraph("Total: " + invoice.getTotal()));
//        document.close();
       return out.toByteArray();
    }
}

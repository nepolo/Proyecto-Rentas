package com.trib.platform.facturacion.controller;

import com.trib.platform.facturacion.model.Factura;
import com.trib.platform.facturacion.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {
    
    @Autowired
    private FacturaService facturaService;
    
    @GetMapping
    public ResponseEntity<List<Factura>> findAll() {
        return ResponseEntity.ok(facturaService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Factura> findById(@PathVariable Long id) {
        return facturaService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/contribuyente/{contribuyenteId}")
    public ResponseEntity<List<Factura>> findByContribuyente(@PathVariable Long contribuyenteId) {
        return ResponseEntity.ok(facturaService.findByContribuyenteId(contribuyenteId));
    }
    
    @PostMapping
    public ResponseEntity<Factura> create(@RequestBody Factura factura) {
        Factura saved = facturaService.save(factura);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}/anular")
    public ResponseEntity<Factura> anular(@PathVariable Long id) {
        try {
            Factura anulada = facturaService.anular(id);
            return ResponseEntity.ok(anulada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

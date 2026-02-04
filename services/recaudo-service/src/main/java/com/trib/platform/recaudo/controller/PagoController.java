package com.trib.platform.recaudo.controller;

import com.trib.platform.recaudo.model.Pago;
import com.trib.platform.recaudo.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {
    
    @Autowired
    private PagoService pagoService;
    
    @GetMapping
    public ResponseEntity<List<Pago>> findAll() {
        return ResponseEntity.ok(pagoService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pago> findById(@PathVariable Long id) {
        return pagoService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/contribuyente/{contribuyenteId}")
    public ResponseEntity<List<Pago>> findByContribuyente(@PathVariable Long contribuyenteId) {
        return ResponseEntity.ok(pagoService.findByContribuyenteId(contribuyenteId));
    }
    
    @PostMapping
    public ResponseEntity<Pago> create(@RequestBody Pago pago) {
        Pago saved = pagoService.save(pago);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}/aplicar")
    public ResponseEntity<Pago> aplicar(@PathVariable Long id) {
        try {
            Pago aplicado = pagoService.aplicarPago(id);
            return ResponseEntity.ok(aplicado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

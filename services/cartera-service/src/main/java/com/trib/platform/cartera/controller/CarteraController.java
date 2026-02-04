package com.trib.platform.cartera.controller;

import com.trib.platform.cartera.model.EstadoCuenta;
import com.trib.platform.cartera.service.CarteraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cartera")
public class CarteraController {
    @Autowired
    private CarteraService service;
    
    @GetMapping
    public ResponseEntity<List<EstadoCuenta>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/contribuyente/{id}")
    public ResponseEntity<List<EstadoCuenta>> findByContribuyente(@PathVariable Long id) {
        return ResponseEntity.ok(service.findByContribuyente(id));
    }
    
    @PostMapping
    public ResponseEntity<EstadoCuenta> create(@RequestBody EstadoCuenta estado) {
        return ResponseEntity.ok(service.save(estado));
    }
}

package com.trib.platform.contabilidad.controller;

import com.trib.platform.contabilidad.model.AsientoContable;
import com.trib.platform.contabilidad.service.ContabilidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contabilidad")
public class ContabilidadController {
    @Autowired
    private ContabilidadService service;
    
    @GetMapping
    public ResponseEntity<List<AsientoContable>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @PostMapping
    public ResponseEntity<AsientoContable> create(@RequestBody AsientoContable asiento) {
        return ResponseEntity.ok(service.save(asiento));
    }
    
    @GetMapping("/transaccion/{id}")
    public ResponseEntity<List<AsientoContable>> findByTransaccion(@PathVariable Long id) {
        return ResponseEntity.ok(service.findByTransaccion(id));
    }
}

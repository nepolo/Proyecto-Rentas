package com.trib.platform.liquidacion.controller;

import com.trib.platform.liquidacion.model.Liquidacion;
import com.trib.platform.liquidacion.service.LiquidacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/liquidaciones")
public class LiquidacionController {
    
    @Autowired
    private LiquidacionService liquidacionService;
    
    @GetMapping
    public ResponseEntity<List<Liquidacion>> findAll() {
        return ResponseEntity.ok(liquidacionService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Liquidacion> findById(@PathVariable Long id) {
        return liquidacionService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/contribuyente/{contribuyenteId}")
    public ResponseEntity<List<Liquidacion>> findByContribuyente(@PathVariable Long contribuyenteId) {
        return ResponseEntity.ok(liquidacionService.findByContribuyenteId(contribuyenteId));
    }
    
    @PostMapping
    public ResponseEntity<Liquidacion> create(@RequestBody Liquidacion liquidacion) {
        Liquidacion saved = liquidacionService.save(liquidacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PostMapping("/{id}/reliquidar")
    public ResponseEntity<Liquidacion> reliquidar(@PathVariable Long id, @RequestBody Map<String, BigDecimal> request) {
        BigDecimal nuevaBaseGravable = request.get("nuevaBaseGravable");
        Liquidacion reliquidada = liquidacionService.reliquidar(id, nuevaBaseGravable);
        return ResponseEntity.ok(reliquidada);
    }
}

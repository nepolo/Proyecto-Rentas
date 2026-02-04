package com.trib.platform.formulas.controller;

import com.trib.platform.formulas.model.Formula;
import com.trib.platform.formulas.service.FormulaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/formulas")
public class FormulaController {
    
    @Autowired
    private FormulaService formulaService;
    
    @GetMapping
    public ResponseEntity<List<Formula>> findAll() {
        return ResponseEntity.ok(formulaService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Formula> findById(@PathVariable Long id) {
        return formulaService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Formula>> findByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(formulaService.findByEstado(estado));
    }
    
    @PostMapping
    public ResponseEntity<Formula> create(@RequestBody Formula formula) {
        Formula saved = formulaService.save(formula);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Formula> update(@PathVariable Long id, @RequestBody Formula formula) {
        try {
            Formula updated = formulaService.update(id, formula);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        formulaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/evaluar")
    public ResponseEntity<Map<String, Object>> evaluarFormula(@RequestBody Map<String, Object> request) {
        String expresion = (String) request.get("expresion");
        Double baseGravable = ((Number) request.get("baseGravable")).doubleValue();
        Double tarifa = ((Number) request.get("tarifa")).doubleValue();
        
        Double resultado = formulaService.evaluarFormula(expresion, baseGravable, tarifa);
        
        return ResponseEntity.ok(Map.of(
            "expresion", expresion,
            "baseGravable", baseGravable,
            "tarifa", tarifa,
            "resultado", resultado
        ));
    }
}

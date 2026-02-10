package com.trib.platform.liquidacion.controller;

import com.trib.platform.liquidacion.model.ConceptoCobro;
import com.trib.platform.liquidacion.repository.ConceptoCobroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuentes/{fuenteId}/conceptos")
@CrossOrigin(origins = "http://localhost:4200")
public class ConceptoCobroController {

    @Autowired
    private ConceptoCobroRepository conceptoRepository;

    @GetMapping
    public List<ConceptoCobro> getConceptosByFuente(@PathVariable Long fuenteId) {
        return conceptoRepository.findByFuenteId(fuenteId);
    }

    @PostMapping
    public ConceptoCobro createConcepto(@PathVariable Long fuenteId, @RequestBody ConceptoCobro concepto) {
        return conceptoRepository.save(concepto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConceptoCobro> updateConcepto(@PathVariable Long fuenteId, @PathVariable Long id,
            @RequestBody ConceptoCobro conceptoDetails) {
        return conceptoRepository.findById(id)
                .map(concepto -> {
                    concepto.setNombre(conceptoDetails.getNombre());
                    concepto.setDescripcion(conceptoDetails.getDescripcion());
                    concepto.setTipo(conceptoDetails.getTipo());
                    concepto.setTarifaBase(conceptoDetails.getTarifaBase());
                    concepto.setFormula(conceptoDetails.getFormula());
                    concepto.setActivo(conceptoDetails.getActivo());
                    return ResponseEntity.ok(conceptoRepository.save(concepto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteConcepto(@PathVariable Long fuenteId, @PathVariable Long id) {
        return conceptoRepository.findById(id)
                .map(concepto -> {
                    conceptoRepository.delete(concepto);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

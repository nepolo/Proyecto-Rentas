package com.trib.platform.liquidacion.controller;

import com.trib.platform.liquidacion.model.FuenteIngreso;
import com.trib.platform.liquidacion.repository.FuenteIngresoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuentes")
@CrossOrigin(origins = "http://localhost:4200")
public class FuenteIngresoController {

    @Autowired
    private FuenteIngresoRepository fuenteRepository;

    @GetMapping
    public List<FuenteIngreso> getAllFuentes(@RequestParam(required = false) String categoria) {
        if (categoria != null && !categoria.isEmpty()) {
            return fuenteRepository.findByCategoria(categoria);
        }
        return fuenteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuenteIngreso> getFuenteById(@PathVariable Long id) {
        return fuenteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FuenteIngreso createFuente(@RequestBody FuenteIngreso fuente) {
        return fuenteRepository.save(fuente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuenteIngreso> updateFuente(@PathVariable Long id, @RequestBody FuenteIngreso fuenteDetails) {
        return fuenteRepository.findById(id)
                .map(fuente -> {
                    fuente.setNombre(fuenteDetails.getNombre());
                    fuente.setDescripcion(fuenteDetails.getDescripcion());
                    fuente.setCategoria(fuenteDetails.getCategoria());
                    fuente.setTipoObjeto(fuenteDetails.getTipoObjeto());
                    fuente.setActivo(fuenteDetails.getActivo());
                    fuente.setIcono(fuenteDetails.getIcono());
                    fuente.setColor(fuenteDetails.getColor());
                    return ResponseEntity.ok(fuenteRepository.save(fuente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFuente(@PathVariable Long id) {
        return fuenteRepository.findById(id)
                .map(fuente -> {
                    fuenteRepository.delete(fuente);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

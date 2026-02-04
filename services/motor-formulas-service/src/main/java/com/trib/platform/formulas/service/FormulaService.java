package com.trib.platform.formulas.service;

import com.trib.platform.formulas.model.Formula;
import com.trib.platform.formulas.repository.FormulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FormulaService {
    
    @Autowired
    private FormulaRepository formulaRepository;
    
    public List<Formula> findAll() {
        return formulaRepository.findAll();
    }
    
    public Optional<Formula> findById(Long id) {
        return formulaRepository.findById(id);
    }
    
    public List<Formula> findByEstado(String estado) {
        return formulaRepository.findByEstado(estado);
    }
    
    public Formula save(Formula formula) {
        return formulaRepository.save(formula);
    }
    
    public Formula update(Long id, Formula formulaActualizada) {
        return formulaRepository.findById(id)
            .map(formula -> {
                formula.setNombre(formulaActualizada.getNombre());
                formula.setExpresion(formulaActualizada.getExpresion());
                formula.setVersion(formulaActualizada.getVersion());
                formula.setVigenciaDesde(formulaActualizada.getVigenciaDesde());
                formula.setVigenciaHasta(formulaActualizada.getVigenciaHasta());
                formula.setEstado(formulaActualizada.getEstado());
                formula.setDescripcion(formulaActualizada.getDescripcion());
                formula.setFechaModificacion(LocalDateTime.now());
                formula.setModificadoPor(formulaActualizada.getModificadoPor());
                return formulaRepository.save(formula);
            })
            .orElseThrow(() -> new RuntimeException("Formula no encontrada con id: " + id));
    }
    
    public void deleteById(Long id) {
        formulaRepository.deleteById(id);
    }
    
    public Double evaluarFormula(String expresion, Double baseGravable, Double tarifa) {
        // Implementación simplificada de evaluación de fórmulas
        // En producción usar un motor de expresiones como JEXL o SpEL
        try {
            expresion = expresion.replace("BASE_GRAVABLE", String.valueOf(baseGravable));
            expresion = expresion.replace("TARIFA", String.valueOf(tarifa));
            // Aquí iría la evaluación real de la expresión
            return baseGravable * tarifa; // Ejemplo simplificado
        } catch (Exception e) {
            throw new RuntimeException("Error al evaluar la fórmula: " + e.getMessage());
        }
    }
}

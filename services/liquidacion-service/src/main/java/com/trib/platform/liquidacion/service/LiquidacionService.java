package com.trib.platform.liquidacion.service;

import com.trib.platform.liquidacion.model.Liquidacion;
import com.trib.platform.liquidacion.repository.LiquidacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class LiquidacionService {
    
    @Autowired
    private LiquidacionRepository liquidacionRepository;
    
    public List<Liquidacion> findAll() {
        return liquidacionRepository.findAll();
    }
    
    public Optional<Liquidacion> findById(Long id) {
        return liquidacionRepository.findById(id);
    }
    
    public List<Liquidacion> findByContribuyenteId(Long contribuyenteId) {
        return liquidacionRepository.findByContribuyenteId(contribuyenteId);
    }
    
    public Liquidacion save(Liquidacion liquidacion) {
        if (liquidacion.getNumeroLiquidacion() == null) {
            liquidacion.setNumeroLiquidacion(generarNumeroLiquidacion());
        }
        calcularValorTotal(liquidacion);
        return liquidacionRepository.save(liquidacion);
    }
    
    public Liquidacion reliquidar(Long id, BigDecimal nuevaBaseGravable) {
        return liquidacionRepository.findById(id)
            .map(liquidacion -> {
                liquidacion.setBaseGravable(nuevaBaseGravable);
                liquidacion.setValorImpuesto(nuevaBaseGravable.multiply(liquidacion.getTarifa()));
                calcularValorTotal(liquidacion);
                liquidacion.setTipoLiquidacion("RELIQUIDACION");
                return liquidacionRepository.save(liquidacion);
            })
            .orElseThrow(() -> new RuntimeException("Liquidación no encontrada"));
    }
    
    private void calcularValorTotal(Liquidacion liquidacion) {
        BigDecimal total = liquidacion.getValorImpuesto()
            .add(liquidacion.getIntereses())
            .add(liquidacion.getSanciones())
            .subtract(liquidacion.getDescuentos());
        liquidacion.setValorTotal(total);
    }
    
    private String generarNumeroLiquidacion() {
        return "LIQ-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

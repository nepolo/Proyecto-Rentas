package com.trib.platform.recaudo.service;

import com.trib.platform.recaudo.model.Pago;
import com.trib.platform.recaudo.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PagoService {
    
    @Autowired
    private PagoRepository pagoRepository;
    
    public List<Pago> findAll() {
        return pagoRepository.findAll();
    }
    
    public Optional<Pago> findById(Long id) {
        return pagoRepository.findById(id);
    }
    
    public List<Pago> findByContribuyenteId(Long contribuyenteId) {
        return pagoRepository.findByContribuyenteId(contribuyenteId);
    }
    
    public Pago save(Pago pago) {
        if (pago.getNumeroRecibo() == null) {
            pago.setNumeroRecibo(generarNumeroRecibo());
        }
        return pagoRepository.save(pago);
    }
    
    public Pago aplicarPago(Long id) {
        return pagoRepository.findById(id)
            .map(pago -> {
                pago.setEstado("APLICADO");
                return pagoRepository.save(pago);
            })
            .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    }
    
    private String generarNumeroRecibo() {
        return "REC-" + System.currentTimeMillis();
    }
}

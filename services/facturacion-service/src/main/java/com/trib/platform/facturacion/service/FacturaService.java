package com.trib.platform.facturacion.service;

import com.trib.platform.facturacion.model.Factura;
import com.trib.platform.facturacion.repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class FacturaService {
    
    @Autowired
    private FacturaRepository facturaRepository;
    
    public List<Factura> findAll() {
        return facturaRepository.findAll();
    }
    
    public Optional<Factura> findById(Long id) {
        return facturaRepository.findById(id);
    }
    
    public List<Factura> findByContribuyenteId(Long contribuyenteId) {
        return facturaRepository.findByContribuyenteId(contribuyenteId);
    }
    
    public Factura save(Factura factura) {
        if (factura.getNumeroFactura() == null) {
            factura.setNumeroFactura(generarNumeroFactura());
        }
        if (factura.getCodigoQR() == null) {
            factura.setCodigoQR(generarCodigoQR(factura));
        }
        return facturaRepository.save(factura);
    }
    
    public Factura anular(Long id) {
        return facturaRepository.findById(id)
            .map(factura -> {
                factura.setEstado("ANULADA");
                return facturaRepository.save(factura);
            })
            .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
    }
    
    private String generarNumeroFactura() {
        return "FAC-" + System.currentTimeMillis();
    }
    
    private String generarCodigoQR(Factura factura) {
        return "QR-" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();
    }
}

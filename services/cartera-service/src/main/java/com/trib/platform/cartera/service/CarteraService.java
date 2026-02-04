package com.trib.platform.cartera.service;

import com.trib.platform.cartera.model.EstadoCuenta;
import com.trib.platform.cartera.repository.EstadoCuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarteraService {
    @Autowired
    private EstadoCuentaRepository repository;
    
    public List<EstadoCuenta> findAll() {
        return repository.findAll();
    }
    
    public List<EstadoCuenta> findByContribuyente(Long id) {
        return repository.findByContribuyenteId(id);
    }
    
    public EstadoCuenta save(EstadoCuenta estado) {
        return repository.save(estado);
    }
}

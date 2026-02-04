package com.trib.platform.contabilidad.service;

import com.trib.platform.contabilidad.model.AsientoContable;
import com.trib.platform.contabilidad.repository.AsientoContableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContabilidadService {
    @Autowired
    private AsientoContableRepository repository;
    
    public List<AsientoContable> findAll() {
        return repository.findAll();
    }
    
    public AsientoContable save(AsientoContable asiento) {
        if (asiento.getNumeroAsiento() == null) {
            asiento.setNumeroAsiento("ASI-" + System.currentTimeMillis());
        }
        return repository.save(asiento);
    }
    
    public List<AsientoContable> findByTransaccion(Long id) {
        return repository.findByTransaccionId(id);
    }
}

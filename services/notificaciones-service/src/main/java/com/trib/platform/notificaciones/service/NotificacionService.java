package com.trib.platform.notificaciones.service;

import com.trib.platform.notificaciones.model.Notificacion;
import com.trib.platform.notificaciones.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {
    @Autowired
    private NotificacionRepository repository;
    
    public List<Notificacion> findAll() {
        return repository.findAll();
    }
    
    public Notificacion save(Notificacion notificacion) {
        return repository.save(notificacion);
    }
    
    public Notificacion enviar(Long id) {
        return repository.findById(id)
            .map(notif -> {
                notif.setEstado("ENVIADA");
                notif.setFechaEnvio(LocalDateTime.now());
                return repository.save(notif);
            })
            .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
    }
}

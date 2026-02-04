package com.trib.platform.notificaciones.repository;

import com.trib.platform.notificaciones.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByEstado(String estado);
    List<Notificacion> findByDestinatario(String destinatario);
}

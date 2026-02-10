package com.trib.platform.seguridad.repository;

import com.trib.platform.seguridad.model.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Long> {
    List<Permiso> findByModulo(String modulo);
}

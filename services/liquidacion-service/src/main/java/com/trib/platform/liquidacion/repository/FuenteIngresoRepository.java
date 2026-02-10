package com.trib.platform.liquidacion.repository;

import com.trib.platform.liquidacion.model.FuenteIngreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FuenteIngresoRepository extends JpaRepository<FuenteIngreso, Long> {
    Optional<FuenteIngreso> findByCodigo(String codigo);

    List<FuenteIngreso> findByCategoria(String categoria);

    List<FuenteIngreso> findByActivo(Boolean activo);
}

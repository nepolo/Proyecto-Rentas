package com.trib.platform.cartera.repository;

import com.trib.platform.cartera.model.EstadoCuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EstadoCuentaRepository extends JpaRepository<EstadoCuenta, Long> {
    List<EstadoCuenta> findByContribuyenteId(Long contribuyenteId);
}

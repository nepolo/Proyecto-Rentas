package com.trib.platform.recaudo.repository;

import com.trib.platform.recaudo.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByFacturaId(Long facturaId);
    List<Pago> findByContribuyenteId(Long contribuyenteId);
    List<Pago> findByEstado(String estado);
}

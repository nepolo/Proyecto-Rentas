package com.trib.platform.facturacion.repository;

import com.trib.platform.facturacion.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    Optional<Factura> findByNumeroFactura(String numeroFactura);
    List<Factura> findByContribuyenteId(Long contribuyenteId);
    List<Factura> findByEstado(String estado);
    Optional<Factura> findByLiquidacionId(Long liquidacionId);
}

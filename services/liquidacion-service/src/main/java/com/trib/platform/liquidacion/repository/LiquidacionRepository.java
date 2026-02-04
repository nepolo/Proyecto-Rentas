package com.trib.platform.liquidacion.repository;

import com.trib.platform.liquidacion.model.Liquidacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiquidacionRepository extends JpaRepository<Liquidacion, Long> {
    Optional<Liquidacion> findByNumeroLiquidacion(String numeroLiquidacion);
    List<Liquidacion> findByContribuyenteId(Long contribuyenteId);
    List<Liquidacion> findByEstado(String estado);
    List<Liquidacion> findByVigenciaAndPeriodo(Integer vigencia, Integer periodo);
}

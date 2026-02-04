package com.trib.platform.contabilidad.repository;

import com.trib.platform.contabilidad.model.AsientoContable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AsientoContableRepository extends JpaRepository<AsientoContable, Long> {
    List<AsientoContable> findByTransaccionId(Long transaccionId);
    List<AsientoContable> findByTipoTransaccion(String tipoTransaccion);
}

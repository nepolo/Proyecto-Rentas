package com.trib.platform.liquidacion.repository;

import com.trib.platform.liquidacion.model.ConceptoCobro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConceptoCobroRepository extends JpaRepository<ConceptoCobro, Long> {
    List<ConceptoCobro> findByFuenteId(Long fuenteId);

    List<ConceptoCobro> findByFuenteIdAndActivo(Long fuenteId, Boolean activo);
}

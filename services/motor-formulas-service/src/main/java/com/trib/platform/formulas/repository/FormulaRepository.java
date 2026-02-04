package com.trib.platform.formulas.repository;

import com.trib.platform.formulas.model.Formula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormulaRepository extends JpaRepository<Formula, Long> {
    List<Formula> findByEstado(String estado);
    List<Formula> findByNombreContainingIgnoreCase(String nombre);
}

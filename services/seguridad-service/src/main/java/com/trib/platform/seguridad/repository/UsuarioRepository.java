package com.trib.platform.seguridad.repository;

import com.trib.platform.seguridad.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    List<Usuario> findByRol(String rol);
    List<Usuario> findByActivo(Boolean activo);
}

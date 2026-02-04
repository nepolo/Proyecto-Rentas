package com.trib.platform.seguridad.service;

import com.trib.platform.seguridad.model.Usuario;
import com.trib.platform.seguridad.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SeguridadService {
    @Autowired
    private UsuarioRepository repository;
    
    public List<Usuario> findAll() {
        return repository.findAll();
    }
    
    public Optional<Usuario> findByUsername(String username) {
        return repository.findByUsername(username);
    }
    
    public Usuario save(Usuario usuario) {
        // En producción: encriptar password con BCrypt
        return repository.save(usuario);
    }
    
    public Usuario activar(Long id) {
        return repository.findById(id)
            .map(user -> {
                user.setActivo(true);
                return repository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}

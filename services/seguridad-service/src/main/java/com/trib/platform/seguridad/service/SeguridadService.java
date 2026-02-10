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

    public Optional<Usuario> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<Usuario> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public Usuario save(Usuario usuario) {
        // En producción: encriptar password con BCrypt
        return repository.save(usuario);
    }

    public Optional<Usuario> update(Long id, Usuario usuarioDetails) {
        return repository.findById(id)
                .map(usuario -> {
                    usuario.setNombre(usuarioDetails.getNombre());
                    usuario.setEmail(usuarioDetails.getEmail());
                    usuario.setEntidad(usuarioDetails.getEntidad());
                    usuario.setRoles(usuarioDetails.getRoles());
                    return repository.save(usuario);
                });
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Usuario activar(Long id) {
        return repository.findById(id)
                .map(user -> {
                    user.setActivo(true);
                    return repository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario desactivar(Long id) {
        return repository.findById(id)
                .map(user -> {
                    user.setActivo(false);
                    return repository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void cambiarPassword(Long id, String nuevaPassword) {
        repository.findById(id)
                .ifPresent(user -> {
                    // En producción: encriptar password con BCrypt
                    user.setPassword(nuevaPassword);
                    repository.save(user);
                });
    }
}

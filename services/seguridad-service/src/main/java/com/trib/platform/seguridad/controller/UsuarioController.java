package com.trib.platform.seguridad.controller;

import com.trib.platform.seguridad.model.Usuario;
import com.trib.platform.seguridad.service.SeguridadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private SeguridadService service;
    
    @GetMapping
    public ResponseEntity<List<Usuario>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<Usuario> findByUsername(@PathVariable String username) {
        return service.findByUsername(username)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(service.save(usuario));
    }
    
    @PutMapping("/{id}/activar")
    public ResponseEntity<Usuario> activar(@PathVariable Long id) {
        return ResponseEntity.ok(service.activar(id));
    }
}

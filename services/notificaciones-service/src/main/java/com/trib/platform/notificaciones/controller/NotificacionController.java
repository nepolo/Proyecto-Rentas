package com.trib.platform.notificaciones.controller;

import com.trib.platform.notificaciones.model.Notificacion;
import com.trib.platform.notificaciones.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {
    @Autowired
    private NotificacionService service;
    
    @GetMapping
    public ResponseEntity<List<Notificacion>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @PostMapping
    public ResponseEntity<Notificacion> create(@RequestBody Notificacion notificacion) {
        return ResponseEntity.ok(service.save(notificacion));
    }
    
    @PutMapping("/{id}/enviar")
    public ResponseEntity<Notificacion> enviar(@PathVariable Long id) {
        return ResponseEntity.ok(service.enviar(id));
    }
}

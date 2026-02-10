package com.trib.platform.seguridad.controller;

import com.trib.platform.seguridad.model.Permiso;
import com.trib.platform.seguridad.repository.PermisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/permisos")
@CrossOrigin(origins = "http://localhost:4200")
public class PermisoController {

    @Autowired
    private PermisoRepository permisoRepository;

    @GetMapping
    public List<Permiso> getAllPermisos() {
        return permisoRepository.findAll();
    }

    @GetMapping("/modulo/{modulo}")
    public List<Permiso> getPermisosByModulo(@PathVariable String modulo) {
        return permisoRepository.findByModulo(modulo);
    }
}

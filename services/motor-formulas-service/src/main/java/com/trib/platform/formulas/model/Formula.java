package com.trib.platform.formulas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "formulas")
public class Formula {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String expresion;
    
    @Column(nullable = false)
    private String version;
    
    @Column(nullable = false)
    private LocalDateTime vigenciaDesde;
    
    private LocalDateTime vigenciaHasta;
    
    @Column(nullable = false)
    private String estado; // ACTIVA, INACTIVA, HISTORICA
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaModificacion;
    
    @Column(nullable = false)
    private String creadoPor;
    
    private String modificadoPor;

    // Constructors
    public Formula() {
        this.fechaCreacion = LocalDateTime.now();
        this.estado = "ACTIVA";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getExpresion() {
        return expresion;
    }

    public void setExpresion(String expresion) {
        this.expresion = expresion;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public LocalDateTime getVigenciaDesde() {
        return vigenciaDesde;
    }

    public void setVigenciaDesde(LocalDateTime vigenciaDesde) {
        this.vigenciaDesde = vigenciaDesde;
    }

    public LocalDateTime getVigenciaHasta() {
        return vigenciaHasta;
    }

    public void setVigenciaHasta(LocalDateTime vigenciaHasta) {
        this.vigenciaHasta = vigenciaHasta;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public String getCreadoPor() {
        return creadoPor;
    }

    public void setCreadoPor(String creadoPor) {
        this.creadoPor = creadoPor;
    }

    public String getModificadoPor() {
        return modificadoPor;
    }

    public void setModificadoPor(String modificadoPor) {
        this.modificadoPor = modificadoPor;
    }
}

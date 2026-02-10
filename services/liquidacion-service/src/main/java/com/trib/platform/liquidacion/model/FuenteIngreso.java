package com.trib.platform.liquidacion.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuentes_ingreso")
public class FuenteIngreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false)
    private String categoria; // PREDIAL, INDUSTRIAL, SERVICIOS, OTROS

    @Column(nullable = false)
    private String tipoObjeto; // Predio, Establecimiento, Suscriptor, Obra, Permiso

    @Column(nullable = false)
    private Boolean activo;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    private String icono;
    private String color;

    // Estadísticas
    private Integer conceptosCount = 0;
    private Integer tiposCount = 0;
    private Integer liquidacionesCount = 0;
    private Integer objetosCount = 0;

    public FuenteIngreso() {
        this.fechaCreacion = LocalDateTime.now();
        this.activo = true;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getTipoObjeto() {
        return tipoObjeto;
    }

    public void setTipoObjeto(String tipoObjeto) {
        this.tipoObjeto = tipoObjeto;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getConceptosCount() {
        return conceptosCount;
    }

    public void setConceptosCount(Integer conceptosCount) {
        this.conceptosCount = conceptosCount;
    }

    public Integer getTiposCount() {
        return tiposCount;
    }

    public void setTiposCount(Integer tiposCount) {
        this.tiposCount = tiposCount;
    }

    public Integer getLiquidacionesCount() {
        return liquidacionesCount;
    }

    public void setLiquidacionesCount(Integer liquidacionesCount) {
        this.liquidacionesCount = liquidacionesCount;
    }

    public Integer getObjetosCount() {
        return objetosCount;
    }

    public void setObjetosCount(Integer objetosCount) {
        this.objetosCount = objetosCount;
    }
}

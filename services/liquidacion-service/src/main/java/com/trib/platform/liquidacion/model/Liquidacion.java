package com.trib.platform.liquidacion.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "liquidaciones")
public class Liquidacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String numeroLiquidacion;
    
    @Column(nullable = false)
    private Long contribuyenteId;
    
    @Column(nullable = false)
    private Long rentaId;
    
    @Column(nullable = false)
    private Integer periodo;
    
    @Column(nullable = false)
    private Integer vigencia;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal baseGravable;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal tarifa;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorImpuesto;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal intereses = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal sanciones = BigDecimal.ZERO;
    
    @Column(precision = 19, scale = 2)
    private BigDecimal descuentos = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorTotal;
    
    @Column(nullable = false)
    private String estado; // PENDIENTE, FACTURADA, PAGADA, ANULADA
    
    @Column(nullable = false)
    private String tipoLiquidacion; // INDIVIDUAL, MASIVA, RELIQUIDACION
    
    private LocalDate fechaVencimiento;
    
    @Column(nullable = false)
    private LocalDateTime fechaLiquidacion;
    
    @Column(nullable = false)
    private String liquidadoPor;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;

    public Liquidacion() {
        this.fechaLiquidacion = LocalDateTime.now();
        this.estado = "PENDIENTE";
        this.intereses = BigDecimal.ZERO;
        this.sanciones = BigDecimal.ZERO;
        this.descuentos = BigDecimal.ZERO;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroLiquidacion() {
        return numeroLiquidacion;
    }

    public void setNumeroLiquidacion(String numeroLiquidacion) {
        this.numeroLiquidacion = numeroLiquidacion;
    }

    public Long getContribuyenteId() {
        return contribuyenteId;
    }

    public void setContribuyenteId(Long contribuyenteId) {
        this.contribuyenteId = contribuyenteId;
    }

    public Long getRentaId() {
        return rentaId;
    }

    public void setRentaId(Long rentaId) {
        this.rentaId = rentaId;
    }

    public Integer getPeriodo() {
        return periodo;
    }

    public void setPeriodo(Integer periodo) {
        this.periodo = periodo;
    }

    public Integer getVigencia() {
        return vigencia;
    }

    public void setVigencia(Integer vigencia) {
        this.vigencia = vigencia;
    }

    public BigDecimal getBaseGravable() {
        return baseGravable;
    }

    public void setBaseGravable(BigDecimal baseGravable) {
        this.baseGravable = baseGravable;
    }

    public BigDecimal getTarifa() {
        return tarifa;
    }

    public void setTarifa(BigDecimal tarifa) {
        this.tarifa = tarifa;
    }

    public BigDecimal getValorImpuesto() {
        return valorImpuesto;
    }

    public void setValorImpuesto(BigDecimal valorImpuesto) {
        this.valorImpuesto = valorImpuesto;
    }

    public BigDecimal getIntereses() {
        return intereses;
    }

    public void setIntereses(BigDecimal intereses) {
        this.intereses = intereses;
    }

    public BigDecimal getSanciones() {
        return sanciones;
    }

    public void setSanciones(BigDecimal sanciones) {
        this.sanciones = sanciones;
    }

    public BigDecimal getDescuentos() {
        return descuentos;
    }

    public void setDescuentos(BigDecimal descuentos) {
        this.descuentos = descuentos;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTipoLiquidacion() {
        return tipoLiquidacion;
    }

    public void setTipoLiquidacion(String tipoLiquidacion) {
        this.tipoLiquidacion = tipoLiquidacion;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public LocalDateTime getFechaLiquidacion() {
        return fechaLiquidacion;
    }

    public void setFechaLiquidacion(LocalDateTime fechaLiquidacion) {
        this.fechaLiquidacion = fechaLiquidacion;
    }

    public String getLiquidadoPor() {
        return liquidadoPor;
    }

    public void setLiquidadoPor(String liquidadoPor) {
        this.liquidadoPor = liquidadoPor;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}

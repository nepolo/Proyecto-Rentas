package com.trib.platform.recaudo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String numeroRecibo;
    
    @Column(nullable = false)
    private Long facturaId;
    
    @Column(nullable = false)
    private Long contribuyenteId;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorPagado;
    
    @Column(nullable = false)
    private String medioPago; // EFECTIVO, TRANSFERENCIA, TARJETA, PSE
    
    @Column(nullable = false)
    private String tipoPago; // TOTAL, PARCIAL
    
    @Column(nullable = false)
    private LocalDateTime fechaPago;
    
    private String referenciaBancaria;
    
    @Column(nullable = false)
    private String estado; // APLICADO, PENDIENTE, RECHAZADO
    
    @Column(nullable = false)
    private String registradoPor;

    public Pago() {
        this.fechaPago = LocalDateTime.now();
        this.estado = "PENDIENTE";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNumeroRecibo() { return numeroRecibo; }
    public void setNumeroRecibo(String numeroRecibo) { this.numeroRecibo = numeroRecibo; }
    
    public Long getFacturaId() { return facturaId; }
    public void setFacturaId(Long facturaId) { this.facturaId = facturaId; }
    
    public Long getContribuyenteId() { return contribuyenteId; }
    public void setContribuyenteId(Long contribuyenteId) { this.contribuyenteId = contribuyenteId; }
    
    public BigDecimal getValorPagado() { return valorPagado; }
    public void setValorPagado(BigDecimal valorPagado) { this.valorPagado = valorPagado; }
    
    public String getMedioPago() { return medioPago; }
    public void setMedioPago(String medioPago) { this.medioPago = medioPago; }
    
    public String getTipoPago() { return tipoPago; }
    public void setTipoPago(String tipoPago) { this.tipoPago = tipoPago; }
    
    public LocalDateTime getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDateTime fechaPago) { this.fechaPago = fechaPago; }
    
    public String getReferenciaBancaria() { return referenciaBancaria; }
    public void setReferenciaBancaria(String referenciaBancaria) { this.referenciaBancaria = referenciaBancaria; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public String getRegistradoPor() { return registradoPor; }
    public void setRegistradoPor(String registradoPor) { this.registradoPor = registradoPor; }
}

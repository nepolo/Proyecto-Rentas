package com.trib.platform.facturacion.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "facturas")
public class Factura {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String numeroFactura;
    
    @Column(nullable = false)
    private Long liquidacionId;
    
    @Column(nullable = false)
    private Long contribuyenteId;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorTotal;
    
    @Column(nullable = false)
    private LocalDate fechaVencimiento;
    
    @Column(nullable = false)
    private LocalDateTime fechaEmision;
    
    @Column(nullable = false)
    private String estado; // EMITIDA, PAGADA, VENCIDA, ANULADA
    
    private String codigoQR;
    
    @Column(columnDefinition = "TEXT")
    private String detalleConceptos;
    
    @Column(nullable = false)
    private String emitidoPor;

    public Factura() {
        this.fechaEmision = LocalDateTime.now();
        this.estado = "EMITIDA";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }
    
    public Long getLiquidacionId() { return liquidacionId; }
    public void setLiquidacionId(Long liquidacionId) { this.liquidacionId = liquidacionId; }
    
    public Long getContribuyenteId() { return contribuyenteId; }
    public void setContribuyenteId(Long contribuyenteId) { this.contribuyenteId = contribuyenteId; }
    
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    
    public LocalDateTime getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDateTime fechaEmision) { this.fechaEmision = fechaEmision; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public String getCodigoQR() { return codigoQR; }
    public void setCodigoQR(String codigoQR) { this.codigoQR = codigoQR; }
    
    public String getDetalleConceptos() { return detalleConceptos; }
    public void setDetalleConceptos(String detalleConceptos) { this.detalleConceptos = detalleConceptos; }
    
    public String getEmitidoPor() { return emitidoPor; }
    public void setEmitidoPor(String emitidoPor) { this.emitidoPor = emitidoPor; }
}

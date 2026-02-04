package com.trib.platform.cartera.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "estados_cuenta")
public class EstadoCuenta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long contribuyenteId;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal saldoTotal;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal saldoVencido;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal interesesMora;
    
    @Column(nullable = false)
    private LocalDateTime fechaConsulta;
    
    @Column(nullable = false)
    private String estado;

    public EstadoCuenta() {
        this.fechaConsulta = LocalDateTime.now();
        this.estado = "ACTIVO";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getContribuyenteId() { return contribuyenteId; }
    public void setContribuyenteId(Long contribuyenteId) { this.contribuyenteId = contribuyenteId; }
    public BigDecimal getSaldoTotal() { return saldoTotal; }
    public void setSaldoTotal(BigDecimal saldoTotal) { this.saldoTotal = saldoTotal; }
    public BigDecimal getSaldoVencido() { return saldoVencido; }
    public void setSaldoVencido(BigDecimal saldoVencido) { this.saldoVencido = saldoVencido; }
    public BigDecimal getInteresesMora() { return interesesMora; }
    public void setInteresesMora(BigDecimal interesesMora) { this.interesesMora = interesesMora; }
    public LocalDateTime getFechaConsulta() { return fechaConsulta; }
    public void setFechaConsulta(LocalDateTime fechaConsulta) { this.fechaConsulta = fechaConsulta; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

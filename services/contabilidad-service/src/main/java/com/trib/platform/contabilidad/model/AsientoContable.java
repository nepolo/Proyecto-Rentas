package com.trib.platform.contabilidad.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "asientos_contables")
public class AsientoContable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String numeroAsiento;
    
    @Column(nullable = false)
    private Long transaccionId;
    
    @Column(nullable = false)
    private String tipoTransaccion; // CAUSACION, RECAUDO, AJUSTE
    
    @Column(nullable = false)
    private String cuentaContable;
    
    @Column(nullable = false)
    private String tipoMovimiento; // DEBITO, CREDITO
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valor;
    
    @Column(nullable = false)
    private LocalDateTime fechaAsiento;
    
    @Column(nullable = false)
    private String registradoPor;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    public AsientoContable() {
        this.fechaAsiento = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroAsiento() { return numeroAsiento; }
    public void setNumeroAsiento(String numeroAsiento) { this.numeroAsiento = numeroAsiento; }
    public Long getTransaccionId() { return transaccionId; }
    public void setTransaccionId(Long transaccionId) { this.transaccionId = transaccionId; }
    public String getTipoTransaccion() { return tipoTransaccion; }
    public void setTipoTransaccion(String tipoTransaccion) { this.tipoTransaccion = tipoTransaccion; }
    public String getCuentaContable() { return cuentaContable; }
    public void setCuentaContable(String cuentaContable) { this.cuentaContable = cuentaContable; }
    public String getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public LocalDateTime getFechaAsiento() { return fechaAsiento; }
    public void setFechaAsiento(LocalDateTime fechaAsiento) { this.fechaAsiento = fechaAsiento; }
    public String getRegistradoPor() { return registradoPor; }
    public void setRegistradoPor(String registradoPor) { this.registradoPor = registradoPor; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}

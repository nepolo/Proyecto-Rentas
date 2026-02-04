package com.trib.platform.notificaciones.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String destinatario;
    
    @Column(nullable = false)
    private String tipoCanal; // EMAIL, SMS, PUSH
    
    @Column(nullable = false)
    private String asunto;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;
    
    @Column(nullable = false)
    private String estado; // PENDIENTE, ENVIADA, FALLIDA
    
    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaEnvio;

    public Notificacion() {
        this.fechaCreacion = LocalDateTime.now();
        this.estado = "PENDIENTE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDestinatario() { return destinatario; }
    public void setDestinatario(String destinatario) { this.destinatario = destinatario; }
    public String getTipoCanal() { return tipoCanal; }
    public void setTipoCanal(String tipoCanal) { this.tipoCanal = tipoCanal; }
    public String getAsunto() { return asunto; }
    public void setAsunto(String asunto) { this.asunto = asunto; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
}

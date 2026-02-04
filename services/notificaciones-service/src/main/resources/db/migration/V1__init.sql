CREATE TABLE notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destinatario VARCHAR(255) NOT NULL,
    tipo_canal VARCHAR(50) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_envio TIMESTAMP
);
CREATE INDEX idx_notif_estado ON notificaciones(estado);
CREATE INDEX idx_notif_destinatario ON notificaciones(destinatario);

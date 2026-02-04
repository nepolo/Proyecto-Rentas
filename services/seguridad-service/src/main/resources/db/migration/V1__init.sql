CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL,
    ultimo_acceso TIMESTAMP
);
CREATE INDEX idx_usuario_username ON usuarios(username);
CREATE INDEX idx_usuario_rol ON usuarios(rol);

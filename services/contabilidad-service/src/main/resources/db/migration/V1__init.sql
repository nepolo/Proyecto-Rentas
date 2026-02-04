CREATE TABLE asientos_contables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_asiento VARCHAR(255) NOT NULL UNIQUE,
    transaccion_id BIGINT NOT NULL,
    tipo_transaccion VARCHAR(50) NOT NULL,
    cuenta_contable VARCHAR(50) NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL,
    valor DECIMAL(19,2) NOT NULL,
    fecha_asiento TIMESTAMP NOT NULL,
    registrado_por VARCHAR(255) NOT NULL,
    descripcion TEXT
);
CREATE INDEX idx_asiento_transaccion ON asientos_contables(transaccion_id);

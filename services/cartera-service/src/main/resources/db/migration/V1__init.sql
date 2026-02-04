CREATE TABLE estados_cuenta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contribuyente_id BIGINT NOT NULL,
    saldo_total DECIMAL(19,2) NOT NULL,
    saldo_vencido DECIMAL(19,2) NOT NULL,
    intereses_mora DECIMAL(19,2) NOT NULL,
    fecha_consulta TIMESTAMP NOT NULL,
    estado VARCHAR(50) NOT NULL
);
CREATE INDEX idx_estado_cuenta_contribuyente ON estados_cuenta(contribuyente_id);

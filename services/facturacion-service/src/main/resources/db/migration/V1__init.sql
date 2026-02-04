CREATE TABLE facturas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(255) NOT NULL UNIQUE,
    liquidacion_id BIGINT NOT NULL,
    contribuyente_id BIGINT NOT NULL,
    valor_total DECIMAL(19,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_emision TIMESTAMP NOT NULL,
    estado VARCHAR(50) NOT NULL,
    codigo_qr VARCHAR(255),
    detalle_conceptos TEXT,
    emitido_por VARCHAR(255) NOT NULL
);

CREATE INDEX idx_factura_contribuyente ON facturas(contribuyente_id);
CREATE INDEX idx_factura_estado ON facturas(estado);
CREATE INDEX idx_factura_liquidacion ON facturas(liquidacion_id);

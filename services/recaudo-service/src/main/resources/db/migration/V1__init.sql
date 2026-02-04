CREATE TABLE pagos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_recibo VARCHAR(255) NOT NULL UNIQUE,
    factura_id BIGINT NOT NULL,
    contribuyente_id BIGINT NOT NULL,
    valor_pagado DECIMAL(19,2) NOT NULL,
    medio_pago VARCHAR(50) NOT NULL,
    tipo_pago VARCHAR(50) NOT NULL,
    fecha_pago TIMESTAMP NOT NULL,
    referencia_bancaria VARCHAR(255),
    estado VARCHAR(50) NOT NULL,
    registrado_por VARCHAR(255) NOT NULL
);

CREATE INDEX idx_pago_factura ON pagos(factura_id);
CREATE INDEX idx_pago_contribuyente ON pagos(contribuyente_id);
CREATE INDEX idx_pago_estado ON pagos(estado);

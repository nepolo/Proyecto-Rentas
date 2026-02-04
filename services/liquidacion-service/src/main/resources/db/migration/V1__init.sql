CREATE TABLE liquidaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_liquidacion VARCHAR(255) NOT NULL UNIQUE,
    contribuyente_id BIGINT NOT NULL,
    renta_id BIGINT NOT NULL,
    periodo INT NOT NULL,
    vigencia INT NOT NULL,
    base_gravable DECIMAL(19,2) NOT NULL,
    tarifa DECIMAL(19,2) NOT NULL,
    valor_impuesto DECIMAL(19,2) NOT NULL,
    intereses DECIMAL(19,2) DEFAULT 0,
    sanciones DECIMAL(19,2) DEFAULT 0,
    descuentos DECIMAL(19,2) DEFAULT 0,
    valor_total DECIMAL(19,2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    tipo_liquidacion VARCHAR(50) NOT NULL,
    fecha_vencimiento DATE,
    fecha_liquidacion TIMESTAMP NOT NULL,
    liquidado_por VARCHAR(255) NOT NULL,
    observaciones TEXT
);

CREATE INDEX idx_liquidacion_contribuyente ON liquidaciones(contribuyente_id);
CREATE INDEX idx_liquidacion_estado ON liquidaciones(estado);
CREATE INDEX idx_liquidacion_vigencia_periodo ON liquidaciones(vigencia, periodo);

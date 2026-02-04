CREATE TABLE formulas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    expresion TEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    vigencia_desde TIMESTAMP NOT NULL,
    vigencia_hasta TIMESTAMP,
    estado VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_modificacion TIMESTAMP,
    creado_por VARCHAR(255) NOT NULL,
    modificado_por VARCHAR(255)
);

CREATE INDEX idx_formula_estado ON formulas(estado);
CREATE INDEX idx_formula_nombre ON formulas(nombre);

// Modelos de Parametrización
export interface Renta {
  id?: number;
  nombre: string;
  tipo: string;
  periodicidad: string;
  vigenciaInicio?: string;
  vigenciaFin?: string;
}

// Modelos de Fórmulas
export interface Formula {
  id?: number;
  nombre: string;
  expresion: string;
  version: string;
  vigenciaDesde: string;
  vigenciaHasta?: string;
  estado: string;
  descripcion?: string;
  creadoPor: string;
}

// Modelos de Liquidación
export interface Liquidacion {
  id?: number;
  numeroLiquidacion?: string;
  contribuyenteId: number;
  rentaId: number;
  periodo: number;
  vigencia: number;
  baseGravable: number;
  tarifa: number;
  valorImpuesto: number;
  intereses?: number;
  sanciones?: number;
  descuentos?: number;
  valorTotal: number;
  estado: string;
  tipoLiquidacion: string;
  fechaVencimiento?: string;
  liquidadoPor: string;
}

// Modelos de Factura
export interface Factura {
  id?: number;
  numeroFactura?: string;
  liquidacionId: number;
  contribuyenteId: number;
  valorTotal: number;
  fechaVencimiento: string;
  fechaEmision?: string;
  estado: string;
  codigoQR?: string;
  emitidoPor: string;
}

// Modelos de Pago
export interface Pago {
  id?: number;
  numeroRecibo?: string;
  facturaId: number;
  contribuyenteId: number;
  valorPagado: number;
  medioPago: string;
  tipoPago: string;
  fechaPago?: string;
  estado: string;
  registradoPor: string;
}

// Modelos de Cartera
export interface EstadoCuenta {
  id?: number;
  contribuyenteId: number;
  saldoTotal: number;
  saldoVencido: number;
  interesesMora: number;
  fechaConsulta?: string;
  estado: string;
}

// Modelos de Usuario
export interface Usuario {
  id?: number;
  username: string;
  password?: string;
  email: string;
  rol: string;
  activo: boolean;
}

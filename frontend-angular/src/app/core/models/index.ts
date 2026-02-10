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

// Modelos de Liquidación - Motor Tributario
export interface FuenteIngreso {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  periodicidad?: string;
  baseLegal?: string;
  activo?: boolean;
  estado: 'ACTIVO' | 'INACTIVO';
  creadoPor?: string;
  fechaCreacion?: string;
  // Nuevos campos de prescripción
  aplicaPrescripcion: boolean;
  aniosPrescripcion?: number;
  // Iconos y UI
  icono?: string;
  color?: string;
}

export interface ObjetoTributario {
  id?: number;
  fuenteIngresoId: number;
  fuenteIngreso?: FuenteIngreso;
  identificacion: string;
  tipoIdentificacion?: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  fechaRegistro?: string;
  tipoObjeto?: string; // 'PREDIO', 'ESTABLECIMIENTO', 'VEHICULO', etc.
  propietario?: string;
  valorCatastral?: number;
  area?: number;
  matricula?: string;
  ubicacion?: string;
}

export interface ConceptoCobro {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  fuenteIngresoId: number;
  fuenteIngreso?: FuenteIngreso;
  formulaId?: number;
  tarifaBase?: number;
  orden?: number;
  obligatorio?: boolean;
  esObligatorio: boolean;
  permiteDescuento?: boolean;
  generaInteres?: boolean;
  permiteCero: boolean;
  activo?: boolean;
  estado: 'ACTIVO' | 'INACTIVO';
  creadoPor?: string;
  fechaCreacion?: string;
  // Nuevos campos especializados
  tipoConcepto: 'CAPITAL' | 'INTERES' | 'SANCION' | 'DESCUENTO' | 'NOVEDAD' | 'OTRO';
  operacion: 'SUMA' | 'RESTA';  // Si suma o resta al total
  cuentaContableId?: string;
  cuentaContableNombre?: string;
  aplicaEnFacturacion: boolean;
  ordenCalculoFormula?: number;  // Orden de aplicación en fórmulas
}

export interface TipoLiquidacion {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  generaFactura: boolean;
  requiereAprobacion: boolean;
  aprobacionMultiple?: boolean;
  permiteEdicion?: boolean;
  generaFacturaAutomatica?: boolean;
  rolesAprobadores?: string[];
  diasVencimiento?: number;
  conceptosAplicables?: number[];
  activo?: boolean;
  conceptosCobro?: ConceptoCobro[];
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface Liquidacion {
  id?: number;
  numeroLiquidacion?: string;
  contribuyenteId: number;
  contribuyenteNombre?: string;
  rentaId: number;
  rentaNombre?: string;
  tipoLiquidacionId?: number;
  tipoLiquidacion?: TipoLiquidacion;
  fuenteIngresoId?: number;
  fuenteIngreso?: FuenteIngreso;
  periodo: number;
  vigencia: number;
  baseGravable: number;
  tarifa: number;
  valorImpuesto: number;
  conceptos?: DetalleConceptoLiquidacion[];
  intereses?: number;
  sanciones?: number;
  descuentos?: number;
  valorTotal: number;
  estado: 'BORRADOR' | 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'FACTURADA' | 'ANULADA';
  esReliquidacion: boolean;
  liquidacionOrigenId?: number;
  motivoAjuste?: string;
  fechaLiquidacion?: string;
  fechaVencimiento?: string;
  liquidadoPor: string;
  aprobadoPor?: string;
  fechaAprobacion?: string;
}

export interface DetalleConceptoLiquidacion {
  id?: number;
  liquidacionId?: number;
  conceptoCobroId: number;
  conceptoCobro?: ConceptoCobro;
  concepto?: string;
  baseGravable?: number;
  base: number;
  tarifa: number;
  valor: number;
  valorCalculado?: number;
  descuento?: number;
  valorNeto: number;
  valorFinal?: number;
}

export interface AjusteLiquidacion {
  id?: number;
  liquidacionOrigenId: number;
  liquidacionNuevaId?: number;
  motivo: string;
  tipoAjuste: 'RELIQUIDACION' | 'CORRECCION' | 'AJUSTE_MANUAL';
  ajustes: CampoAjustado[];
  realizadoPor: string;
  fechaAjuste?: string;
  estado: 'PENDIENTE' | 'APLICADO' | 'RECHAZADO';
}

export interface CampoAjustado {
  campo: string;
  valorAnterior: any;
  valorNuevo: any;
  justificacion?: string;
}

export interface LiquidacionMasiva {
  id?: number;
  nombre: string;
  descripcion?: string;
  tipoLiquidacionId: number;
  fuenteIngresoId: number;
  vigencia: number;
  periodo: number;
  contribuyentes?: number[];
  criterioSeleccion?: CriterioSeleccion;
  totalContribuyentes?: number;
  totalLiquidaciones?: number;
  estadoProceso: 'CONFIGURANDO' | 'EN_PROCESO' | 'COMPLETADO' | 'FALLIDO';
  progreso?: number;
  fechaInicio?: string;
  fechaFin?: string;
  creadoPor: string;
}

export interface CriterioSeleccion {
  rentaIds?: number[];
  actividadEconomica?: string[];
  rango?: { minimo: number; maximo: number };
  excluirContribuyentes?: number[];
}

// ===== NUEVOS MODELOS COMPLETOS DE PARAMETRIZACIÓN =====

// Período de Liquidación - Período total de cobro del impuesto/obligación
export interface PeriodoLiquidacion {
  id?: number | string;  // ID interno autogenerado
  fuenteIngresoId: number;
  fuenteIngreso?: FuenteIngreso;
  vigencia: number;  // Año fiscal
  tipoPeriodo: 'ANUAL' | 'MENSUAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'CUATRIMESTRAL' | 'SEMESTRAL';
  descripcion: string;  // Ej: "Período Anual 2024", "Primer Semestre 2024"
  fechaInicio: string;
  fechaFin: string;
  fechaVencimiento?: string;  // Fecha límite para liquidar
  // Información estadística
  numeroLiquidacionesGeneradas?: number;
  valorTotalLiquidado?: number;
  numeroPeriodosFacturacion?: number;  // Cuántos períodos de facturación tiene
  estado: 'ACTIVO' | 'CERRADO' | 'ANULADO';
  creadoPor?: string;
  fechaCreacion?: string;
  modificadoPor?: string;
  fechaModificacion?: string;
  observaciones?: string;
}

// Período de Facturación - Períodos en que se difiere/divide la deuda
export interface PeriodoFacturacion {
  id?: number | string;  // ID interno autogenerado
  periodoLiquidacionId: number | string;  // Relación con el período de liquidación padre
  periodoLiquidacion?: PeriodoLiquidacion;
  fuenteIngresoId: number;
  vigencia: number;
  numeroPeriodo: number;  // 1, 2, 3, 4, 5, 6 (ej: 6 bimestres en un año)
  descripcion: string;  // Ej: "Bimestre 1 - 2024", "Cuota 2 de 6"
  fechaInicio: string;  // Rango de fechas de este período de facturación
  fechaFin: string;
  fechaVencimiento: string;  // Fecha límite para pagar esta cuota
  valorCuota?: number;  // Valor de esta cuota específica
  porcentajeCuota?: number;  // % del total que representa esta cuota
  // Información de facturación
  estaFacturado: boolean;
  numeroFacturasGeneradas?: number;
  valorTotalFacturado?: number;
  estadoFacturacion: 'PENDIENTE' | 'EN_PROCESO' | 'FACTURADO' | 'ANULADO';
  // Configuración de pago
  permitePagoAnticipado: boolean;
  generaDescuentoProntoPago: boolean;
  porcentajeDescuentoProntoPago?: number;
  diasDescuentoProntoPago?: number;
  generaInteresesMora: boolean;
  porcentajeInteresesMora?: number;
  estadoPeriodo: 'ACTIVO' | 'CERRADO' | 'ANULADO';
  creadoPor?: string;
  fechaCreacion?: string;
  modificadoPor?: string;
  fechaModificacion?: string;
  observaciones?: string;
}

// Formulación de Liquidación (Reglas de Negocio)
export interface FormulacionLiquidacion {
  id?: number;
  fuenteIngresoId: number;
  nombre: string;
  descripcion?: string;
  tipoObjetoTributario: string;  // 'PREDIO', 'ESTABLECIMIENTO', 'VEHICULO', etc.
  condicionesAplicacion: CondicionFormulacion[];
  parametrosRequeridos: ParametroFormulacion[];
  formulaPrincipal: string;
  formulasConceptos?: FormulaConcepto[];
  vigenciaDesde: string;
  vigenciaHasta?: string;
  prioridad?: number;
  activo: boolean;
  estado: 'BORRADOR' | 'ACTIVO' | 'INACTIVO' | 'HISTORICO';
  creadoPor?: string;
  fechaCreacion?: string;
}

export interface CondicionFormulacion {
  campo: string;
  operador: 'IGUAL' | 'DIFERENTE' | 'MAYOR' | 'MENOR' | 'MAYOR_IGUAL' | 'MENOR_IGUAL' | 'ENTRE' | 'EN_LISTA' | 'CONTIENE';
  valor: any;
  valorHasta?: any;  // Para operador ENTRE
  listaValores?: any[];  // Para operador EN_LISTA
}

export interface ParametroFormulacion {
  nombre: string;
  tipo: 'NUMERICO' | 'TEXTO' | 'FECHA' | 'BOOLEANO' | 'LISTA';
  obligatorio: boolean;
  descripcion?: string;
  valorPorDefecto?: any;
  origenDato?: 'OBJETO_TRIBUTARIO' | 'CONFIGURACION' | 'PARAMETRIZACION' | 'CALCULADO';
  campoObjeto?: string;  // Si origenDato es OBJETO_TRIBUTARIO
}

export interface FormulaConcepto {
  conceptoCobroId: number;
  conceptoNombre?: string;
  formula: string;
  orden: number;
}

// (Interfaz PeriodoFacturacion movida arriba - ver líneas 209-244)

// Facturación - Tipos de Facturación
// Representa la CONFIGURACIÓN de cómo se factura (plantillas, mensajes, códigos de barra)
// NO confundir con PeriodoFacturacion que son las CUOTAS/PERÍODOS de pago
export interface TipoFacturacion {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  fuenteIngresoId?: number;  // Si es específico de una fuente o null para usar en todas
  
  // Información Legal/DIAN
  resolucionDIAN?: string;  // Número de resolución (si aplica para facturación electrónica)
  fechaResolucionDIAN?: string;
  prefijoFactura?: string;  // Ej: "FPU" para Factura Predial Urbano
  numeroInicial?: number;
  numeroFinal?: number;
  numeroActual?: number;
  
  // Información de la Entidad
  nombreEntidad?: string;
  nitEntidad?: string;
  direccionEntidad?: string;
  telefonoEntidad?: string;
  emailEntidad?: string;
  logoEntidad?: string;  // URL o base64
  
  // Plantillas y Mensajes
  plantillaFactura?: string;  // HTML template
  mensajeEncabezado?: string;
  mensajePieFactura?: string;
  mensajeInstruccionesPago?: string;
  mensajeLegal?: string;  // Ej: "De conformidad con la Ley 1066 de 2006..."
  mensajesAdicionales?: MensajeFactura[];
  
  // Configuración de Pago
  formasPagoDisponibles: FormaPago[];
  incluirCodigoBarras: boolean;
  incluirCodigoQR: boolean;
  permitePagoParcial: boolean;
  valorMinimoPagoParcial?: number;
  
  // Intereses y Descuentos
  generaInteresesMora: boolean;
  porcentajeInteresesMora?: number;  // Ej: 2.13% mensual
  aplicaDescuentoProntoPago: boolean;
  porcentajeDescuentoProntoPago?: number;
  diasDescuentoProntoPago?: number;
  diasVencimiento: number;  // Días después de generación
  
  // Flujo de Aprobación
  requiereAprobacion: boolean;
  aprobadoPor?: string;
  fechaAprobacion?: string;
  
  // Notificaciones
  plantillaNotificacion?: string;  // Template para email/SMS
  enviarNotificacionEmail: boolean;
  enviarNotificacionSMS: boolean;
  
  // Validez
  vigenciaDesde: string;
  vigenciaHasta?: string;
  
  estado: 'BORRADOR' | 'ACTIVO' | 'INACTIVO' | 'HISTORICO';
  creadoPor?: string;
  fechaCreacion?: string;
  modificadoPor?: string;
  fechaModificacion?: string;
}

export interface MensajeFactura {
  tipo: 'INFORMATIVO' | 'ADVERTENCIA' | 'LEGAL' | 'PROMOCIONAL';
  ubicacion: 'ENCABEZADO' | 'CUERPO' | 'PIE' | 'REVERSO';
  texto: string;
  orden: number;
  activo: boolean;
}

export interface FormaPago {
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoCodigo: 'PERIODO_INDIVIDUAL' | 'ANUALIDAD_COMPLETA' | 'SALDO_TOTAL' | 'PERSONALIZADO';
  generaCodigoBarras: boolean;
  tipoCodigoBarras?: 'CODE128' | 'QR' | 'PDF417' | 'EAN13';
  formatoCodigo?: string;
  permitePagoEnLinea: boolean;
  urlPagoEnLinea?: string;
  cuentasBancarias?: CuentaBancaria[];
  instruccionesPago?: string;
  orden: number;
  activo: boolean;
}

export interface CuentaBancaria {
  banco: string;
  tipoCuenta: 'AHORROS' | 'CORRIENTE';
  numeroCuenta: string;
  titular: string;
  activa: boolean;
}

// Relación Liquidación-Facturación
export interface CuentaCobro {
  id?: number;
  liquidacionId: number;
  liquidacion?: Liquidacion;
  periodoFacturacionId: number;
  periodoFacturacion?: PeriodoFacturacion;
  numeroCuenta?: string;
  valorPeriodo: number;
  valorAcumulado?: number;
  saldoPendiente: number;
  conceptosIncluidos: ConceptoCuentaCobro[];
  estado: 'PENDIENTE' | 'GENERADA' | 'ENVIADA' | 'PAGADA' | 'VENCIDA' | 'ANULADA';
  facturaId?: number;
  fechaGeneracion?: string;
  fechaVencimiento?: string;
  codigosBarras?: CodigoBarraGenerado[];
}

export interface ConceptoCuentaCobro {
  conceptoCobroId: number;
  conceptoNombre: string;
  valor: number;
  aplicado: boolean;
}

export interface CodigoBarraGenerado {
  tipo: 'PERIODO_INDIVIDUAL' | 'ANUALIDAD_COMPLETA';
  codigo: string;
  valor: number;
  descripcion: string;
  imagenBase64?: string;
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

// Modelo genérico de respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface CampoDinamico {
  id: string;
  nombre: string;
  etiqueta: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'lista' | 'boolean' | 'moneda' | 'porcentaje' | 'email' | 'telefono';
  obligatorio: boolean;
  valorPorDefecto?: any;
  opciones?: string[]; // Para tipo 'lista'
  orden: number;
  grupo?: string;
  ayuda?: string;
  validaciones?: {
    min?: number;
    max?: number;
    pattern?: string;
    mensaje?: string;
  };
}

export interface ObjetoTributario {
  id?: number;
  fuenteId: number;
  tipoObjeto: string;
  codigo: string;
  valores: { [key: string]: any };
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface PlantillaCampos {
  tipoObjeto: string;
  camposBase: CampoDinamico[];
  camposPersonalizados: CampoDinamico[];
}

@Injectable({
  providedIn: 'root'
})
export class ObjetosTributariosService {
  // Plantillas predefinidas por tipo de objeto
  private plantillasPredefinidas: { [key: string]: CampoDinamico[] } = {
    'Predio': [
      { id: 'matricula', nombre: 'matricula', etiqueta: 'Matrícula Inmobiliaria', tipo: 'texto', obligatorio: true, orden: 1, grupo: 'Identificación' },
      { id: 'direccion', nombre: 'direccion', etiqueta: 'Dirección', tipo: 'texto', obligatorio: true, orden: 2, grupo: 'Ubicación' },
      { id: 'barrio', nombre: 'barrio', etiqueta: 'Barrio/Vereda', tipo: 'texto', obligatorio: true, orden: 3, grupo: 'Ubicación' },
      { id: 'estrato', nombre: 'estrato', etiqueta: 'Estrato', tipo: 'lista', obligatorio: true, orden: 4, grupo: 'Clasificación', opciones: ['1', '2', '3', '4', '5', '6'] },
      { id: 'avaluo', nombre: 'avaluo', etiqueta: 'Avalúo Catastral', tipo: 'moneda', obligatorio: true, orden: 5, grupo: 'Valoración', ayuda: 'Valor catastral del predio' },
      { id: 'area', nombre: 'area', etiqueta: 'Área (m²)', tipo: 'numero', obligatorio: true, orden: 6, grupo: 'Características', validaciones: { min: 0 } },
      { id: 'uso', nombre: 'uso', etiqueta: 'Uso del Suelo', tipo: 'lista', obligatorio: true, orden: 7, grupo: 'Clasificación', opciones: ['Residencial', 'Comercial', 'Industrial', 'Mixto', 'Lote'] },
      { id: 'propietario', nombre: 'propietario', etiqueta: 'Propietario', tipo: 'texto', obligatorio: true, orden: 8, grupo: 'Propietario' },
      { id: 'cedula', nombre: 'cedula', etiqueta: 'Cédula/NIT', tipo: 'texto', obligatorio: true, orden: 9, grupo: 'Propietario' },
      { id: 'telefono', nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'telefono', obligatorio: false, orden: 10, grupo: 'Contacto' },
      { id: 'email', nombre: 'email', etiqueta: 'Correo Electrónico', tipo: 'email', obligatorio: false, orden: 11, grupo: 'Contacto' }
    ],
    'Establecimiento': [
      { id: 'nit', nombre: 'nit', etiqueta: 'NIT', tipo: 'texto', obligatorio: true, orden: 1, grupo: 'Identificación' },
      { id: 'razonSocial', nombre: 'razonSocial', etiqueta: 'Razón Social', tipo: 'texto', obligatorio: true, orden: 2, grupo: 'Identificación' },
      { id: 'nombreComercial', nombre: 'nombreComercial', etiqueta: 'Nombre Comercial', tipo: 'texto', obligatorio: false, orden: 3, grupo: 'Identificación' },
      { id: 'direccion', nombre: 'direccion', etiqueta: 'Dirección', tipo: 'texto', obligatorio: true, orden: 4, grupo: 'Ubicación' },
      { id: 'actividadEconomica', nombre: 'actividadEconomica', etiqueta: 'Actividad Económica (CIIU)', tipo: 'texto', obligatorio: true, orden: 5, grupo: 'Actividad' },
      { id: 'ingresosAnuales', nombre: 'ingresosAnuales', etiqueta: 'Ingresos Anuales', tipo: 'moneda', obligatorio: true, orden: 6, grupo: 'Financiero' },
      { id: 'tarifaICA', nombre: 'tarifaICA', etiqueta: 'Tarifa ICA (%)', tipo: 'porcentaje', obligatorio: true, orden: 7, grupo: 'Tributario' },
      { id: 'representanteLegal', nombre: 'representanteLegal', etiqueta: 'Representante Legal', tipo: 'texto', obligatorio: true, orden: 8, grupo: 'Legal' },
      { id: 'telefono', nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'telefono', obligatorio: true, orden: 9, grupo: 'Contacto' },
      { id: 'email', nombre: 'email', etiqueta: 'Correo Electrónico', tipo: 'email', obligatorio: true, orden: 10, grupo: 'Contacto' }
    ],
    'Suscriptor': [
      { id: 'numeroSuscriptor', nombre: 'numeroSuscriptor', etiqueta: 'Número de Suscriptor', tipo: 'texto', obligatorio: true, orden: 1, grupo: 'Identificación' },
      { id: 'nombre', nombre: 'nombre', etiqueta: 'Nombre Completo', tipo: 'texto', obligatorio: true, orden: 2, grupo: 'Personal' },
      { id: 'cedula', nombre: 'cedula', etiqueta: 'Cédula', tipo: 'texto', obligatorio: true, orden: 3, grupo: 'Personal' },
      { id: 'direccion', nombre: 'direccion', etiqueta: 'Dirección del Servicio', tipo: 'texto', obligatorio: true, orden: 4, grupo: 'Ubicación' },
      { id: 'estrato', nombre: 'estrato', etiqueta: 'Estrato', tipo: 'lista', obligatorio: true, orden: 5, grupo: 'Clasificación', opciones: ['1', '2', '3', '4', '5', '6'] },
      { id: 'medidor', nombre: 'medidor', etiqueta: 'Número de Medidor', tipo: 'texto', obligatorio: false, orden: 6, grupo: 'Servicio' },
      { id: 'telefono', nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'telefono', obligatorio: false, orden: 7, grupo: 'Contacto' }
    ],
    'Obra': [
      { id: 'codigoObra', nombre: 'codigoObra', etiqueta: 'Código de Obra', tipo: 'texto', obligatorio: true, orden: 1, grupo: 'Identificación' },
      { id: 'nombreObra', nombre: 'nombreObra', etiqueta: 'Nombre de la Obra', tipo: 'texto', obligatorio: true, orden: 2, grupo: 'Identificación' },
      { id: 'tipoObra', nombre: 'tipoObra', etiqueta: 'Tipo de Obra', tipo: 'lista', obligatorio: true, orden: 3, grupo: 'Clasificación', opciones: ['Pavimentación', 'Acueducto', 'Alcantarillado', 'Espacio Público', 'Otra'] },
      { id: 'metrosLineales', nombre: 'metrosLineales', etiqueta: 'Metros Lineales', tipo: 'numero', obligatorio: true, orden: 4, grupo: 'Medidas' },
      { id: 'presupuesto', nombre: 'presupuesto', etiqueta: 'Presupuesto Total', tipo: 'moneda', obligatorio: true, orden: 5, grupo: 'Financiero' },
      { id: 'beneficiarios', nombre: 'beneficiarios', etiqueta: 'Número de Beneficiarios', tipo: 'numero', obligatorio: true, orden: 6, grupo: 'Beneficiarios' },
      { id: 'fechaInicio', nombre: 'fechaInicio', etiqueta: 'Fecha de Inicio', tipo: 'fecha', obligatorio: false, orden: 7, grupo: 'Cronograma' }
    ],
    'Permiso': [
      { id: 'numeroPermiso', nombre: 'numeroPermiso', etiqueta: 'Número de Permiso', tipo: 'texto', obligatorio: true, orden: 1, grupo: 'Identificación' },
      { id: 'tipoPermiso', nombre: 'tipoPermiso', etiqueta: 'Tipo de Permiso', tipo: 'lista', obligatorio: true, orden: 2, grupo: 'Clasificación', opciones: ['Temporal', 'Permanente', 'Eventual'] },
      { id: 'titular', nombre: 'titular', etiqueta: 'Titular del Permiso', tipo: 'texto', obligatorio: true, orden: 3, grupo: 'Titular' },
      { id: 'cedula', nombre: 'cedula', etiqueta: 'Cédula/NIT', tipo: 'texto', obligatorio: true, orden: 4, grupo: 'Titular' },
      { id: 'ubicacion', nombre: 'ubicacion', etiqueta: 'Ubicación', tipo: 'texto', obligatorio: true, orden: 5, grupo: 'Ubicación' },
      { id: 'areaOcupada', nombre: 'areaOcupada', etiqueta: 'Área Ocupada (m²)', tipo: 'numero', obligatorio: true, orden: 6, grupo: 'Medidas' },
      { id: 'fechaExpedicion', nombre: 'fechaExpedicion', etiqueta: 'Fecha de Expedición', tipo: 'fecha', obligatorio: true, orden: 7, grupo: 'Vigencia' },
      { id: 'fechaVencimiento', nombre: 'fechaVencimiento', etiqueta: 'Fecha de Vencimiento', tipo: 'fecha', obligatorio: true, orden: 8, grupo: 'Vigencia' }
    ]
  };

  obtenerPlantilla(tipoObjeto: string): CampoDinamico[] {
    return this.plantillasPredefinidas[tipoObjeto] || [];
  }

  validarCampo(campo: CampoDinamico, valor: any): { valido: boolean; mensaje?: string } {
    if (campo.obligatorio && (valor === null || valor === undefined || valor === '')) {
      return { valido: false, mensaje: `${campo.etiqueta} es obligatorio` };
    }

    if (campo.validaciones) {
      if (campo.validaciones.min !== undefined && valor < campo.validaciones.min) {
        return { valido: false, mensaje: `${campo.etiqueta} debe ser mayor o igual a ${campo.validaciones.min}` };
      }
      if (campo.validaciones.max !== undefined && valor > campo.validaciones.max) {
        return { valido: false, mensaje: `${campo.etiqueta} debe ser menor o igual a ${campo.validaciones.max}` };
      }
      if (campo.validaciones.pattern && !new RegExp(campo.validaciones.pattern).test(valor)) {
        return { valido: false, mensaje: campo.validaciones.mensaje || `${campo.etiqueta} tiene un formato inválido` };
      }
    }

    return { valido: true };
  }

  agruparCampos(campos: CampoDinamico[]): { [grupo: string]: CampoDinamico[] } {
    return campos.reduce((grupos, campo) => {
      const grupo = campo.grupo || 'General';
      if (!grupos[grupo]) {
        grupos[grupo] = [];
      }
      grupos[grupo].push(campo);
      return grupos;
    }, {} as { [grupo: string]: CampoDinamico[] });
  }
}

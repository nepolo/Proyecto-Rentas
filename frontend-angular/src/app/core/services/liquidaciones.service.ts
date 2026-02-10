import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Liquidacion, 
  FuenteIngreso, 
  ConceptoCobro, 
  TipoLiquidacion,
  AjusteLiquidacion,
  LiquidacionMasiva 
} from '../models';

export interface FiltrosLiquidacion {
  vigencia?: number;
  periodo?: number;
  estado?: string;
  contribuyenteId?: number;
  rentaId?: number;
  fuenteIngresoId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class LiquidacionesService {
  private apiUrl = environment.services.liquidaciones;

  constructor(private http: HttpClient) {}

  // ============ LIQUIDACIONES ============
  getLiquidaciones(filtros?: FiltrosLiquidacion): Observable<PaginatedResponse<Liquidacion>> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const value = (filtros as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<PaginatedResponse<Liquidacion>>(`${this.apiUrl}/liquidaciones`, { params });
  }

  getLiquidacion(id: number): Observable<Liquidacion> {
    return this.http.get<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}`);
  }

  createLiquidacion(liquidacion: Liquidacion): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones`, liquidacion);
  }

  updateLiquidacion(id: number, liquidacion: Partial<Liquidacion>): Observable<Liquidacion> {
    return this.http.put<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}`, liquidacion);
  }

  deleteLiquidacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/liquidaciones/${id}`);
  }

  aprobarLiquidacion(id: number, observaciones?: string): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}/aprobar`, { observaciones });
  }

  rechazarLiquidacion(id: number, motivo: string): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}/rechazar`, { motivo });
  }

  anularLiquidacion(id: number, motivo: string): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}/anular`, { motivo });
  }

  // ============ RELIQUIDACIÓN Y AJUSTES ============
  reliquidar(id: number, ajuste: AjusteLiquidacion): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}/reliquidar`, ajuste);
  }

  aplicarAjuste(id: number, ajuste: AjusteLiquidacion): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}/ajuste`, ajuste);
  }

  getHistorialAjustes(liquidacionId: number): Observable<AjusteLiquidacion[]> {
    return this.http.get<AjusteLiquidacion[]>(`${this.apiUrl}/liquidaciones/${liquidacionId}/ajustes`);
  }

  // ============ LIQUIDACIÓN MASIVA ============
  crearLiquidacionMasiva(configuracion: LiquidacionMasiva): Observable<LiquidacionMasiva> {
    return this.http.post<LiquidacionMasiva>(`${this.apiUrl}/liquidaciones/masivas`, configuracion);
  }

  ejecutarLiquidacionMasiva(id: number): Observable<LiquidacionMasiva> {
    return this.http.post<LiquidacionMasiva>(`${this.apiUrl}/liquidaciones/masivas/${id}/ejecutar`, {});
  }

  getProgresoLiquidacionMasiva(id: number): Observable<LiquidacionMasiva> {
    return this.http.get<LiquidacionMasiva>(`${this.apiUrl}/liquidaciones/masivas/${id}`);
  }

  getLiquidacionesMasivas(): Observable<LiquidacionMasiva[]> {
    return this.http.get<LiquidacionMasiva[]>(`${this.apiUrl}/liquidaciones/masivas`);
  }

  // ============ FUENTES DE INGRESO ============
  getFuentesIngreso(): Observable<FuenteIngreso[]> {
    return this.http.get<FuenteIngreso[]>(`${this.apiUrl}/fuentes-ingreso`);
  }

  getFuenteIngreso(id: number): Observable<FuenteIngreso> {
    return this.http.get<FuenteIngreso>(`${this.apiUrl}/fuentes-ingreso/${id}`);
  }

  createFuenteIngreso(fuente: FuenteIngreso): Observable<FuenteIngreso> {
    return this.http.post<FuenteIngreso>(`${this.apiUrl}/fuentes-ingreso`, fuente);
  }

  updateFuenteIngreso(id: number, fuente: Partial<FuenteIngreso>): Observable<FuenteIngreso> {
    return this.http.put<FuenteIngreso>(`${this.apiUrl}/fuentes-ingreso/${id}`, fuente);
  }

  deleteFuenteIngreso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fuentes-ingreso/${id}`);
  }

  // ============ CONCEPTOS DE COBRO ============
  getConceptosCobro(fuenteIngresoId?: number): Observable<ConceptoCobro[]> {
    const params = fuenteIngresoId ? new HttpParams().set('fuenteIngresoId', fuenteIngresoId) : undefined;
    return this.http.get<ConceptoCobro[]>(`${this.apiUrl}/conceptos-cobro`, { params });
  }

  getConceptoCobro(id: number): Observable<ConceptoCobro> {
    return this.http.get<ConceptoCobro>(`${this.apiUrl}/conceptos-cobro/${id}`);
  }

  createConceptoCobro(concepto: ConceptoCobro): Observable<ConceptoCobro> {
    return this.http.post<ConceptoCobro>(`${this.apiUrl}/conceptos-cobro`, concepto);
  }

  updateConceptoCobro(id: number, concepto: Partial<ConceptoCobro>): Observable<ConceptoCobro> {
    return this.http.put<ConceptoCobro>(`${this.apiUrl}/conceptos-cobro/${id}`, concepto);
  }

  deleteConceptoCobro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/conceptos-cobro/${id}`);
  }

  // ============ TIPOS DE LIQUIDACIÓN ============
  getTiposLiquidacion(): Observable<TipoLiquidacion[]> {
    return this.http.get<TipoLiquidacion[]>(`${this.apiUrl}/tipos-liquidacion`);
  }

  getTipoLiquidacion(id: number): Observable<TipoLiquidacion> {
    return this.http.get<TipoLiquidacion>(`${this.apiUrl}/tipos-liquidacion/${id}`);
  }

  createTipoLiquidacion(tipo: TipoLiquidacion): Observable<TipoLiquidacion> {
    return this.http.post<TipoLiquidacion>(`${this.apiUrl}/tipos-liquidacion`, tipo);
  }

  updateTipoLiquidacion(id: number, tipo: Partial<TipoLiquidacion>): Observable<TipoLiquidacion> {
    return this.http.put<TipoLiquidacion>(`${this.apiUrl}/tipos-liquidacion/${id}`, tipo);
  }

  deleteTipoLiquidacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tipos-liquidacion/${id}`);
  }

  // ============ CONSULTAS ESPECIALES ============
  getLiquidacionesByContribuyente(contribuyenteId: number): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.apiUrl}/liquidaciones/contribuyente/${contribuyenteId}`);
  }

  getLiquidacionesByRenta(rentaId: number, vigencia?: number, periodo?: number): Observable<Liquidacion[]> {
    let params = new HttpParams();
    if (vigencia) params = params.set('vigencia', vigencia);
    if (periodo) params = params.set('periodo', periodo);
    return this.http.get<Liquidacion[]>(`${this.apiUrl}/liquidaciones/renta/${rentaId}`, { params });
  }

  getEstadisticas(vigencia: number, periodo?: number): Observable<any> {
    let params = new HttpParams().set('vigencia', vigencia);
    if (periodo) params = params.set('periodo', periodo);
    return this.http.get(`${this.apiUrl}/liquidaciones/estadisticas`, { params });
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../models';

export interface FuenteIngreso {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'directos' | 'indirectos' | 'tasas' | 'otros';
  tipoObjeto?: string;
  activo?: boolean;
  estado?: 'activo' | 'inactivo' | 'configuracion';
  conceptosCount?: number;
  tiposCount?: number;
  liquidacionesCount?: number;
  objetosCount?: number;
  color?: string;
  icono?: string;
  vigencia?: number;
  fechaCreacion?: Date;
  creadoPor?: string;
}

export interface ConceptoCobroFuente {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  fuenteId: number;
  tipo: 'CAPITAL' | 'INTERES' | 'SOBRETASA';
  tarifaBase?: number;
  unidadMedida?: string;
  formula?: string;
  activo?: boolean;
  estado?: 'activo' | 'inactivo';
}

export interface TipoLiquidacionFuente {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  fuenteId: number;
  periodicidad: 'anual' | 'semestral' | 'trimestral' | 'mensual' | 'ocasional';
  conceptosAplicables?: number[];
  estado: 'activo' | 'inactivo';
}

@Injectable({
  providedIn: 'root'
})
export class FuentesService {
  private http = inject(HttpClient);
  private baseUrl = environment.services.fuentes;

  // Fuentes
  getFuentes(filtros?: any): Observable<FuenteIngreso[]> {
    let params = new HttpParams();
    if (filtros?.categoria) {
      params = params.append('categoria', filtros.categoria);
    }
    return this.http.get<FuenteIngreso[]>(this.baseUrl, { params });
  }

  getFuente(id: number): Observable<FuenteIngreso> {
    return this.http.get<FuenteIngreso>(`${this.baseUrl}/${id}`);
  }

  createFuente(fuente: FuenteIngreso): Observable<FuenteIngreso> {
    return this.http.post<FuenteIngreso>(this.baseUrl, fuente);
  }

  updateFuente(id: number, fuente: FuenteIngreso): Observable<FuenteIngreso> {
    return this.http.put<FuenteIngreso>(`${this.baseUrl}/${id}`, fuente);
  }

  deleteFuente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Conceptos por fuente
  getConceptosFuente(fuenteId: number): Observable<ConceptoCobroFuente[]> {
    return this.http.get<ConceptoCobroFuente[]>(`${this.baseUrl}/${fuenteId}/conceptos`);
  }

  createConceptoFuente(fuenteId: number, concepto: ConceptoCobroFuente): Observable<ConceptoCobroFuente> {
    return this.http.post<ConceptoCobroFuente>(`${this.baseUrl}/${fuenteId}/conceptos`, concepto);
  }

  updateConceptoFuente(fuenteId: number, conceptoId: number, concepto: ConceptoCobroFuente): Observable<ConceptoCobroFuente> {
    return this.http.put<ConceptoCobroFuente>(`${this.baseUrl}/${fuenteId}/conceptos/${conceptoId}`, concepto);
  }

  deleteConceptoFuente(fuenteId: number, conceptoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fuenteId}/conceptos/${conceptoId}`);
  }

  // Tipos por fuente
  getTiposFuente(fuenteId: number): Observable<TipoLiquidacionFuente[]> {
    return this.http.get<TipoLiquidacionFuente[]>(`${this.baseUrl}/${fuenteId}/tipos`);
  }

  createTipoFuente(fuenteId: number, tipo: TipoLiquidacionFuente): Observable<TipoLiquidacionFuente> {
    return this.http.post<TipoLiquidacionFuente>(`${this.baseUrl}/${fuenteId}/tipos`, tipo);
  }

  updateTipoFuente(fuenteId: number, tipoId: number, tipo: TipoLiquidacionFuente): Observable<TipoLiquidacionFuente> {
    return this.http.put<TipoLiquidacionFuente>(`${this.baseUrl}/${fuenteId}/tipos/${tipoId}`, tipo);
  }

  deleteTipoFuente(fuenteId: number, tipoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fuenteId}/tipos/${tipoId}`);
  }

  // Liquidaciones por fuente
  getLiquidacionesFuente(fuenteId: number, filtros?: any): Observable<PaginatedResponse<any>> {
    let params = new HttpParams();
    if (filtros) {
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
          params = params.append(key, filtros[key]);
        }
      });
    }
    return this.http.get<PaginatedResponse<any>>(`${this.baseUrl}/${fuenteId}/liquidaciones`, { params });
  }
}

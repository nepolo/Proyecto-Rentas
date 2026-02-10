import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardKPIs {
  totalRecaudo: number;
  totalFacturado: number;
  carteraActiva: number;
  contribuyentes: number;
  efectividad: number;
  variacionAnual: number;
}

export interface FuenteRecaudo {
  id: number;
  nombre: string;
  icono: string;
  color: string;
  objetos: number;
  facturado: number;
  recaudado: number;
  efectividad: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.services.dashboard;

  getKPIs(): Observable<DashboardKPIs> {
    return this.http.get<DashboardKPIs>(`${this.baseUrl}/kpis`);
  }

  getFuentesRecaudo(): Observable<FuenteRecaudo[]> {
    return this.http.get<FuenteRecaudo[]>(`${this.baseUrl}/fuentes-recaudo`);
  }
}

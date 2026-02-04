import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Liquidacion } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionesService {
  private apiUrl = environment.services.liquidaciones;

  constructor(private http: HttpClient) {}

  getLiquidaciones(): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.apiUrl}/liquidaciones`);
  }

  getLiquidacion(id: number): Observable<Liquidacion> {
    return this.http.get<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}`);
  }

  createLiquidacion(liquidacion: Liquidacion): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones`, liquidacion);
  }

  reliquidar(id: number, nuevaBaseGravable: number): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.apiUrl}/liquidaciones/${id}/reliquidar`, {
      nuevaBaseGravable
    });
  }

  getLiquidacionesByContribuyente(contribuyenteId: number): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(`${this.apiUrl}/liquidaciones/contribuyente/${contribuyenteId}`);
  }
}

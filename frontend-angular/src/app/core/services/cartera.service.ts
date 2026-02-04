import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EstadoCuenta } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private apiUrl = environment.services.cartera;

  constructor(private http: HttpClient) {}

  getEstadosCuenta(): Observable<EstadoCuenta[]> {
    return this.http.get<EstadoCuenta[]>(`${this.apiUrl}/cartera`);
  }

  getEstadoCuenta(id: number): Observable<EstadoCuenta> {
    return this.http.get<EstadoCuenta>(`${this.apiUrl}/cartera/${id}`);
  }

  createEstadoCuenta(estado: EstadoCuenta): Observable<EstadoCuenta> {
    return this.http.post<EstadoCuenta>(`${this.apiUrl}/cartera`, estado);
  }

  getEstadoCuentaByContribuyente(contribuyenteId: number): Observable<EstadoCuenta[]> {
    return this.http.get<EstadoCuenta[]>(`${this.apiUrl}/cartera/contribuyente/${contribuyenteId}`);
  }
}

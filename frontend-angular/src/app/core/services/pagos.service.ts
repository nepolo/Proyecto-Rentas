import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pago } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private apiUrl = environment.services.pagos;

  constructor(private http: HttpClient) {}

  getPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/pagos`);
  }

  getPago(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/pagos/${id}`);
  }

  createPago(pago: Pago): Observable<Pago> {
    return this.http.post<Pago>(`${this.apiUrl}/pagos`, pago);
  }

  aplicarPago(id: number): Observable<Pago> {
    return this.http.put<Pago>(`${this.apiUrl}/pagos/${id}/aplicar`, {});
  }

  getPagosByContribuyente(contribuyenteId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/pagos/contribuyente/${contribuyenteId}`);
  }
}

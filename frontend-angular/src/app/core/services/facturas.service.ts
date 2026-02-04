import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Factura } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private apiUrl = environment.services.facturas;

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.apiUrl}/facturas`);
  }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/facturas/${id}`);
  }

  createFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(`${this.apiUrl}/facturas`, factura);
  }

  anularFactura(id: number): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/facturas/${id}/anular`, {});
  }

  getFacturasByContribuyente(contribuyenteId: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.apiUrl}/facturas/contribuyente/${contribuyenteId}`);
  }
}

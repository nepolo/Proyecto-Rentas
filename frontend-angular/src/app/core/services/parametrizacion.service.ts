import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Renta } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParametrizacionService {
  private apiUrl = environment.services.parametrizacion;

  constructor(private http: HttpClient) {}

  getRentas(): Observable<Renta[]> {
    return this.http.get<Renta[]>(`${this.apiUrl}/rentas`);
  }

  getRenta(id: number): Observable<Renta> {
    return this.http.get<Renta>(`${this.apiUrl}/rentas/${id}`);
  }

  createRenta(renta: Renta): Observable<Renta> {
    return this.http.post<Renta>(`${this.apiUrl}/rentas`, renta);
  }

  updateRenta(id: number, renta: Renta): Observable<Renta> {
    return this.http.put<Renta>(`${this.apiUrl}/rentas/${id}`, renta);
  }

  deleteRenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rentas/${id}`);
  }
}

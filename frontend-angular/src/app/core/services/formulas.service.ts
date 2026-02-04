import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Formula } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FormulasService {
  private apiUrl = environment.services.formulas;

  constructor(private http: HttpClient) {}

  getFormulas(): Observable<Formula[]> {
    return this.http.get<Formula[]>(`${this.apiUrl}/formulas`);
  }

  getFormula(id: number): Observable<Formula> {
    return this.http.get<Formula>(`${this.apiUrl}/formulas/${id}`);
  }

  createFormula(formula: Formula): Observable<Formula> {
    return this.http.post<Formula>(`${this.apiUrl}/formulas`, formula);
  }

  updateFormula(id: number, formula: Formula): Observable<Formula> {
    return this.http.put<Formula>(`${this.apiUrl}/formulas/${id}`, formula);
  }

  deleteFormula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/formulas/${id}`);
  }

  evaluarFormula(expresion: string, baseGravable: number, tarifa: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/formulas/evaluar`, {
      expresion,
      baseGravable,
      tarifa
    });
  }
}

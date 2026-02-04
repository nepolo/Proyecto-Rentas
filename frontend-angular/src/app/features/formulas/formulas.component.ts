import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulasService } from '../../core/services/formulas.service';
import { Formula } from '../../core/models';

@Component({
  selector: 'app-formulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>🧮 Motor de Fórmulas</h2>
      <button class="btn btn-primary" (click)="showForm = !showForm">Nueva Fórmula</button>
      
      <div *ngIf="showForm" class="card">
        <h3>Crear Fórmula</h3>
        <div class="form-group">
          <label>Nombre</label>
          <input class="form-control" [(ngModel)]="currentFormula.nombre">
        </div>
        <div class="form-group">
          <label>Expresión</label>
          <input class="form-control" [(ngModel)]="currentFormula.expresion" placeholder="Ej: BASE_GRAVABLE * TARIFA">
        </div>
        <div class="form-group">
          <label>Versión</label>
          <input class="form-control" [(ngModel)]="currentFormula.version" placeholder="1.0">
        </div>
        <button class="btn btn-success" (click)="saveFormula()">Guardar</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Expresión</th>
            <th>Versión</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let formula of formulas">
            <td>{{formula.id}}</td>
            <td>{{formula.nombre}}</td>
            <td>{{formula.expresion}}</td>
            <td>{{formula.version}}</td>
            <td><span class="badge">{{formula.estado}}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; }
    .badge { padding: 4px 8px; border-radius: 4px; background: #4caf50; color: white; font-size: 12px; }
  `]
})
export class FormulasComponent implements OnInit {
  formulas: Formula[] = [];
  showForm = false;
  currentFormula: Formula = {
    nombre: '',
    expresion: '',
    version: '1.0',
    vigenciaDesde: new Date().toISOString(),
    estado: 'ACTIVA',
    creadoPor: 'admin'
  };

  constructor(private formulasService: FormulasService) {}

  ngOnInit() {
    this.loadFormulas();
  }

  loadFormulas() {
    this.formulasService.getFormulas().subscribe({
      next: (data: any) => this.formulas = data,
      error: (err: any) => console.error(err)
    });
  }

  saveFormula() {
    this.formulasService.createFormula(this.currentFormula).subscribe({
      next: () => {
        this.loadFormulas();
        this.showForm = false;
      }
    });
  }
}

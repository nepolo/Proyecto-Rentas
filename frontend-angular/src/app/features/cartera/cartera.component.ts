import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarteraService } from '../../core/services/cartera.service';
import { EstadoCuenta } from '../../core/models';

@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>💼 Gestión de Cartera</h2>
      <button class="btn btn-primary" (click)="showForm = !showForm">Nuevo Estado de Cuenta</button>
      
      <div *ngIf="showForm" class="card">
        <h3>Crear Estado de Cuenta</h3>
        <div class="form-group">
          <label>Contribuyente ID</label>
          <input type="number" class="form-control" [(ngModel)]="currentEstado.contribuyenteId">
        </div>
        <div class="form-group">
          <label>Saldo Total</label>
          <input type="number" class="form-control" [(ngModel)]="currentEstado.saldoTotal">
        </div>
        <div class="form-group">
          <label>Saldo Vencido</label>
          <input type="number" class="form-control" [(ngModel)]="currentEstado.saldoVencido">
        </div>
        <div class="form-group">
          <label>Intereses Mora</label>
          <input type="number" class="form-control" [(ngModel)]="currentEstado.interesesMora">
        </div>
        <button class="btn btn-success" (click)="saveEstado()">Guardar</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Contribuyente</th>
            <th>Saldo Total</th>
            <th>Saldo Vencido</th>
            <th>Intereses Mora</th>
            <th>Estado</th>
            <th>Fecha Consulta</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let estado of estados">
            <td>{{estado.id}}</td>
            <td>{{estado.contribuyenteId}}</td>
            <td><strong>{{estado.saldoTotal | number}}</strong></td>
            <td class="text-danger">{{estado.saldoVencido | number}}</td>
            <td class="text-warning">{{estado.interesesMora | number}}</td>
            <td><span class="badge">{{estado.estado}}</span></td>
            <td>{{estado.fechaConsulta}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; }
    .badge { padding: 4px 8px; border-radius: 4px; background: #9c27b0; color: white; font-size: 12px; }
    .text-danger { color: #f44336; }
    .text-warning { color: #ff9800; }
  `]
})
export class CarteraComponent implements OnInit {
  estados: EstadoCuenta[] = [];
  showForm = false;
  currentEstado: EstadoCuenta = {
    contribuyenteId: 1,
    saldoTotal: 0,
    saldoVencido: 0,
    interesesMora: 0,
    estado: 'ACTIVO'
  };

  constructor(private carteraService: CarteraService) {}

  ngOnInit() {
    this.loadEstados();
  }

  loadEstados() {
    this.carteraService.getEstadosCuenta().subscribe({
      next: (data: any) => this.estados = data,
      error: (err: any) => console.error(err)
    });
  }

  saveEstado() {
    this.carteraService.createEstadoCuenta(this.currentEstado).subscribe({
      next: () => {
        this.loadEstados();
        this.showForm = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiquidacionesService } from '../../core/services/liquidaciones.service';
import { Liquidacion } from '../../core/models';

@Component({
  selector: 'app-liquidaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>📝 Liquidaciones Tributarias</h2>
      <button class="btn btn-primary" (click)="showForm = !showForm">Nueva Liquidación</button>
      
      <div *ngIf="showForm" class="card">
        <h3>Crear Liquidación</h3>
        <div class="form-group">
          <label>Contribuyente ID</label>
          <input type="number" class="form-control" [(ngModel)]="currentLiquidacion.contribuyenteId">
        </div>
        <div class="form-group">
          <label>Renta ID</label>
          <input type="number" class="form-control" [(ngModel)]="currentLiquidacion.rentaId">
        </div>
        <div class="form-group">
          <label>Base Gravable</label>
          <input type="number" class="form-control" [(ngModel)]="currentLiquidacion.baseGravable">
        </div>
        <div class="form-group">
          <label>Tarifa</label>
          <input type="number" step="0.01" class="form-control" [(ngModel)]="currentLiquidacion.tarifa">
        </div>
        <button class="btn btn-success" (click)="saveLiquidacion()">Liquidar</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Contribuyente</th>
            <th>Vigencia/Periodo</th>
            <th>Base Gravable</th>
            <th>Valor Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let liq of liquidaciones">
            <td>{{liq.numeroLiquidacion}}</td>
            <td>{{liq.contribuyenteId}}</td>
            <td>{{liq.vigencia}}/{{liq.periodo}}</td>
            <td>{{liq.baseGravable | number}}</td>
            <td><strong>{{liq.valorTotal | number}}</strong></td>
            <td><span class="badge">{{liq.estado}}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; }
    .badge { padding: 4px 8px; border-radius: 4px; background: #ff9800; color: white; font-size: 12px; }
  `]
})
export class LiquidacionesComponent implements OnInit {
  liquidaciones: Liquidacion[] = [];
  showForm = false;
  currentLiquidacion: Liquidacion = {
    contribuyenteId: 1,
    rentaId: 1,
    periodo: 1,
    vigencia: 2024,
    baseGravable: 0,
    tarifa: 0.01,
    valorImpuesto: 0,
    valorTotal: 0,
    estado: 'PENDIENTE',
    tipoLiquidacion: 'INDIVIDUAL',
    liquidadoPor: 'admin'
  };

  constructor(private liquidacionesService: LiquidacionesService) {}

  ngOnInit() {
    this.loadLiquidaciones();
  }

  loadLiquidaciones() {
    this.liquidacionesService.getLiquidaciones().subscribe({
      next: (data: any) => this.liquidaciones = data,
      error: (err: any) => console.error(err)
    });
  }

  saveLiquidacion() {
    this.currentLiquidacion.valorImpuesto = this.currentLiquidacion.baseGravable * this.currentLiquidacion.tarifa;
    this.currentLiquidacion.valorTotal = this.currentLiquidacion.valorImpuesto;
    
    this.liquidacionesService.createLiquidacion(this.currentLiquidacion).subscribe({
      next: () => {
        this.loadLiquidaciones();
        this.showForm = false;
      }
    });
  }
}

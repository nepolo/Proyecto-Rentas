import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../../core/services/pagos.service';
import { Pago } from '../../core/models';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>💰 Recaudo y Pagos</h2>
      <button class="btn btn-primary" (click)="showForm = !showForm">Registrar Pago</button>
      
      <div *ngIf="showForm" class="card">
        <h3>Registrar Pago</h3>
        <div class="form-group">
          <label>Factura ID</label>
          <input type="number" class="form-control" [(ngModel)]="currentPago.facturaId">
        </div>
        <div class="form-group">
          <label>Contribuyente ID</label>
          <input type="number" class="form-control" [(ngModel)]="currentPago.contribuyenteId">
        </div>
        <div class="form-group">
          <label>Valor Pagado</label>
          <input type="number" class="form-control" [(ngModel)]="currentPago.valorPagado">
        </div>
        <div class="form-group">
          <label>Medio de Pago</label>
          <select class="form-control" [(ngModel)]="currentPago.medioPago">
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="PSE">PSE</option>
          </select>
        </div>
        <button class="btn btn-success" (click)="savePago()">Registrar</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Recibo</th>
            <th>Factura ID</th>
            <th>Contribuyente</th>
            <th>Valor Pagado</th>
            <th>Medio</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let pago of pagos">
            <td><strong>{{pago.numeroRecibo}}</strong></td>
            <td>{{pago.facturaId}}</td>
            <td>{{pago.contribuyenteId}}</td>
            <td>{{pago.valorPagado | number}}</td>
            <td>{{pago.medioPago}}</td>
            <td><span class="badge">{{pago.estado}}</span></td>
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
export class PagosComponent implements OnInit {
  pagos: Pago[] = [];
  showForm = false;
  currentPago: Pago = {
    facturaId: 1,
    contribuyenteId: 1,
    valorPagado: 0,
    medioPago: 'TRANSFERENCIA',
    tipoPago: 'TOTAL',
    estado: 'PENDIENTE',
    registradoPor: 'admin'
  };

  constructor(private pagosService: PagosService) {}

  ngOnInit() {
    this.loadPagos();
  }

  loadPagos() {
    this.pagosService.getPagos().subscribe({
      next: (data: any) => this.pagos = data,
      error: (err: any) => console.error(err)
    });
  }

  savePago() {
    this.pagosService.createPago(this.currentPago).subscribe({
      next: () => {
        this.loadPagos();
        this.showForm = false;
      }
    });
  }
}

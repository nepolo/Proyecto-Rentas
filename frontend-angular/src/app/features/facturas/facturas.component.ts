import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturasService } from '../../core/services/facturas.service';
import { Factura } from '../../core/models';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>📄 Facturación Electrónica</h2>
      <button class="btn btn-primary" (click)="showForm = !showForm">Nueva Factura</button>
      
      <div *ngIf="showForm" class="card">
        <h3>Generar Factura</h3>
        <div class="form-group">
          <label>Liquidación ID</label>
          <input type="number" class="form-control" [(ngModel)]="currentFactura.liquidacionId">
        </div>
        <div class="form-group">
          <label>Contribuyente ID</label>
          <input type="number" class="form-control" [(ngModel)]="currentFactura.contribuyenteId">
        </div>
        <div class="form-group">
          <label>Valor Total</label>
          <input type="number" class="form-control" [(ngModel)]="currentFactura.valorTotal">
        </div>
        <div class="form-group">
          <label>Fecha Vencimiento</label>
          <input type="date" class="form-control" [(ngModel)]="currentFactura.fechaVencimiento">
        </div>
        <button class="btn btn-success" (click)="saveFactura()">Generar</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Número Factura</th>
            <th>Contribuyente</th>
            <th>Valor Total</th>
            <th>Fecha Vencimiento</th>
            <th>Estado</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let factura of facturas">
            <td><strong>{{factura.numeroFactura}}</strong></td>
            <td>{{factura.contribuyenteId}}</td>
            <td>{{factura.valorTotal | number}}</td>
            <td>{{factura.fechaVencimiento}}</td>
            <td><span class="badge">{{factura.estado}}</span></td>
            <td><code>{{factura.codigoQR}}</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; }
    .badge { padding: 4px 8px; border-radius: 4px; background: #2196f3; color: white; font-size: 12px; }
  `]
})
export class FacturasComponent implements OnInit {
  facturas: Factura[] = [];
  showForm = false;
  currentFactura: Factura = {
    liquidacionId: 1,
    contribuyenteId: 1,
    valorTotal: 0,
    fechaVencimiento: new Date().toISOString().split('T')[0],
    estado: 'EMITIDA',
    emitidoPor: 'admin'
  };

  constructor(private facturasService: FacturasService) {}

  ngOnInit() {
    this.loadFacturas();
  }

  loadFacturas() {
    this.facturasService.getFacturas().subscribe({
      next: (data: any) => this.facturas = data,
      error: (err: any) => console.error(err)
    });
  }

  saveFactura() {
    this.facturasService.createFactura(this.currentFactura).subscribe({
      next: () => {
        this.loadFacturas();
        this.showForm = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrizacionService } from '../../core/services/parametrizacion.service';
import { LiquidacionesService } from '../../core/services/liquidaciones.service';
import { FacturasService } from '../../core/services/facturas.service';
import { PagosService } from '../../core/services/pagos.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = {
    totalRentas: 0,
    liquidacionesPendientes: 0,
    facturasPendientes: 0,
    pagosHoy: 0,
    saldoTotal: 0
  };

  loading = true;

  constructor(
    private parametrizacionService: ParametrizacionService,
    private liquidacionesService: LiquidacionesService,
    private facturasService: FacturasService,
    private pagosService: PagosService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Cargar estadísticas
    this.parametrizacionService.getRentas().subscribe({
      next: (rentas) => {
        this.stats.totalRentas = rentas.length;
      }
    });

    this.liquidacionesService.getLiquidaciones().subscribe({
      next: (liquidaciones) => {
        this.stats.liquidacionesPendientes = liquidaciones.filter(l => l.estado === 'PENDIENTE').length;
      }
    });

    this.facturasService.getFacturas().subscribe({
      next: (facturas) => {
        this.stats.facturasPendientes = facturas.filter(f => f.estado === 'EMITIDA').length;
      }
    });

    this.pagosService.getPagos().subscribe({
      next: (pagos) => {
        const hoy = new Date().toISOString().split('T')[0];
        this.stats.pagosHoy = pagos.filter(p => p.fechaPago?.startsWith(hoy)).length;
        this.stats.saldoTotal = pagos.reduce((sum, p) => sum + p.valorPagado, 0);
        this.loading = false;
      }
    });
  }
}

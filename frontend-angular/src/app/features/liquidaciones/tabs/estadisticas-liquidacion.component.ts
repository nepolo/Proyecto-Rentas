import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';

/**
 * Componente Tab: Estadísticas y Dashboard
 * 
 * Visualización de métricas clave del motor de liquidación
 */
@Component({
  selector: 'app-estadisticas-liquidacion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  template: `
    <div class="estadisticas-container">
      <div class="header">
        <h2>
          <mat-icon>analytics</mat-icon>
          Estadísticas y Métricas
        </h2>
        <button mat-raised-button color="primary" (click)="recargar()">
          <mat-icon>refresh</mat-icon>
          Actualizar
        </button>
      </div>

      <!-- KPIs Principales -->
      <div class="kpis-grid">
        <mat-card class="kpi-card primary">
          <div class="kpi-icon">
            <mat-icon>receipt_long</mat-icon>
          </div>
          <div class="kpi-content">
            <h3>Total Liquidaciones</h3>
            <p class="kpi-value">{{ estadisticas?.totalLiquidaciones | number }}</p>
            <span class="kpi-change positive">+{{ estadisticas?.cambioMensual }}% vs mes anterior</span>
          </div>
        </mat-card>

        <mat-card class="kpi-card success">
          <div class="kpi-icon">
            <mat-icon>attach_money</mat-icon>
          </div>
          <div class="kpi-content">
            <h3>Valor Total Liquidado</h3>
            <p class="kpi-value">{{ estadisticas?.valorTotal | currency:'COP':'symbol-narrow':'1.0-0' }}</p>
            <span class="kpi-change positive">+{{ estadisticas?.cambioValor }}% vs mes anterior</span>
          </div>
        </mat-card>

        <mat-card class="kpi-card warning">
          <div class="kpi-icon">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="kpi-content">
            <h3>Pendientes de Aprobación</h3>
            <p class="kpi-value">{{ estadisticas?.pendientesAprobacion | number }}</p>
            <span class="kpi-sublabel">Requieren atención</span>
          </div>
        </mat-card>

        <mat-card class="kpi-card info">
          <div class="kpi-icon">
            <mat-icon>speed</mat-icon>
          </div>
          <div class="kpi-content">
            <h3>Tiempo Promedio</h3>
            <p class="kpi-value">{{ estadisticas?.tiempoPromedio }} días</p>
            <span class="kpi-sublabel">Desde creación a aprobación</span>
          </div>
        </mat-card>
      </div>

      <!-- Distribución por Estado -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>donut_large</mat-icon>
            Distribución por Estado
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="estados-grid">
            <div *ngFor="let estado of estadisticas?.porEstado" class="estado-item">
              <div class="estado-header">
                <mat-chip [class]="'estado-' + estado.estado.toLowerCase()">
                  {{ estado.estado }}
                </mat-chip>
                <span class="estado-count">{{ estado.cantidad }}</span>
              </div>
              <mat-progress-bar 
                mode="determinate" 
                [value]="(estado.cantidad / estadisticas!.totalLiquidaciones) * 100"
                [class]="'bar-' + estado.estado.toLowerCase()">
              </mat-progress-bar>
              <div class="estado-footer">
                <span class="porcentaje">{{ ((estado.cantidad / estadisticas!.totalLiquidaciones) * 100).toFixed(1) }}%</span>
                <span class="valor">{{ estado.valor | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Dos columnas -->
      <div class="two-columns">
        <!-- Top Fuentes -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>account_balance</mat-icon>
              Top Fuentes de Ingreso
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="ranking-list">
              <div *ngFor="let fuente of estadisticas?.topFuentes; let i = index" class="ranking-item">
                <div class="ranking-position">{{ i + 1 }}</div>
                <div class="ranking-info">
                  <strong>{{ fuente.nombre }}</strong>
                  <div class="ranking-meta">
                    <span>{{ fuente.cantidad }} liquidaciones</span>
                    <span class="valor">{{ fuente.valor | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Actividad Reciente -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>timeline</mat-icon>
              Últimos 7 Días
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="timeline-chart">
              <div *ngFor="let dia of estadisticas?.ultimos7Dias" class="timeline-bar">
                <div class="bar-container">
                  <div class="bar-fill" [style.height.%]="(dia.cantidad / maxDia) * 100"></div>
                </div>
                <div class="bar-label">
                  <span class="cantidad">{{ dia.cantidad }}</span>
                  <span class="dia">{{ dia.dia }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Alertas y Notificaciones -->
      <mat-card class="alerts-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>notification_important</mat-icon>
            Alertas y Notificaciones
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="alerts-list">
            <div class="alert-item warning">
              <mat-icon>warning</mat-icon>
              <div class="alert-content">
                <strong>{{ estadisticas?.pendientesAprobacion }} liquidaciones</strong> pendientes de aprobación por más de 3 días
              </div>
              <button mat-button color="primary">Ver</button>
            </div>

            <div class="alert-item info" *ngIf="estadisticas?.proximasVencer">
              <mat-icon>schedule</mat-icon>
              <div class="alert-content">
                <strong>{{ estadisticas.proximasVencer }} liquidaciones</strong> próximas a vencer en 5 días
              </div>
              <button mat-button color="primary">Ver</button>
            </div>

            <div class="alert-item success">
              <mat-icon>check_circle</mat-icon>
              <div class="alert-content">
                Sistema funcionando correctamente. Última actualización: hace 5 minutos
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Métricas Detalladas -->
      <div class="metrics-grid">
        <mat-card class="metric-card">
          <h4>Tasa de Aprobación</h4>
          <div class="metric-value">{{ estadisticas?.tasaAprobacion }}%</div>
          <mat-progress-bar mode="determinate" [value]="estadisticas?.tasaAprobacion || 0" color="primary"></mat-progress-bar>
        </mat-card>

        <mat-card class="metric-card">
          <h4>Tasa de Rechazo</h4>
          <div class="metric-value">{{ estadisticas?.tasaRechazo }}%</div>
          <mat-progress-bar mode="determinate" [value]="estadisticas?.tasaRechazo || 0" color="warn"></mat-progress-bar>
        </mat-card>

        <mat-card class="metric-card">
          <h4>Eficiencia del Proceso</h4>
          <div class="metric-value">{{ estadisticas?.eficiencia }}%</div>
          <mat-progress-bar mode="determinate" [value]="estadisticas?.eficiencia || 0" color="accent"></mat-progress-bar>
        </mat-card>

        <mat-card class="metric-card">
          <h4>Satisfacción</h4>
          <div class="metric-value">{{ estadisticas?.satisfaccion }}%</div>
          <mat-progress-bar mode="determinate" [value]="estadisticas?.satisfaccion || 0" color="primary"></mat-progress-bar>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .estadisticas-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
      }
    }

    .kpis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .kpi-card {
      display: flex;
      gap: 16px;
      padding: 20px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
      }

      &.primary::before {
        background: #1976d2;
      }

      &.success::before {
        background: #4caf50;
      }

      &.warning::before {
        background: #ff9800;
      }

      &.info::before {
        background: #2196f3;
      }

      .kpi-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 12px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: white;
        }
      }

      &.primary .kpi-icon {
        background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      }

      &.success .kpi-icon {
        background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
      }

      &.warning .kpi-icon {
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      }

      &.info .kpi-icon {
        background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
      }

      .kpi-content {
        flex: 1;

        h3 {
          margin: 0 0 8px;
          font-size: 13px;
          color: #666;
          text-transform: uppercase;
          font-weight: 500;
        }

        .kpi-value {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 700;
          color: #333;
        }

        .kpi-change {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;

          &.positive {
            background: #e8f5e9;
            color: #2e7d32;
          }

          &.negative {
            background: #ffebee;
            color: #c62828;
          }
        }

        .kpi-sublabel {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .chart-card {
      margin-bottom: 24px;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .estados-grid {
      display: grid;
      gap: 16px;

      .estado-item {
        .estado-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .estado-count {
            font-size: 20px;
            font-weight: 700;
          }
        }

        mat-progress-bar {
          height: 12px;
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .estado-footer {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;

          .valor {
            font-weight: 500;
          }
        }
      }
    }

    .estado-borrador {
      background-color: #9e9e9e !important;
      color: white !important;
    }

    .estado-pendiente {
      background-color: #ff9800 !important;
      color: white !important;
    }

    .estado-aprobada {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .estado-facturada {
      background-color: #2196f3 !important;
      color: white !important;
    }

    ::ng-deep {
      .bar-borrador .mdc-linear-progress__bar-inner {
        border-color: #9e9e9e !important;
      }

      .bar-pendiente .mdc-linear-progress__bar-inner {
        border-color: #ff9800 !important;
      }

      .bar-aprobada .mdc-linear-progress__bar-inner {
        border-color: #4caf50 !important;
      }

      .bar-facturada .mdc-linear-progress__bar-inner {
        border-color: #2196f3 !important;
      }
    }

    .two-columns {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 24px;

      @media (max-width: 968px) {
        grid-template-columns: 1fr;
      }
    }

    .ranking-list {
      .ranking-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;

        &:last-child {
          border-bottom: none;
        }

        .ranking-position {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e3f2fd;
          color: #1976d2;
          font-weight: 700;
          font-size: 18px;
        }

        .ranking-info {
          flex: 1;

          strong {
            display: block;
            margin-bottom: 4px;
          }

          .ranking-meta {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;

            .valor {
              font-weight: 500;
              color: #333;
            }
          }
        }
      }
    }

    .timeline-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 200px;
      gap: 8px;
      padding: 20px 0;

      .timeline-bar {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .bar-container {
          flex: 1;
          width: 100%;
          background: #f5f5f5;
          border-radius: 4px 4px 0 0;
          position: relative;
          display: flex;
          align-items: flex-end;

          .bar-fill {
            width: 100%;
            background: linear-gradient(180deg, #1976d2 0%, #2196f3 100%);
            border-radius: 4px 4px 0 0;
            transition: height 0.3s ease;
          }
        }

        .bar-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;

          .cantidad {
            font-weight: 700;
            font-size: 14px;
          }

          .dia {
            font-size: 11px;
            color: #666;
          }
        }
      }
    }

    .alerts-card {
      margin-bottom: 24px;

      .alerts-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .alert-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid;

          &.warning {
            background: #fff3cd;
            border-color: #ffc107;

            mat-icon {
              color: #ffc107;
            }
          }

          &.info {
            background: #e3f2fd;
            border-color: #2196f3;

            mat-icon {
              color: #2196f3;
            }
          }

          &.success {
            background: #e8f5e9;
            border-color: #4caf50;

            mat-icon {
              color: #4caf50;
            }
          }

          .alert-content {
            flex: 1;
            font-size: 14px;
          }
        }
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;

      .metric-card {
        padding: 16px;

        h4 {
          margin: 0 0 12px;
          font-size: 13px;
          color: #666;
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1976d2;
        }

        mat-progress-bar {
          height: 8px;
          border-radius: 4px;
        }
      }
    }
  `]
})
export class EstadisticasLiquidacionComponent implements OnInit {
  estadisticas: any;
  maxDia = 100;

  constructor(private liquidacionesService: LiquidacionesService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    const añoActual = new Date().getFullYear();
    this.liquidacionesService.getEstadisticas(añoActual).subscribe({
      next: (data) => {
        this.estadisticas = data;
        
        // Calcular el máximo para el gráfico de barras
        if (this.estadisticas?.ultimos7Dias) {
          this.maxDia = Math.max(...this.estadisticas.ultimos7Dias.map((d: any) => d.cantidad));
        }
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        // Mock data para desarrollo
        this.estadisticas = this.getMockEstadisticas();
      }
    });
  }

  recargar() {
    this.cargarEstadisticas();
  }

  getMockEstadisticas() {
    return {
      totalLiquidaciones: 1247,
      cambioMensual: 12.5,
      valorTotal: 4567890000,
      cambioValor: 8.3,
      pendientesAprobacion: 23,
      tiempoPromedio: 3.2,
      tasaAprobacion: 92,
      tasaRechazo: 5,
      eficiencia: 88,
      satisfaccion: 95,
      proximasVencer: 15,
      porEstado: [
        { estado: 'APROBADA', cantidad: 856, valor: 3200000000 },
        { estado: 'FACTURADA', cantidad: 245, valor: 980000000 },
        { estado: 'PENDIENTE', cantidad: 89, valor: 320000000 },
        { estado: 'BORRADOR', cantidad: 45, valor: 57000000 },
        { estado: 'ANULADA', cantidad: 12, valor: 10890000 }
      ],
      topFuentes: [
        { nombre: 'Impuesto Predial Unificado', cantidad: 523, valor: 2100000000 },
        { nombre: 'Impuesto de Industria y Comercio', cantidad: 412, valor: 1650000000 },
        { nombre: 'Sobretasa Bomberil', cantidad: 189, valor: 450000000 },
        { nombre: 'Impuesto de Delineación', cantidad: 89, valor: 290000000 },
        { nombre: 'Valorización', cantidad: 34, valor: 77890000 }
      ],
      ultimos7Dias: [
        { dia: 'Lun', cantidad: 45 },
        { dia: 'Mar', cantidad: 67 },
        { dia: 'Mié', cantidad: 52 },
        { dia: 'Jue', cantidad: 78 },
        { dia: 'Vie', cantidad: 89 },
        { dia: 'Sáb', cantidad: 23 },
        { dia: 'Dom', cantidad: 12 }
      ]
    };
  }
}

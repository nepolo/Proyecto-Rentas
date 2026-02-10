import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

interface LogAuditoria {
  id: number;
  fecha: Date;
  usuario: string;
  modulo: string;
  accion: string;
  descripcion: string;
  ip: string;
  nivel: 'info' | 'warning' | 'error' | 'success';
}

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  template: `
    <div class="auditoria-container">
      <div class="page-header">
        <h1>
          <mat-icon>history</mat-icon>
          Auditoría y Trazabilidad
        </h1>
        <p class="subtitle">Registro completo de operaciones y cambios en el sistema</p>
      </div>

      <!-- Filtros -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-grid">
            <mat-form-field appearance="outline">
              <mat-label>Módulo</mat-label>
              <mat-select [(ngModel)]="filtroModulo">
                <mat-option value="">Todos</mat-option>
                <mat-option value="usuarios">Usuarios</mat-option>
                <mat-option value="liquidaciones">Liquidaciones</mat-option>
                <mat-option value="fuentes">Fuentes</mat-option>
                <mat-option value="configuracion">Configuración</mat-option>
                <mat-option value="objetos">Objetos Tributarios</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput [(ngModel)]="filtroUsuario" placeholder="Nombre de usuario">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha Desde</mat-label>
              <input matInput [matDatepicker]="pickerDesde" [(ngModel)]="filtroFechaDesde">
              <mat-datepicker-toggle matIconSuffix [for]="pickerDesde"></mat-datepicker-toggle>
              <mat-datepicker #pickerDesde></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha Hasta</mat-label>
              <input matInput [matDatepicker]="pickerHasta" [(ngModel)]="filtroFechaHasta">
              <mat-datepicker-toggle matIconSuffix [for]="pickerHasta"></mat-datepicker-toggle>
              <mat-datepicker #pickerHasta></mat-datepicker>
            </mat-form-field>
          </div>
          <div class="filter-actions">
            <button mat-raised-button color="primary" (click)="aplicarFiltros()">
              <mat-icon>search</mat-icon>
              Buscar
            </button>
            <button mat-button (click)="limpiarFiltros()">
              <mat-icon>clear</mat-icon>
              Limpiar
            </button>
            <button mat-button>
              <mat-icon>file_download</mat-icon>
              Exportar Excel
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Estadísticas Rápidas -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon class="stat-icon info">event</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().hoy }}</div>
            <div class="stat-label">Eventos Hoy</div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon class="stat-icon success">check_circle</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().operacionesExitosas }}</div>
            <div class="stat-label">Operaciones Exitosas</div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon class="stat-icon warning">warning</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().advertencias }}</div>
            <div class="stat-label">Advertencias</div>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon class="stat-icon error">error</mat-icon>
          <div class="stat-content">
            <div class="stat-value">{{ stats().errores }}</div>
            <div class="stat-label">Errores</div>
          </div>
        </mat-card>
      </div>

      <!-- Tabla de Logs -->
      <mat-card class="logs-card">
        <mat-card-header>
          <mat-card-title>Registro de Auditoría ({{ logs().length }} registros)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="logs()" class="auditoria-table">
            <!-- Fecha -->
            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef>Fecha y Hora</th>
              <td mat-cell *matCellDef="let log">
                <div class="fecha-cell">
                  <div>{{ log.fecha | date:'dd/MM/yyyy' }}</div>
                  <div class="hora">{{ log.fecha | date:'HH:mm:ss' }}</div>
                </div>
              </td>
            </ng-container>

            <!-- Usuario -->
            <ng-container matColumnDef="usuario">
              <th mat-header-cell *matHeaderCellDef>Usuario</th>
              <td mat-cell *matCellDef="let log">
                <div class="usuario-cell">
                  <mat-icon>person</mat-icon>
                  {{ log.usuario }}
                </div>
              </td>
            </ng-container>

            <!-- Módulo -->
            <ng-container matColumnDef="modulo">
              <th mat-header-cell *matHeaderCellDef>Módulo</th>
              <td mat-cell *matCellDef="let log">
                <mat-chip [class]="'modulo-' + log.modulo">
                  {{ getModuloLabel(log.modulo) }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Acción -->
            <ng-container matColumnDef="accion">
              <th mat-header-cell *matHeaderCellDef>Acción</th>
              <td mat-cell *matCellDef="let log">
                <strong>{{ log.accion }}</strong>
              </td>
            </ng-container>

            <!-- Descripción -->
            <ng-container matColumnDef="descripcion">
              <th mat-header-cell *matHeaderCellDef>Descripción</th>
              <td mat-cell *matCellDef="let log">
                {{ log.descripcion }}
              </td>
            </ng-container>

            <!-- IP -->
            <ng-container matColumnDef="ip">
              <th mat-header-cell *matHeaderCellDef>IP</th>
              <td mat-cell *matCellDef="let log">
                <div class="ip-cell">
                  <mat-icon>computer</mat-icon>
                  {{ log.ip }}
                </div>
              </td>
            </ng-container>

            <!-- Nivel -->
            <ng-container matColumnDef="nivel">
              <th mat-header-cell *matHeaderCellDef>Nivel</th>
              <td mat-cell *matCellDef="let log">
                <mat-chip [class]="'nivel-' + log.nivel">
                  <mat-icon>{{ getNivelIcon(log.nivel) }}</mat-icon>
                  {{ getNivelLabel(log.nivel) }}
                </mat-chip>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class]="'row-' + row.nivel"></tr>
          </table>

          <div *ngIf="logs().length === 0" class="empty-state">
            <mat-icon>history</mat-icon>
            <p>No hay registros de auditoría para mostrar</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auditoria-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .page-header {
      margin-bottom: 24px;

      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 8px 0;
        font-size: 28px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #667eea;
        }
      }

      .subtitle {
        color: #666;
        margin: 0;
        font-size: 14px;
      }
    }

    .filters-card {
      margin-bottom: 24px;

      .filters-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 16px;
      }

      .filter-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px !important;

        .stat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;

          &.info { color: #2196f3; }
          &.success { color: #4caf50; }
          &.warning { color: #ff9800; }
          &.error { color: #f44336; }
        }

        .stat-content {
          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #333;
          }

          .stat-label {
            font-size: 13px;
            color: #666;
          }
        }
      }
    }

    .logs-card {
      .auditoria-table {
        width: 100%;

        th {
          font-weight: 600;
          color: #666;
          background: #f9f9f9;
        }

        td, th {
          padding: 12px 16px;
        }

        .fecha-cell {
          .hora {
            font-size: 12px;
            color: #666;
            margin-top: 2px;
          }
        }

        .usuario-cell {
          display: flex;
          align-items: center;
          gap: 8px;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #666;
          }
        }

        .ip-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 13px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: #666;
          }
        }

        mat-chip {
          font-size: 12px;
          min-height: 24px;
          padding: 4px 8px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }

          &.modulo-usuarios { background: #e3f2fd; color: #1976d2; }
          &.modulo-liquidaciones { background: #f3e5f5; color: #7b1fa2; }
          &.modulo-fuentes { background: #e8f5e9; color: #388e3c; }
          &.modulo-configuracion { background: #fff3e0; color: #f57c00; }
          &.modulo-objetos { background: #fce4ec; color: #c2185b; }

          &.nivel-info { background: #e3f2fd; color: #1976d2; }
          &.nivel-success { background: #e8f5e9; color: #388e3c; }
          &.nivel-warning { background: #fff3e0; color: #f57c00; }
          &.nivel-error { background: #ffebee; color: #d32f2f; }
        }

        .row-error {
          background: #ffebee;
        }

        .row-warning {
          background: #fff9e6;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: #999;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
    }

    @media (max-width: 1400px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .filters-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `]
})
export class AuditoriaComponent {
  displayedColumns = ['fecha', 'usuario', 'modulo', 'accion', 'descripcion', 'ip', 'nivel'];
  
  filtroModulo = '';
  filtroUsuario = '';
  filtroFechaDesde: Date | null = null;
  filtroFechaHasta: Date | null = null;

  stats = signal({
    hoy: 127,
    operacionesExitosas: 1845,
    advertencias: 23,
    errores: 5
  });

  logs = signal<LogAuditoria[]>([
    {
      id: 1,
      fecha: new Date('2024-02-04T14:32:15'),
      usuario: 'admin@sistema.com',
      modulo: 'configuracion',
      accion: 'Actualizar UVT',
      descripcion: 'Cambió el valor de UVT de $44000 a $47065',
      ip: '192.168.1.105',
      nivel: 'success'
    },
    {
      id: 2,
      fecha: new Date('2024-02-04T14:15:22'),
      usuario: 'liquidador@municipio.gov.co',
      modulo: 'liquidaciones',
      accion: 'Aprobar Liquidación',
      descripcion: 'Aprobó liquidación #10234 de Predial Urbano',
      ip: '192.168.1.112',
      nivel: 'success'
    },
    {
      id: 3,
      fecha: new Date('2024-02-04T13:45:10'),
      usuario: 'operador@sistema.com',
      modulo: 'objetos',
      accion: 'Crear Predio',
      descripcion: 'Registró nuevo predio con matrícula 50N-789456',
      ip: '192.168.1.108',
      nivel: 'info'
    },
    {
      id: 4,
      fecha: new Date('2024-02-04T13:20:05'),
      usuario: 'admin@sistema.com',
      modulo: 'usuarios',
      accion: 'Crear Usuario',
      descripcion: 'Creó nuevo usuario: aprobador@municipio.gov.co con rol Aprobador',
      ip: '192.168.1.105',
      nivel: 'info'
    },
    {
      id: 5,
      fecha: new Date('2024-02-04T12:55:30'),
      usuario: 'liquidador@municipio.gov.co',
      modulo: 'liquidaciones',
      accion: 'Error en Cálculo',
      descripcion: 'Error al calcular liquidación: Falta configurar tarifa para estrato 6',
      ip: '192.168.1.112',
      nivel: 'error'
    },
    {
      id: 6,
      fecha: new Date('2024-02-04T12:30:18'),
      usuario: 'admin@sistema.com',
      modulo: 'fuentes',
      accion: 'Modificar Fuente',
      descripcion: 'Actualizó conceptos de cobro en fuente ICA Industrial',
      ip: '192.168.1.105',
      nivel: 'warning'
    },
    {
      id: 7,
      fecha: new Date('2024-02-04T11:45:00'),
      usuario: 'operador@sistema.com',
      modulo: 'objetos',
      accion: 'Importar Excel',
      descripcion: 'Importó 150 predios desde archivo Excel',
      ip: '192.168.1.108',
      nivel: 'success'
    },
    {
      id: 8,
      fecha: new Date('2024-02-04T11:20:45'),
      usuario: 'consultor@municipio.gov.co',
      modulo: 'liquidaciones',
      accion: 'Consultar Reporte',
      descripcion: 'Generó reporte de recaudo mensual - Enero 2024',
      ip: '192.168.1.120',
      nivel: 'info'
    },
    {
      id: 9,
      fecha: new Date('2024-02-04T10:55:12'),
      usuario: 'admin@sistema.com',
      modulo: 'configuracion',
      accion: 'Modificar Notificaciones',
      descripcion: 'Habilitó envío de notificaciones por SMS',
      ip: '192.168.1.105',
      nivel: 'success'
    },
    {
      id: 10,
      fecha: new Date('2024-02-04T10:30:00'),
      usuario: 'sistema',
      modulo: 'configuracion',
      accion: 'Respaldo Automático',
      descripcion: 'Ejecutó respaldo automático de base de datos',
      ip: '127.0.0.1',
      nivel: 'info'
    }
  ]);

  getModuloLabel(modulo: string): string {
    const labels: Record<string, string> = {
      'usuarios': 'Usuarios',
      'liquidaciones': 'Liquidaciones',
      'fuentes': 'Fuentes',
      'configuracion': 'Configuración',
      'objetos': 'Objetos Tributarios'
    };
    return labels[modulo] || modulo;
  }

  getNivelIcon(nivel: string): string {
    const icons: Record<string, string> = {
      'info': 'info',
      'success': 'check_circle',
      'warning': 'warning',
      'error': 'error'
    };
    return icons[nivel] || 'info';
  }

  getNivelLabel(nivel: string): string {
    const labels: Record<string, string> = {
      'info': 'Info',
      'success': 'Éxito',
      'warning': 'Advertencia',
      'error': 'Error'
    };
    return labels[nivel] || nivel;
  }

  aplicarFiltros() {
    console.log('Aplicando filtros...');
  }

  limpiarFiltros() {
    this.filtroModulo = '';
    this.filtroUsuario = '';
    this.filtroFechaDesde = null;
    this.filtroFechaHasta = null;
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';
import { Liquidacion, AjusteLiquidacion, DetalleConceptoLiquidacion } from '../../../core/models';

/**
 * Dialog para visualizar el detalle completo de una liquidación
 * 
 * Incluye:
 * - Información general
 * - Desglose de conceptos
 * - Historial de cambios
 * - Documentos adjuntos
 * - Trazabilidad completa
 * - Acciones disponibles según estado
 */
@Component({
  selector: 'app-detalle-liquidacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <mat-icon>description</mat-icon>
        Detalle de Liquidación #{{ liquidacion?.numeroLiquidacion }}
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Cargando información...</p>
      </div>

      <div *ngIf="!loading && liquidacion" class="content-container">
        <!-- Información General -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Información General</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Estado:</span>
                <mat-chip [class]="'estado-' + liquidacion.estado.toLowerCase()">
                  {{ liquidacion.estado }}
                </mat-chip>
              </div>
              <div class="info-item">
                <span class="label">Contribuyente:</span>
                <span class="value">{{ liquidacion.contribuyenteNombre || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">NIT:</span>
                <span class="value">{{ liquidacion.contribuyenteId }}</span>
              </div>
              <div class="info-item">
                <span class="label">Renta:</span>
                <span class="value">{{ liquidacion.rentaNombre || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Fuente de Ingreso:</span>
                <span class="value">{{ liquidacion.fuenteIngreso }}</span>
              </div>
              <div class="info-item">
                <span class="label">Tipo:</span>
                <span class="value">{{ liquidacion.tipoLiquidacion?.nombre || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Vigencia:</span>
                <span class="value">{{ liquidacion.vigencia }}</span>
              </div>
              <div class="info-item">
                <span class="label">Periodo:</span>
                <span class="value">{{ liquidacion.periodo }}</span>
              </div>
              <div class="info-item">
                <span class="label">Fecha Creación:</span>
                <span class="value">{{ liquidacion.fechaLiquidacion | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Creado por:</span>
                <span class="value">{{ liquidacion.liquidadoPor }}</span>
              </div>
              <div class="info-item" *ngIf="liquidacion.fechaAprobacion">
                <span class="label">Fecha Aprobación:</span>
                <span class="value">{{ liquidacion.fechaAprobacion | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="info-item" *ngIf="liquidacion.fechaVencimiento">
                <span class="label">Fecha Vencimiento:</span>
                <span class="value">{{ liquidacion.fechaVencimiento | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tabs para Información Detallada -->
        <mat-tab-group class="detail-tabs">
          <!-- Tab Conceptos -->
          <mat-tab label="Conceptos">
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <table mat-table [dataSource]="liquidacion.conceptos || []" class="conceptos-table">
                    <ng-container matColumnDef="concepto">
                      <th mat-header-cell *matHeaderCellDef>Concepto</th>
                      <td mat-cell *matCellDef="let item">{{ item.concepto }}</td>
                      <td mat-footer-cell *matFooterCellDef><strong>TOTAL</strong></td>
                    </ng-container>

                    <ng-container matColumnDef="baseGravable">
                      <th mat-header-cell *matHeaderCellDef class="number-cell">Base Gravable</th>
                      <td mat-cell *matCellDef="let item" class="number-cell">
                        {{ item.baseGravable | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                      <td mat-footer-cell *matFooterCellDef class="number-cell">
                        {{ getTotalBaseGravable() | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="tarifa">
                      <th mat-header-cell *matHeaderCellDef class="number-cell">Tarifa</th>
                      <td mat-cell *matCellDef="let item" class="number-cell">{{ item.tarifa }}%</td>
                      <td mat-footer-cell *matFooterCellDef></td>
                    </ng-container>

                    <ng-container matColumnDef="valorCalculado">
                      <th mat-header-cell *matHeaderCellDef class="number-cell">Valor Calculado</th>
                      <td mat-cell *matCellDef="let item" class="number-cell">
                        {{ item.valorCalculado | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                      <td mat-footer-cell *matFooterCellDef class="number-cell">
                        {{ getTotalValorCalculado() | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="descuento">
                      <th mat-header-cell *matHeaderCellDef class="number-cell">Descuento</th>
                      <td mat-cell *matCellDef="let item" class="number-cell">
                        {{ item.descuento | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                      <td mat-footer-cell *matFooterCellDef class="number-cell">
                        {{ getTotalDescuento() | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="valorFinal">
                      <th mat-header-cell *matHeaderCellDef class="number-cell">Valor Final</th>
                      <td mat-cell *matCellDef="let item" class="number-cell valor-destacado">
                        {{ item.valorFinal | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                      <td mat-footer-cell *matFooterCellDef class="number-cell valor-total">
                        {{ liquidacion.valorTotal | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
                  </table>

                  <div class="resumen-final">
                    <div class="resumen-item">
                      <span class="label">Subtotal:</span>
                      <span class="value">{{ liquidacion.valorTotal | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                    </div>
                    <div class="resumen-item" *ngIf="liquidacion.intereses">
                      <span class="label">Intereses:</span>
                      <span class="value">{{ liquidacion.intereses | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                    </div>
                    <div class="resumen-item total">
                      <span class="label">Total a Pagar:</span>
                      <span class="value">
                        {{ (liquidacion.valorTotal + (liquidacion.intereses || 0)) | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- Tab Historial -->
          <mat-tab label="Historial">
            <div class="tab-content">
              <mat-accordion>
                <mat-expansion-panel *ngFor="let ajuste of historial" class="historial-item">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>{{ getIconoTipo(ajuste.tipoAjuste) }}</mat-icon>
                      {{ ajuste.tipoAjuste }}
                    </mat-panel-title>
                    <mat-panel-description>
                      {{ ajuste.fechaAjuste | date:'dd/MM/yyyy HH:mm' }} - {{ ajuste.realizadoPor }}
                    </mat-panel-description>
                  </mat-expansion-panel-header>

                  <div class="ajuste-details">
                    <p class="motivo">
                      <strong>Motivo:</strong> {{ ajuste.motivo }}
                    </p>

                    <div *ngIf="ajuste.ajustes && ajuste.ajustes.length > 0" class="cambios-list">
                      <h4>Cambios realizados:</h4>
                      <table class="cambios-table">
                        <thead>
                          <tr>
                            <th>Campo</th>
                            <th>Valor Anterior</th>
                            <th>Valor Nuevo</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let cambio of ajuste.ajustes">
                            <td>{{ cambio.campo }}</td>
                            <td class="valor-anterior">{{ cambio.valorAnterior }}</td>
                            <td class="valor-nuevo">{{ cambio.valorNuevo }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>

              <div *ngIf="!historial || historial.length === 0" class="no-data">
                <mat-icon>info</mat-icon>
                <p>No hay historial de cambios para esta liquidación</p>
              </div>
            </div>
          </mat-tab>

          <!-- Tab Documentos -->
          <mat-tab label="Documentos">
            <div class="tab-content">
              <mat-card *ngIf="documentos && documentos.length > 0">
                <mat-card-content>
                  <div class="documentos-list">
                    <div *ngFor="let doc of documentos" class="documento-item">
                      <mat-icon>insert_drive_file</mat-icon>
                      <div class="documento-info">
                        <span class="nombre">{{ doc.nombre }}</span>
                        <span class="fecha">{{ doc.fecha | date:'dd/MM/yyyy' }}</span>
                      </div>
                      <button mat-icon-button matTooltip="Descargar">
                        <mat-icon>download</mat-icon>
                      </button>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <div *ngIf="!documentos || documentos.length === 0" class="no-data">
                <mat-icon>description</mat-icon>
                <p>No hay documentos adjuntos</p>
              </div>
            </div>
          </mat-tab>

          <!-- Tab Trazabilidad -->
          <mat-tab label="Trazabilidad">
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <div class="timeline">
                    <div class="timeline-item" *ngFor="let evento of trazabilidad">
                      <div class="timeline-marker" [class]="'marker-' + evento.tipo"></div>
                      <div class="timeline-content">
                        <div class="timeline-header">
                          <strong>{{ evento.accion }}</strong>
                          <span class="fecha">{{ evento.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
                        </div>
                        <div class="timeline-body">
                          <p>{{ evento.descripcion }}</p>
                          <span class="usuario">Por: {{ evento.usuario }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div *ngIf="!trazabilidad || trazabilidad.length === 0" class="no-data">
                    <mat-icon>timeline</mat-icon>
                    <p>No hay registros de trazabilidad</p>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
      
      <button mat-raised-button color="accent" 
              *ngIf="liquidacion?.estado === 'BORRADOR'"
              (click)="editar()">
        <mat-icon>edit</mat-icon>
        Editar
      </button>

      <button mat-raised-button color="primary"
              *ngIf="liquidacion?.estado === 'PENDIENTE'"
              (click)="aprobar()">
        <mat-icon>check_circle</mat-icon>
        Aprobar
      </button>

      <button mat-raised-button color="warn"
              *ngIf="liquidacion?.estado === 'PENDIENTE'"
              (click)="rechazar()">
        <mat-icon>cancel</mat-icon>
        Rechazar
      </button>

      <button mat-raised-button color="accent"
              *ngIf="liquidacion?.estado === 'APROBADA' || liquidacion?.estado === 'FACTURADA'"
              (click)="reliquidar()">
        <mat-icon>refresh</mat-icon>
        Reliquidar
      </button>

      <button mat-raised-button 
              *ngIf="liquidacion?.estado === 'APROBADA'"
              (click)="descargarPDF()">
        <mat-icon>picture_as_pdf</mat-icon>
        Descargar PDF
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      border-bottom: 1px solid #e0e0e0;

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        padding: 20px 0;
      }
    }

    mat-dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      gap: 20px;
    }

    .info-card {
      margin-bottom: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .label {
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
        font-weight: 500;
      }

      .value {
        font-size: 14px;
        color: #333;
      }

      mat-chip {
        width: fit-content;
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

    .estado-anulada {
      background-color: #f44336 !important;
      color: white !important;
    }

    .estado-rechazada {
      background-color: #d32f2f !important;
      color: white !important;
    }

    .detail-tabs {
      margin-top: 24px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .conceptos-table {
      width: 100%;
      margin-bottom: 24px;

      .number-cell {
        text-align: right;
      }

      .valor-destacado {
        font-weight: 500;
        color: #1976d2;
      }

      .valor-total {
        font-weight: 700;
        font-size: 16px;
        color: #1976d2;
      }

      mat-footer-row {
        font-weight: 700;
        background-color: #f5f5f5;
      }
    }

    .resumen-final {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;

      .resumen-item {
        display: flex;
        gap: 16px;
        min-width: 300px;
        justify-content: space-between;

        &.total {
          border-top: 2px solid #333;
          padding-top: 8px;
          margin-top: 8px;
          font-size: 18px;
          font-weight: 700;
          color: #1976d2;
        }
      }
    }

    .historial-item {
      margin-bottom: 8px;

      mat-icon {
        margin-right: 8px;
      }
    }

    .ajuste-details {
      padding: 16px 0;

      .motivo {
        margin-bottom: 16px;
      }

      h4 {
        margin: 16px 0 8px;
        color: #666;
      }
    }

    .cambios-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;

      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
      }

      th {
        background-color: #f5f5f5;
        font-weight: 500;
      }

      .valor-anterior {
        color: #f44336;
        text-decoration: line-through;
      }

      .valor-nuevo {
        color: #4caf50;
        font-weight: 500;
      }
    }

    .observaciones {
      margin-top: 16px;
      padding: 12px;
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;

      p {
        margin: 8px 0 0;
      }
    }

    .documentos-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .documento-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;

      mat-icon {
        color: #666;
      }

      .documento-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .nombre {
          font-weight: 500;
        }

        .fecha {
          font-size: 12px;
          color: #666;
        }
      }
    }

    .timeline {
      position: relative;
      padding-left: 40px;

      &::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: #e0e0e0;
      }
    }

    .timeline-item {
      position: relative;
      margin-bottom: 24px;

      .timeline-marker {
        position: absolute;
        left: -29px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #2196f3;
        border: 2px solid white;
        box-shadow: 0 0 0 2px #2196f3;

        &.marker-creacion {
          background-color: #4caf50;
          box-shadow: 0 0 0 2px #4caf50;
        }

        &.marker-aprobacion {
          background-color: #2196f3;
          box-shadow: 0 0 0 2px #2196f3;
        }

        &.marker-modificacion {
          background-color: #ff9800;
          box-shadow: 0 0 0 2px #ff9800;
        }

        &.marker-anulacion {
          background-color: #f44336;
          box-shadow: 0 0 0 2px #f44336;
        }
      }

      .timeline-content {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 4px;

        .timeline-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          strong {
            color: #333;
          }

          .fecha {
            color: #666;
            font-size: 13px;
          }
        }

        .timeline-body {
          p {
            margin: 0 0 8px;
            color: #555;
          }

          .usuario {
            font-size: 12px;
            color: #888;
            font-style: italic;
          }
        }
      }
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #999;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      p {
        margin: 0;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;

      button {
        margin-left: 8px;

        mat-icon {
          margin-right: 4px;
        }
      }
    }

    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .resumen-final .resumen-item {
        min-width: 100%;
      }

      .timeline {
        padding-left: 30px;
      }
    }
  `]
})
export class DetalleLiquidacionDialogComponent implements OnInit {
  liquidacion?: Liquidacion;
  historial: AjusteLiquidacion[] = [];
  documentos: any[] = [];
  trazabilidad: any[] = [];
  loading = true;

  displayedColumns = [
    'concepto',
    'baseGravable',
    'tarifa',
    'valorCalculado',
    'descuento',
    'valorFinal'
  ];

  constructor(
    public dialogRef: MatDialogRef<DetalleLiquidacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { liquidacionId: number },
    private liquidacionesService: LiquidacionesService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;

    // Cargar liquidación
    this.liquidacionesService.getLiquidacion(this.data.liquidacionId).subscribe({
      next: (liquidacion) => {
        this.liquidacion = liquidacion;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar liquidación:', error);
        this.loading = false;
      }
    });

    // Cargar historial de ajustes
    this.liquidacionesService.getHistorialAjustes(this.data.liquidacionId).subscribe({
      next: (historial) => {
        this.historial = historial;
      }
    });

    // Mock de documentos (implementar cuando el backend esté listo)
    this.documentos = [
      { nombre: 'Liquidacion_2026_01.pdf', fecha: new Date() },
      { nombre: 'Soporte_Declaracion.pdf', fecha: new Date() }
    ];

    // Mock de trazabilidad (implementar cuando el backend esté listo)
    this.trazabilidad = [
      {
        tipo: 'creacion',
        accion: 'Liquidación Creada',
        descripcion: 'Se creó la liquidación inicial',
        usuario: 'Juan Pérez',
        fecha: new Date()
      },
      {
        tipo: 'aprobacion',
        accion: 'Liquidación Aprobada',
        descripcion: 'La liquidación fue revisada y aprobada',
        usuario: 'María García',
        fecha: new Date()
      }
    ];
  }

  getTotalBaseGravable(): number {
    return this.liquidacion?.conceptos?.reduce((sum, c) => sum + (c.baseGravable || 0), 0) || 0;
  }

  getTotalValorCalculado(): number {
    return this.liquidacion?.conceptos?.reduce((sum, c) => sum + (c.valorCalculado || 0), 0) || 0;
  }

  getTotalDescuento(): number {
    return this.liquidacion?.conceptos?.reduce((sum, c) => sum + (c.descuento || 0), 0) || 0;
  }

  getIconoTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'CREACION': 'add_circle',
      'MODIFICACION': 'edit',
      'APROBACION': 'check_circle',
      'RECHAZO': 'cancel',
      'ANULACION': 'block',
      'RELIQUIDACION': 'refresh',
      'AJUSTE': 'tune'
    };
    return iconos[tipo] || 'info';
  }

  editar() {
    this.dialogRef.close({ action: 'editar', liquidacion: this.liquidacion });
  }

  aprobar() {
    this.dialogRef.close({ action: 'aprobar', liquidacion: this.liquidacion });
  }

  rechazar() {
    this.dialogRef.close({ action: 'rechazar', liquidacion: this.liquidacion });
  }

  reliquidar() {
    this.dialogRef.close({ action: 'reliquidar', liquidacion: this.liquidacion });
  }

  descargarPDF() {
    // Implementar descarga de PDF
    console.log('Descargar PDF de liquidación', this.liquidacion?.id);
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ObjetosTributariosService, ObjetoTributario } from '../../../core/services/objetos-tributarios.service';
import { ObjetoTributarioDialogComponent } from '../objeto-tributario-dialog/objeto-tributario-dialog.component';

@Component({
  selector: 'app-fuente-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  template: `
    <div class="fuente-detalle-container" *ngIf="fuente()">
      <!-- Header -->
      <div class="fuente-header">
        <button mat-icon-button (click)="volver()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-info">
          <div class="fuente-icon" [style.background-color]="fuente()!.color + '20'">
            <mat-icon [style.color]="fuente()!.color">{{ fuente()!.icono }}</mat-icon>
          </div>
          <div>
            <h1>{{ fuente()!.nombre }}</h1>
            <p class="subtitle">{{ fuente()!.codigo }} • {{ fuente()!.categoria }}</p>
          </div>
        </div>
        <div class="header-actions">
          <mat-chip [class]="'estado-' + fuente()!.estado">
            {{ fuente()!.estado }}
          </mat-chip>
          <button mat-raised-button color="primary">
            <mat-icon>settings</mat-icon>
            Configurar
          </button>
        </div>
      </div>

      <!-- Tabs de Parametrización -->
      <mat-tab-group class="fuente-tabs" animationDuration="0ms">
        <mat-tab label="Dashboard">
          <ng-template matTabContent>
            <div class="tab-content dashboard-grid">
              <!-- KPIs Principales -->
              <div class="kpi-section">
                <mat-card class="kpi-card recaudo">
                  <div class="kpi-icon">
                    <mat-icon>payments</mat-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-label">Recaudo Total 2024</div>
                    <div class="kpi-value">$128.5B</div>
                    <div class="kpi-change positive">+15.3% vs 2023</div>
                  </div>
                </mat-card>

                <mat-card class="kpi-card facturado">
                  <div class="kpi-icon">
                    <mat-icon>description</mat-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-label">Facturado</div>
                    <div class="kpi-value">$156.0B</div>
                    <div class="kpi-change">82.4% efectividad</div>
                  </div>
                </mat-card>

                <mat-card class="kpi-card objetos">
                  <div class="kpi-icon">
                    <mat-icon>{{ fuente()!.icono }}</mat-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-label">Objetos Tributarios</div>
                    <div class="kpi-value">{{ 15234 | number }}</div>
                    <div class="kpi-change">Activos</div>
                  </div>
                </mat-card>

                <mat-card class="kpi-card liquidaciones">
                  <div class="kpi-icon">
                    <mat-icon>calculate</mat-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-label">Liquidaciones</div>
                    <div class="kpi-value">{{ fuente()!.liquidacionesCount | number }}</div>
                    <div class="kpi-change">Aprobadas</div>
                  </div>
                </mat-card>
              </div>

              <!-- Gráfica de Recaudo -->
              <mat-card class="chart-card">
                <mat-card-header>
                  <mat-card-title>Recaudo Mensual 2024</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="chart-placeholder">
                    <mat-icon>bar_chart</mat-icon>
                    <p>Gráfica de barras: Recaudo mensual</p>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Información General -->
              <mat-card class="info-card">
                <mat-card-header>
                  <mat-card-title>Configuración de Fuente</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Código:</label>
                      <span>{{ fuente()!.codigo }}</span>
                    </div>
                    <div class="info-item">
                      <label>Periodicidad:</label>
                      <span>Anual</span>
                    </div>
                    <div class="info-item">
                      <label>Períodos de cobro:</label>
                      <span>Bimestral (6 períodos)</span>
                    </div>
                    <div class="info-item">
                      <label>Vigencia:</label>
                      <span>2024</span>
                    </div>
                    <div class="info-item">
                      <label>Conceptos:</label>
                      <span>{{ fuente()!.conceptosCount }} configurados</span>
                    </div>
                    <div class="info-item">
                      <label>Fórmulas:</label>
                      <span>3 activas</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Objetos Tributarios">
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Gestión de {{ getTipoObjeto() }}</h2>
                <div class="header-actions">
                  <button mat-raised-button color="primary" (click)="abrirDialogoObjeto()">
                    <mat-icon>add</mat-icon>
                    Nuevo {{ getTipoObjeto() }}
                  </button>
                  <button mat-raised-button>
                    <mat-icon>upload</mat-icon>
                    Importar Excel
                  </button>
                </div>
              </div>
              <mat-card class="data-card">
                <div class="search-bar">
                  <mat-form-field>
                    <mat-label>Buscar {{ getTipoObjeto() }}</mat-label>
                    <input matInput placeholder="Código, descripción...">
                    <mat-icon matSuffix>search</mat-icon>
                  </mat-form-field>
                </div>
                
                <table mat-table [dataSource]="objetosTributarios()" class="objetos-table">
                  <!-- Código -->
                  <ng-container matColumnDef="codigo">
                    <th mat-header-cell *matHeaderCellDef>Código</th>
                    <td mat-cell *matCellDef="let objeto">
                      <strong>{{ objeto.codigo }}</strong>
                    </td>
                  </ng-container>

                  <!-- Descripción Principal -->
                  <ng-container matColumnDef="descripcion">
                    <th mat-header-cell *matHeaderCellDef>{{ getTipoObjeto() }}</th>
                    <td mat-cell *matCellDef="let objeto">
                      {{ getValorPrincipal(objeto) }}
                    </td>
                  </ng-container>

                  <!-- Estado -->
                  <ng-container matColumnDef="estado">
                    <th mat-header-cell *matHeaderCellDef>Estado</th>
                    <td mat-cell *matCellDef="let objeto">
                      <mat-chip [class]="objeto.activo ? 'estado-activo' : 'estado-inactivo'">
                        {{ objeto.activo ? 'Activo' : 'Inactivo' }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <!-- Acciones -->
                  <ng-container matColumnDef="acciones">
                    <th mat-header-cell *matHeaderCellDef>Acciones</th>
                    <td mat-cell *matCellDef="let objeto">
                      <button mat-icon-button (click)="abrirDialogoObjeto(objeto)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button (click)="eliminarObjetoTributario(objeto)" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
                
                <div *ngIf="objetosTributarios().length === 0" class="empty-state">
                  <mat-icon>{{ fuente()!.icono }}</mat-icon>
                  <p>No hay {{ getTipoObjeto() }}s registrados</p>
                  <button mat-raised-button color="primary" (click)="abrirDialogoObjeto()">
                    <mat-icon>add</mat-icon>
                    Registrar Primer {{ getTipoObjeto() }}
                  </button>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab [label]="'Conceptos (' + fuente()!.conceptosCount + ')'">
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Conceptos de Cobro</h2>
                <button mat-raised-button color="primary">
                  <mat-icon>add</mat-icon>
                  Nuevo Concepto
                </button>
              </div>
              <mat-card class="data-card">
                <div class="conceptos-grid">
                  <div class="concepto-card" *ngFor="let tipo of ['Capital', 'Intereses', 'Sobretasa']">
                    <div class="concepto-header">
                      <mat-icon [class]="tipo.toLowerCase()">
                        {{ tipo === 'Capital' ? 'account_balance' : tipo === 'Intereses' ? 'percent' : 'add_circle' }}
                      </mat-icon>
                      <span class="tipo-badge">{{ tipo }}</span>
                    </div>
                    <h3>Concepto {{ tipo }}</h3>
                    <p>Descripción del concepto de cobro</p>
                    <div class="concepto-footer">
                      <button mat-icon-button><mat-icon>edit</mat-icon></button>
                      <button mat-icon-button><mat-icon>delete</mat-icon></button>
                    </div>
                  </div>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Fórmulas Dinámicas">
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Motor de Cálculo</h2>
                <button mat-raised-button color="primary">
                  <mat-icon>add</mat-icon>
                  Nueva Fórmula
                </button>
              </div>
              <mat-card class="formula-editor">
                <mat-card-header>
                  <mat-card-title>Editor de Fórmulas</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="formula-example">
                    <code>
                      SI estrato <= 2 ENTONCES<br>
                      &nbsp;&nbsp;tarifa = 0.005<br>
                      SI estrato == 3 ENTONCES<br>
                      &nbsp;&nbsp;tarifa = 0.008<br>
                      SINO<br>
                      &nbsp;&nbsp;tarifa = 0.012<br>
                      <br>
                      valor = avaluo * tarifa * (1 - descuento)
                    </code>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Períodos de Facturación">
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Configuración de Períodos</h2>
                <button mat-raised-button color="primary">
                  <mat-icon>edit</mat-icon>
                  Configurar
                </button>
              </div>
              <mat-card class="periodos-card">
                <div class="periodos-config">
                  <div class="config-item">
                    <label>Tipo de período:</label>
                    <strong>Bimestral</strong>
                  </div>
                  <div class="config-item">
                    <label>Número de períodos:</label>
                    <strong>6 períodos/año</strong>
                  </div>
                  <div class="config-item">
                    <label>División:</label>
                    <strong>Valor anual ÷ 6</strong>
                  </div>
                </div>
                <div class="periodos-timeline">
                  <div class="periodo-item" *ngFor="let p of [1,2,3,4,5,6]">
                    <div class="periodo-number">P{{ p }}</div>
                    <div class="periodo-info">
                      <div class="periodo-label">Período {{ p }}</div>
                      <div class="periodo-dates">Ene-Feb 2024</div>
                      <div class="periodo-value">$333.333</div>
                    </div>
                  </div>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Liquidaciones">
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Liquidaciones</h2>
                <div class="header-actions">
                  <button mat-raised-button color="primary">
                    <mat-icon>add</mat-icon>
                    Liquidación Individual
                  </button>
                  <button mat-raised-button color="accent">
                    <mat-icon>layers</mat-icon>
                    Liquidación Masiva
                  </button>
                </div>
              </div>
              <mat-card class="data-card">
                <p class="placeholder-text">Tabla de liquidaciones aprobadas</p>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Facturas">
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <h2>Facturas Emitidas</h2>
                <button mat-raised-button color="primary">
                  <mat-icon>refresh</mat-icon>
                  Generar Período Actual
                </button>
              </div>
              <mat-card class="data-card">
                <p class="placeholder-text">Tabla de facturas por período</p>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .fuente-detalle-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .fuente-header {
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      gap: 16px;

      .header-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 16px;

        .fuente-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }

        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 500;
        }

        .subtitle {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #666;
        }
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;

        mat-chip {
          &.estado-activo {
            background: #e8f5e9;
            color: #2e7d32;
          }
        }
      }
    }

    .fuente-tabs {
      flex: 1;

      ::ng-deep .mat-mdc-tab-body-wrapper {
        flex: 1;
      }
    }

    .tab-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h2 {
          margin: 0;
          font-size: 20px;
        }
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;

          &.full-width {
            grid-column: 1 / -1;
          }

          label {
            font-size: 12px;
            color: #666;
            font-weight: 500;
          }

          span {
            font-size: 14px;
          }
        }
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;

        .stat-card {
          text-align: center;
          padding: 24px;
          border-radius: 8px;
          background: #f5f5f5;

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: #667eea;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 600;
            margin: 8px 0;
          }

          .stat-label {
            font-size: 14px;
            color: #666;
          }
        }
      }

      .placeholder-text {
        text-align: center;
        color: #999;
        padding: 48px;
        font-style: italic;
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

        p {
          font-size: 16px;
          margin-bottom: 24px;
        }
      }

      .objetos-table {
        width: 100%;
        margin-top: 16px;

        th {
          font-weight: 600;
          color: #666;
        }

        td, th {
          padding: 12px 16px;
        }

        .estado-activo {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .estado-inactivo {
          background-color: #ffebee;
          color: #c62828;
        }
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .kpi-section {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .chart-card {
          grid-column: 1 / -1;
        }
      }

      .kpi-card {
        display: flex;
        gap: 16px;
        padding: 20px;

        .kpi-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: white;
          }
        }

        &.recaudo .kpi-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.facturado .kpi-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.objetos .kpi-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.liquidaciones .kpi-icon {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .kpi-content {
          flex: 1;

          .kpi-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
          }

          .kpi-value {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .kpi-change {
            font-size: 12px;
            color: #666;

            &.positive {
              color: #2e7d32;
            }
          }
        }
      }

      .chart-placeholder {
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f9f9f9;
        border-radius: 8px;
        color: #999;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
        }
      }

      .data-card {
        .search-bar {
          margin-bottom: 16px;

          mat-form-field {
            width: 100%;
          }
        }
      }

      .conceptos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;

        .concepto-card {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;

          &:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }

          .concepto-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;

            mat-icon {
              font-size: 32px;
              width: 32px;
              height: 32px;

              &.capital { color: #1976d2; }
              &.intereses { color: #f57c00; }
              &.sobretasa { color: #388e3c; }
            }

            .tipo-badge {
              font-size: 11px;
              padding: 4px 8px;
              background: #e3f2fd;
              color: #1565c0;
              border-radius: 4px;
            }
          }

          h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
          }

          p {
            margin: 0 0 16px 0;
            font-size: 13px;
            color: #666;
          }

          .concepto-footer {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
          }
        }
      }

      .formula-editor {
        .formula-example {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 24px;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;

          code {
            display: block;
          }
        }
      }

      .periodos-card {
        .periodos-config {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding: 24px;
          background: #f5f5f5;
          border-radius: 8px;
          margin-bottom: 24px;

          .config-item {
            display: flex;
            flex-direction: column;
            gap: 4px;

            label {
              font-size: 12px;
              color: #666;
            }

            strong {
              font-size: 16px;
            }
          }
        }

        .periodos-timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;

          .periodo-item {
            display: flex;
            gap: 12px;
            padding: 16px;
            background: #f9f9f9;
            border-radius: 8px;

            .periodo-number {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: #667eea;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
            }

            .periodo-info {
              flex: 1;

              .periodo-label {
                font-size: 12px;
                color: #666;
              }

              .periodo-dates {
                font-size: 13px;
                margin: 4px 0;
              }

              .periodo-value {
                font-size: 16px;
                font-weight: 600;
                color: #667eea;
              }
            }
          }
        }
      }
    }
  `]
})
export class FuenteDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private objetosService = inject(ObjetosTributariosService);

  fuente = signal<any>(null);
  objetosTributarios = signal<ObjetoTributario[]>([]);
  displayedColumns = ['codigo', 'descripcion', 'estado', 'acciones'];

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    // Simular carga de fuente
    this.fuente.set({
      id: 1,
      codigo: 'PRED-URB',
      nombre: 'Predial Unificado Urbano',
      descripcion: 'Impuesto predial unificado para predios urbanos del municipio',
      categoria: 'Impuestos Directos',
      estado: 'activo',
      conceptosCount: 8,
      tiposCount: 3,
      liquidacionesCount: 15234,
      color: '#1976d2',
      icono: 'home'
    });
    
    this.cargarObjetosTributarios();
  }

  cargarObjetosTributarios() {
    // Datos de ejemplo
    this.objetosTributarios.set([
      {
        id: 1,
        fuenteId: 1,
        tipoObjeto: 'Predio',
        codigo: '01-001-0001',
        valores: {
          matricula: '50N-123456',
          direccion: 'Calle 10 # 5-25',
          estrato: '3',
          avaluo: 120000000
        },
        activo: true
      }
    ]);
  }

  volver() {
    this.router.navigate(['/fuentes']);
  }

  getTipoObjeto(): string {
    const tipos: Record<string, string> = {
      'Predial Unificado Urbano': 'Predio',
      'Predial Unificado Rural': 'Predio',
      'ICA Industrial': 'Establecimiento',
      'ICA Comercial': 'Establecimiento',
      'Sobretasa Ambiental': 'Predio',
      'Alumbrado Público': 'Suscriptor',
      'Valorización': 'Obra',
      'Espacio Público': 'Permiso'
    };
    return tipos[this.fuente()?.nombre || ''] || 'Objeto';
  }

  abrirDialogoObjeto(objeto?: ObjetoTributario) {
    const dialogRef = this.dialog.open(ObjetoTributarioDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        tipoObjeto: this.getTipoObjeto(),
        fuenteId: this.fuente()!.id,
        objeto: objeto
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarObjetoTributario(result);
      }
    });
  }

  guardarObjetoTributario(objeto: ObjetoTributario) {
    const objetos = this.objetosTributarios();
    if (objeto.id) {
      const index = objetos.findIndex(o => o.id === objeto.id);
      objetos[index] = objeto;
    } else {
      objeto.id = Date.now();
      objetos.push(objeto);
    }
    this.objetosTributarios.set([...objetos]);
  }

  eliminarObjetoTributario(objeto: ObjetoTributario) {
    if (confirm(`¿Está seguro de eliminar el objeto ${objeto.codigo}?`)) {
      const objetos = this.objetosTributarios().filter(o => o.id !== objeto.id);
      this.objetosTributarios.set(objetos);
    }
  }

  getValorPrincipal(objeto: ObjetoTributario): string {
    const tipoObjeto = this.getTipoObjeto();
    switch(tipoObjeto) {
      case 'Predio':
        return objeto.valores['matricula'] || objeto.valores['direccion'] || '-';
      case 'Establecimiento':
        return objeto.valores['razonSocial'] || objeto.valores['nombreComercial'] || '-';
      case 'Suscriptor':
        return objeto.valores['nombre'] || '-';
      case 'Obra':
        return objeto.valores['nombreObra'] || '-';
      case 'Permiso':
        return objeto.valores['titular'] || '-';
      default:
        return '-';
    }
  }
}

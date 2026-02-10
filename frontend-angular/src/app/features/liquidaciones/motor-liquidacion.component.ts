import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { LiquidacionesService, FiltrosLiquidacion } from '../../core/services/liquidaciones.service';
import { Liquidacion } from '../../core/models';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { NuevaLiquidacionDialogComponent } from './dialogs/nueva-liquidacion-dialog.component';
import { LiquidacionMasivaDialogComponent } from './dialogs/liquidacion-masiva-dialog.component';
import { DetalleLiquidacionDialogComponent } from './dialogs/detalle-liquidacion-dialog.component';
import { ReliquidacionDialogComponent } from './dialogs/reliquidacion-dialog.component';
import { EstadisticasLiquidacionComponent } from './tabs/estadisticas-liquidacion.component';

@Component({
  selector: 'app-motor-liquidacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    EstadisticasLiquidacionComponent
  ],
  template: `
    <div class="motor-liquidacion-container">
      <!-- Header -->
      <div class="header">
        <div class="title-section">
          <h1>
            <mat-icon>calculate</mat-icon>
            Motor de Liquidación Tributaria
          </h1>
          <p class="subtitle">Gestión integral de rentas, liquidaciones y conceptos de cobro</p>
        </div>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="openNuevaLiquidacion()">
            <mat-icon>add</mat-icon>
            Nueva Liquidación
          </button>
          <button mat-raised-button color="accent" (click)="openLiquidacionMasiva()">
            <mat-icon>layers</mat-icon>
            Liquidación Masiva
          </button>
        </div>
      </div>

      <!-- Tabs Principal -->
      <mat-tab-group [(selectedIndex)]="selectedTab" class="main-tabs">
        
        <!-- TAB 1: LIQUIDACIONES -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">receipt_long</mat-icon>
            Liquidaciones
            <span class="badge" *ngIf="totalLiquidaciones > 0">{{totalLiquidaciones}}</span>
          </ng-template>

          <div class="tab-content">
            <!-- Filtros Avanzados -->
            <mat-card class="filters-card">
              <mat-card-content>
                <div class="filters-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Búsqueda</mat-label>
                    <input matInput 
                           placeholder="Buscar por número, contribuyente..." 
                           [(ngModel)]="filtros.search"
                           (ngModelChange)="onSearchChange($event)">
                    <mat-icon matSuffix>search</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Estado</mat-label>
                    <mat-select [(ngModel)]="filtros.estado" (ngModelChange)="applyFilters()">
                      <mat-option value="">Todos</mat-option>
                      <mat-option value="BORRADOR">Borrador</mat-option>
                      <mat-option value="PENDIENTE">Pendiente</mat-option>
                      <mat-option value="APROBADA">Aprobada</mat-option>
                      <mat-option value="FACTURADA">Facturada</mat-option>
                      <mat-option value="ANULADA">Anulada</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Vigencia</mat-label>
                    <input matInput type="number" 
                           [(ngModel)]="filtros.vigencia"
                           (ngModelChange)="applyFilters()">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Periodo</mat-label>
                    <input matInput type="number" 
                           [(ngModel)]="filtros.periodo"
                           (ngModelChange)="applyFilters()">
                  </mat-form-field>

                  <button mat-stroked-button (click)="limpiarFiltros()">
                    <mat-icon>clear</mat-icon>
                    Limpiar
                  </button>
                </div>

                <!-- Filtros Activos -->
                <div class="active-filters" *ngIf="hasActiveFilters()">
                  <mat-chip-set>
                    <mat-chip *ngIf="filtros.estado" removable (removed)="removeFilter('estado')">
                      Estado: {{filtros.estado}}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                    <mat-chip *ngIf="filtros.vigencia" removable (removed)="removeFilter('vigencia')">
                      Vigencia: {{filtros.vigencia}}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                    <mat-chip *ngIf="filtros.periodo" removable (removed)="removeFilter('periodo')">
                      Periodo: {{filtros.periodo}}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Vista de Cards (Responsive) -->
            <div class="liquidaciones-grid" *ngIf="vistaActual === 'cards'">
              <mat-card *ngFor="let liq of liquidaciones" class="liquidacion-card">
                <mat-card-header>
                  <div mat-card-avatar class="avatar" [class.aprobada]="liq.estado === 'APROBADA'">
                    <mat-icon>{{getIconByEstado(liq.estado)}}</mat-icon>
                  </div>
                  <mat-card-title>{{liq.numeroLiquidacion}}</mat-card-title>
                  <mat-card-subtitle>{{liq.contribuyenteNombre}}</mat-card-subtitle>
                  <button mat-icon-button [matMenuTriggerFor]="menu" class="card-menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="verDetalle(liq)">
                      <mat-icon>visibility</mat-icon>
                      Ver Detalle
                    </button>
                    <button mat-menu-item (click)="editar(liq)" *ngIf="liq.estado === 'BORRADOR'">
                      <mat-icon>edit</mat-icon>
                      Editar
                    </button>
                    <button mat-menu-item (click)="reliquidar(liq)">
                      <mat-icon>refresh</mat-icon>
                      Reliquidar
                    </button>
                    <button mat-menu-item (click)="anular(liq)" *ngIf="liq.estado !== 'ANULADA'">
                      <mat-icon>cancel</mat-icon>
                      Anular
                    </button>
                  </mat-menu>
                </mat-card-header>
                <mat-card-content>
                  <div class="card-data">
                    <div class="data-row">
                      <span class="label">Renta:</span>
                      <span class="value">{{liq.rentaNombre}}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Periodo:</span>
                      <span class="value">{{liq.vigencia}}/{{liq.periodo}}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Base Gravable:</span>
                      <span class="value">{{liq.baseGravable | currency}}</span>
                    </div>
                    <div class="data-row">
                      <span class="label">Valor Total:</span>
                      <span class="value total">{{liq.valorTotal | currency}}</span>
                    </div>
                    <div class="data-row">
                      <mat-chip [class]="'estado-' + liq.estado?.toLowerCase()">
                        {{liq.estado}}
                      </mat-chip>
                    </div>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary" (click)="verDetalle(liq)">Ver Detalle</button>
                  <button mat-button *ngIf="liq.estado === 'PENDIENTE'" (click)="aprobar(liq)">
                    Aprobar
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>

            <!-- Vista de Tabla (Desktop) -->
            <div class="table-container" *ngIf="vistaActual === 'table'">
              <table mat-table [dataSource]="dataSource" matSort class="liquidaciones-table">
                
                <ng-container matColumnDef="numero">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Número</th>
                  <td mat-cell *matCellDef="let liq">
                    <strong>{{liq.numeroLiquidacion}}</strong>
                  </td>
                </ng-container>

                <ng-container matColumnDef="contribuyente">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Contribuyente</th>
                  <td mat-cell *matCellDef="let liq">{{liq.contribuyenteNombre}}</td>
                </ng-container>

                <ng-container matColumnDef="renta">
                  <th mat-header-cell *matHeaderCellDef>Renta</th>
                  <td mat-cell *matCellDef="let liq">{{liq.rentaNombre}}</td>
                </ng-container>

                <ng-container matColumnDef="periodo">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Periodo</th>
                  <td mat-cell *matCellDef="let liq">{{liq.vigencia}}/{{liq.periodo}}</td>
                </ng-container>

                <ng-container matColumnDef="valorTotal">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Valor Total</th>
                  <td mat-cell *matCellDef="let liq" class="valor-column">
                    <strong>{{liq.valorTotal | currency}}</strong>
                  </td>
                </ng-container>

                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                  <td mat-cell *matCellDef="let liq">
                    <mat-chip [class]="'estado-' + liq.estado?.toLowerCase()">
                      {{liq.estado}}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="acciones">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let liq">
                    <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Acciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #menu="matMenu">
                      <button mat-menu-item (click)="verDetalle(liq)">
                        <mat-icon>visibility</mat-icon>
                        Ver Detalle
                      </button>
                      <button mat-menu-item (click)="reliquidar(liq)">
                        <mat-icon>refresh</mat-icon>
                        Reliquidar
                      </button>
                      <button mat-menu-item (click)="anular(liq)" *ngIf="liq.estado !== 'ANULADA'">
                        <mat-icon>cancel</mat-icon>
                        Anular
                      </button>
                    </mat-menu>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                    (click)="verDetalle(row)" class="clickable-row"></tr>
              </table>

              <mat-paginator [length]="totalLiquidaciones"
                           [pageSize]="filtros.size"
                           [pageSizeOptions]="[10, 25, 50, 100]"
                           (page)="onPageChange($event)"
                           showFirstLastButtons>
              </mat-paginator>
            </div>

            <!-- Toggle Vista -->
            <div class="view-toggle">
              <button mat-icon-button 
                      [class.active]="vistaActual === 'cards'"
                      (click)="vistaActual = 'cards'"
                      matTooltip="Vista de tarjetas">
                <mat-icon>view_module</mat-icon>
              </button>
              <button mat-icon-button 
                      [class.active]="vistaActual === 'table'"
                      (click)="vistaActual = 'table'"
                      matTooltip="Vista de tabla">
                <mat-icon>view_list</mat-icon>
              </button>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 2: ESTADÍSTICAS -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">analytics</mat-icon>
            Estadísticas
          </ng-template>
          <app-estadisticas-liquidacion></app-estadisticas-liquidacion>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .motor-liquidacion-container {
      padding: 20px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .title-section h1 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1976d2;
      font-size: 28px;
    }

    .subtitle {
      margin: 8px 0 0 44px;
      color: #666;
      font-size: 14px;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .main-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-icon {
      margin-right: 8px;
    }

    .badge {
      background: #ff5252;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      margin-left: 8px;
      font-weight: 600;
    }

    .tab-content {
      padding: 24px;
    }

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: start;
    }

    .active-filters {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    /* Cards Grid */
    .liquidaciones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .liquidacion-card {
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      position: relative;
    }

    .liquidacion-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .avatar {
      background: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar.aprobada {
      background: #4caf50;
    }

    .card-menu {
      position: absolute;
      right: 8px;
      top: 8px;
    }

    .card-data {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      color: #666;
      font-size: 13px;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .value.total {
      font-size: 18px;
      color: #1976d2;
      font-weight: 600;
    }

    /* Tabla */
    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .liquidaciones-table {
      width: 100%;
    }

    .clickable-row {
      cursor: pointer;
      transition: background 0.2s;
    }

    .clickable-row:hover {
      background: #f5f5f5;
    }

    .valor-column {
      text-align: right;
      color: #1976d2;
    }

    /* Estados */
    .estado-borrador {
      background: #9e9e9e !important;
      color: white !important;
    }

    .estado-pendiente {
      background: #ff9800 !important;
      color: white !important;
    }

    .estado-aprobada {
      background: #4caf50 !important;
      color: white !important;
    }

    .estado-facturada {
      background: #2196f3 !important;
      color: white !important;
    }

    .estado-anulada {
      background: #f44336 !important;
      color: white !important;
    }

    .estado-rechazada {
      background: #d32f2f !important;
      color: white !important;
    }

    /* Toggle Vista */
    .view-toggle {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: white;
      border-radius: 24px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      padding: 4px;
    }

    .view-toggle button.active {
      background: #1976d2;
      color: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .liquidaciones-grid {
        grid-template-columns: 1fr;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MotorLiquidacionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedTab = 0;
  vistaActual: 'cards' | 'table' = 'cards';
  
  liquidaciones: Liquidacion[] = [];
  dataSource = new MatTableDataSource<Liquidacion>([]);
  displayedColumns = ['numero', 'contribuyente', 'renta', 'periodo', 'valorTotal', 'estado', 'acciones'];
  
  totalLiquidaciones = 0;
  
  filtros: FiltrosLiquidacion = {
    page: 0,
    size: 25
  };

  searchSubject = new Subject<string>();

  constructor(
    private liquidacionesService: LiquidacionesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadLiquidaciones();
    
    // Debounce para búsqueda
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filtros.search = searchTerm;
      this.filtros.page = 0;
      this.loadLiquidaciones();
    });
  }

  loadLiquidaciones() {
    this.liquidacionesService.getLiquidaciones(this.filtros).subscribe({
      next: (response) => {
        this.liquidaciones = response.content;
        this.dataSource.data = response.content;
        this.totalLiquidaciones = response.totalElements;
      },
      error: (error) => {
        console.error('Error cargando liquidaciones', error);
        this.snackBar.open('Error al cargar liquidaciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  applyFilters() {
    this.filtros.page = 0;
    this.loadLiquidaciones();
  }

  limpiarFiltros() {
    this.filtros = { page: 0, size: 25 };
    this.loadLiquidaciones();
  }

  removeFilter(field: keyof FiltrosLiquidacion) {
    (this.filtros as any)[field] = undefined;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.filtros.estado || this.filtros.vigencia || this.filtros.periodo);
  }

  onPageChange(event: PageEvent) {
    this.filtros.page = event.pageIndex;
    this.filtros.size = event.pageSize;
    this.loadLiquidaciones();
  }

  getIconByEstado(estado: string): string {
    const icons: any = {
      'BORRADOR': 'edit',
      'PENDIENTE': 'schedule',
      'APROBADA': 'check_circle',
      'FACTURADA': 'receipt',
      'ANULADA': 'cancel'
    };
    return icons[estado] || 'description';
  }

  verDetalle(liq: Liquidacion) {
    const dialogRef = this.dialog.open(DetalleLiquidacionDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: { liquidacionId: liq.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Manejar acciones desde el dialog de detalle
        if (result.action === 'reliquidar') {
          this.reliquidar(result.liquidacion);
        } else if (result.action === 'aprobar') {
          this.aprobar(result.liquidacion);
        } else if (result.action === 'rechazar') {
          if (result.liquidacion.id) {
            this.liquidacionesService.rechazarLiquidacion(result.liquidacion.id, 'Rechazado desde detalle').subscribe({
              next: () => {
                this.snackBar.open('Liquidación rechazada', 'Cerrar', { duration: 3000 });
                this.loadLiquidaciones();
              },
              error: (error) => this.snackBar.open('Error al rechazar liquidación', 'Cerrar', { duration: 3000 })
            });
          }
        } else if (result.action === 'editar') {
          this.editar(result.liquidacion);
        }
      }
    });
  }

  editar(liq: Liquidacion) {
    console.log('Editar:', liq);
    // TODO: Abrir dialog de edición
    this.snackBar.open('Edición - Por implementar', 'Cerrar', { duration: 2000 });
  }

  reliquidar(liq: Liquidacion) {
    const dialogRef = this.dialog.open(ReliquidacionDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      disableClose: true,
      data: { liquidacion: liq }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(
          result.tipo === 'reliquidacion' 
            ? 'Reliquidación completada exitosamente' 
            : 'Ajuste aplicado exitosamente',
          'Cerrar',
          { duration: 3000 }
        );
        this.loadLiquidaciones();
      }
    });
  }

  aprobar(liq: Liquidacion) {
    if (liq.id) {
      this.liquidacionesService.aprobarLiquidacion(liq.id).subscribe({
        next: () => {
          this.snackBar.open('Liquidación aprobada', 'Cerrar', { duration: 3000 });
          this.loadLiquidaciones();
        },
        error: () => {
          this.snackBar.open('Error al aprobar liquidación', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  anular(liq: Liquidacion) {
    console.log('Anular:', liq);
    // TODO: Abrir dialog para motivo de anulación
    this.snackBar.open('Anulación - Por implementar', 'Cerrar', { duration: 2000 });
  }

  openNuevaLiquidacion() {
    const dialogRef = this.dialog.open(NuevaLiquidacionDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Liquidación creada exitosamente', 'Cerrar', { duration: 3000 });
        this.loadLiquidaciones();
      }
    });
  }

  openLiquidacionMasiva() {
    const dialogRef = this.dialog.open(LiquidacionMasivaDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.verLiquidaciones) {
        this.loadLiquidaciones();
      }
    });
  }
}

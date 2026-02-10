import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';
import { FuenteIngreso } from '../../../core/models';

/**
 * Componente Tab: Fuentes de Ingreso
 * 
 * CRUD completo para gestionar las fuentes tributarias del municipio
 * Cada fuente representa un tipo de tributo (Predial, ICA, etc.)
 */
@Component({
  selector: 'app-fuentes-ingreso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule
  ],
  template: `
    <div class="fuentes-container">
      <!-- Header -->
      <div class="header">
        <div class="title-section">
          <h2>
            <mat-icon>account_balance</mat-icon>
            Fuentes de Ingreso
          </h2>
          <p>Gestiona las fuentes tributarias del municipio</p>
        </div>
        <button mat-raised-button color="primary" (click)="nuevaFuente()">
          <mat-icon>add</mat-icon>
          Nueva Fuente
        </button>
      </div>

      <!-- Formulario de Edición/Creación -->
      <mat-expansion-panel *ngIf="mostrarFormulario" [expanded]="mostrarFormulario" class="form-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon>{{ editando ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editando ? 'Editar Fuente' : 'Nueva Fuente de Ingreso' }}
          </mat-panel-title>
        </mat-expansion-panel-header>

        <form [formGroup]="fuenteForm" (ngSubmit)="guardar()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Código</mat-label>
              <input matInput formControlName="codigo" placeholder="FI-001">
              <mat-hint>Código único de identificación</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" placeholder="Impuesto Predial Unificado">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Categoría</mat-label>
              <mat-select formControlName="categoria">
                <mat-option value="IMPUESTO">Impuesto</mat-option>
                <mat-option value="TASA">Tasa</mat-option>
                <mat-option value="CONTRIBUCION">Contribución</mat-option>
                <mat-option value="MULTA">Multa</mat-option>
                <mat-option value="SANCION">Sanción</mat-option>
                <mat-option value="OTRO">Otro</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Periodicidad</mat-label>
              <mat-select formControlName="periodicidad">
                <mat-option value="MENSUAL">Mensual</mat-option>
                <mat-option value="BIMESTRAL">Bimestral</mat-option>
                <mat-option value="TRIMESTRAL">Trimestral</mat-option>
                <mat-option value="CUATRIMESTRAL">Cuatrimestral</mat-option>
                <mat-option value="SEMESTRAL">Semestral</mat-option>
                <mat-option value="ANUAL">Anual</mat-option>
                <mat-option value="EVENTUAL">Eventual</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="3"
                        placeholder="Descripción detallada de la fuente de ingreso..."></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Base Legal</mat-label>
              <input matInput formControlName="baseLegal" placeholder="Acuerdo Municipal No. 001 de 2026">
              <mat-hint>Normativa que sustenta la fuente</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="activo">
                <mat-option [value]="true">Activa</mat-option>
                <mat-option [value]="false">Inactiva</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelar()">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!fuenteForm.valid">
              <mat-icon>save</mat-icon>
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </mat-expansion-panel>

      <!-- Tabla de Fuentes -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-header">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar fuente</mat-label>
              <input matInput (keyup)="aplicarFiltro($event)" placeholder="Código, nombre...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <div class="filter-chips">
              <mat-chip-listbox>
                <mat-chip-option 
                  *ngFor="let categoria of categorias" 
                  [selected]="categoriaFiltro === categoria.value"
                  (click)="filtrarPorCategoria(categoria.value)">
                  {{ categoria.label }}
                </mat-chip-option>
              </mat-chip-listbox>
            </div>
          </div>

          <table mat-table [dataSource]="dataSource" class="fuentes-table">
            <!-- Columna Código -->
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef>Código</th>
              <td mat-cell *matCellDef="let fuente">
                <span class="codigo-badge">{{ fuente.codigo }}</span>
              </td>
            </ng-container>

            <!-- Columna Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let fuente">
                <div class="nombre-cell">
                  <strong>{{ fuente.nombre }}</strong>
                  <span class="descripcion">{{ fuente.descripcion }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Columna Categoría -->
            <ng-container matColumnDef="categoria">
              <th mat-header-cell *matHeaderCellDef>Categoría</th>
              <td mat-cell *matCellDef="let fuente">
                <mat-chip [class]="'categoria-' + fuente.categoria.toLowerCase()">
                  {{ fuente.categoria }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Columna Periodicidad -->
            <ng-container matColumnDef="periodicidad">
              <th mat-header-cell *matHeaderCellDef>Periodicidad</th>
              <td mat-cell *matCellDef="let fuente">{{ fuente.periodicidad }}</td>
            </ng-container>

            <!-- Columna Conceptos -->
            <ng-container matColumnDef="conceptos">
              <th mat-header-cell *matHeaderCellDef class="center-cell">Conceptos</th>
              <td mat-cell *matCellDef="let fuente" class="center-cell">
                <mat-chip class="count-chip">{{ fuente.cantidadConceptos || 0 }}</mat-chip>
              </td>
            </ng-container>

            <!-- Columna Estado -->
            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let fuente">
                <mat-chip [class]="fuente.activo ? 'estado-activo' : 'estado-inactivo'">
                  {{ fuente.activo ? 'ACTIVA' : 'INACTIVA' }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Columna Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="center-cell">Acciones</th>
              <td mat-cell *matCellDef="let fuente" class="center-cell">
                <button mat-icon-button [matTooltip]="'Editar'" (click)="editar(fuente)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button 
                        [matTooltip]="fuente.activo ? 'Desactivar' : 'Activar'" 
                        (click)="toggleEstado(fuente)">
                  <mat-icon>{{ fuente.activo ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                </button>
                <button mat-icon-button 
                        [matTooltip]="'Eliminar'" 
                        (click)="eliminar(fuente)"
                        color="warn"
                        [disabled]="fuente.cantidadConceptos > 0">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <!-- Fila cuando no hay datos -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                <mat-icon>info</mat-icon>
                <p>No se encontraron fuentes de ingreso</p>
              </td>
            </tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .fuentes-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .title-section {
        h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 8px;
          font-size: 24px;
        }

        p {
          margin: 0;
          color: #666;
        }
      }

      button mat-icon {
        margin-right: 8px;
      }
    }

    .form-panel {
      margin-bottom: 24px;

      mat-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin: 24px 0;

        .full-width {
          grid-column: 1 / -1;
        }

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;

        button mat-icon {
          margin-right: 4px;
        }
      }
    }

    .table-card {
      mat-card-content {
        padding: 0;
      }

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        gap: 16px;

        @media (max-width: 968px) {
          flex-direction: column;
          align-items: stretch;
        }

        .search-field {
          min-width: 300px;

          @media (max-width: 968px) {
            min-width: 100%;
          }
        }

        .filter-chips {
          flex: 1;

          mat-chip-listbox {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      }
    }

    .fuentes-table {
      width: 100%;

      th {
        background-color: #f5f5f5;
        font-weight: 500;
      }

      .center-cell {
        text-align: center;
      }

      .codigo-badge {
        display: inline-block;
        padding: 4px 12px;
        background-color: #e3f2fd;
        border-radius: 12px;
        font-family: monospace;
        font-size: 12px;
        font-weight: 500;
        color: #1976d2;
      }

      .nombre-cell {
        display: flex;
        flex-direction: column;
        gap: 4px;

        strong {
          font-size: 14px;
        }

        .descripcion {
          font-size: 12px;
          color: #666;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      mat-chip {
        font-size: 11px;
        min-height: 24px;
      }

      .categoria-impuesto {
        background-color: #e3f2fd !important;
        color: #1976d2 !important;
      }

      .categoria-tasa {
        background-color: #f3e5f5 !important;
        color: #7b1fa2 !important;
      }

      .categoria-contribucion {
        background-color: #e8f5e9 !important;
        color: #388e3c !important;
      }

      .categoria-multa {
        background-color: #ffebee !important;
        color: #c62828 !important;
      }

      .categoria-sancion {
        background-color: #fff3e0 !important;
        color: #e65100 !important;
      }

      .categoria-otro {
        background-color: #f5f5f5 !important;
        color: #616161 !important;
      }

      .count-chip {
        background-color: #9e9e9e !important;
        color: white !important;
      }

      .estado-activo {
        background-color: #4caf50 !important;
        color: white !important;
      }

      .estado-inactivo {
        background-color: #f44336 !important;
        color: white !important;
      }

      .no-data-cell {
        text-align: center;
        padding: 40px !important;
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
    }
  `]
})
export class FuentesIngresoComponent implements OnInit {
  fuenteForm: FormGroup;
  dataSource: MatTableDataSource<FuenteIngreso>;
  displayedColumns = ['codigo', 'nombre', 'categoria', 'periodicidad', 'conceptos', 'activo', 'acciones'];
  
  mostrarFormulario = false;
  editando = false;
  fuenteActual?: FuenteIngreso;
  categoriaFiltro = '';

  categorias = [
    { value: '', label: 'Todas' },
    { value: 'IMPUESTO', label: 'Impuestos' },
    { value: 'TASA', label: 'Tasas' },
    { value: 'CONTRIBUCION', label: 'Contribuciones' },
    { value: 'MULTA', label: 'Multas' },
    { value: 'SANCION', label: 'Sanciones' }
  ];

  constructor(
    private fb: FormBuilder,
    private liquidacionesService: LiquidacionesService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<FuenteIngreso>([]);

    this.fuenteForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      categoria: ['IMPUESTO', Validators.required],
      periodicidad: ['ANUAL', Validators.required],
      baseLegal: [''],
      activo: [true]
    });
  }

  ngOnInit() {
    this.cargarFuentes();
  }

  cargarFuentes() {
    this.liquidacionesService.getFuentesIngreso().subscribe({
      next: (fuentes) => {
        this.dataSource.data = fuentes;
      },
      error: (error) => {
        console.error('Error al cargar fuentes:', error);
        this.snackBar.open('Error al cargar fuentes de ingreso', 'Cerrar', { duration: 3000 });
      }
    });
  }

  nuevaFuente() {
    this.editando = false;
    this.fuenteActual = undefined;
    this.fuenteForm.reset({
      categoria: 'IMPUESTO',
      periodicidad: 'ANUAL',
      activo: true
    });
    this.mostrarFormulario = true;
  }

  editar(fuente: FuenteIngreso) {
    this.editando = true;
    this.fuenteActual = fuente;
    this.fuenteForm.patchValue(fuente);
    this.mostrarFormulario = true;
  }

  guardar() {
    if (this.fuenteForm.valid) {
      const fuente = this.fuenteForm.value;

      const observable = this.editando && this.fuenteActual
        ? this.liquidacionesService.updateFuenteIngreso(this.fuenteActual?.id!, fuente)
        : this.liquidacionesService.createFuenteIngreso(fuente);

      observable.subscribe({
        next: () => {
          this.snackBar.open(
            `Fuente ${this.editando ? 'actualizada' : 'creada'} exitosamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.cancelar();
          this.cargarFuentes();
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('Error al guardar fuente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.editando = false;
    this.fuenteActual = undefined;
    this.fuenteForm.reset();
  }

  toggleEstado(fuente: FuenteIngreso) {
    const nuevoEstado = !fuente.activo;
    this.liquidacionesService.updateFuenteIngreso(fuente.id!, { ...fuente, activo: nuevoEstado }).subscribe({
      next: () => {
        this.snackBar.open(
          `Fuente ${nuevoEstado ? 'activada' : 'desactivada'}`,
          'Cerrar',
          { duration: 2000 }
        );
        this.cargarFuentes();
      }
    });
  }

  eliminar(fuente: FuenteIngreso) {
    if (confirm(`¿Está seguro de eliminar la fuente "${fuente.nombre}"?`)) {
      this.liquidacionesService.deleteFuenteIngreso(fuente.id!).subscribe({
        next: () => {
          this.snackBar.open('Fuente eliminada', 'Cerrar', { duration: 2000 });
          this.cargarFuentes();
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('Error al eliminar fuente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaFiltro = categoria;
    if (categoria) {
      this.dataSource.filterPredicate = (data: FuenteIngreso) => {
        return data.categoria === categoria;
      };
      this.dataSource.filter = categoria;
    } else {
      this.dataSource.filterPredicate = () => true;
      this.dataSource.filter = '';
    }
  }
}

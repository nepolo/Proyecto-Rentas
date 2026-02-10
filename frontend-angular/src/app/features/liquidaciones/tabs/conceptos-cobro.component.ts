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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';
import { ConceptoCobro, FuenteIngreso } from '../../../core/models';

/**
 * Componente Tab: Conceptos de Cobro
 * 
 * CRUD para gestionar conceptos vinculados a fuentes de ingreso
 * Los conceptos se aplican en las liquidaciones y pueden usar fórmulas
 */
@Component({
  selector: 'app-conceptos-cobro',
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
    MatExpansionModule,
    MatCheckboxModule
  ],
  template: `
    <div class="conceptos-container">
      <div class="header">
        <div class="title-section">
          <h2>
            <mat-icon>category</mat-icon>
            Conceptos de Cobro
          </h2>
          <p>Define conceptos aplicables en liquidaciones por cada fuente de ingreso</p>
        </div>
        <button mat-raised-button color="primary" (click)="nuevoConcepto()">
          <mat-icon>add</mat-icon>
          Nuevo Concepto
        </button>
      </div>

      <!-- Formulario -->
      <mat-expansion-panel *ngIf="mostrarFormulario" [expanded]="mostrarFormulario" class="form-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon>{{ editando ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editando ? 'Editar Concepto' : 'Nuevo Concepto de Cobro' }}
          </mat-panel-title>
        </mat-expansion-panel-header>

        <form [formGroup]="conceptoForm" (ngSubmit)="guardar()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Código</mat-label>
              <input matInput formControlName="codigo" placeholder="CC-001">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" placeholder="Impuesto Predial">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fuente de Ingreso</mat-label>
              <mat-select formControlName="fuenteIngresoId">
                <mat-option *ngFor="let fuente of fuentes" [value]="fuente.id">
                  {{ fuente.nombre }}
                </mat-option>
              </mat-select>
              <mat-hint>Fuente a la que pertenece este concepto</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="2"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tarifa Base (%)</mat-label>
              <input matInput type="number" formControlName="tarifaBase" step="0.01">
              <span matSuffix>%</span>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Orden</mat-label>
              <input matInput type="number" formControlName="orden">
              <mat-hint>Orden de aplicación en liquidación</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fórmula de Cálculo</mat-label>
              <mat-select formControlName="formulaId">
                <mat-option [value]="null">Sin fórmula (cálculo manual)</mat-option>
                <mat-option value="1">Fórmula Predial</mat-option>
                <mat-option value="2">Fórmula ICA</mat-option>
                <mat-option value="3">Fórmula Valorización</mat-option>
              </mat-select>
              <mat-hint>Fórmula para cálculo automático</mat-hint>
            </mat-form-field>

            <div class="checkbox-group full-width">
              <mat-checkbox formControlName="obligatorio">
                Obligatorio en liquidación
              </mat-checkbox>
              <mat-checkbox formControlName="permiteDescuento">
                Permite descuentos
              </mat-checkbox>
              <mat-checkbox formControlName="generaInteres">
                Genera intereses por mora
              </mat-checkbox>
              <mat-checkbox formControlName="activo">
                Activo
              </mat-checkbox>
            </div>
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelar()">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!conceptoForm.valid">
              <mat-icon>save</mat-icon>
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </mat-expansion-panel>

      <!-- Filtros -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar concepto</mat-label>
              <input matInput (keyup)="aplicarFiltro($event)">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Filtrar por Fuente</mat-label>
              <mat-select [(value)]="fuenteFiltro" (selectionChange)="filtrarPorFuente()">
                <mat-option [value]="null">Todas las fuentes</mat-option>
                <mat-option *ngFor="let fuente of fuentes" [value]="fuente.id">
                  {{ fuente.nombre }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla -->
      <mat-card class="table-card">
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="conceptos-table">
            
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef>Código</th>
              <td mat-cell *matCellDef="let concepto">
                <span class="codigo-badge">{{ concepto.codigo }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Concepto</th>
              <td mat-cell *matCellDef="let concepto">
                <div class="concepto-info">
                  <strong>{{ concepto.nombre }}</strong>
                  <span class="descripcion">{{ concepto.descripcion }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="fuente">
              <th mat-header-cell *matHeaderCellDef>Fuente</th>
              <td mat-cell *matCellDef="let concepto">
                <mat-chip class="fuente-chip">
                  {{ getFuenteNombre(concepto.fuenteIngresoId) }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="tarifaBase">
              <th mat-header-cell *matHeaderCellDef class="number-cell">Tarifa Base</th>
              <td mat-cell *matCellDef="let concepto" class="number-cell">
                {{ concepto.tarifaBase }}%
              </td>
            </ng-container>

            <ng-container matColumnDef="formula">
              <th mat-header-cell *matHeaderCellDef class="center-cell">Fórmula</th>
              <td mat-cell *matCellDef="let concepto" class="center-cell">
                <mat-icon *ngIf="concepto.formulaId" 
                          color="primary" 
                          matTooltip="Usa fórmula automática">
                  functions
                </mat-icon>
                <mat-icon *ngIf="!concepto.formulaId" 
                          class="disabled-icon" 
                          matTooltip="Cálculo manual">
                  edit
                </mat-icon>
              </td>
            </ng-container>

            <ng-container matColumnDef="propiedades">
              <th mat-header-cell *matHeaderCellDef>Propiedades</th>
              <td mat-cell *matCellDef="let concepto">
                <div class="propiedades-chips">
                  <mat-chip *ngIf="concepto.obligatorio" class="prop-obligatorio">
                    <mat-icon>star</mat-icon>
                    Obligatorio
                  </mat-chip>
                  <mat-chip *ngIf="concepto.permiteDescuento" class="prop-descuento">
                    <mat-icon>discount</mat-icon>
                    Descuento
                  </mat-chip>
                  <mat-chip *ngIf="concepto.generaInteres" class="prop-interes">
                    <mat-icon>percent</mat-icon>
                    Interés
                  </mat-chip>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let concepto">
                <mat-chip [class]="concepto.activo ? 'estado-activo' : 'estado-inactivo'">
                  {{ concepto.activo ? 'ACTIVO' : 'INACTIVO' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="center-cell">Acciones</th>
              <td mat-cell *matCellDef="let concepto" class="center-cell">
                <button mat-icon-button matTooltip="Editar" (click)="editar(concepto)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button 
                        [matTooltip]="concepto.activo ? 'Desactivar' : 'Activar'"
                        (click)="toggleEstado(concepto)">
                  <mat-icon>{{ concepto.activo ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                </button>
                <button mat-icon-button 
                        matTooltip="Eliminar" 
                        (click)="eliminar(concepto)"
                        color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                <mat-icon>info</mat-icon>
                <p>No se encontraron conceptos de cobro</p>
              </td>
            </tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .conceptos-container {
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
        }
        p {
          margin: 0;
          color: #666;
        }
      }
    }

    .form-panel {
      margin-bottom: 24px;

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin: 24px 0;

        .full-width {
          grid-column: 1 / -1;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 8px;
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
      }
    }

    .filters-card {
      margin-bottom: 24px;

      .filters-row {
        display: flex;
        gap: 16px;
        align-items: center;

        .search-field {
          flex: 1;
        }

        @media (max-width: 768px) {
          flex-direction: column;
          align-items: stretch;
        }
      }
    }

    .table-card {
      mat-card-content {
        padding: 0;
      }
    }

    .conceptos-table {
      width: 100%;

      th {
        background-color: #f5f5f5;
        font-weight: 500;
      }

      .number-cell {
        text-align: right;
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

      .concepto-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .descripcion {
          font-size: 12px;
          color: #666;
        }
      }

      .fuente-chip {
        background-color: #f3e5f5 !important;
        color: #7b1fa2 !important;
      }

      .disabled-icon {
        color: #ccc;
      }

      .propiedades-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;

        mat-chip {
          font-size: 10px;
          min-height: 20px;
          padding: 0 8px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
        }

        .prop-obligatorio {
          background-color: #fff3e0 !important;
          color: #e65100 !important;
        }

        .prop-descuento {
          background-color: #e8f5e9 !important;
          color: #2e7d32 !important;
        }

        .prop-interes {
          background-color: #fff9c4 !important;
          color: #f57f17 !important;
        }
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
        }
      }
    }
  `]
})
export class ConceptosCobroComponent implements OnInit {
  conceptoForm: FormGroup;
  dataSource: MatTableDataSource<ConceptoCobro>;
  displayedColumns = ['codigo', 'nombre', 'fuente', 'tarifaBase', 'formula', 'propiedades', 'activo', 'acciones'];
  
  mostrarFormulario = false;
  editando = false;
  conceptoActual?: ConceptoCobro;
  fuentes: FuenteIngreso[] = [];
  fuenteFiltro: number | null = null;

  constructor(
    private fb: FormBuilder,
    private liquidacionesService: LiquidacionesService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<ConceptoCobro>([]);

    this.conceptoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      fuenteIngresoId: ['', Validators.required],
      tarifaBase: [0, [Validators.required, Validators.min(0)]],
      formulaId: [null],
      orden: [1, Validators.required],
      obligatorio: [false],
      permiteDescuento: [true],
      generaInteres: [false],
      activo: [true]
    });
  }

  ngOnInit() {
    this.cargarFuentes();
    this.cargarConceptos();
  }

  cargarFuentes() {
    this.liquidacionesService.getFuentesIngreso().subscribe({
      next: (fuentes) => {
        this.fuentes = fuentes;
      }
    });
  }

  cargarConceptos(fuenteId?: number) {
    this.liquidacionesService.getConceptosCobro(fuenteId).subscribe({
      next: (conceptos) => {
        this.dataSource.data = conceptos;
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error al cargar conceptos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  nuevoConcepto() {
    this.editando = false;
    this.conceptoActual = undefined;
    this.conceptoForm.reset({
      orden: 1,
      tarifaBase: 0,
      obligatorio: false,
      permiteDescuento: true,
      generaInteres: false,
      activo: true
    });
    this.mostrarFormulario = true;
  }

  editar(concepto: ConceptoCobro) {
    this.editando = true;
    this.conceptoActual = concepto;
    this.conceptoForm.patchValue(concepto);
    this.mostrarFormulario = true;
  }

  guardar() {
    if (this.conceptoForm.valid) {
      const concepto = this.conceptoForm.value;

      const observable = this.editando && this.conceptoActual
        ? this.liquidacionesService.updateConceptoCobro(this.conceptoActual?.id!, concepto)
        : this.liquidacionesService.createConceptoCobro(concepto);

      observable.subscribe({
        next: () => {
          this.snackBar.open(
            `Concepto ${this.editando ? 'actualizado' : 'creado'} exitosamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.cancelar();
          this.cargarConceptos(this.fuenteFiltro || undefined);
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('Error al guardar concepto', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.editando = false;
    this.conceptoActual = undefined;
    this.conceptoForm.reset();
  }

  toggleEstado(concepto: ConceptoCobro) {
    const nuevoEstado = !concepto.activo;
    this.liquidacionesService.updateConceptoCobro(concepto.id!, { ...concepto, activo: nuevoEstado }).subscribe({
      next: () => {
        this.snackBar.open(
          `Concepto ${nuevoEstado ? 'activado' : 'desactivado'}`,
          'Cerrar',
          { duration: 2000 }
        );
        this.cargarConceptos(this.fuenteFiltro || undefined);
      }
    });
  }

  eliminar(concepto: ConceptoCobro) {
    if (confirm(`¿Eliminar el concepto "${concepto.nombre}"?`)) {
      this.liquidacionesService.deleteConceptoCobro(concepto.id!).subscribe({
        next: () => {
          this.snackBar.open('Concepto eliminado', 'Cerrar', { duration: 2000 });
          this.cargarConceptos(this.fuenteFiltro || undefined);
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('Error al eliminar concepto', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filtrarPorFuente() {
    this.cargarConceptos(this.fuenteFiltro || undefined);
  }

  getFuenteNombre(fuenteId: number): string {
    const fuente = this.fuentes.find(f => f.id === fuenteId);
    return fuente?.nombre || 'Sin fuente';
  }
}

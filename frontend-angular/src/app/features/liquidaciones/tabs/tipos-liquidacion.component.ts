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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';
import { TipoLiquidacion } from '../../../core/models';

/**
 * Componente Tab: Tipos de Liquidación
 * 
 * Configuración de tipos con flujos de aprobación personalizados
 */
@Component({
  selector: 'app-tipos-liquidacion',
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
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="tipos-container">
      <div class="header">
        <div class="title-section">
          <h2>
            <mat-icon>description</mat-icon>
            Tipos de Liquidación
          </h2>
          <p>Configura tipos con flujos de aprobación personalizados</p>
        </div>
        <button mat-raised-button color="primary" (click)="nuevoTipo()">
          <mat-icon>add</mat-icon>
          Nuevo Tipo
        </button>
      </div>

      <!-- Formulario -->
      <mat-expansion-panel *ngIf="mostrarFormulario" [expanded]="mostrarFormulario" class="form-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <mat-icon>{{ editando ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editando ? 'Editar Tipo' : 'Nuevo Tipo de Liquidación' }}
          </mat-panel-title>
        </mat-expansion-panel-header>

        <form [formGroup]="tipoForm" (ngSubmit)="guardar()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Código</mat-label>
              <input matInput formControlName="codigo" placeholder="TL-001">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" placeholder="Liquidación Oficial">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="2"></textarea>
            </mat-form-field>

            <div class="config-section full-width">
              <h4>
                <mat-icon>settings</mat-icon>
                Configuración de Flujo
              </h4>

              <div class="config-grid">
                <mat-slide-toggle formControlName="requiereAprobacion">
                  Requiere Aprobación
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="aprobacionMultiple">
                  Aprobación en Múltiples Niveles
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="permiteEdicion">
                  Permite Edición Post-Creación
                </mat-slide-toggle>

                <mat-slide-toggle formControlName="generaFacturaAutomatica">
                  Genera Factura Automática
                </mat-slide-toggle>
              </div>

              <mat-form-field appearance="outline" *ngIf="tipoForm.get('requiereAprobacion')?.value">
                <mat-label>Roles Aprobadores</mat-label>
                <mat-select formControlName="rolesAprobadores" multiple>
                  <mat-option value="SUPERVISOR">Supervisor</mat-option>
                  <mat-option value="COORDINADOR">Coordinador</mat-option>
                  <mat-option value="DIRECTOR">Director</mat-option>
                  <mat-option value="SECRETARIO">Secretario de Hacienda</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Días de Vencimiento (desde aprobación)</mat-label>
                <input matInput type="number" formControlName="diasVencimiento" min="0">
                <mat-hint>0 = Sin vencimiento automático</mat-hint>
              </mat-form-field>
            </div>

            <div class="conceptos-section full-width">
              <h4>
                <mat-icon>category</mat-icon>
                Conceptos Aplicables
              </h4>
              <p class="section-hint">Define qué conceptos se pueden usar en este tipo de liquidación</p>
              
              <div class="conceptos-list">
                <mat-chip-listbox multiple>
                  <mat-chip-option *ngFor="let concepto of conceptosDisponibles" [value]="concepto.id">
                    {{ concepto.nombre }}
                  </mat-chip-option>
                </mat-chip-listbox>
              </div>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="activo">
                <mat-option [value]="true">Activo</mat-option>
                <mat-option [value]="false">Inactivo</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelar()">Cancelar</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="!tipoForm.valid">
              <mat-icon>save</mat-icon>
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </mat-expansion-panel>

      <!-- Tabla -->
      <div class="tipos-grid">
        <mat-card *ngFor="let tipo of tipos" class="tipo-card">
          <mat-card-header>
            <div class="card-header-content">
              <div class="title-row">
                <span class="codigo-badge">{{ tipo.codigo }}</span>
                <mat-chip [class]="tipo.activo ? 'estado-activo' : 'estado-inactivo'">
                  {{ tipo.activo ? 'ACTIVO' : 'INACTIVO' }}
                </mat-chip>
              </div>
              <h3>{{ tipo.nombre }}</h3>
              <p class="descripcion">{{ tipo.descripcion }}</p>
            </div>
          </mat-card-header>

          <mat-card-content>
            <div class="propiedades-list">
              <div class="prop-item" [class.active]="tipo.requiereAprobacion">
                <mat-icon>{{ tipo.requiereAprobacion ? 'check_circle' : 'cancel' }}</mat-icon>
                <span>Requiere Aprobación</span>
              </div>

              <div class="prop-item" [class.active]="tipo.aprobacionMultiple">
                <mat-icon>{{ tipo.aprobacionMultiple ? 'check_circle' : 'cancel' }}</mat-icon>
                <span>Aprobación Múltiple</span>
              </div>

              <div class="prop-item" [class.active]="tipo.permiteEdicion">
                <mat-icon>{{ tipo.permiteEdicion ? 'check_circle' : 'cancel' }}</mat-icon>
                <span>Permite Edición</span>
              </div>

              <div class="prop-item" [class.active]="tipo.generaFacturaAutomatica">
                <mat-icon>{{ tipo.generaFacturaAutomatica ? 'check_circle' : 'cancel' }}</mat-icon>
                <span>Factura Automática</span>
              </div>
            </div>

            <div class="meta-info">
              <div class="meta-item" *ngIf="tipo.diasVencimiento">
                <mat-icon>schedule</mat-icon>
                <span>Vence en {{ tipo.diasVencimiento }} días</span>
              </div>

              <div class="meta-item" *ngIf="tipo.conceptosAplicables?.length">
                <mat-icon>category</mat-icon>
                <span>{{ tipo.conceptosAplicables?.length || 0 }} conceptos</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button (click)="editar(tipo)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button (click)="toggleEstado(tipo)">
              <mat-icon>{{ tipo.activo ? 'toggle_off' : 'toggle_on' }}</mat-icon>
              {{ tipo.activo ? 'Desactivar' : 'Activar' }}
            </button>
            <button mat-button color="warn" (click)="eliminar(tipo)">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>

        <div *ngIf="tipos.length === 0" class="no-data">
          <mat-icon>description</mat-icon>
          <p>No hay tipos de liquidación configurados</p>
          <button mat-raised-button color="primary" (click)="nuevoTipo()">
            <mat-icon>add</mat-icon>
            Crear Primer Tipo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tipos-container {
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

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .config-section,
      .conceptos-section {
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
        border-left: 4px solid #1976d2;

        h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px;
          color: #1976d2;
        }

        .section-hint {
          margin: 0 0 16px;
          font-size: 13px;
          color: #666;
        }
      }

      .config-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 16px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .conceptos-list {
        mat-chip-listbox {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
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

    .tipos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .tipo-card {
      .card-header-content {
        width: 100%;

        .title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

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

          mat-chip {
            font-size: 10px;
            min-height: 20px;
          }
        }

        h3 {
          margin: 0 0 8px;
          font-size: 18px;
          color: #333;
        }

        .descripcion {
          margin: 0;
          font-size: 13px;
          color: #666;
          line-height: 1.4;
        }
      }

      mat-card-content {
        .propiedades-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;

          .prop-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 13px;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #ccc;
            }

            &.active mat-icon {
              color: #4caf50;
            }
          }
        }

        .meta-info {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #666;

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
            }
          }
        }
      }

      mat-card-actions {
        border-top: 1px solid #e0e0e0;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;

        button mat-icon {
          margin-right: 4px;
        }
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

    .no-data {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: #999;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      p {
        margin: 0 0 24px;
        font-size: 16px;
      }
    }
  `]
})
export class TiposLiquidacionComponent implements OnInit {
  tipoForm: FormGroup;
  tipos: TipoLiquidacion[] = [];
  conceptosDisponibles: any[] = [];
  
  mostrarFormulario = false;
  editando = false;
  tipoActual?: TipoLiquidacion;

  constructor(
    private fb: FormBuilder,
    private liquidacionesService: LiquidacionesService,
    private snackBar: MatSnackBar
  ) {
    this.tipoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      requiereAprobacion: [true],
      aprobacionMultiple: [false],
      permiteEdicion: [true],
      generaFacturaAutomatica: [false],
      rolesAprobadores: [[]],
      diasVencimiento: [30],
      activo: [true]
    });
  }

  ngOnInit() {
    this.cargarTipos();
    this.cargarConceptos();
  }

  cargarTipos() {
    this.liquidacionesService.getTiposLiquidacion().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error al cargar tipos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarConceptos() {
    this.liquidacionesService.getConceptosCobro().subscribe({
      next: (conceptos) => {
        this.conceptosDisponibles = conceptos;
      }
    });
  }

  nuevoTipo() {
    this.editando = false;
    this.tipoActual = undefined;
    this.tipoForm.reset({
      requiereAprobacion: true,
      aprobacionMultiple: false,
      permiteEdicion: true,
      generaFacturaAutomatica: false,
      rolesAprobadores: [],
      diasVencimiento: 30,
      activo: true
    });
    this.mostrarFormulario = true;
  }

  editar(tipo: TipoLiquidacion) {
    this.editando = true;
    this.tipoActual = tipo;
    this.tipoForm.patchValue(tipo);
    this.mostrarFormulario = true;
  }

  guardar() {
    if (this.tipoForm.valid) {
      const tipo = this.tipoForm.value;

      const observable = this.editando && this.tipoActual
        ? this.liquidacionesService.updateTipoLiquidacion(this.tipoActual?.id!, tipo)
        : this.liquidacionesService.createTipoLiquidacion(tipo);

      observable.subscribe({
        next: () => {
          this.snackBar.open(
            `Tipo ${this.editando ? 'actualizado' : 'creado'} exitosamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.cancelar();
          this.cargarTipos();
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('Error al guardar tipo', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.editando = false;
    this.tipoActual = undefined;
    this.tipoForm.reset();
  }

  toggleEstado(tipo: TipoLiquidacion) {
    const nuevoEstado = !tipo.activo;
    this.liquidacionesService.updateTipoLiquidacion(tipo.id!, { ...tipo, activo: nuevoEstado }).subscribe({
      next: () => {
        this.snackBar.open(
          `Tipo ${nuevoEstado ? 'activado' : 'desactivado'}`,
          'Cerrar',
          { duration: 2000 }
        );
        this.cargarTipos();
      }
    });
  }

  eliminar(tipo: TipoLiquidacion) {
    if (confirm(`¿Eliminar el tipo "${tipo.nombre}"?`)) {
      this.liquidacionesService.deleteTipoLiquidacion(tipo.id!).subscribe({
        next: () => {
          this.snackBar.open('Tipo eliminado', 'Cerrar', { duration: 2000 });
          this.cargarTipos();
        },
        error: (error) => {
          console.error('Error:', error);
          this.snackBar.open('Error al eliminar tipo', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}

import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

interface Entidad {
  id?: number;
  nit: string;
  digitoVerificacion: string;
  razonSocial: string;
  nombreComercial: string;
  tipoEntidad: string;
  regimen: string;
  direccion: string;
  municipio: string;
  departamento: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  representanteLegal: string;
  cedulaRepresentante: string;
  vigenciaFiscalActual: number;
  fechaInicioVigencia: Date;
  fechaFinVigencia: Date;
  logoUrl?: string;
  activa: boolean;
}

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule
  ],
  template: `
    <div class="entidades-container">
      <div class="header">
        <h2>Gestión de Entidades Territoriales</h2>
        <button mat-raised-button color="primary" (click)="toggleFormulario()" *ngIf="!mostrarFormulario()">
          <mat-icon>add</mat-icon>
          Nueva Entidad
        </button>
      </div>

      <!-- Formulario de Entidad -->
      <mat-card *ngIf="mostrarFormulario()" class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>business</mat-icon>
            {{ entidadSeleccionada() ? 'Editar Entidad' : 'Registrar Nueva Entidad' }}
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="entidadForm" class="entidad-form">
            <!-- Sección: Información Legal -->
            <div class="seccion">
              <h3>Información Legal</h3>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>NIT</mat-label>
                  <input matInput formControlName="nit" placeholder="900123456">
                  <mat-error *ngIf="entidadForm.get('nit')?.hasError('required')">El NIT es obligatorio</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Dígito de Verificación</mat-label>
                  <input matInput formControlName="digitoVerificacion" maxlength="1" placeholder="0">
                  <mat-error *ngIf="entidadForm.get('digitoVerificacion')?.hasError('required')">Requerido</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Razón Social</mat-label>
                  <input matInput formControlName="razonSocial" placeholder="Municipio de...">
                  <mat-error *ngIf="entidadForm.get('razonSocial')?.hasError('required')">La razón social es obligatoria</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nombre Comercial</mat-label>
                  <input matInput formControlName="nombreComercial" placeholder="Alcaldía Municipal de...">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Tipo de Entidad</mat-label>
                  <mat-select formControlName="tipoEntidad">
                    <mat-option value="MUNICIPIO">Municipio</mat-option>
                    <mat-option value="DISTRITO">Distrito</mat-option>
                    <mat-option value="DEPARTAMENTO">Departamento</mat-option>
                    <mat-option value="ENTIDAD_DESCENTRALIZADA">Entidad Descentralizada</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Régimen Tributario</mat-label>
                  <mat-select formControlName="regimen">
                    <mat-option value="ESPECIAL">Especial</mat-option>
                    <mat-option value="COMUN">Común</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Sección: Ubicación -->
            <div class="seccion">
              <h3>Ubicación</h3>
              <div class="form-grid">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Dirección</mat-label>
                  <input matInput formControlName="direccion" placeholder="Calle 10 # 20-30">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Municipio</mat-label>
                  <input matInput formControlName="municipio">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Departamento</mat-label>
                  <mat-select formControlName="departamento">
                    <mat-option value="CUNDINAMARCA">Cundinamarca</mat-option>
                    <mat-option value="ANTIOQUIA">Antioquia</mat-option>
                    <mat-option value="VALLE">Valle del Cauca</mat-option>
                    <mat-option value="ATLANTICO">Atlántico</mat-option>
                    <mat-option value="BOLIVAR">Bolívar</mat-option>
                    <mat-option value="SANTANDER">Santander</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Sección: Contacto -->
            <div class="seccion">
              <h3>Información de Contacto</h3>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Teléfono</mat-label>
                  <input matInput formControlName="telefono" placeholder="6011234567">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Correo Electrónico</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="contacto@municipio.gov.co">
                  <mat-error *ngIf="entidadForm.get('email')?.hasError('email')">Email inválido</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Sitio Web</mat-label>
                  <input matInput formControlName="sitioWeb" placeholder="https://www.municipio.gov.co">
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Sección: Representante Legal -->
            <div class="seccion">
              <h3>Representante Legal</h3>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Nombre Completo</mat-label>
                  <input matInput formControlName="representanteLegal" placeholder="Nombre del Alcalde">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Cédula</mat-label>
                  <input matInput formControlName="cedulaRepresentante" placeholder="1234567890">
                </mat-form-field>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Sección: Vigencia Fiscal -->
            <div class="seccion vigencia-section">
              <h3><mat-icon>calendar_today</mat-icon> Vigencia Fiscal</h3>
              <p class="descripcion">Configure el período fiscal actual para liquidaciones y facturación</p>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Vigencia Fiscal Actual</mat-label>
                  <input matInput formControlName="vigenciaFiscalActual" type="number" placeholder="2024">
                  <mat-hint>Año fiscal actual</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Fecha Inicio Vigencia</mat-label>
                  <input matInput [matDatepicker]="pickerInicio" formControlName="fechaInicioVigencia">
                  <mat-datepicker-toggle matIconSuffix [for]="pickerInicio"></mat-datepicker-toggle>
                  <mat-datepicker #pickerInicio></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Fecha Fin Vigencia</mat-label>
                  <input matInput [matDatepicker]="pickerFin" formControlName="fechaFinVigencia">
                  <mat-datepicker-toggle matIconSuffix [for]="pickerFin"></mat-datepicker-toggle>
                  <mat-datepicker #pickerFin></mat-datepicker>
                </mat-form-field>
              </div>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="cancelar()">Cancelar</button>
          <button mat-raised-button color="primary" (click)="guardarEntidad()" [disabled]="!entidadForm.valid">
            <mat-icon>save</mat-icon>
            Guardar Entidad
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Lista de Entidades -->
      <mat-card class="entidades-list" *ngIf="!mostrarFormulario()">
        <mat-card-content>
          <table mat-table [dataSource]="entidades()" class="entidades-table">
            <ng-container matColumnDef="nit">
              <th mat-header-cell *matHeaderCellDef>NIT</th>
              <td mat-cell *matCellDef="let entidad">{{ entidad.nit }}-{{ entidad.digitoVerificacion }}</td>
            </ng-container>

            <ng-container matColumnDef="razonSocial">
              <th mat-header-cell *matHeaderCellDef>Razón Social</th>
              <td mat-cell *matCellDef="let entidad">{{ entidad.razonSocial }}</td>
            </ng-container>

            <ng-container matColumnDef="tipoEntidad">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let entidad">
                <mat-chip>{{ entidad.tipoEntidad }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="vigencia">
              <th mat-header-cell *matHeaderCellDef>Vigencia Fiscal</th>
              <td mat-cell *matCellDef="let entidad">
                <strong>{{ entidad.vigenciaFiscalActual }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let entidad">
                <mat-chip [class.activa]="entidad.activa" [class.inactiva]="!entidad.activa">
                  {{ entidad.activa ? 'Activa' : 'Inactiva' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let entidad">
                <button mat-icon-button (click)="editarEntidad(entidad)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminarEntidad(entidad)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="entidades().length === 0" class="empty-state">
            <mat-icon>business</mat-icon>
            <p>No hay entidades registradas</p>
            <button mat-raised-button color="primary" (click)="toggleFormulario()">
              <mat-icon>add</mat-icon>
              Registrar Primera Entidad
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .entidades-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        margin: 0;
        font-size: 24px;
      }
    }

    .form-card {
      margin-bottom: 24px;

      mat-card-header {
        margin-bottom: 24px;

        mat-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
        }
      }
    }

    .entidad-form {
      .seccion {
        padding: 16px 0;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        &.vigencia-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;

          .descripcion {
            color: #666;
            font-size: 14px;
            margin-bottom: 16px;
          }
        }
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .full-width {
          grid-column: 1 / -1;
        }
      }

      mat-divider {
        margin: 16px 0;
      }
    }

    .entidades-table {
      width: 100%;

      mat-chip {
        font-size: 12px;

        &.activa {
          background: #4caf50;
          color: white;
        }

        &.inactiva {
          background: #f44336;
          color: white;
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      color: #999;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      p {
        font-size: 16px;
        margin-bottom: 16px;
      }
    }
  `]
})
export class EntidadesComponent {
  private fb = inject(FormBuilder);
  
  mostrarFormulario = signal(false);
  entidadSeleccionada = signal<Entidad | null>(null);
  entidades = signal<Entidad[]>([
    {
      id: 1,
      nit: '890123456',
      digitoVerificacion: '7',
      razonSocial: 'Municipio de Ejemplo',
      nombreComercial: 'Alcaldía Municipal de Ejemplo',
      tipoEntidad: 'MUNICIPIO',
      regimen: 'ESPECIAL',
      direccion: 'Calle 10 # 20-30',
      municipio: 'Ejemplo',
      departamento: 'CUNDINAMARCA',
      telefono: '6011234567',
      email: 'contacto@ejemplo.gov.co',
      sitioWeb: 'https://www.ejemplo.gov.co',
      representanteLegal: 'Juan Pérez García',
      cedulaRepresentante: '1234567890',
      vigenciaFiscalActual: 2024,
      fechaInicioVigencia: new Date('2024-01-01'),
      fechaFinVigencia: new Date('2024-12-31'),
      activa: true
    }
  ]);

  displayedColumns = ['nit', 'razonSocial', 'tipoEntidad', 'vigencia', 'estado', 'acciones'];

  entidadForm: FormGroup;

  constructor() {
    this.entidadForm = this.fb.group({
      nit: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      digitoVerificacion: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      razonSocial: ['', Validators.required],
      nombreComercial: [''],
      tipoEntidad: ['MUNICIPIO', Validators.required],
      regimen: ['ESPECIAL', Validators.required],
      direccion: ['', Validators.required],
      municipio: ['', Validators.required],
      departamento: ['CUNDINAMARCA', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sitioWeb: [''],
      representanteLegal: ['', Validators.required],
      cedulaRepresentante: ['', Validators.required],
      vigenciaFiscalActual: [new Date().getFullYear(), Validators.required],
      fechaInicioVigencia: [new Date(), Validators.required],
      fechaFinVigencia: [new Date(new Date().getFullYear(), 11, 31), Validators.required]
    });
  }

  toggleFormulario() {
    this.mostrarFormulario.set(!this.mostrarFormulario());
    if (!this.mostrarFormulario()) {
      this.entidadForm.reset();
      this.entidadSeleccionada.set(null);
    }
  }

  guardarEntidad() {
    if (this.entidadForm.valid) {
      const nuevaEntidad = {
        ...this.entidadForm.value,
        id: this.entidadSeleccionada()?.id || Date.now(),
        activa: true
      };

      const entidadesActuales = [...this.entidades()];
      if (this.entidadSeleccionada()) {
        const index = entidadesActuales.findIndex(e => e.id === this.entidadSeleccionada()!.id);
        entidadesActuales[index] = nuevaEntidad;
      } else {
        entidadesActuales.push(nuevaEntidad);
      }

      this.entidades.set(entidadesActuales);
      this.toggleFormulario();
    }
  }

  editarEntidad(entidad: Entidad) {
    this.entidadSeleccionada.set(entidad);
    this.entidadForm.patchValue(entidad);
    this.mostrarFormulario.set(true);
  }

  eliminarEntidad(entidad: Entidad) {
    if (confirm(`¿Está seguro de eliminar la entidad ${entidad.razonSocial}?`)) {
      this.entidades.set(this.entidades().filter(e => e.id !== entidad.id));
    }
  }

  cancelar() {
    this.toggleFormulario();
  }
}

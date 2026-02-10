import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PeriodoLiquidacion } from '../../../core/models';

@Component({
  selector: 'app-periodo-liquidacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>calendar_month</mat-icon>
      {{ data.periodo ? 'Editar' : 'Nuevo' }} Período de Liquidación
      <span class="subtitle">Período total de cobro del impuesto</span>
    </h2>

    <mat-dialog-content>
      <form [formGroup]="periodoForm" class="periodo-form">
        <!-- Identificación -->
        <div class="form-section">
          <h3>Identificación del Período</h3>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Vigencia (Año Fiscal)</mat-label>
              <input matInput type="number" formControlName="vigencia" 
                     placeholder="2024" min="2020" max="2050">
              <mat-icon matSuffix>event</mat-icon>
              <mat-error *ngIf="periodoForm.get('vigencia')?.hasError('required')">
                Campo obligatorio
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tipo de Período</mat-label>
              <mat-select formControlName="tipoPeriodo" (selectionChange)="onTipoPeriodoChange()">
                <mat-option value="ANUAL">Anual (1 período)</mat-option>
                <mat-option value="SEMESTRAL">Semestral (2 períodos)</mat-option>
                <mat-option value="CUATRIMESTRAL">Cuatrimestral (3 períodos)</mat-option>
                <mat-option value="TRIMESTRAL">Trimestral (4 períodos)</mat-option>
                <mat-option value="BIMESTRAL">Bimestral (6 períodos)</mat-option>
                <mat-option value="MENSUAL">Mensual (12 períodos)</mat-option>
              </mat-select>
              <mat-icon matSuffix>schedule</mat-icon>
              <mat-hint>Define la frecuencia total de liquidación</mat-hint>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <input matInput formControlName="descripcion" 
                   placeholder="Ej: Primer Trimestre 2024 - Enero a Marzo">
            <mat-icon matSuffix>description</mat-icon>
          </mat-form-field>
        </div>

        <!-- Fechas -->
        <div class="form-section">
          <h3>Rango de Fechas</h3>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Fecha Inicio</mat-label>
              <input matInput [matDatepicker]="pickerInicio" formControlName="fechaInicio">
              <mat-datepicker-toggle matIconSuffix [for]="pickerInicio"></mat-datepicker-toggle>
              <mat-datepicker #pickerInicio></mat-datepicker>
              <mat-error *ngIf="periodoForm.get('fechaInicio')?.hasError('required')">
                Campo obligatorio
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha Fin</mat-label>
              <input matInput [matDatepicker]="pickerFin" formControlName="fechaFin">
              <mat-datepicker-toggle matIconSuffix [for]="pickerFin"></mat-datepicker-toggle>
              <mat-datepicker #pickerFin></mat-datepicker>
              <mat-hint>Opcional - Dejar vacío si es indefinido</mat-hint>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Fecha Vencimiento Liquidación</mat-label>
            <input matInput [matDatepicker]="pickerVencimiento" formControlName="fechaVencimiento">
            <mat-datepicker-toggle matIconSuffix [for]="pickerVencimiento"></mat-datepicker-toggle>
            <mat-datepicker #pickerVencimiento></mat-datepicker>
            <mat-hint>Fecha límite para liquidar este período</mat-hint>
          </mat-form-field>
        </div>

        <!-- Estado y Observaciones -->
        <div class="form-section">
          <h3>Estado</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Estado del Período</mat-label>
            <mat-select formControlName="estado">
              <mat-option value="ACTIVO">Activo - En Liquidación</mat-option>
              <mat-option value="CERRADO">Cerrado - Liquidaciones Completas</mat-option>
              <mat-option value="ANULADO">Anulado - Período Cancelado</mat-option>
            </mat-select>
            <mat-icon matSuffix>info</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Observaciones</mat-label>
            <textarea matInput formControlName="observaciones" rows="3"
                      placeholder="Notas adicionales sobre este período"></textarea>
            <mat-icon matSuffix>note</mat-icon>
          </mat-form-field>
        </div>

        <!-- Información Adicional (si está editando) -->
        <div class="form-section info-section" *ngIf="data.periodo">
          <h3>Información de Liquidación</h3>
          <div class="info-grid">
            <div class="info-item">
              <mat-icon>assignment</mat-icon>
              <div>
                <span class="info-label">Liquidaciones Generadas</span>
                <span class="info-value">{{ data.periodo.numeroLiquidacionesGeneradas || 0 }}</span>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>payments</mat-icon>
              <div>
                <span class="info-label">Valor Total Liquidado</span>
                <span class="info-value">{{ (data.periodo.valorTotalLiquidado || 0) | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            </div>
            <div class="info-item">
              <mat-icon>description</mat-icon>
              <div>
                <span class="info-label">Períodos Facturación</span>
                <span class="info-value">{{ data.periodo.numeroPeriodosFacturacion || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" 
              [disabled]="periodoForm.invalid">
        <mat-icon>save</mat-icon>
        Guardar Período
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .subtitle {
        font-size: 13px;
        font-weight: 400;
        color: #666;
        margin-top: 4px;
      }
    }

    .periodo-form {
      max-width: 700px;
      padding: 16px 0;
    }

    .form-section {
      margin-bottom: 32px;

      h3 {
        color: #667eea;
        font-size: 16px;
        margin: 0 0 16px 0;
        font-weight: 600;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .info-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;

      .info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background: white;
        padding: 12px;
        border-radius: 8px;

        mat-icon {
          color: #667eea;
          font-size: 32px;
          width: 32px;
          height: 32px;
        }

        div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          font-weight: 500;
        }

        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
      }
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 0 -24px -20px;
    }
  `]
})
export class PeriodoLiquidacionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PeriodoLiquidacionDialogComponent>);
  data: { periodo?: PeriodoLiquidacion; fuenteIngresoId: number } = inject(MAT_DIALOG_DATA);

  periodoForm!: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const periodo = this.data.periodo;
    const fechaActual = new Date();
    const vigenciaActual = fechaActual.getFullYear();
    
    this.periodoForm = this.fb.group({
      id: [periodo?.id || null],  // ID interno autogenerado
      vigencia: [periodo?.vigencia || vigenciaActual, [Validators.required, Validators.min(2020)]],
      tipoPeriodo: [periodo?.tipoPeriodo || 'ANUAL', Validators.required],
      descripcion: [periodo?.descripcion || ''],
      fechaInicio: [periodo?.fechaInicio ? new Date(periodo.fechaInicio) : null, Validators.required],
      fechaFin: [periodo?.fechaFin ? new Date(periodo.fechaFin) : null],
      fechaVencimiento: [periodo?.fechaVencimiento ? new Date(periodo.fechaVencimiento) : null],
      estado: [periodo?.estado || 'ACTIVO', Validators.required],
      observaciones: [periodo?.observaciones || '']
    });
  }

  onTipoPeriodoChange() {
    const tipo = this.periodoForm.get('tipoPeriodo')?.value;
    const vigencia = this.periodoForm.get('vigencia')?.value;
    
    // Generar descripción automática según el tipo
    const descripciones: Record<string, string> = {
      'ANUAL': `Período Anual ${vigencia}`,
      'SEMESTRAL': `Período Semestral ${vigencia}`,
      'CUATRIMESTRAL': `Período Cuatrimestral ${vigencia}`,
      'TRIMESTRAL': `Período Trimestral ${vigencia}`,
      'BIMESTRAL': `Período Bimestral ${vigencia}`,
      'MENSUAL': `Período Mensual ${vigencia}`
    };
    
    this.periodoForm.patchValue({
      descripcion: descripciones[tipo] || `Período ${tipo} ${vigencia}`
    });
  }

  guardar() {
    if (this.periodoForm.valid) {
      const formValue = this.periodoForm.value;
      
      // Generar ID si es nuevo
      const periodoId = formValue.id || `PL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const periodo: PeriodoLiquidacion = {
        ...this.data.periodo,
        id: periodoId,
        ...formValue,
        fuenteIngresoId: this.data.fuenteIngresoId,
        fechaInicio: this.formatDate(formValue.fechaInicio),
        fechaFin: this.formatDate(formValue.fechaFin),
        fechaVencimiento: formValue.fechaVencimiento ? this.formatDate(formValue.fechaVencimiento) : undefined,
        // Auditoría
        creadoPor: this.data.periodo?.creadoPor || 'usuario@sistema.com',
        fechaCreacion: this.data.periodo?.fechaCreacion || new Date().toISOString(),
        modificadoPor: 'usuario@sistema.com',
        fechaModificacion: new Date().toISOString()
      };
      this.dialogRef.close(periodo);
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  cancelar() {
    this.dialogRef.close();
  }
}

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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PeriodoFacturacion, PeriodoLiquidacion } from '../../../core/models';

@Component({
  selector: 'app-periodo-facturacion-dialog',
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
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>receipt</mat-icon>
      {{ data.periodoFacturacion ? 'Editar' : 'Nuevo' }} Período de Facturación
      <span class="subtitle">Define las cuotas en que se divide la deuda</span>
    </h2>

    <mat-dialog-content>
      <form [formGroup]="periodoForm" class="periodo-form">
        
        <!-- Información del Período de Liquidación Padre -->
        <div class="info-section" *ngIf="data.periodoLiquidacion">
          <mat-icon>info</mat-icon>
          <div class="info-content">
            <strong>Período de Liquidación:</strong> {{ data.periodoLiquidacion.descripcion }}
            <span class="info-detail">
              {{ data.periodoLiquidacion.fechaInicio | date:'dd/MM/yyyy' }} - 
              {{ data.periodoLiquidacion.fechaFin | date:'dd/MM/yyyy' }}
            </span>
          </div>
        </div>

        <!-- Identificación -->
        <div class="form-section">
          <h3>Identificación del Período</h3>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Número de Período (Cuota)</mat-label>
              <input matInput type="number" formControlName="numeroPeriodo" 
                     placeholder="1, 2, 3..." min="1" max="12">
              <mat-icon matSuffix>tag</mat-icon>
              <mat-hint>Cuota número X del total de cuotas</mat-hint>
              <mat-error *ngIf="periodoForm.get('numeroPeriodo')?.hasError('required')">
                Campo obligatorio
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado Facturación</mat-label>
              <mat-select formControlName="estadoFacturacion">
                <mat-option value="PENDIENTE">Pendiente</mat-option>
                <mat-option value="EN_PROCESO">En Proceso</mat-option>
                <mat-option value="FACTURADO">Facturado</mat-option>
                <mat-option value="ANULADO">Anulado</mat-option>
              </mat-select>
              <mat-icon matSuffix>info</mat-icon>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <input matInput formControlName="descripcion" 
                   placeholder="Ej: Bimestre 1 - 2024 (Enero-Febrero)">
            <mat-icon matSuffix>description</mat-icon>
          </mat-form-field>
        </div>

        <!-- Rango de Fechas -->
        <div class="form-section">
          <h3>Rango de Fechas del Período</h3>
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
              <mat-error *ngIf="periodoForm.get('fechaFin')?.hasError('required')">
                Campo obligatorio
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Fecha Vencimiento de Pago</mat-label>
            <input matInput [matDatepicker]="pickerVencimiento" formControlName="fechaVencimiento">
            <mat-datepicker-toggle matIconSuffix [for]="pickerVencimiento"></mat-datepicker-toggle>
            <mat-datepicker #pickerVencimiento></mat-datepicker>
            <mat-hint>Fecha límite para pagar esta cuota sin intereses</mat-hint>
            <mat-error *ngIf="periodoForm.get('fechaVencimiento')?.hasError('required')">
              Campo obligatorio
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Valores -->
        <div class="form-section">
          <h3>Configuración de Valores</h3>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Valor de la Cuota</mat-label>
              <input matInput type="number" formControlName="valorCuota" 
                     placeholder="0.00" step="0.01">
              <mat-icon matSuffix>attach_money</mat-icon>
              <mat-hint>Opcional - Valor en pesos de esta cuota</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Porcentaje de la Cuota (%)</mat-label>
              <input matInput type="number" formControlName="porcentajeCuota" 
                     placeholder="16.67" step="0.01" min="0" max="100">
              <mat-icon matSuffix>percent</mat-icon>
              <mat-hint>Opcional - % del total que representa esta cuota</mat-hint>
              <mat-icon matSuffix>percent</mat-icon>
              <mat-hint>% del total que representa esta cuota</mat-hint>
            </mat-form-field>
          </div>
        </div>

        <!-- Configuración de Pago -->
        <div class="form-section">
          <h3>Configuración de Pago</h3>
          <div class="options-grid">
            <mat-checkbox formControlName="permitePagoAnticipado" class="option-item">
              <div class="option-content">
                <strong>Permite Pago Anticipado</strong>
                <span>El contribuyente puede pagar antes del vencimiento</span>
              </div>
            </mat-checkbox>

            <mat-checkbox formControlName="generaDescuentoProntoPago" class="option-item">
              <div class="option-content">
                <strong>Genera Descuento Pronto Pago</strong>
                <span>Aplica descuento si paga antes de la fecha</span>
              </div>
            </mat-checkbox>
          </div>

          <div class="form-grid" *ngIf="periodoForm.get('generaDescuentoProntoPago')?.value">
            <mat-form-field appearance="outline">
              <mat-label>Porcentaje Descuento (%)</mat-label>
              <input matInput type="number" formControlName="porcentajeDescuentoProntoPago" 
                     placeholder="5" step="0.1" min="0" max="100">
              <mat-icon matSuffix>percent</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Días para Descuento</mat-label>
              <input matInput type="number" formControlName="diasDescuentoProntoPago" 
                     placeholder="15" min="1">
              <mat-icon matSuffix>calendar_today</mat-icon>
              <mat-hint>Días antes del vencimiento</mat-hint>
            </mat-form-field>
          </div>

          <div class="options-grid">
            <mat-checkbox formControlName="generaInteresesMora" class="option-item">
              <div class="option-content">
                <strong>Genera Intereses de Mora</strong>
                <span>Aplica intereses después del vencimiento</span>
              </div>
            </mat-checkbox>
          </div>

          <mat-form-field appearance="outline" class="full-width" 
                          *ngIf="periodoForm.get('generaInteresesMora')?.value">
            <mat-label>Porcentaje Interés Mora (% mensual)</mat-label>
            <input matInput type="number" formControlName="porcentajeInteresesMora" 
                   placeholder="2.13" step="0.01" min="0" max="100">
            <mat-icon matSuffix>trending_up</mat-icon>
            <mat-hint>Tasa de interés mensual por mora</mat-hint>
          </mat-form-field>
        </div>

        <!-- Estado -->
        <div class="form-section">
          <h3>Estado</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Estado del Período</mat-label>
            <mat-select formControlName="estadoPeriodo">
              <mat-option value="ACTIVO">Activo</mat-option>
              <mat-option value="CERRADO">Cerrado</mat-option>
              <mat-option value="ANULADO">Anulado</mat-option>
            </mat-select>
            <mat-icon matSuffix>check_circle</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Observaciones</mat-label>
            <textarea matInput formControlName="observaciones" rows="3"
                      placeholder="Notas adicionales sobre este período de facturación"></textarea>
            <mat-icon matSuffix>note</mat-icon>
          </mat-form-field>
        </div>

        <!-- Información Adicional (solo en edición) -->
        <div class="info-section-details" *ngIf="data.periodoFacturacion">
          <h3>Información Estadística</h3>
          <div class="info-grid">
            <div class="info-item">
              <mat-icon>description</mat-icon>
              <div>
                <span class="info-label">Facturas Generadas</span>
                <span class="info-value">{{ data.periodoFacturacion.numeroFacturasGeneradas || 0 }}</span>
              </div>
            </div>

            <div class="info-item">
              <mat-icon>payments</mat-icon>
              <div>
                <span class="info-label">Valor Total Facturado</span>
                <span class="info-value">{{ (data.periodoFacturacion.valorTotalFacturado || 0) | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            </div>

            <div class="info-item">
              <mat-icon>check_circle</mat-icon>
              <div>
                <span class="info-label">Estado Facturación</span>
                <span class="info-value">{{ data.periodoFacturacion.estadoFacturacion }}</span>
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
        Guardar Período de Facturación
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
      max-width: 800px;
      padding: 16px 0;
    }

    .info-section {
      display: flex;
      align-items: start;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 8px;
      margin-bottom: 24px;

      mat-icon {
        color: #2196f3;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .info-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        strong {
          font-size: 14px;
          color: #1976d2;
        }

        .info-detail {
          font-size: 13px;
          color: #555;
        }
      }
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

    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .option-item {
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: all 0.2s;

      &:hover {
        background: #f5f5f5;
        border-color: #667eea;
      }

      .option-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-left: 8px;

        strong {
          font-size: 14px;
          color: #333;
        }

        span {
          font-size: 12px;
          color: #666;
        }
      }
    }

    .info-section-details {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-top: 24px;

      h3 {
        color: #667eea;
        font-size: 15px;
        margin: 0 0 12px 0;
      }

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
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        div {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .info-label {
            font-size: 12px;
            color: #666;
          }

          .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }
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
export class PeriodoFacturacionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PeriodoFacturacionDialogComponent>);
  data: { 
    periodoFacturacion?: PeriodoFacturacion; 
    periodoLiquidacion: PeriodoLiquidacion;
    fuenteIngresoId: number;
  } = inject(MAT_DIALOG_DATA);

  periodoForm!: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const periodo = this.data.periodoFacturacion;
    
    this.periodoForm = this.fb.group({
      id: [periodo?.id || null],
      numeroPeriodo: [periodo?.numeroPeriodo || 1, [Validators.required, Validators.min(1)]],
      descripcion: [periodo?.descripcion || ''],
      fechaInicio: [periodo?.fechaInicio ? new Date(periodo.fechaInicio) : null, Validators.required],
      fechaFin: [periodo?.fechaFin ? new Date(periodo.fechaFin) : null],
      fechaVencimiento: [periodo?.fechaVencimiento ? new Date(periodo.fechaVencimiento) : null, Validators.required],
      valorCuota: [periodo?.valorCuota || null],
      porcentajeCuota: [periodo?.porcentajeCuota || null],
      estadoFacturacion: [periodo?.estadoFacturacion || 'PENDIENTE', Validators.required],
      permitePagoAnticipado: [periodo?.permitePagoAnticipado ?? true],
      generaDescuentoProntoPago: [periodo?.generaDescuentoProntoPago ?? false],
      porcentajeDescuentoProntoPago: [periodo?.porcentajeDescuentoProntoPago || 0],
      diasDescuentoProntoPago: [periodo?.diasDescuentoProntoPago || 15],
      generaInteresesMora: [periodo?.generaInteresesMora ?? true],
      porcentajeInteresesMora: [periodo?.porcentajeInteresesMora || 2.13],
      estadoPeriodo: [periodo?.estadoPeriodo || 'ACTIVO', Validators.required],
      observaciones: [periodo?.observaciones || '']
    });
  }

  guardar() {
    if (this.periodoForm.valid) {
      const formValue = this.periodoForm.value;
      
      // Generar ID si es nuevo
      const periodoId = formValue.id || `PF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const periodo: PeriodoFacturacion = {
        ...this.data.periodoFacturacion,
        id: periodoId,
        ...formValue,
        periodoLiquidacionId: this.data.periodoLiquidacion.id!,
        fuenteIngresoId: this.data.fuenteIngresoId,
        vigencia: this.data.periodoLiquidacion.vigencia,
        fechaInicio: this.formatDate(formValue.fechaInicio),
        fechaFin: this.formatDate(formValue.fechaFin),
        fechaVencimiento: this.formatDate(formValue.fechaVencimiento),
        estaFacturado: formValue.estadoFacturacion === 'FACTURADO',
        // Auditoría
        creadoPor: this.data.periodoFacturacion?.creadoPor || 'usuario@sistema.com',
        fechaCreacion: this.data.periodoFacturacion?.fechaCreacion || new Date().toISOString(),
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

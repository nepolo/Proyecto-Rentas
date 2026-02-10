import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConceptoCobro } from '../../../core/models';

@Component({
  selector: 'app-concepto-dialog',
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
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ data.concepto ? 'edit' : 'add' }}</mat-icon>
      {{ data.concepto ? 'Editar' : 'Nuevo' }} Concepto de Cobro
    </h2>

    <mat-dialog-content>
      <form [formGroup]="conceptoForm" class="concepto-form">
        <!-- Información Básica -->
        <div class="form-section">
          <h3>Información Básica</h3>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Código (Autogenerado)</mat-label>
              <input matInput formControlName="codigo" readonly>
              <mat-icon matSuffix>tag</mat-icon>
              <mat-hint>Generado automáticamente</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tipo de Concepto</mat-label>
              <mat-select formControlName="tipoConcepto">
                <mat-option value="CAPITAL">Capital</mat-option>
                <mat-option value="INTERES">Intereses</mat-option>
                <mat-option value="SANCION">Sanción</mat-option>
                <mat-option value="DESCUENTO">Descuento</mat-option>
                <mat-option value="NOVEDAD">Novedad</mat-option>
                <mat-option value="OTRO">Otro</mat-option>
              </mat-select>
              <mat-icon matSuffix>category</mat-icon>
              <mat-hint>Clasifica el concepto de cobro</mat-hint>
              <mat-error *ngIf="conceptoForm.get('tipoConcepto')?.hasError('required')">
                Seleccione un tipo
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre del Concepto</mat-label>
            <input matInput formControlName="nombre" placeholder="Ej: Capital Impuesto Predial">
            <mat-icon matSuffix>text_fields</mat-icon>
            <mat-error *ngIf="conceptoForm.get('nombre')?.hasError('required')">
              Campo obligatorio
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="descripcion" rows="3" 
                      placeholder="Descripción detallada del concepto"></textarea>
            <mat-icon matSuffix>description</mat-icon>
          </mat-form-field>
        </div>

        <!-- Configuración Técnica -->
        <div class="form-section">
          <h3>Configuración Técnica</h3>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Operación (Signo)</mat-label>
              <mat-select formControlName="operacion">
                <mat-option value="SUMA">
                  <mat-icon class="option-icon">add</mat-icon>
                  Suma al Total
                </mat-option>
                <mat-option value="RESTA">
                  <mat-icon class="option-icon">remove</mat-icon>
                  Resta al Total
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>calculate</mat-icon>
              <mat-hint>Define si suma (+) o resta (-) en la liquidación</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Orden de Cálculo</mat-label>
              <input matInput type="number" formControlName="ordenCalculoFormula" 
                     placeholder="1, 2, 3...">
              <mat-icon matSuffix>format_list_numbered</mat-icon>
              <mat-hint>Orden de aplicación en fórmulas</mat-hint>
            </mat-form-field>
          </div>

          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Cuenta Contable (ID)</mat-label>
              <input matInput formControlName="cuentaContableId" placeholder="Ej: 1110-01-001">
              <mat-icon matSuffix>account_balance_wallet</mat-icon>
              <mat-hint>Código de cuenta para integración contable</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Concepto Contabilidad</mat-label>
              <input matInput formControlName="cuentaContableNombre" 
                     placeholder="Ej: Ingresos por Impuesto Predial">
              <mat-icon matSuffix>receipt_long</mat-icon>
              <mat-hint>Descripción del concepto contable asociado</mat-hint>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tarifa Base (%)</mat-label>
            <input matInput type="number" formControlName="tarifaBase" 
                   placeholder="Ej: 5.5" step="0.01">
            <mat-icon matSuffix>percent</mat-icon>
            <mat-hint>Tarifa por defecto si no hay fórmula específica</mat-hint>
          </mat-form-field>
        </div>

        <!-- Opciones -->
        <div class="form-section">
          <h3>Opciones</h3>
          <div class="options-grid">
            <mat-checkbox formControlName="esObligatorio" class="option-item">
              <div class="option-content">
                <strong>Obligatorio</strong>
                <span>Se debe aplicar siempre en liquidaciones</span>
              </div>
            </mat-checkbox>

            <mat-checkbox formControlName="aplicaEnFacturacion" class="option-item">
              <div class="option-content">
                <strong>Aplica en Facturación</strong>
                <span>Se incluye en la factura generada</span>
              </div>
            </mat-checkbox>

            <mat-checkbox formControlName="generaInteres" class="option-item">
              <div class="option-content">
                <strong>Genera Intereses</strong>
                <span>Este concepto genera intereses de mora</span>
              </div>
            </mat-checkbox>

            <mat-checkbox formControlName="permiteDescuento" class="option-item">
              <div class="option-content">
                <strong>Permite Descuentos</strong>
                <span>Se pueden aplicar descuentos sobre este concepto</span>
              </div>
            </mat-checkbox>

            <mat-checkbox formControlName="permiteCero" class="option-item">
              <div class="option-content">
                <strong>Permite Valor Cero</strong>
                <span>Puede tener valor cero en liquidaciones</span>
              </div>
            </mat-checkbox>

            <mat-slide-toggle formControlName="activo" class="option-item estado-toggle" color="primary">
              <div class="option-content">
                <strong>
                  <mat-icon>{{ conceptoForm.get('activo')?.value ? 'check_circle' : 'cancel' }}</mat-icon>
                  Estado: {{ conceptoForm.get('activo')?.value ? 'ACTIVO' : 'INACTIVO' }}
                </strong>
                <span>{{ conceptoForm.get('activo')?.value ? 'El concepto está disponible para uso' : 'El concepto no se aplicará en liquidaciones' }}</span>
              </div>
            </mat-slide-toggle>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" 
              [disabled]="conceptoForm.invalid">
        <mat-icon>save</mat-icon>
        Guardar Concepto
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .concepto-form {
      max-width: 900px;
      padding: 16px 0;
    }

    .form-section {
      margin-bottom: 32px;

      h3 {
        color: #667eea;
        font-size: 16px;
        margin: 0 0 16px 0;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
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

      &.estado-toggle {
        grid-column: 1 / -1;
        background: #f0f4ff;
        border: 2px solid #667eea;

        strong {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          
          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }
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

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      margin: 0 -24px -20px;
    }

    ::ng-deep .mat-mdc-option {
      .option-icon {
        vertical-align: middle;
        margin-right: 8px;
        font-size: 18px;
      }
    }
  `]
})
export class ConceptoDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ConceptoDialogComponent>);
  data: { concepto?: ConceptoCobro; fuenteIngresoId: number } = inject(MAT_DIALOG_DATA);

  conceptoForm!: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const concepto = this.data.concepto;
    
    // Generar código automático si es nuevo concepto
    const codigoGenerado = concepto?.codigo || this.generarCodigoUnico();
    
    this.conceptoForm = this.fb.group({
      codigo: [{ value: codigoGenerado, disabled: true }], // Código autogenerado y deshabilitado
      nombre: [concepto?.nombre || '', Validators.required],
      descripcion: [concepto?.descripcion || ''],
      tipoConcepto: [concepto?.tipoConcepto || 'CAPITAL', Validators.required],
      operacion: [concepto?.operacion || 'SUMA', Validators.required],
      cuentaContableId: [concepto?.cuentaContableId || ''],
      cuentaContableNombre: [concepto?.cuentaContableNombre || ''],
      tarifaBase: [concepto?.tarifaBase || 0],
      ordenCalculoFormula: [concepto?.ordenCalculoFormula || 1],
      esObligatorio: [concepto?.esObligatorio ?? true],
      aplicaEnFacturacion: [concepto?.aplicaEnFacturacion ?? true],
      generaInteres: [concepto?.generaInteres ?? false],
      permiteDescuento: [concepto?.permiteDescuento ?? true],
      permiteCero: [concepto?.permiteCero ?? false],
      activo: [concepto?.activo ?? true]
    });
  }

  /**
   * Genera un código único para el concepto basado en el tipo y timestamp
   */
  generarCodigoUnico(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CON-${timestamp}-${random}`;
  }

  guardar() {
    if (this.conceptoForm.valid) {
      const formValue = this.conceptoForm.getRawValue(); // Obtener valores incluyendo campos deshabilitados
      const concepto: ConceptoCobro = {
        ...this.data.concepto,
        ...formValue,
        codigo: formValue.codigo, // Incluir el código autogenerado
        fuenteIngresoId: this.data.fuenteIngresoId,
        estado: formValue.activo ? 'ACTIVO' : 'INACTIVO',
        // Agregar auditoría
        creadoPor: this.data.concepto?.creadoPor || 'usuario@sistema.com',
        fechaCreacion: this.data.concepto?.fechaCreacion || new Date().toISOString(),
        modificadoPor: 'usuario@sistema.com',
        fechaModificacion: new Date().toISOString()
      };
      this.dialogRef.close(concepto);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

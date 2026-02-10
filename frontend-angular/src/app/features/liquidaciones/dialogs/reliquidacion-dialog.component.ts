import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';
import { Liquidacion, DetalleConceptoLiquidacion } from '../../../core/models';

/**
 * Dialog para Reliquidación y Ajustes
 * 
 * Permite:
 * - Reliquidar completamente (anula la anterior y crea nueva)
 * - Ajustar valores específicos sin anular
 * - Comparación lado a lado: Antes vs Después
 * - Justificación obligatoria
 * - Trazabilidad completa
 */
@Component({
  selector: 'app-reliquidacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <mat-icon>refresh</mat-icon>
        {{ tipoOperacion === 'reliquidacion' ? 'Reliquidar' : 'Ajustar' }} Liquidación
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <mat-stepper linear #stepper>
        <!-- Paso 1: Tipo de Operación -->
        <mat-step [stepControl]="tipoForm">
          <form [formGroup]="tipoForm">
            <ng-template matStepLabel>Tipo de Operación</ng-template>
            
            <div class="step-content">
              <mat-card class="info-card warning">
                <mat-card-content>
                  <div class="info-header">
                    <mat-icon>info</mat-icon>
                    <strong>Información de la Liquidación Original</strong>
                  </div>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">Número:</span>
                      <span class="value">{{ liquidacionOriginal.numeroLiquidacion }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Contribuyente:</span>
                      <span class="value">{{ liquidacionOriginal.contribuyenteNombre || 'N/A' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Valor Total:</span>
                      <span class="value">
                        {{ liquidacionOriginal.valorTotal | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </span>
                    </div>
                    <div class="info-item">
                      <span class="label">Estado:</span>
                      <span class="value">{{ liquidacionOriginal.estado }}</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="tipo-selector">
                <mat-card-content>
                  <mat-radio-group formControlName="tipo" (change)="onTipoChange()">
                    <mat-radio-button value="reliquidacion" class="tipo-option">
                      <div class="tipo-content">
                        <div class="tipo-header">
                          <mat-icon>refresh</mat-icon>
                          <strong>Reliquidación Completa</strong>
                        </div>
                        <p class="tipo-description">
                          Anula la liquidación actual y genera una nueva con los valores recalculados.
                          <br>
                          <strong>Usa cuando:</strong> Hay cambios significativos o errores de base.
                        </p>
                        <mat-chip class="impacto-chip alto">Impacto: Alto</mat-chip>
                      </div>
                    </mat-radio-button>

                    <mat-radio-button value="ajuste" class="tipo-option">
                      <div class="tipo-content">
                        <div class="tipo-header">
                          <mat-icon>tune</mat-icon>
                          <strong>Ajuste de Valores</strong>
                        </div>
                        <p class="tipo-description">
                          Modifica valores específicos sin anular la liquidación original.
                          <br>
                          <strong>Usa cuando:</strong> Solo requieres correcciones menores.
                        </p>
                        <mat-chip class="impacto-chip medio">Impacto: Medio</mat-chip>
                      </div>
                    </mat-radio-button>
                  </mat-radio-group>
                </mat-card-content>
              </mat-card>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Motivo {{ tipoOperacion === 'reliquidacion' ? 'de la Reliquidación' : 'del Ajuste' }}</mat-label>
                <mat-select formControlName="motivo" required>
                  <mat-option value="error_calculo">Error de Cálculo</mat-option>
                  <mat-option value="error_datos">Error en Datos Base</mat-option>
                  <mat-option value="cambio_normativo">Cambio Normativo</mat-option>
                  <mat-option value="solicitud_contribuyente">Solicitud del Contribuyente</mat-option>
                  <mat-option value="decision_administrativa">Decisión Administrativa</mat-option>
                  <mat-option value="otro">Otro</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Justificación Detallada</mat-label>
                <textarea matInput formControlName="justificacion" 
                          rows="4" 
                          placeholder="Describe detalladamente el motivo de la {{ tipoOperacion }}..."
                          required></textarea>
                <mat-hint>Mínimo 20 caracteres</mat-hint>
              </mat-form-field>
            </div>

            <div class="step-actions">
              <button mat-button mat-dialog-close>Cancelar</button>
              <button mat-raised-button color="primary" matStepperNext 
                      [disabled]="!tipoForm.valid">
                Siguiente
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Paso 2: Ajuste de Conceptos -->
        <mat-step [stepControl]="conceptosForm">
          <form [formGroup]="conceptosForm">
            <ng-template matStepLabel>Ajustar Conceptos</ng-template>
            
            <div class="step-content">
              <mat-card class="alert-card">
                <mat-card-content>
                  <mat-icon>warning</mat-icon>
                  <div>
                    <strong>Importante:</strong>
                    Modifica solo los valores que necesitan corrección.
                    Los cambios quedarán registrados en el historial de la liquidación.
                  </div>
                </mat-card-content>
              </mat-card>

              <div class="conceptos-editor">
                <table class="conceptos-table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th class="number-cell">Base Gravable Original</th>
                      <th class="number-cell">Nueva Base Gravable</th>
                      <th class="number-cell">Tarifa (%)</th>
                      <th class="number-cell">Nuevo Valor</th>
                      <th class="center-cell">Acciones</th>
                    </tr>
                  </thead>
                  <tbody formArrayName="conceptos">
                    <tr *ngFor="let conceptoForm of conceptosArray.controls; let i = index" 
                        [formGroupName]="i"
                        [class.modificado]="conceptoForm.get('modificado')?.value">
                      <td>{{ conceptoForm.get('concepto')?.value }}</td>
                      
                      <td class="number-cell valor-original">
                        {{ conceptoForm.get('baseGravableOriginal')?.value | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                      
                      <td class="number-cell">
                        <mat-form-field appearance="outline" class="compact-field">
                          <input matInput type="number" 
                                 formControlName="baseGravable"
                                 (change)="recalcularConcepto(i)">
                        </mat-form-field>
                      </td>
                      
                      <td class="number-cell">
                        <mat-form-field appearance="outline" class="compact-field">
                          <input matInput type="number" 
                                 formControlName="tarifa"
                                 (change)="recalcularConcepto(i)"
                                 min="0" max="100" step="0.1">
                        </mat-form-field>
                      </td>
                      
                      <td class="number-cell valor-nuevo">
                        {{ conceptoForm.get('valorFinal')?.value | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                      
                      <td class="center-cell">
                        <button mat-icon-button 
                                *ngIf="conceptoForm.get('modificado')?.value"
                                (click)="restaurarConcepto(i)"
                                matTooltip="Restaurar valor original">
                          <mat-icon>restore</mat-icon>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="total-row">
                      <td colspan="4"><strong>TOTAL</strong></td>
                      <td class="number-cell">
                        <strong>{{ calcularNuevoTotal() | currency:'COP':'symbol-narrow':'1.0-0' }}</strong>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div class="descuento-adicional">
                <h4>Descuento o Recargo Adicional (Opcional)</h4>
                <div class="descuento-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Tipo</mat-label>
                    <mat-select formControlName="tipoAjusteAdicional">
                      <mat-option value="">Ninguno</mat-option>
                      <mat-option value="descuento">Descuento</mat-option>
                      <mat-option value="recargo">Recargo</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Valor</mat-label>
                    <input matInput type="number" formControlName="valorAjusteAdicional">
                    <span matSuffix>COP</span>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Motivo</mat-label>
                    <input matInput formControlName="motivoAjusteAdicional">
                  </mat-form-field>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Atrás</button>
              <button mat-raised-button color="primary" matStepperNext>
                Siguiente
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Paso 3: Comparación y Confirmación -->
        <mat-step>
          <ng-template matStepLabel>Confirmar</ng-template>
          
          <div class="step-content">
            <mat-card class="comparacion-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>compare_arrows</mat-icon>
                  Comparación: Antes vs Después
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="comparacion-grid">
                  <!-- Columna ANTES -->
                  <div class="comparacion-columna antes">
                    <h3>
                      <mat-icon>history</mat-icon>
                      Antes (Original)
                    </h3>
                    <div class="datos-card">
                      <div class="dato-item" *ngFor="let concepto of liquidacionOriginal.conceptos">
                        <span class="concepto-nombre">{{ concepto.concepto }}</span>
                        <span class="concepto-valor">
                          {{ concepto.valorFinal | currency:'COP':'symbol-narrow':'1.0-0' }}
                        </span>
                      </div>
                      <mat-divider></mat-divider>
                      <div class="dato-item total">
                        <span class="concepto-nombre"><strong>TOTAL</strong></span>
                        <span class="concepto-valor">
                          <strong>{{ liquidacionOriginal.valorTotal | currency:'COP':'symbol-narrow':'1.0-0' }}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Flecha -->
                  <div class="comparacion-flecha">
                    <mat-icon>arrow_forward</mat-icon>
                  </div>

                  <!-- Columna DESPUÉS -->
                  <div class="comparacion-columna despues">
                    <h3>
                      <mat-icon>new_releases</mat-icon>
                      Después (Nuevo)
                    </h3>
                    <div class="datos-card">
                      <div class="dato-item" *ngFor="let concepto of getNuevosConceptos()" 
                           [class.modificado]="concepto.modificado">
                        <span class="concepto-nombre">
                          {{ concepto.concepto }}
                          <mat-icon *ngIf="concepto.modificado" class="icono-cambio">edit</mat-icon>
                        </span>
                        <span class="concepto-valor">
                          {{ concepto.valorFinal | currency:'COP':'symbol-narrow':'1.0-0' }}
                        </span>
                      </div>
                      <mat-divider></mat-divider>
                      <div class="dato-item total" 
                           [class.aumento]="getDiferencia() > 0"
                           [class.disminucion]="getDiferencia() < 0">
                        <span class="concepto-nombre"><strong>TOTAL</strong></span>
                        <span class="concepto-valor">
                          <strong>{{ calcularNuevoTotal() | currency:'COP':'symbol-narrow':'1.0-0' }}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Resumen de Diferencia -->
                <div class="resumen-diferencia" 
                     [class.aumento]="getDiferencia() > 0"
                     [class.disminucion]="getDiferencia() < 0">
                  <mat-icon>{{ getDiferencia() > 0 ? 'trending_up' : getDiferencia() < 0 ? 'trending_down' : 'trending_flat' }}</mat-icon>
                  <div class="diferencia-info">
                    <span class="diferencia-label">Diferencia:</span>
                    <span class="diferencia-valor">
                      {{ getDiferencia() | currency:'COP':'symbol-narrow':'1.0-0' }}
                      ({{ getPorcentajeDiferencia() }}%)
                    </span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Resumen de Justificación -->
            <mat-card class="justificacion-card">
              <mat-card-header>
                <mat-card-title>Justificación</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="justificacion-item">
                  <strong>Tipo de Operación:</strong>
                  <span>{{ tipoOperacion === 'reliquidacion' ? 'Reliquidación Completa' : 'Ajuste de Valores' }}</span>
                </div>
                <div class="justificacion-item">
                  <strong>Motivo:</strong>
                  <span>{{ getMotivoLabel() }}</span>
                </div>
                <div class="justificacion-item">
                  <strong>Justificación:</strong>
                  <p>{{ tipoForm.get('justificacion')?.value }}</p>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Advertencia Final -->
            <mat-card class="alert-card warning" *ngIf="tipoOperacion === 'reliquidacion'">
              <mat-card-content>
                <mat-icon>warning</mat-icon>
                <div>
                  <strong>⚠️ Advertencia:</strong>
                  La reliquidación anulará la liquidación original y creará una nueva.
                  Esta acción quedará registrada en el historial pero no se puede deshacer.
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="step-actions">
            <button mat-button matStepperPrevious>Atrás</button>
            <button mat-raised-button 
                    [color]="tipoOperacion === 'reliquidacion' ? 'warn' : 'primary'"
                    (click)="confirmar()"
                    [disabled]="procesando">
              <mat-icon>{{ tipoOperacion === 'reliquidacion' ? 'refresh' : 'check' }}</mat-icon>
              {{ procesando ? 'Procesando...' : (tipoOperacion === 'reliquidacion' ? 'Reliquidar' : 'Aplicar Ajuste') }}
            </button>
          </div>
        </mat-step>
      </mat-stepper>
    </mat-dialog-content>
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
      padding: 0;
      max-height: 75vh;
      overflow-y: auto;
    }

    .step-content {
      padding: 24px;
    }

    .info-card {
      margin-bottom: 24px;

      &.warning {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
      }

      .info-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        color: #856404;

        mat-icon {
          color: #ffc107;
        }
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
          }

          .value {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }

    .tipo-selector {
      margin-bottom: 24px;

      mat-radio-group {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .tipo-option {
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
        transition: all 0.3s ease;

        &:hover {
          border-color: #1976d2;
          background-color: #f5f5f5;
        }

        ::ng-deep .mdc-radio__native-control:checked ~ & {
          border-color: #1976d2;
          background-color: #e3f2fd;
        }
      }

      .tipo-content {
        width: 100%;
        margin-left: 12px;

        .tipo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          mat-icon {
            color: #1976d2;
          }
        }

        .tipo-description {
          margin: 8px 0;
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }

        .impacto-chip {
          &.alto {
            background-color: #f44336 !important;
            color: white !important;
          }

          &.medio {
            background-color: #ff9800 !important;
            color: white !important;
          }
        }
      }
    }

    .full-width {
      width: 100%;
    }

    .alert-card {
      margin-bottom: 24px;
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;

      mat-card-content {
        display: flex;
        gap: 12px;
        align-items: flex-start;

        mat-icon {
          color: #ffc107;
        }
      }
    }

    .conceptos-editor {
      margin: 24px 0;
      overflow-x: auto;
    }

    .conceptos-table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 12px 8px;
        border-bottom: 1px solid #e0e0e0;
      }

      th {
        background-color: #f5f5f5;
        font-weight: 500;
        text-align: left;
      }

      .number-cell {
        text-align: right;
        min-width: 150px;
      }

      .center-cell {
        text-align: center;
      }

      .compact-field {
        margin: 0;
        
        ::ng-deep .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }
      }

      .valor-original {
        color: #999;
        text-decoration: line-through;
      }

      .valor-nuevo {
        font-weight: 500;
        color: #1976d2;
      }

      tr.modificado {
        background-color: #fff3cd;
      }

      tfoot {
        background-color: #f5f5f5;
        font-size: 16px;
      }
    }

    .descuento-adicional {
      margin-top: 32px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;

      h4 {
        margin: 0 0 16px;
        color: #666;
      }

      .descuento-form {
        display: grid;
        grid-template-columns: 150px 200px 1fr;
        gap: 16px;
        align-items: start;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }
    }

    .comparacion-card {
      margin-bottom: 24px;

      mat-card-header {
        mat-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }

    .comparacion-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 24px;
      margin-top: 24px;

      @media (max-width: 968px) {
        grid-template-columns: 1fr;

        .comparacion-flecha {
          transform: rotate(90deg);
        }
      }
    }

    .comparacion-columna {
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px;
        font-size: 16px;
      }

      &.antes h3 {
        color: #666;
      }

      &.despues h3 {
        color: #1976d2;
      }

      .datos-card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 16px;

        .dato-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;

          &.modificado {
            background-color: #fff3cd;
            margin: 0 -8px;
            padding: 8px;
            border-radius: 4px;

            .icono-cambio {
              font-size: 16px;
              width: 16px;
              height: 16px;
              color: #ff9800;
              vertical-align: middle;
            }
          }

          &.total {
            margin-top: 8px;
            padding-top: 16px;
            font-size: 18px;

            &.aumento .concepto-valor {
              color: #f44336;
            }

            &.disminucion .concepto-valor {
              color: #4caf50;
            }
          }
        }
      }
    }

    .comparacion-flecha {
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #1976d2;
      }
    }

    .resumen-diferencia {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #9e9e9e;

      &.aumento {
        background-color: #ffebee;
        border-color: #f44336;

        mat-icon {
          color: #f44336;
        }
      }

      &.disminucion {
        background-color: #e8f5e9;
        border-color: #4caf50;

        mat-icon {
          color: #4caf50;
        }
      }

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }

      .diferencia-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .diferencia-label {
          font-size: 12px;
          color: #666;
        }

        .diferencia-valor {
          font-size: 24px;
          font-weight: 700;
        }
      }
    }

    .justificacion-card {
      margin-bottom: 24px;

      .justificacion-item {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        strong {
          display: block;
          margin-bottom: 4px;
          color: #666;
        }

        p {
          margin: 0;
          line-height: 1.6;
        }
      }
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #e0e0e0;
      margin-top: 24px;

      button mat-icon {
        margin-right: 4px;
      }
    }
  `]
})
export class ReliquidacionDialogComponent implements OnInit {
  tipoForm: FormGroup;
  conceptosForm: FormGroup;
  liquidacionOriginal: Liquidacion;
  tipoOperacion: 'reliquidacion' | 'ajuste' = 'reliquidacion';
  procesando = false;

  constructor(
    public dialogRef: MatDialogRef<ReliquidacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { liquidacion: Liquidacion },
    private fb: FormBuilder,
    private liquidacionesService: LiquidacionesService,
    private snackBar: MatSnackBar
  ) {
    this.liquidacionOriginal = data.liquidacion;

    // Formulario paso 1
    this.tipoForm = this.fb.group({
      tipo: ['reliquidacion', Validators.required],
      motivo: ['', Validators.required],
      justificacion: ['', [Validators.required, Validators.minLength(20)]]
    });

    // Formulario paso 2
    this.conceptosForm = this.fb.group({
      conceptos: this.fb.array([]),
      tipoAjusteAdicional: [''],
      valorAjusteAdicional: [0],
      motivoAjusteAdicional: ['']
    });
  }

  ngOnInit() {
    this.inicializarConceptos();
  }

  get conceptosArray(): FormArray {
    return this.conceptosForm.get('conceptos') as FormArray;
  }

  inicializarConceptos() {
    if (!this.liquidacionOriginal?.conceptos) return;
    
    this.liquidacionOriginal.conceptos.forEach(concepto => {
      this.conceptosArray.push(this.fb.group({
        concepto: [concepto.conceptoCobro?.nombre || 'Concepto'],
        baseGravableOriginal: [concepto.base || 0],
        baseGravable: [concepto.base || 0],
        tarifa: [concepto.tarifa || 0],
        valorCalculado: [concepto.valor || 0],
        descuento: [concepto.descuento || 0],
        valorFinal: [concepto.valorNeto || 0],
        modificado: [false]
      }));
    });
  }

  onTipoChange() {
    this.tipoOperacion = this.tipoForm.get('tipo')?.value;
  }

  recalcularConcepto(index: number) {
    const concepto = this.conceptosArray.at(index);
    const baseGravable = concepto.get('baseGravable')?.value || 0;
    const tarifa = concepto.get('tarifa')?.value || 0;
    const descuento = concepto.get('descuento')?.value || 0;

    const valorCalculado = baseGravable * (tarifa / 100);
    const valorFinal = valorCalculado - descuento;

    concepto.patchValue({
      valorCalculado,
      valorFinal,
      modificado: true
    });
  }

  restaurarConcepto(index: number) {
    const concepto = this.conceptosArray.at(index);
    const conceptoOriginal = this.liquidacionOriginal?.conceptos?.[index];
    if (!conceptoOriginal) return;

    concepto.patchValue({
      baseGravable: conceptoOriginal.baseGravable || conceptoOriginal.base,
      tarifa: conceptoOriginal.tarifa,
      valorCalculado: conceptoOriginal.valorCalculado || conceptoOriginal.valor,
      valorFinal: conceptoOriginal.valorFinal || conceptoOriginal.valorNeto,
      modificado: false
    });
  }

  calcularNuevoTotal(): number {
    let total = 0;
    this.conceptosArray.controls.forEach(concepto => {
      total += concepto.get('valorFinal')?.value || 0;
    });

    const tipoAjuste = this.conceptosForm.get('tipoAjusteAdicional')?.value;
    const valorAjuste = this.conceptosForm.get('valorAjusteAdicional')?.value || 0;

    if (tipoAjuste === 'descuento') {
      total -= valorAjuste;
    } else if (tipoAjuste === 'recargo') {
      total += valorAjuste;
    }

    return total;
  }

  getNuevosConceptos(): any[] {
    return this.conceptosArray.controls.map(control => control.value);
  }

  getDiferencia(): number {
    return this.calcularNuevoTotal() - this.liquidacionOriginal.valorTotal;
  }

  getPorcentajeDiferencia(): string {
    const diferencia = this.getDiferencia();
    const porcentaje = (diferencia / this.liquidacionOriginal.valorTotal) * 100;
    return (porcentaje > 0 ? '+' : '') + porcentaje.toFixed(2);
  }

  getMotivoLabel(): string {
    const motivos: { [key: string]: string } = {
      'error_calculo': 'Error de Cálculo',
      'error_datos': 'Error en Datos Base',
      'cambio_normativo': 'Cambio Normativo',
      'solicitud_contribuyente': 'Solicitud del Contribuyente',
      'decision_administrativa': 'Decisión Administrativa',
      'otro': 'Otro'
    };
    return motivos[this.tipoForm.get('motivo')?.value] || '';
  }

  confirmar() {
    this.procesando = true;

    const datos = {
      tipo: this.tipoOperacion,
      motivo: this.tipoForm.get('motivo')?.value,
      justificacion: this.tipoForm.get('justificacion')?.value,
      conceptos: this.getNuevosConceptos(),
      ajusteAdicional: {
        tipo: this.conceptosForm.get('tipoAjusteAdicional')?.value,
        valor: this.conceptosForm.get('valorAjusteAdicional')?.value,
        motivo: this.conceptosForm.get('motivoAjusteAdicional')?.value
      },
      valorTotal: this.calcularNuevoTotal(),
      diferencia: this.getDiferencia()
    };

    const observable = this.tipoOperacion === 'reliquidacion'
      ? this.liquidacionesService.reliquidar(this.liquidacionOriginal.id!, datos as any)
      : this.liquidacionesService.aplicarAjuste(this.liquidacionOriginal.id!, datos as any);

    observable.subscribe({
      next: (result) => {
        this.snackBar.open(
          `${this.tipoOperacion === 'reliquidacion' ? 'Reliquidación' : 'Ajuste'} aplicado exitosamente`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(result);
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error al procesar la operación', 'Cerrar', { duration: 3000 });
        this.procesando = false;
      }
    });
  }
}

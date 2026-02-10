import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TipoFacturacion, MensajeFactura, FormaPago } from '../../../core/models';

interface TipoFacturacionDialogData {
  tipoFacturacion?: TipoFacturacion;
  fuenteIngresoId?: number;
}

@Component({
  selector: 'app-tipo-facturacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatChipsModule,
    MatExpansionModule,
    MatSlideToggleModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>receipt_long</mat-icon>
      {{ data.tipoFacturacion ? 'Editar' : 'Nuevo' }} Tipo de Facturación
    </h2>

    <mat-dialog-content>
      <form [formGroup]="formulario" class="tipo-facturacion-form">
        
        <!-- Sección 1: Información Básica -->
        <div class="form-section">
          <h3><mat-icon>info</mat-icon> Información Básica</h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Código</mat-label>
              <input matInput formControlName="codigo" placeholder="TF-001">
              <mat-hint>Código único del tipo de facturación</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre" placeholder="Facturación Predial Urbano">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="descripcion" rows="2" 
              placeholder="Descripción detallada del tipo de facturación"></textarea>
          </mat-form-field>
        </div>

        <!-- Sección 2: Información Legal/DIAN -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>gavel</mat-icon> Información Legal y DIAN
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Resolución DIAN</mat-label>
              <input matInput formControlName="resolucionDIAN" placeholder="N° 123456">
              <mat-hint>Opcional - Para facturación electrónica</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha Resolución</mat-label>
              <input matInput [matDatepicker]="pickerResolucion" formControlName="fechaResolucionDIAN">
              <mat-datepicker-toggle matIconSuffix [for]="pickerResolucion"></mat-datepicker-toggle>
              <mat-datepicker #pickerResolucion></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Prefijo Factura</mat-label>
              <input matInput formControlName="prefijoFactura" placeholder="FPU" maxlength="10">
              <mat-hint>Ej: FPU para Factura Predial Urbano</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Número Inicial</mat-label>
              <input matInput type="number" formControlName="numeroInicial" placeholder="1">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Número Final</mat-label>
              <input matInput type="number" formControlName="numeroFinal" placeholder="100000">
            </mat-form-field>
          </div>
        </mat-expansion-panel>

        <!-- Sección 3: Información de la Entidad -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>business</mat-icon> Información de la Entidad Emisora
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Nombre Entidad</mat-label>
              <input matInput formControlName="nombreEntidad" placeholder="Municipio de...">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>NIT</mat-label>
              <input matInput formControlName="nitEntidad" placeholder="123456789-0">
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="direccionEntidad" placeholder="Calle 123 # 45-67">
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="telefonoEntidad" placeholder="(601) 234-5678">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="emailEntidad" placeholder="rentas@municipio.gov.co">
            </mat-form-field>
          </div>
        </mat-expansion-panel>

        <!-- Sección 4: Mensajes en la Factura -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>message</mat-icon> Mensajes en la Factura
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mensaje Encabezado</mat-label>
            <textarea matInput formControlName="mensajeEncabezado" rows="2" 
              placeholder="Texto que aparece al inicio de la factura"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mensaje Legal</mat-label>
            <textarea matInput formControlName="mensajeLegal" rows="3" 
              placeholder="Ej: De conformidad con la Ley 1066 de 2006..."></textarea>
            <mat-hint>Referencia legal que debe aparecer en la factura</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Instrucciones de Pago</mat-label>
            <textarea matInput formControlName="mensajeInstruccionesPago" rows="3" 
              placeholder="Puede pagar en bancos autorizados, PSE..."></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mensaje Pie de Factura</mat-label>
            <textarea matInput formControlName="mensajePieFactura" rows="2" 
              placeholder="Gracias por su pago oportuno"></textarea>
          </mat-form-field>
        </mat-expansion-panel>

        <!-- Sección 5: Configuración de Códigos -->
        <div class="form-section">
          <h3><mat-icon>qr_code</mat-icon> Códigos de Barras y QR</h3>
          
          <div class="checkbox-group">
            <mat-checkbox formControlName="incluirCodigoBarras">
              <mat-icon>barcode</mat-icon>
              Incluir Código de Barras
            </mat-checkbox>

            <mat-checkbox formControlName="incluirCodigoQR">
              <mat-icon>qr_code_2</mat-icon>
              Incluir Código QR
            </mat-checkbox>
          </div>
        </div>

        <!-- Sección 6: Configuración de Pagos -->
        <div class="form-section">
          <h3><mat-icon>payments</mat-icon> Configuración de Pagos</h3>
          
          <div class="checkbox-group">
            <mat-checkbox formControlName="permitePagoParcial">
              Permitir Pago Parcial
            </mat-checkbox>

            @if (formulario.get('permitePagoParcial')?.value) {
              <mat-form-field appearance="outline" class="indented-field">
                <mat-label>Valor Mínimo</mat-label>
                <input matInput type="number" formControlName="valorMinimoPagoParcial" 
                  placeholder="50000">
                <span matTextPrefix>$&nbsp;</span>
                <mat-hint>Valor mínimo para pago parcial</mat-hint>
              </mat-form-field>
            }
          </div>
        </div>

        <!-- Sección 7: Intereses y Descuentos -->
        <div class="form-section">
          <h3><mat-icon>percent</mat-icon> Intereses y Descuentos</h3>
          
          <div class="subsection">
            <mat-checkbox formControlName="generaInteresesMora">
              <mat-icon>trending_up</mat-icon>
              Genera Intereses de Mora
            </mat-checkbox>

            @if (formulario.get('generaInteresesMora')?.value) {
              <mat-form-field appearance="outline" class="indented-field">
                <mat-label>Porcentaje Mensual</mat-label>
                <input matInput type="number" step="0.01" formControlName="porcentajeInteresesMora" 
                  placeholder="2.13">
                <span matTextSuffix>%</span>
                <mat-hint>Ej: 2.13% mensual</mat-hint>
              </mat-form-field>
            }
          </div>

          <div class="subsection">
            <mat-checkbox formControlName="aplicaDescuentoProntoPago">
              <mat-icon>trending_down</mat-icon>
              Aplica Descuento por Pronto Pago
            </mat-checkbox>

            @if (formulario.get('aplicaDescuentoProntoPago')?.value) {
              <div class="form-row indented-field">
                <mat-form-field appearance="outline">
                  <mat-label>Porcentaje</mat-label>
                  <input matInput type="number" step="0.1" formControlName="porcentajeDescuentoProntoPago" 
                    placeholder="10">
                  <span matTextSuffix>%</span>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Días para descuento</mat-label>
                  <input matInput type="number" formControlName="diasDescuentoProntoPago" 
                    placeholder="15">
                  <mat-hint>Días desde generación</mat-hint>
                </mat-form-field>
              </div>
            }
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Días de Vencimiento</mat-label>
            <input matInput type="number" formControlName="diasVencimiento" placeholder="30">
            <mat-hint>Días después de la generación de la factura</mat-hint>
          </mat-form-field>
        </div>

        <!-- Sección 8: Notificaciones -->
        <div class="form-section">
          <h3><mat-icon>notifications</mat-icon> Notificaciones</h3>
          
          <div class="checkbox-group">
            <mat-checkbox formControlName="enviarNotificacionEmail">
              <mat-icon>email</mat-icon>
              Enviar por Email
            </mat-checkbox>

            <mat-checkbox formControlName="enviarNotificacionSMS">
              <mat-icon>sms</mat-icon>
              Enviar por SMS
            </mat-checkbox>
          </div>
        </div>

        <!-- Sección 9: Aprobación y Vigencia -->
        <div class="form-section">
          <h3><mat-icon>check_circle</mat-icon> Aprobación y Vigencia</h3>
          
          <mat-checkbox formControlName="requiereAprobacion">
            Requiere Aprobación
          </mat-checkbox>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Vigencia Desde</mat-label>
              <input matInput [matDatepicker]="pickerDesde" formControlName="vigenciaDesde" required>
              <mat-datepicker-toggle matIconSuffix [for]="pickerDesde"></mat-datepicker-toggle>
              <mat-datepicker #pickerDesde></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Vigencia Hasta</mat-label>
              <input matInput [matDatepicker]="pickerHasta" formControlName="vigenciaHasta">
              <mat-datepicker-toggle matIconSuffix [for]="pickerHasta"></mat-datepicker-toggle>
              <mat-datepicker #pickerHasta></mat-datepicker>
              <mat-hint>Opcional - Dejar vacío para vigencia indefinida</mat-hint>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="estado">
              <mat-option value="BORRADOR">
                <mat-icon>edit</mat-icon> Borrador
              </mat-option>
              <mat-option value="ACTIVO">
                <mat-icon>check_circle</mat-icon> Activo
              </mat-option>
              <mat-option value="INACTIVO">
                <mat-icon>cancel</mat-icon> Inactivo
              </mat-option>
              <mat-option value="HISTORICO">
                <mat-icon>history</mat-icon> Histórico
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="!formulario.valid">
        <mat-icon>save</mat-icon>
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tipo-facturacion-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 8px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;

      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #1976d2;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;

      mat-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          margin-right: 4px;
        }
      }
    }

    .subsection {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .indented-field {
      margin-left: 32px;
    }

    mat-expansion-panel {
      margin-bottom: 16px;

      mat-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          color: #1976d2;
        }
      }
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1976d2;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }
  `]
})
export class TipoFacturacionDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TipoFacturacionDialogComponent>);
  public data = inject<TipoFacturacionDialogData>(MAT_DIALOG_DATA);

  formulario: FormGroup;

  constructor() {
    this.formulario = this.inicializarFormulario();
  }

  private inicializarFormulario(): FormGroup {
    const tipo = this.data.tipoFacturacion;
    const hoy = new Date().toISOString().split('T')[0];

    return this.fb.group({
      // Información Básica
      codigo: [tipo?.codigo || '', Validators.required],
      nombre: [tipo?.nombre || '', Validators.required],
      descripcion: [tipo?.descripcion || ''],
      
      // Información Legal/DIAN
      resolucionDIAN: [tipo?.resolucionDIAN || ''],
      fechaResolucionDIAN: [tipo?.fechaResolucionDIAN || ''],
      prefijoFactura: [tipo?.prefijoFactura || ''],
      numeroInicial: [tipo?.numeroInicial || 1],
      numeroFinal: [tipo?.numeroFinal || null],
      
      // Información de la Entidad
      nombreEntidad: [tipo?.nombreEntidad || ''],
      nitEntidad: [tipo?.nitEntidad || ''],
      direccionEntidad: [tipo?.direccionEntidad || ''],
      telefonoEntidad: [tipo?.telefonoEntidad || ''],
      emailEntidad: [tipo?.emailEntidad || ''],
      
      // Mensajes
      mensajeEncabezado: [tipo?.mensajeEncabezado || ''],
      mensajeLegal: [tipo?.mensajeLegal || 'De conformidad con la normatividad vigente, el no pago oportuno generará intereses de mora.'],
      mensajeInstruccionesPago: [tipo?.mensajeInstruccionesPago || 'Puede realizar el pago en entidades bancarias autorizadas, PSE o en las oficinas de la Secretaría de Hacienda.'],
      mensajePieFactura: [tipo?.mensajePieFactura || 'Gracias por su pago oportuno'],
      
      // Códigos
      incluirCodigoBarras: [tipo?.incluirCodigoBarras ?? true],
      incluirCodigoQR: [tipo?.incluirCodigoQR ?? true],
      
      // Pagos
      permitePagoParcial: [tipo?.permitePagoParcial ?? false],
      valorMinimoPagoParcial: [tipo?.valorMinimoPagoParcial || null],
      
      // Intereses y Descuentos
      generaInteresesMora: [tipo?.generaInteresesMora ?? true],
      porcentajeInteresesMora: [tipo?.porcentajeInteresesMora || 2.13],
      aplicaDescuentoProntoPago: [tipo?.aplicaDescuentoProntoPago ?? false],
      porcentajeDescuentoProntoPago: [tipo?.porcentajeDescuentoProntoPago || null],
      diasDescuentoProntoPago: [tipo?.diasDescuentoProntoPago || null],
      diasVencimiento: [tipo?.diasVencimiento || 30, Validators.required],
      
      // Notificaciones
      enviarNotificacionEmail: [tipo?.enviarNotificacionEmail ?? true],
      enviarNotificacionSMS: [tipo?.enviarNotificacionSMS ?? false],
      
      // Aprobación y Vigencia
      requiereAprobacion: [tipo?.requiereAprobacion ?? false],
      vigenciaDesde: [tipo?.vigenciaDesde || hoy, Validators.required],
      vigenciaHasta: [tipo?.vigenciaHasta || ''],
      estado: [tipo?.estado || 'BORRADOR', Validators.required]
    });
  }

  guardar() {
    if (this.formulario.valid) {
      const tipoFacturacion: TipoFacturacion = {
        ...this.data.tipoFacturacion,
        ...this.formulario.value,
        fuenteIngresoId: this.data.fuenteIngresoId,
        formasPagoDisponibles: [], // Se configuran después
        creadoPor: this.data.tipoFacturacion ? undefined : 'Usuario Actual',
        fechaCreacion: this.data.tipoFacturacion ? undefined : new Date().toISOString(),
        modificadoPor: this.data.tipoFacturacion ? 'Usuario Actual' : undefined,
        fechaModificacion: this.data.tipoFacturacion ? new Date().toISOString() : undefined
      };

      this.dialogRef.close(tipoFacturacion);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';
import { 
  Liquidacion, 
  TipoLiquidacion, 
  ConceptoCobro, 
  DetalleConceptoLiquidacion,
  FuenteIngreso,
  Renta 
} from '../../../core/models';

@Component({
  selector: 'app-nueva-liquidacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>add_circle</mat-icon>
      Nueva Liquidación
    </h2>

    <mat-dialog-content>
      <mat-stepper [linear]="true" #stepper>
        
        <!-- PASO 1: DATOS BÁSICOS -->
        <mat-step [stepControl]="datosBasicosForm">
          <ng-template matStepLabel>Datos Básicos</ng-template>
          
          <form [formGroup]="datosBasicosForm" class="step-form">
            <h3>Información General</h3>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contribuyente</mat-label>
              <input matInput 
                     formControlName="contribuyenteId"
                     placeholder="Buscar contribuyente...">
              <mat-icon matSuffix>search</mat-icon>
              <mat-hint>Ingrese cédula, NIT o nombre</mat-hint>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Renta</mat-label>
                <mat-select formControlName="rentaId" (selectionChange)="onRentaChange()">
                  <mat-option *ngFor="let renta of rentas" [value]="renta.id">
                    {{renta.nombre}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fuente de Ingreso</mat-label>
                <mat-select formControlName="fuenteIngresoId" (selectionChange)="onFuenteChange()">
                  <mat-option *ngFor="let fuente of fuentes" [value]="fuente.id">
                    {{fuente.nombre}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tipo de Liquidación</mat-label>
              <mat-select formControlName="tipoLiquidacionId" (selectionChange)="onTipoChange()">
                <mat-option *ngFor="let tipo of tiposLiquidacion" [value]="tipo.id">
                  {{tipo.nombre}}
                  <span class="tipo-info">
                    <mat-icon *ngIf="tipo.generaFactura">receipt</mat-icon>
                    <mat-icon *ngIf="tipo.requiereAprobacion">verified</mat-icon>
                  </span>
                </mat-option>
              </mat-select>
              <mat-hint *ngIf="tipoSeleccionado">
                <mat-icon inline>info</mat-icon>
                {{getTipoInfo()}}
              </mat-hint>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Vigencia</mat-label>
                <input matInput type="number" formControlName="vigencia" [value]="currentYear">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Periodo</mat-label>
                <mat-select formControlName="periodo">
                  <mat-option [value]="1">Periodo 1</mat-option>
                  <mat-option [value]="2">Periodo 2</mat-option>
                  <mat-option [value]="3">Periodo 3</mat-option>
                  <mat-option [value]="4">Periodo 4</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="step-actions">
              <button mat-raised-button matStepperNext color="primary" [disabled]="!datosBasicosForm.valid">
                Siguiente
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- PASO 2: CONCEPTOS Y VALORES -->
        <mat-step [stepControl]="conceptosForm">
          <ng-template matStepLabel>Conceptos de Cobro</ng-template>
          
          <div class="step-form">
            <h3>Valores por Concepto</h3>
            
            <p *ngIf="!conceptosDisponibles || conceptosDisponibles.length === 0" class="info-message">
              <mat-icon>info</mat-icon>
              Seleccione un tipo de liquidación para cargar los conceptos
            </p>

            <div *ngIf="conceptosDisponibles && conceptosDisponibles.length > 0">
              <div class="concepto-card" *ngFor="let concepto of conceptosDisponibles; let i = index">
                <div class="concepto-header">
                  <h4>
                    <mat-icon [color]="concepto.esObligatorio ? 'accent' : 'primary'">
                      {{concepto.esObligatorio ? 'star' : 'star_border'}}
                    </mat-icon>
                    {{concepto.nombre}}
                  </h4>
                  <mat-chip [color]="concepto.esObligatorio ? 'accent' : 'primary'" selected>
                    {{concepto.esObligatorio ? 'Obligatorio' : 'Opcional'}}
                  </mat-chip>
                </div>

                <p class="concepto-descripcion">{{concepto.descripcion}}</p>

                <form [formGroup]="getConceptoForm(i)" class="concepto-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="flex-2">
                      <mat-label>Base Gravable</mat-label>
                      <input matInput 
                             type="number" 
                             formControlName="base"
                             (change)="calcularConcepto(i)"
                             placeholder="0.00">
                      <span matPrefix>$</span>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Tarifa (%)</mat-label>
                      <input matInput 
                             type="number" 
                             step="0.01"
                             formControlName="tarifa"
                             (change)="calcularConcepto(i)">
                      <span matSuffix>%</span>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Descuento</mat-label>
                      <input matInput 
                             type="number"
                             formControlName="descuento"
                             (change)="calcularConcepto(i)"
                             placeholder="0.00">
                      <span matPrefix>$</span>
                    </mat-form-field>
                  </div>

                  <div class="calculo-resultado">
                    <div class="resultado-item">
                      <span class="label">Valor Calculado:</span>
                      <span class="value">{{getConceptoForm(i).get('valor')?.value | currency}}</span>
                    </div>
                    <div class="resultado-item">
                      <span class="label">Valor Neto:</span>
                      <span class="value total">{{getConceptoForm(i).get('valorNeto')?.value | currency}}</span>
                    </div>
                  </div>

                  <button mat-button 
                          color="primary" 
                          *ngIf="concepto.formulaId"
                          (click)="aplicarFormula(i)">
                    <mat-icon>functions</mat-icon>
                    Aplicar Fórmula
                  </button>
                </form>
              </div>

              <!-- RESUMEN TOTAL -->
              <div class="resumen-total">
                <div class="resumen-row">
                  <span class="label">Subtotal:</span>
                  <span class="value">{{calcularSubtotal() | currency}}</span>
                </div>
                <div class="resumen-row">
                  <span class="label">Descuentos:</span>
                  <span class="value descuento">-{{calcularDescuentos() | currency}}</span>
                </div>
                <div class="resumen-row total-row">
                  <span class="label">TOTAL A PAGAR:</span>
                  <span class="value">{{calcularTotal() | currency}}</span>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon>
                Anterior
              </button>
              <button mat-raised-button matStepperNext color="primary" [disabled]="!isConceptosValid()">
                Siguiente
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </mat-step>

        <!-- PASO 3: CONFIRMACIÓN -->
        <mat-step>
          <ng-template matStepLabel>Confirmar</ng-template>
          
          <div class="step-form confirmacion">
            <h3>Resumen de la Liquidación</h3>

            <div class="resumen-card">
              <div class="resumen-section">
                <h4>Datos Generales</h4>
                <div class="data-grid">
                  <div class="data-item">
                    <span class="label">Contribuyente:</span>
                    <span class="value">{{datosBasicosForm.get('contribuyenteId')?.value}}</span>
                  </div>
                  <div class="data-item">
                    <span class="label">Renta:</span>
                    <span class="value">{{getRentaNombre()}}</span>
                  </div>
                  <div class="data-item">
                    <span class="label">Tipo:</span>
                    <span class="value">{{getTipoNombre()}}</span>
                  </div>
                  <div class="data-item">
                    <span class="label">Periodo:</span>
                    <span class="value">
                      {{datosBasicosForm.get('vigencia')?.value}} / 
                      {{datosBasicosForm.get('periodo')?.value}}
                    </span>
                  </div>
                </div>
              </div>

              <div class="resumen-section">
                <h4>Conceptos Liquidados</h4>
                <table class="resumen-table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Base</th>
                      <th>Tarifa</th>
                      <th>Descuento</th>
                      <th>Valor Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let concepto of conceptosDisponibles; let i = index">
                      <td>{{concepto.nombre}}</td>
                      <td>{{getConceptoForm(i).get('base')?.value | currency}}</td>
                      <td>{{getConceptoForm(i).get('tarifa')?.value}}%</td>
                      <td>{{getConceptoForm(i).get('descuento')?.value | currency}}</td>
                      <td><strong>{{getConceptoForm(i).get('valorNeto')?.value | currency}}</strong></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="total-row">
                      <td colspan="4"><strong>TOTAL:</strong></td>
                      <td><strong>{{calcularTotal() | currency}}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div class="resumen-section alertas" *ngIf="tipoSeleccionado">
                <mat-icon color="primary">info</mat-icon>
                <div>
                  <p *ngIf="tipoSeleccionado.generaFactura">
                    ✓ Esta liquidación generará una factura automáticamente
                  </p>
                  <p *ngIf="tipoSeleccionado.requiereAprobacion">
                    ⚠️ Esta liquidación requerirá aprobación antes de ser facturada
                  </p>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon>
                Anterior
              </button>
              <button mat-raised-button (click)="guardarBorrador()" [disabled]="guardando">
                <mat-icon>save</mat-icon>
                Guardar Borrador
              </button>
              <button mat-raised-button color="primary" (click)="crearLiquidacion()" [disabled]="guardando">
                <mat-spinner diameter="20" *ngIf="guardando"></mat-spinner>
                <mat-icon *ngIf="!guardando">check_circle</mat-icon>
                {{tipoSeleccionado?.requiereAprobacion ? 'Enviar a Aprobación' : 'Crear Liquidación'}}
              </button>
            </div>
          </div>
        </mat-step>

      </mat-stepper>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cerrar()" [disabled]="guardando">Cancelar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 700px;
      max-width: 900px;
      min-height: 500px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1976d2;
    }

    .step-form {
      padding: 24px;
      min-height: 400px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .flex-2 {
      grid-column: span 1;
    }

    .tipo-info {
      display: inline-flex;
      gap: 4px;
      margin-left: 8px;
    }

    .tipo-info mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #4caf50;
    }

    .info-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-radius: 8px;
      color: #1976d2;
    }

    /* Conceptos */
    .concepto-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background: #fafafa;
    }

    .concepto-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .concepto-header h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #333;
    }

    .concepto-descripcion {
      color: #666;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .concepto-form .form-row {
      grid-template-columns: 2fr 1fr 1fr;
    }

    .calculo-resultado {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      background: white;
      border-radius: 4px;
      margin: 16px 0;
    }

    .resultado-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resultado-item .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }

    .resultado-item .value {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .resultado-item .value.total {
      font-size: 24px;
      color: #1976d2;
      font-weight: 600;
    }

    /* Resumen Total */
    .resumen-total {
      background: white;
      border: 2px solid #1976d2;
      border-radius: 8px;
      padding: 20px;
      margin-top: 24px;
    }

    .resumen-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .resumen-row:last-child {
      border-bottom: none;
    }

    .resumen-row .label {
      font-size: 14px;
      color: #666;
    }

    .resumen-row .value {
      font-size: 16px;
      font-weight: 500;
    }

    .resumen-row .value.descuento {
      color: #f44336;
    }

    .resumen-row.total-row {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid #1976d2;
    }

    .resumen-row.total-row .label {
      font-size: 18px;
      font-weight: 600;
      color: #1976d2;
    }

    .resumen-row.total-row .value {
      font-size: 24px;
      color: #1976d2;
      font-weight: 700;
    }

    /* Confirmación */
    .confirmacion {
      max-width: 100%;
    }

    .resumen-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .resumen-section {
      margin-bottom: 24px;
    }

    .resumen-section h4 {
      color: #1976d2;
      margin-bottom: 16px;
    }

    .data-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .data-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .data-item .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }

    .data-item .value {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .resumen-table {
      width: 100%;
      border-collapse: collapse;
    }

    .resumen-table th,
    .resumen-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .resumen-table th {
      background: #f5f5f5;
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }

    .resumen-table tfoot tr {
      background: #e3f2fd;
    }

    .resumen-table tfoot td {
      font-size: 18px;
      color: #1976d2;
    }

    .alertas {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fff3e0;
      border-radius: 4px;
    }

    .alertas p {
      margin: 4px 0;
      font-size: 14px;
    }

    .step-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }

    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
  `]
})
export class NuevaLiquidacionDialogComponent implements OnInit {
  datosBasicosForm: FormGroup;
  conceptosForm: FormGroup;
  
  rentas: Renta[] = [];
  fuentes: FuenteIngreso[] = [];
  tiposLiquidacion: TipoLiquidacion[] = [];
  conceptosDisponibles: ConceptoCobro[] = [];
  
  tipoSeleccionado?: TipoLiquidacion;
  guardando = false;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NuevaLiquidacionDialogComponent>,
    private liquidacionesService: LiquidacionesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.datosBasicosForm = this.fb.group({
      contribuyenteId: ['', Validators.required],
      rentaId: ['', Validators.required],
      fuenteIngresoId: ['', Validators.required],
      tipoLiquidacionId: ['', Validators.required],
      vigencia: [this.currentYear, [Validators.required, Validators.min(2000)]],
      periodo: [1, Validators.required]
    });

    this.conceptosForm = this.fb.group({
      conceptos: this.fb.array([])
    });
  }

  ngOnInit() {
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    // TODO: Cargar desde servicios reales
    this.rentas = [
      { id: 1, nombre: 'Impuesto Predial', tipo: 'Anual', periodicidad: 'Anual' },
      { id: 2, nombre: 'Industria y Comercio', tipo: 'Bimestral', periodicidad: 'Bimestral' }
    ];
    
    this.liquidacionesService.getFuentesIngreso().subscribe({
      next: (fuentes) => this.fuentes = fuentes,
      error: () => this.fuentes = []
    });

    this.liquidacionesService.getTiposLiquidacion().subscribe({
      next: (tipos) => this.tiposLiquidacion = tipos,
      error: () => this.tiposLiquidacion = []
    });
  }

  onRentaChange() {
    // Cargar fuentes relacionadas con la renta
  }

  onFuenteChange() {
    const fuenteId = this.datosBasicosForm.get('fuenteIngresoId')?.value;
    if (fuenteId) {
      this.liquidacionesService.getConceptosCobro(fuenteId).subscribe({
        next: (conceptos) => this.conceptosDisponibles = conceptos,
        error: () => this.conceptosDisponibles = []
      });
    }
  }

  onTipoChange() {
    const tipoId = this.datosBasicosForm.get('tipoLiquidacionId')?.value;
    this.tipoSeleccionado = this.tiposLiquidacion.find(t => t.id === tipoId);
    
    if (this.tipoSeleccionado?.conceptosCobro) {
      this.conceptosDisponibles = this.tipoSeleccionado.conceptosCobro;
      this.inicializarConceptosForms();
    }
  }

  inicializarConceptosForms() {
    const conceptosArray = this.fb.array(
      this.conceptosDisponibles.map(concepto => this.fb.group({
        conceptoCobroId: [concepto.id],
        base: [0, Validators.required],
        tarifa: [0, Validators.required],
        descuento: [0],
        valor: [0],
        valorNeto: [0]
      }))
    );
    this.conceptosForm.setControl('conceptos', conceptosArray);
  }

  getConceptoForm(index: number): FormGroup {
    const conceptos = this.conceptosForm.get('conceptos') as any;
    return conceptos.at(index) as FormGroup;
  }

  calcularConcepto(index: number) {
    const form = this.getConceptoForm(index);
    const base = form.get('base')?.value || 0;
    const tarifa = form.get('tarifa')?.value || 0;
    const descuento = form.get('descuento')?.value || 0;
    
    const valor = (base * tarifa) / 100;
    const valorNeto = valor - descuento;
    
    form.patchValue({ valor, valorNeto }, { emitEvent: false });
  }

  aplicarFormula(index: number) {
    // TODO: Llamar al servicio de fórmulas
    console.log('Aplicar fórmula para concepto', index);
  }

  calcularSubtotal(): number {
    const conceptos = this.conceptosForm.get('conceptos') as any;
    return conceptos.controls.reduce((sum: number, control: FormGroup) => 
      sum + (control.get('valor')?.value || 0), 0
    );
  }

  calcularDescuentos(): number {
    const conceptos = this.conceptosForm.get('conceptos') as any;
    return conceptos.controls.reduce((sum: number, control: FormGroup) => 
      sum + (control.get('descuento')?.value || 0), 0
    );
  }

  calcularTotal(): number {
    return this.calcularSubtotal() - this.calcularDescuentos();
  }

  isConceptosValid(): boolean {
    const conceptos = this.conceptosForm.get('conceptos') as any;
    return conceptos.controls.every((control: FormGroup) => {
      const concepto = this.conceptosDisponibles[conceptos.controls.indexOf(control)];
      const valorNeto = control.get('valorNeto')?.value || 0;
      
      if (concepto.esObligatorio && valorNeto === 0 && !concepto.permiteCero) {
        return false;
      }
      return true;
    });
  }

  getTipoInfo(): string {
    if (!this.tipoSeleccionado) return '';
    
    let info = [];
    if (this.tipoSeleccionado.generaFactura) info.push('Genera factura automática');
    if (this.tipoSeleccionado.requiereAprobacion) info.push('Requiere aprobación');
    
    return info.join(' • ');
  }

  getRentaNombre(): string {
    const id = this.datosBasicosForm.get('rentaId')?.value;
    return this.rentas.find(r => r.id === id)?.nombre || '';
  }

  getTipoNombre(): string {
    return this.tipoSeleccionado?.nombre || '';
  }

  guardarBorrador() {
    this.guardar('BORRADOR');
  }

  crearLiquidacion() {
    const estado = this.tipoSeleccionado?.requiereAprobacion ? 'PENDIENTE' : 'APROBADA';
    this.guardar(estado);
  }

  private guardar(estado: string) {
    this.guardando = true;

    const liquidacion: Liquidacion = {
      ...this.datosBasicosForm.value,
      conceptos: this.getConceptosData(),
      valorTotal: this.calcularTotal(),
      estado,
      esReliquidacion: false,
      liquidadoPor: 'current-user' // TODO: Obtener del contexto
    };

    this.liquidacionesService.createLiquidacion(liquidacion).subscribe({
      next: (result) => {
        this.dialogRef.close(result);
      },
      error: (error) => {
        console.error('Error al crear liquidación', error);
        this.guardando = false;
      }
    });
  }

  private getConceptosData(): DetalleConceptoLiquidacion[] {
    const conceptos = this.conceptosForm.get('conceptos') as any;
    return conceptos.controls.map((control: FormGroup, index: number) => ({
      conceptoCobroId: this.conceptosDisponibles[index].id!,
      base: control.get('base')?.value,
      tarifa: control.get('tarifa')?.value,
      descuento: control.get('descuento')?.value,
      valor: control.get('valor')?.value,
      valorNeto: control.get('valorNeto')?.value
    }));
  }

  cerrar() {
    this.dialogRef.close();
  }
}

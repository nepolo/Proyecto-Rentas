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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { LiquidacionesService } from '../../../core/services/liquidaciones.service';
import { LiquidacionMasiva, CriterioSeleccion } from '../../../core/models';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-liquidacion-masiva-dialog',
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
    MatProgressBarModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>layers</mat-icon>
      Liquidación Masiva
    </h2>

    <mat-dialog-content>
      <mat-stepper [linear]="true" #stepper>
        
        <!-- PASO 1: CONFIGURACIÓN -->
        <mat-step [stepControl]="configuracionForm">
          <ng-template matStepLabel>Configuración</ng-template>
          
          <form [formGroup]="configuracionForm" class="step-form">
            <h3>Datos Generales</h3>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del Proceso</mat-label>
              <input matInput formControlName="nombre" placeholder="ej: Predial 2024 - Trimestre 1">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput 
                        formControlName="descripcion" 
                        rows="2"
                        placeholder="Descripción opcional del proceso"></textarea>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de Liquidación</mat-label>
                <mat-select formControlName="tipoLiquidacionId">
                  <mat-option *ngFor="let tipo of tiposLiquidacion" [value]="tipo.id">
                    {{tipo.nombre}}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fuente de Ingreso</mat-label>
                <mat-select formControlName="fuenteIngresoId">
                  <mat-option *ngFor="let fuente of fuentes" [value]="fuente.id">
                    {{fuente.nombre}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Vigencia</mat-label>
                <input matInput type="number" formControlName="vigencia">
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
              <button mat-raised-button matStepperNext color="primary" [disabled]="!configuracionForm.valid">
                Siguiente
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- PASO 2: CRITERIOS DE SELECCIÓN -->
        <mat-step [stepControl]="criteriosForm">
          <ng-template matStepLabel>Criterios</ng-template>
          
          <form [formGroup]="criteriosForm" class="step-form">
            <h3>Criterios de Selección</h3>
            <p class="help-text">Defina los criterios para seleccionar los contribuyentes a liquidar</p>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rentas</mat-label>
              <mat-select formControlName="rentaIds" multiple>
                <mat-option *ngFor="let renta of rentas" [value]="renta.id">
                  {{renta.nombre}}
                </mat-option>
              </mat-select>
              <mat-hint>Seleccione una o más rentas</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Actividades Económicas</mat-label>
              <mat-select formControlName="actividadEconomica" multiple>
                <mat-option value="RESIDENCIAL">Residencial</mat-option>
                <mat-option value="COMERCIAL">Comercial</mat-option>
                <mat-option value="INDUSTRIAL">Industrial</mat-option>
                <mat-option value="SERVICIOS">Servicios</mat-option>
                <mat-option value="MIXTO">Mixto</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="criterio-section">
              <h4>Rango de Valores (Opcional)</h4>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Valor Mínimo</mat-label>
                  <input matInput type="number" formControlName="rangoMinimo" placeholder="0">
                  <span matPrefix>$</span>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Valor Máximo</mat-label>
                  <input matInput type="number" formControlName="rangoMaximo">
                  <span matPrefix>$</span>
                </mat-form-field>
              </div>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Excluir Contribuyentes (IDs)</mat-label>
              <input matInput formControlName="excluirContribuyentes" 
                     placeholder="ej: 123, 456, 789">
              <mat-hint>Separe los IDs con comas</mat-hint>
            </mat-form-field>

            <button mat-stroked-button (click)="simularSeleccion()" class="preview-btn">
              <mat-icon>preview</mat-icon>
              Simular Selección
            </button>

            <div *ngIf="previewContribuyentes" class="preview-result">
              <div class="preview-header">
                <mat-icon color="primary">info</mat-icon>
                <div>
                  <strong>Previsualización</strong>
                  <p>Con estos criterios se seleccionarán aproximadamente:</p>
                </div>
              </div>
              <div class="preview-stats">
                <div class="stat-card">
                  <span class="stat-value">{{previewContribuyentes}}</span>
                  <span class="stat-label">Contribuyentes</span>
                </div>
                <div class="stat-card">
                  <span class="stat-value">{{estimarTiempo()}}</span>
                  <span class="stat-label">Tiempo Estimado</span>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon>
                Anterior
              </button>
              <button mat-raised-button matStepperNext color="primary" [disabled]="!criteriosForm.valid">
                Siguiente
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- PASO 3: CONFIRMACIÓN Y EJECUCIÓN -->
        <mat-step>
          <ng-template matStepLabel>Ejecutar</ng-template>
          
          <div class="step-form">
            <div *ngIf="!procesoIniciado" class="confirmacion">
              <h3>Resumen del Proceso</h3>
              
              <div class="resumen-card">
                <div class="resumen-item">
                  <span class="label">Nombre:</span>
                  <span class="value">{{configuracionForm.get('nombre')?.value}}</span>
                </div>
                <div class="resumen-item">
                  <span class="label">Periodo:</span>
                  <span class="value">
                    {{configuracionForm.get('vigencia')?.value}} / 
                    {{configuracionForm.get('periodo')?.value}}
                  </span>
                </div>
                <div class="resumen-item">
                  <span class="label">Contribuyentes estimados:</span>
                  <span class="value highlight">{{previewContribuyentes || 0}}</span>
                </div>
                <div class="resumen-item">
                  <span class="label">Tiempo estimado:</span>
                  <span class="value">{{estimarTiempo()}}</span>
                </div>
              </div>

              <div class="warning-box">
                <mat-icon>warning</mat-icon>
                <div>
                  <strong>Importante:</strong>
                  <ul>
                    <li>El proceso se ejecutará en segundo plano</li>
                    <li>Recibirá una notificación al finalizar</li>
                    <li>Puede cerrar esta ventana sin detener el proceso</li>
                    <li>Las liquidaciones quedarán en estado según configuración</li>
                  </ul>
                </div>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon>
                  Anterior
                </button>
                <button mat-raised-button 
                        color="accent" 
                        (click)="ejecutarProceso()"
                        [disabled]="procesando">
                  <mat-icon>play_arrow</mat-icon>
                  Ejecutar Proceso
                </button>
              </div>
            </div>

            <!-- MONITOR DE PROGRESO -->
            <div *ngIf="procesoIniciado" class="monitor">
              <h3>Proceso en Ejecución</h3>
              
              <div class="progress-container">
                <div class="progress-header">
                  <span class="progress-text">
                    {{liquidacionesProcesadas}} de {{totalLiquidaciones}} liquidaciones
                  </span>
                  <span class="progress-percentage">{{obtenerPorcentaje()}}%</span>
                </div>
                
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="obtenerPorcentaje()"
                  [color]="obtenerPorcentaje() === 100 ? 'accent' : 'primary'">
                </mat-progress-bar>

                <div class="progress-details">
                  <div class="detail-item">
                    <mat-icon color="primary">check_circle</mat-icon>
                    <span>Exitosas: {{liquidacionesExitosas}}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon color="warn">error</mat-icon>
                    <span>Fallidas: {{liquidacionesFallidas}}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <span>Tiempo transcurrido: {{tiempoTranscurrido}}</span>
                  </div>
                </div>
              </div>

              <div *ngIf="obtenerPorcentaje() === 100" class="resultado-final">
                <mat-icon [color]="liquidacionesFallidas === 0 ? 'accent' : 'warn'">
                  {{liquidacionesFallidas === 0 ? 'check_circle' : 'warning'}}
                </mat-icon>
                <h3>{{liquidacionesFallidas === 0 ? '¡Proceso Completado!' : 'Proceso Completado con Errores'}}</h3>
                <p>{{liquidacionesExitosas}} liquidaciones creadas exitosamente</p>
                <p *ngIf="liquidacionesFallidas > 0" class="error-text">
                  {{liquidacionesFallidas}} liquidaciones fallaron
                </p>
              </div>

              <div *ngIf="liquidacionesFallidas > 0" class="errores-lista">
                <h4>Errores Encontrados:</h4>
                <mat-list>
                  <mat-list-item *ngFor="let error of errores">
                    <mat-icon matListItemIcon color="warn">error</mat-icon>
                    <div matListItemTitle>Contribuyente: {{error.contribuyente}}</div>
                    <div matListItemLine>{{error.mensaje}}</div>
                  </mat-list-item>
                </mat-list>
              </div>

              <div class="step-actions" *ngIf="obtenerPorcentaje() === 100">
                <button mat-button (click)="verLiquidaciones()">
                  <mat-icon>visibility</mat-icon>
                  Ver Liquidaciones
                </button>
                <button mat-raised-button color="primary" (click)="cerrar()">
                  <mat-icon>check</mat-icon>
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        </mat-step>

      </mat-stepper>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cerrar()" [disabled]="procesando && !procesoCompletado">
        {{procesoCompletado ? 'Cerrar' : 'Cancelar'}}
      </button>
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
      color: #ff6f00;
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

    .help-text {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .criterio-section {
      margin: 24px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .criterio-section h4 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .preview-btn {
      margin: 16px 0;
    }

    .preview-result {
      background: #e3f2fd;
      border-radius: 8px;
      padding: 20px;
      margin-top: 16px;
    }

    .preview-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .preview-header strong {
      font-size: 16px;
      color: #1976d2;
    }

    .preview-header p {
      margin: 4px 0 0 0;
      font-size: 14px;
      color: #666;
    }

    .preview-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 32px;
      font-weight: 700;
      color: #1976d2;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
    }

    /* Confirmación */
    .confirmacion {
      max-width: 100%;
    }

    .resumen-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }

    .resumen-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .resumen-item:last-child {
      border-bottom: none;
    }

    .resumen-item .label {
      color: #666;
      font-weight: 500;
    }

    .resumen-item .value {
      font-weight: 600;
      color: #333;
    }

    .resumen-item .value.highlight {
      color: #ff6f00;
      font-size: 20px;
    }

    .warning-box {
      display: flex;
      gap: 12px;
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 24px;
    }

    .warning-box mat-icon {
      color: #ff9800;
    }

    .warning-box ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }

    .warning-box li {
      font-size: 14px;
      margin: 4px 0;
    }

    /* Monitor de Progreso */
    .monitor {
      max-width: 100%;
    }

    .progress-container {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .progress-text {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .progress-percentage {
      font-size: 24px;
      font-weight: 700;
      color: #1976d2;
    }

    mat-progress-bar {
      height: 12px;
      border-radius: 6px;
      margin: 12px 0;
    }

    .progress-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .resultado-final {
      text-align: center;
      padding: 32px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .resultado-final mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .resultado-final h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .resultado-final p {
      margin: 4px 0;
      font-size: 16px;
    }

    .error-text {
      color: #f44336;
      font-weight: 600;
    }

    .errores-lista {
      background: #ffebee;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .errores-lista h4 {
      color: #f44336;
      margin: 0 0 12px 0;
    }

    .step-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class LiquidacionMasivaDialogComponent implements OnInit {
  configuracionForm: FormGroup;
  criteriosForm: FormGroup;
  
  tiposLiquidacion: any[] = [];
  fuentes: any[] = [];
  rentas: any[] = [];
  
  previewContribuyentes: number = 0;
  procesoIniciado = false;
  procesando = false;
  procesoCompletado = false;
  
  totalLiquidaciones = 0;
  liquidacionesProcesadas = 0;
  liquidacionesExitosas = 0;
  liquidacionesFallidas = 0;
  tiempoTranscurrido = '0:00';
  
  errores: any[] = [];
  liquidacionMasivaId?: number;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LiquidacionMasivaDialogComponent>,
    private liquidacionesService: LiquidacionesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.configuracionForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      tipoLiquidacionId: ['', Validators.required],
      fuenteIngresoId: ['', Validators.required],
      vigencia: [new Date().getFullYear(), Validators.required],
      periodo: [1, Validators.required]
    });

    this.criteriosForm = this.fb.group({
      rentaIds: [[]],
      actividadEconomica: [[]],
      rangoMinimo: [null],
      rangoMaximo: [null],
      excluirContribuyentes: ['']
    });
  }

  ngOnInit() {
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    // TODO: Cargar desde servicios reales
    this.liquidacionesService.getTiposLiquidacion().subscribe({
      next: (tipos) => this.tiposLiquidacion = tipos
    });
    
    this.liquidacionesService.getFuentesIngreso().subscribe({
      next: (fuentes) => this.fuentes = fuentes
    });

    this.rentas = [
      { id: 1, nombre: 'Impuesto Predial' },
      { id: 2, nombre: 'Industria y Comercio' }
    ];
  }

  simularSeleccion() {
    // TODO: Llamar al backend para simular
    this.previewContribuyentes = Math.floor(Math.random() * 1000) + 100;
  }

  estimarTiempo(): string {
    if (!this.previewContribuyentes) return '-';
    const minutos = Math.ceil(this.previewContribuyentes / 60);
    return `~${minutos} min`;
  }

  ejecutarProceso() {
    this.procesando = true;
    
    const criterioSeleccion: CriterioSeleccion = {
      rentaIds: this.criteriosForm.get('rentaIds')?.value,
      actividadEconomica: this.criteriosForm.get('actividadEconomica')?.value,
      rango: {
        minimo: this.criteriosForm.get('rangoMinimo')?.value || 0,
        maximo: this.criteriosForm.get('rangoMaximo')?.value || 999999999
      },
      excluirContribuyentes: this.parseExcluidos()
    };

    const liquidacionMasiva: LiquidacionMasiva = {
      ...this.configuracionForm.value,
      criterioSeleccion,
      estadoProceso: 'CONFIGURANDO',
      creadoPor: 'current-user' // TODO: Obtener del contexto
    };

    this.liquidacionesService.crearLiquidacionMasiva(liquidacionMasiva).subscribe({
      next: (result) => {
        this.liquidacionMasivaId = result.id;
        if (result.id) {
          this.liquidacionesService.ejecutarLiquidacionMasiva(result.id).subscribe({
            next: () => {
              this.iniciarMonitoreo();
            }
          });
        }
      }
    });
  }

  iniciarMonitoreo() {
    this.procesoIniciado = true;
    this.totalLiquidaciones = this.previewContribuyentes;
    
    // Simular progreso (en producción vendría del backend)
    const startTime = Date.now();
    interval(1000).pipe(take(this.totalLiquidaciones + 1)).subscribe({
      next: (tick) => {
        this.liquidacionesProcesadas = tick;
        this.liquidacionesExitosas = Math.floor(tick * 0.95);
        this.liquidacionesFallidas = tick - this.liquidacionesExitosas;
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        this.tiempoTranscurrido = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (tick % 10 === 0 && Math.random() > 0.9) {
          this.errores.push({
            contribuyente: `CONTRIB-${Math.floor(Math.random() * 1000)}`,
            mensaje: 'Error al calcular base gravable'
          });
        }
      },
      complete: () => {
        this.procesando = false;
        this.procesoCompletado = true;
      }
    });
  }

  obtenerPorcentaje(): number {
    if (!this.totalLiquidaciones) return 0;
    return Math.round((this.liquidacionesProcesadas / this.totalLiquidaciones) * 100);
  }

  parseExcluidos(): number[] {
    const value = this.criteriosForm.get('excluirContribuyentes')?.value;
    if (!value) return [];
    return value.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
  }

  verLiquidaciones() {
    this.dialogRef.close({ verLiquidaciones: true });
  }

  cerrar() {
    this.dialogRef.close();
  }
}

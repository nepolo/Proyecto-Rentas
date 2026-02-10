import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

interface ConfiguracionGeneral {
  uvt: number;
  smmlv: number;
  tasaInteresmora: number;
  tasaInteresCorriente: number;
  diasVencimiento: number;
  emailNotificaciones: boolean;
  smsNotificaciones: boolean;
  emailContacto: string;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    MatDividerModule,
    MatSelectModule
  ],
  template: `
    <div class="configuracion-container">
      <div class="page-header">
        <h1>
          <mat-icon>settings</mat-icon>
          Configuración General del Sistema
        </h1>
        <p class="subtitle">Parametrización global de valores tributarios y operativos</p>
      </div>

      <mat-tab-group>
        <!-- TAB 1: Valores Tributarios -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">monetization_on</mat-icon>
            Valores Tributarios
          </ng-template>
          <mat-card class="config-card">
            <mat-card-header>
              <mat-card-title>Parámetros Tributarios Vigencia {{ configuracion().vigencia || 2024 }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-grid">
                <mat-form-field appearance="outline" class="full-width highlight">
                  <mat-label>Unidad de Valor Tributario (UVT)</mat-label>
                  <span matPrefix>$ &nbsp;</span>
                  <input matInput type="number" [(ngModel)]="configuracion().uvt">
                  <mat-icon matSuffix matTooltip="Valor de la UVT definido por la DIAN para el año fiscal actual">info</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width highlight">
                  <mat-label>Salario Mínimo Legal Mensual Vigente (SMMLV)</mat-label>
                  <span matPrefix>$ &nbsp;</span>
                  <input matInput type="number" [(ngModel)]="configuracion().smmlv">
                  <mat-icon matSuffix matTooltip="Salario mínimo legal vigente para el año fiscal">info</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Tasa de Interés de Mora Mensual</mat-label>
                  <input matInput type="number" step="0.01" [(ngModel)]="configuracion().tasaInteresmora">
                  <span matSuffix>%</span>
                  <mat-hint>Interés aplicado a obligaciones vencidas</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Tasa de Interés Corriente Anual</mat-label>
                  <input matInput type="number" step="0.01" [(ngModel)]="configuracion().tasaInteresCorriente">
                  <span matSuffix>%</span>
                  <mat-hint>Para financiación de deudas</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Días para Vencimiento de Facturas</mat-label>
                  <input matInput type="number" [(ngModel)]="configuracion().diasVencimiento">
                  <span matSuffix>días</span>
                  <mat-hint>Días hábiles desde la emisión</mat-hint>
                </mat-form-field>
              </div>

              <div class="alert-info">
                <mat-icon>info</mat-icon>
                <div>
                  <strong>Importante:</strong> Estos valores deben actualizarse al inicio de cada vigencia fiscal según las resoluciones de la DIAN y decretos del Gobierno Nacional.
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-raised-button color="primary" (click)="guardarConfiguracion()">
                <mat-icon>save</mat-icon>
                Guardar Cambios
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>

        <!-- TAB 2: Notificaciones -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">notifications</mat-icon>
            Notificaciones
          </ng-template>
          <mat-card class="config-card">
            <mat-card-header>
              <mat-card-title>Configuración de Notificaciones</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="notification-section">
                <div class="notification-item">
                  <div class="notification-info">
                    <mat-icon>email</mat-icon>
                    <div>
                      <h3>Notificaciones por Email</h3>
                      <p>Enviar correos electrónicos a contribuyentes sobre liquidaciones, vencimientos y pagos</p>
                    </div>
                  </div>
                  <mat-slide-toggle [(ngModel)]="configuracion().emailNotificaciones" color="primary"></mat-slide-toggle>
                </div>

                <mat-divider></mat-divider>

                <div class="notification-item">
                  <div class="notification-info">
                    <mat-icon>sms</mat-icon>
                    <div>
                      <h3>Notificaciones por SMS</h3>
                      <p>Enviar mensajes de texto para recordatorios de pago y alertas importantes</p>
                    </div>
                  </div>
                  <mat-slide-toggle [(ngModel)]="configuracion().smsNotificaciones" color="primary"></mat-slide-toggle>
                </div>

                <mat-divider></mat-divider>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email de Contacto del Sistema</mat-label>
                  <input matInput type="email" [(ngModel)]="configuracion().emailContacto">
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-hint>Email desde el cual se enviarán las notificaciones</mat-hint>
                </mat-form-field>

                <div class="notification-types">
                  <h3>Tipos de Notificaciones Activas</h3>
                  <div class="notification-list">
                    <div class="notification-type-item">
                      <mat-icon>description</mat-icon>
                      <span>Nueva liquidación generada</span>
                    </div>
                    <div class="notification-type-item">
                      <mat-icon>schedule</mat-icon>
                      <span>Recordatorio de vencimiento (7 días antes)</span>
                    </div>
                    <div class="notification-type-item">
                      <mat-icon>warning</mat-icon>
                      <span>Factura vencida</span>
                    </div>
                    <div class="notification-type-item">
                      <mat-icon>check_circle</mat-icon>
                      <span>Confirmación de pago</span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-raised-button color="primary" (click)="guardarConfiguracion()">
                <mat-icon>save</mat-icon>
                Guardar Cambios
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>

        <!-- TAB 3: Facturación -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">receipt</mat-icon>
            Facturación
          </ng-template>
          <mat-card class="config-card">
            <mat-card-header>
              <mat-card-title>Configuración de Facturación</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Prefijo de Factura</mat-label>
                  <input matInput [(ngModel)]="facturacion().prefijo" maxlength="5">
                  <mat-hint>Ej: FT, FACT, IMP</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Número Inicial</mat-label>
                  <input matInput type="number" [(ngModel)]="facturacion().numeroInicial">
                  <mat-hint>Siguiente número a generar</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Resolución DIAN</mat-label>
                  <input matInput [(ngModel)]="facturacion().resolucionDian">
                  <mat-hint>Número de resolución de facturación</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Rango Autorizado</mat-label>
                  <input matInput [(ngModel)]="facturacion().rangoAutorizado" readonly>
                  <mat-hint>Del 1 al 50000</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Texto Pie de Factura</mat-label>
                  <textarea matInput rows="3" [(ngModel)]="facturacion().piePagina"></textarea>
                  <mat-hint>Información adicional que aparecerá en todas las facturas</mat-hint>
                </mat-form-field>
              </div>

              <div class="stats-facturacion">
                <div class="stat-item">
                  <mat-icon>insert_drive_file</mat-icon>
                  <div>
                    <div class="stat-value">{{ facturacion().facturasGeneradas | number }}</div>
                    <div class="stat-label">Facturas Generadas</div>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon>check</mat-icon>
                  <div>
                    <div class="stat-value">{{ facturacion().facturasDisponibles | number }}</div>
                    <div class="stat-label">Facturas Disponibles</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-raised-button color="primary" (click)="guardarConfiguracion()">
                <mat-icon>save</mat-icon>
                Guardar Cambios
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>

        <!-- TAB 4: Sistema -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">settings_applications</mat-icon>
            Sistema
          </ng-template>
          <mat-card class="config-card">
            <mat-card-header>
              <mat-card-title>Configuración del Sistema</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="system-config">
                <div class="config-section">
                  <h3>
                    <mat-icon>schedule</mat-icon>
                    Sesiones y Seguridad
                  </h3>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Tiempo de Sesión</mat-label>
                      <input matInput type="number" [(ngModel)]="sistema().tiempoSesion">
                      <span matSuffix>minutos</span>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Intentos de Login</mat-label>
                      <input matInput type="number" [(ngModel)]="sistema().intentosLogin">
                      <mat-hint>Antes de bloquear cuenta</mat-hint>
                    </mat-form-field>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="config-section">
                  <h3>
                    <mat-icon>backup</mat-icon>
                    Respaldos y Mantenimiento
                  </h3>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Frecuencia de Respaldo</mat-label>
                      <mat-select [(ngModel)]="sistema().frecuenciaRespaldo">
                        <mat-option value="diario">Diario</mat-option>
                        <mat-option value="semanal">Semanal</mat-option>
                        <mat-option value="mensual">Mensual</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Hora de Respaldo</mat-label>
                      <input matInput type="time" [(ngModel)]="sistema().horaRespaldo">
                    </mat-form-field>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="config-section">
                  <h3>
                    <mat-icon>storage</mat-icon>
                    Información del Sistema
                  </h3>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">Versión:</span>
                      <span class="value">1.0.0</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Base de Datos:</span>
                      <span class="value">PostgreSQL 15</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Último Respaldo:</span>
                      <span class="value">{{ sistema().ultimoRespaldo }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Espacio Usado:</span>
                      <span class="value">2.5 GB / 50 GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-button>
                <mat-icon>refresh</mat-icon>
                Limpiar Caché
              </button>
              <button mat-raised-button color="primary" (click)="guardarConfiguracion()">
                <mat-icon>save</mat-icon>
                Guardar Cambios
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .configuracion-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .page-header {
      margin-bottom: 24px;

      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 8px 0;
        font-size: 28px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #667eea;
        }
      }

      .subtitle {
        color: #666;
        margin: 0;
        font-size: 14px;
      }
    }

    .config-card {
      margin-top: 16px;
    }

    .tab-icon {
      margin-right: 8px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      .full-width {
        grid-column: 1 / -1;
      }

      .highlight {
        background: #fff9e6;
        border-radius: 4px;
      }
    }

    .alert-info {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      margin-top: 16px;

      mat-icon {
        color: #2196f3;
      }
    }

    .notification-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;

      .notification-info {
        display: flex;
        gap: 16px;
        align-items: flex-start;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #667eea;
        }

        h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
      }
    }

    .notification-types {
      margin-top: 24px;

      h3 {
        margin-bottom: 16px;
        font-size: 16px;
      }

      .notification-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .notification-type-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 8px;

        mat-icon {
          color: #667eea;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        span {
          font-size: 14px;
        }
      }
    }

    .stats-facturacion {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 24px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 8px;

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: #667eea;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: #333;
        }

        .stat-label {
          font-size: 13px;
          color: #666;
        }
      }
    }

    .system-config {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .config-section {
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        font-size: 16px;

        mat-icon {
          color: #667eea;
        }
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 4px;

        .label {
          font-weight: 500;
          color: #666;
        }

        .value {
          color: #333;
        }
      }
    }
  `]
})
export class ConfiguracionComponent {
  configuracion = signal<ConfiguracionGeneral & { vigencia: number }>({
    uvt: 47065,
    smmlv: 1300000,
    tasaInteresmora: 2.13,
    tasaInteresCorriente: 18.5,
    diasVencimiento: 30,
    emailNotificaciones: true,
    smsNotificaciones: false,
    emailContacto: 'rentas@municipio.gov.co',
    vigencia: 2024
  });

  facturacion = signal({
    prefijo: 'FT',
    numeroInicial: 1001,
    resolucionDian: '18764003456789',
    rangoAutorizado: '1 - 50000',
    piePagina: 'Gracias por cumplir con sus obligaciones tributarias.',
    facturasGeneradas: 1245,
    facturasDisponibles: 48755
  });

  sistema = signal({
    tiempoSesion: 30,
    intentosLogin: 3,
    frecuenciaRespaldo: 'diario',
    horaRespaldo: '02:00',
    ultimoRespaldo: '2024-02-04 02:00:00'
  });

  guardarConfiguracion() {
    alert('Configuración guardada exitosamente');
  }
}

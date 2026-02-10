import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { ObjetosTributariosService, ObjetoTributario } from '../../../core/services/objetos-tributarios.service';
import { ObjetoTributarioDialogComponent } from '../objeto-tributario-dialog/objeto-tributario-dialog.component';
import { ConceptoDialogComponent } from '../concepto-dialog/concepto-dialog.component';
import { PeriodoLiquidacionDialogComponent } from '../periodo-liquidacion-dialog/periodo-liquidacion-dialog.component';
import { PeriodoFacturacionDialogComponent } from '../periodo-facturacion-dialog/periodo-facturacion-dialog.component';
import { TipoFacturacionDialogComponent } from '../tipo-facturacion-dialog/tipo-facturacion-dialog.component';
import { ConceptoCobro, PeriodoLiquidacion, PeriodoFacturacion, TipoFacturacion } from '../../../core/models';

interface FuenteDetalle {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  estado: string;
  color: string;
  icono: string;
  // Prescripción
  aplicaPrescripcion: boolean;
  aniosPrescripcion?: number;
  // Estadísticas
  conceptosCount: number;
  liquidacionesCount: number;
  objetosCount: number;
  periodosLiquidacionCount: number;
  periodosFacturacionCount: number;
  // Auditoría
  creadoPor: string;
  fechaCreacion: string;
  modificadoPor?: string;
  fechaModificacion?: string;
}

@Component({
  selector: 'app-fuente-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  template: `
    <div class="fuente-detalle-container" *ngIf="fuente()">
      <!-- Header Mejorado -->
      <div class="fuente-header">
        <div class="header-left">
          <button mat-icon-button (click)="volver()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div class="fuente-icon" [style.background]="'linear-gradient(135deg, ' + fuente()!.color + ' 0%, ' + fuente()!.color + 'CC 100%)'">
            <mat-icon>{{ fuente()!.icono }}</mat-icon>
          </div>
          <div class="header-info">
            <div class="breadcrumb">
              <span class="breadcrumb-item" (click)="volver()">Fuentes</span>
              <mat-icon>chevron_right</mat-icon>
              <span class="breadcrumb-item active">{{ fuente()!.nombre }}</span>
            </div>
            <h1>{{ fuente()!.nombre }}</h1>
            <p class="subtitle">
              <span class="codigo">{{ fuente()!.codigo }}</span>
              <span class="separator">•</span>
              <span>{{ fuente()!.categoria }}</span>
              <span class="separator" *ngIf="fuente()!.aplicaPrescripcion">•</span>
              <span *ngIf="fuente()!.aplicaPrescripcion" class="prescripcion">
                <mat-icon>schedule</mat-icon>
                Prescripción: {{ fuente()!.aniosPrescripcion }} años
              </span>
            </p>
          </div>
        </div>
        <div class="header-actions">
          <mat-chip [class]="'estado-' + fuente()!.estado">
            <mat-icon>{{ fuente()!.estado === 'activo' ? 'check_circle' : 'cancel' }}</mat-icon>
            {{ fuente()!.estado | uppercase }}
          </mat-chip>
          <button mat-raised-button color="primary">
            <mat-icon>edit</mat-icon>
            Editar Fuente
          </button>
          <button mat-icon-button [matTooltip]="'Más opciones'">
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
      </div>

      <!-- KPIs Rápidos -->
      <div class="kpi-bar">
        <div class="kpi-item" [style.border-left-color]="fuente()!.color">
          <mat-icon>inventory_2</mat-icon>
          <div class="kpi-content">
            <span class="kpi-value">{{ fuente()!.objetosCount | number }}</span>
            <span class="kpi-label">Objetos Tributarios</span>
          </div>
        </div>
        <div class="kpi-item" [style.border-left-color]="fuente()!.color">
          <mat-icon>receipt_long</mat-icon>
          <div class="kpi-content">
            <span class="kpi-value">{{ fuente()!.conceptosCount }}</span>
            <span class="kpi-label">Rubros de Liquidación</span>
          </div>
        </div>
        <div class="kpi-item" [style.border-left-color]="fuente()!.color">
          <mat-icon>calendar_today</mat-icon>
          <div class="kpi-content">
            <span class="kpi-value">{{ fuente()!.periodosLiquidacionCount }}</span>
            <span class="kpi-label">Períodos Liquidación</span>
          </div>
        </div>
        <div class="kpi-item" [style.border-left-color]="fuente()!.color">
          <mat-icon>description</mat-icon>
          <div class="kpi-content">
            <span class="kpi-value">{{ fuente()!.liquidacionesCount | number }}</span>
            <span class="kpi-label">Liquidaciones</span>
          </div>
        </div>
        <div class="kpi-item" [style.border-left-color]="fuente()!.color">
          <mat-icon>payments</mat-icon>
          <div class="kpi-content">
            <span class="kpi-value">$128.5B</span>
            <span class="kpi-label">Recaudado 2024</span>
          </div>
        </div>
      </div>

      <!-- Barra de Completitud / Estado de Configuración -->
      <div class="completitud-bar" *ngIf="fuente()">
        <div class="completitud-header">
          <mat-icon>checklist</mat-icon>
          <span class="completitud-title">Configuración: {{ getCompletitudPercentage() }}% completa</span>
        </div>
        <div class="completitud-progress">
          <div class="progress-bar-fill" [style.width.%]="getCompletitudPercentage()"></div>
        </div>
        <div class="completitud-items-simple">
          <span class="completitud-badge" [class.completo]="true">✓ Info Básica</span>
          <span class="completitud-badge" [class.completo]="objetosTributarios().length > 0">
            {{ objetosTributarios().length > 0 ? '✓' : '○' }} Objetos ({{ objetosTributarios().length }})
          </span>
          <span class="completitud-badge" [class.completo]="(valoresPredial().length + valoresICA().length) > 0">
            {{ (valoresPredial().length + valoresICA().length) > 0 ? '✓' : '○' }} Valores ({{ valoresPredial().length + valoresICA().length }})
          </span>
          <span class="completitud-badge" [class.completo]="conceptos().length > 0">
            {{ conceptos().length > 0 ? '✓' : '○' }} Rubros ({{ conceptos().length }})
          </span>
          <span class="completitud-badge" [class.completo]="periodosLiquidacion().length > 0" [class.bloqueado]="conceptos().length === 0">
            {{ periodosLiquidacion().length > 0 ? '✓' : (conceptos().length === 0 ? '🔒' : '○') }} Períodos ({{ periodosLiquidacion().length }})
          </span>
        </div>
      </div>

      <!-- Tabs Reorganizados por Secciones Lógicas -->
      <mat-tab-group class="fuente-tabs" [(selectedIndex)]="selectedTabIndex" animationDuration="200ms">
        
        <!-- ═══════════════════════════════════════════════════════════════════ -->
        <!-- SECCIÓN 1: INFORMACIÓN BÁSICA                                       -->
        <!-- ═══════════════════════════════════════════════════════════════════ -->
        
        <!-- TAB 1: INFORMACIÓN GENERAL -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>info</mat-icon>
            General
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="info-section-grid">
                <!-- Información Básica -->
                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>article</mat-icon>
                      Detalles de la Fuente
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="info-grid">
                      <div class="info-item">
                        <label>Código:</label>
                        <span>{{ fuente()!.codigo }}</span>
                      </div>
                      <div class="info-item">
                        <label>Categoría:</label>
                        <span>{{ fuente()!.categoria }}</span>
                      </div>
                      <div class="info-item">
                        <label>Estado:</label>
                        <mat-chip [class]="'estado-' + fuente()!.estado">
                          {{ fuente()!.estado }}
                        </mat-chip>
                      </div>
                      <div class="info-item">
                        <label>Prescripción:</label>
                        <span>{{ fuente()!.aplicaPrescripcion ? fuente()!.aniosPrescripcion + ' años' : 'No aplica' }}</span>
                      </div>
                      <div class="info-item full-width">
                        <label>Descripción:</label>
                        <span>{{ fuente()!.descripcion }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Auditoría -->
                <mat-card class="info-card audit-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>history</mat-icon>
                      Auditoría
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="audit-timeline">
                      <div class="audit-item">
                        <mat-icon>add_circle</mat-icon>
                        <div>
                          <strong>Creado por:</strong> {{ fuente()!.creadoPor }}<br>
                          <small>{{ fuente()!.fechaCreacion }}</small>
                        </div>
                      </div>
                      <div class="audit-item" *ngIf="fuente()!.modificadoPor">
                        <mat-icon>edit</mat-icon>
                        <div>
                          <strong>Modificado por:</strong> {{ fuente()!.modificadoPor }}<br>
                          <small>{{ fuente()!.fechaModificacion }}</small>
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Resumen de Configuración -->
                <mat-card class="info-card config-summary">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>checklist</mat-icon>
                      Estado de Configuración
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="config-checklist">
                      <div class="check-item" [class.completed]="fuente()!.objetosCount > 0">
                        <mat-icon>{{ fuente()!.objetosCount > 0 ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                        <span>Objetos Tributarios ({{ fuente()!.objetosCount }})</span>
                      </div>
                      <div class="check-item" [class.completed]="fuente()!.conceptosCount > 0">
                        <mat-icon>{{ fuente()!.conceptosCount > 0 ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                        <span>Conceptos de Cobro ({{ fuente()!.conceptosCount }})</span>
                      </div>
                      <div class="check-item" [class.completed]="fuente()!.periodosLiquidacionCount > 0">
                        <mat-icon>{{ fuente()!.periodosLiquidacionCount > 0 ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                        <span>Períodos de Liquidación ({{ fuente()!.periodosLiquidacionCount }})</span>
                      </div>
                      <div class="check-item" [class.completed]="fuente()!.periodosFacturacionCount > 0">
                        <mat-icon>{{ fuente()!.periodosFacturacionCount > 0 ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                        <span>Períodos de Facturación ({{ fuente()!.periodosFacturacionCount }})</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </ng-template>
        </mat-tab>

        <!-- ═══════════════════════════════════════════════════════════════════ -->
        <!-- SECCIÓN 2: SUJETOS Y VALORES (A quién/qué le cobro y cuánto vale)  -->
        <!-- ═══════════════════════════════════════════════════════════════════ -->

        <!-- TAB 2: OBJETOS TRIBUTARIOS -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon [matBadge]="objetosTributarios().length" matBadgeColor="primary">{{ fuente()!.icono }}</mat-icon>
            Objetos Tributarios
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>Gestión de {{ getTipoObjeto() }}s</h2>
                  <p class="tab-subtitle">Registros de {{ getTipoObjeto() }}s asociados a esta fuente</p>
                </div>
                <div class="header-actions">
                  <button mat-raised-button color="accent">
                    <mat-icon>upload</mat-icon>
                    Importar Excel
                  </button>
                  <button mat-raised-button color="primary" (click)="abrirDialogoObjeto()">
                    <mat-icon>add</mat-icon>
                    Nuevo {{ getTipoObjeto() }}
                  </button>
                </div>
              </div>

              <mat-card class="data-card">
                <div class="search-bar">
                  <mat-form-field>
                    <mat-label>Buscar {{ getTipoObjeto() }}</mat-label>
                    <input matInput placeholder="Código, descripción...">
                    <mat-icon matSuffix>search</mat-icon>
                  </mat-form-field>
                  <button mat-button>
                    <mat-icon>filter_list</mat-icon>
                    Filtros
                  </button>
                </div>
                
                <table mat-table [dataSource]="objetosTributarios()" class="objetos-table" *ngIf="objetosTributarios().length > 0">
                  <ng-container matColumnDef="codigo">
                    <th mat-header-cell *matHeaderCellDef>Código</th>
                    <td mat-cell *matCellDef="let objeto">
                      <strong>{{ objeto.codigo }}</strong>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="descripcion">
                    <th mat-header-cell *matHeaderCellDef>{{ getTipoObjeto() }}</th>
                    <td mat-cell *matCellDef="let objeto">
                      <div class="objeto-info">
                        <span class="principal">{{ getValorPrincipal(objeto) }}</span>
                        <span class="secundario">{{ getValorSecundario(objeto) }}</span>
                      </div>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="estado">
                    <th mat-header-cell *matHeaderCellDef>Estado</th>
                    <td mat-cell *matCellDef="let objeto">
                      <mat-chip [class]="objeto.activo ? 'estado-activo' : 'estado-inactivo'">
                        {{ objeto.activo ? 'Activo' : 'Inactivo' }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="acciones">
                    <th mat-header-cell *matHeaderCellDef>Acciones</th>
                    <td mat-cell *matCellDef="let objeto">
                      <button mat-icon-button (click)="verDetalleObjeto(objeto)" [matTooltip]="'Ver detalle'">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button (click)="abrirDialogoObjeto(objeto)" [matTooltip]="'Editar'">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button (click)="eliminarObjetoTributario(objeto)" [matTooltip]="'Eliminar'" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
                </table>
                
                <div *ngIf="objetosTributarios().length === 0" class="empty-state">
                  <mat-icon>{{ fuente()!.icono }}</mat-icon>
                  <h3>No hay {{ getTipoObjeto() }}s registrados</h3>
                  <p>Comienza agregando el primer {{ getTipoObjeto() }} de esta fuente</p>
                  <button mat-raised-button color="primary" (click)="abrirDialogoObjeto()">
                    <mat-icon>add</mat-icon>
                    Registrar Primer {{ getTipoObjeto() }}
                  </button>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <!-- TAB 3: VALORES BASE (Avalúos, CIIU, Ingresos) -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>assessment</mat-icon>
            {{ getNombreTabValoresBase() }}
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>{{ getNombreTabValoresBase() }}</h2>
                  <p class="tab-subtitle">Valores base del objeto tributario por vigencia con historial completo</p>
                </div>
                <button mat-raised-button color="primary" (click)="abrirFormValoresBase()">
                  <mat-icon>add</mat-icon>
                  Nuevo {{ getNombreTabValoresBase() }}
                </button>
              </div>

              <mat-card class="data-card">
                <!-- Filtros -->
                <div class="filters-valores-base">
                  <mat-form-field>
                    <mat-label>Vigencia</mat-label>
                    <mat-select [(ngModel)]="vigenciaValoresBase">
                      <mat-option *ngFor="let year of vigenciasDisponibles()" [value]="year">
                        {{ year }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                  
                  <mat-form-field>
                    <mat-label>Buscar objeto</mat-label>
                    <input matInput placeholder="Código o descripción">
                    <mat-icon matSuffix>search</mat-icon>
                  </mat-form-field>
                </div>

                <!-- Tabla de Valores Base según tipo de fuente -->
                <div *ngIf="esPredi() && valoresPredial().length > 0">
                  <table mat-table [dataSource]="valoresPredial()" class="valores-table">
                    <ng-container matColumnDef="objeto">
                      <th mat-header-cell *matHeaderCellDef>Objeto</th>
                      <td mat-cell *matCellDef="let valor">
                        <strong>{{ getObjetoNombre(valor.objetoTributarioId) }}</strong>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="avaluo">
                      <th mat-header-cell *matHeaderCellDef>Avalúo Catastral</th>
                      <td mat-cell *matCellDef="let valor">
                        {{ valor.avaluoCatastral | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="destinacion">
                      <th mat-header-cell *matHeaderCellDef>Destinación</th>
                      <td mat-cell *matCellDef="let valor">
                        <mat-chip [class]="'destinacion-' + valor.destinacionEconomica.toLowerCase()">
                          {{ valor.destinacionEconomica }}
                        </mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="estrato">
                      <th mat-header-cell *matHeaderCellDef>Estrato</th>
                      <td mat-cell *matCellDef="let valor">
                        <mat-chip class="estrato-badge">{{ valor.estrato }}</mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="vigencia">
                      <th mat-header-cell *matHeaderCellDef>Vigencia</th>
                      <td mat-cell *matCellDef="let valor">
                        <mat-chip class="vigencia-badge">{{ valor.vigencia }}</mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="acciones">
                      <th mat-header-cell *matHeaderCellDef>Acciones</th>
                      <td mat-cell *matCellDef="let valor">
                        <button mat-icon-button (click)="editarValorBase(valor)" matTooltip="Editar">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="eliminarValorBase(valor)" matTooltip="Eliminar">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="['objeto', 'avaluo', 'destinacion', 'estrato', 'vigencia', 'acciones']"></tr>
                    <tr mat-row *matRowDef="let row; columns: ['objeto', 'avaluo', 'destinacion', 'estrato', 'vigencia', 'acciones'];"></tr>
                  </table>
                </div>

                <div *ngIf="esICA() && valoresICA().length > 0">
                  <table mat-table [dataSource]="valoresICA()" class="valores-table">
                    <ng-container matColumnDef="objeto">
                      <th mat-header-cell *matHeaderCellDef>Objeto</th>
                      <td mat-cell *matCellDef="let valor">
                        <strong>{{ getObjetoNombre(valor.objetoTributarioId) }}</strong>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="ciiu">
                      <th mat-header-cell *matHeaderCellDef>CIIU</th>
                      <td mat-cell *matCellDef="let valor">
                        <mat-chip class="ciiu-badge">{{ valor.actividadEconomica }}</mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="actividad">
                      <th mat-header-cell *matHeaderCellDef>Actividad</th>
                      <td mat-cell *matCellDef="let valor">
                        {{ valor.descripcionActividad }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="ingresos">
                      <th mat-header-cell *matHeaderCellDef>Ingresos Gravados</th>
                      <td mat-cell *matCellDef="let valor">
                        {{ valor.ingresosGravados | currency:'COP':'symbol-narrow':'1.0-0' }}
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="tipo">
                      <th mat-header-cell *matHeaderCellDef>Tipo</th>
                      <td mat-cell *matCellDef="let valor">
                        <mat-chip [class]="'tipo-' + valor.tipoContribuyente.toLowerCase().replace('_', '-')">
                          {{ valor.tipoContribuyente.replace('_', ' ') }}
                        </mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="vigencia">
                      <th mat-header-cell *matHeaderCellDef>Vigencia</th>
                      <td mat-cell *matCellDef="let valor">
                        <mat-chip class="vigencia-badge">{{ valor.vigencia }}</mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="acciones">
                      <th mat-header-cell *matHeaderCellDef>Acciones</th>
                      <td mat-cell *matCellDef="let valor">
                        <button mat-icon-button (click)="editarValorBase(valor)" matTooltip="Editar">
                          <mat-icon>edit</mat-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="eliminarValorBase(valor)" matTooltip="Eliminar">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="['objeto', 'ciiu', 'actividad', 'ingresos', 'tipo', 'vigencia', 'acciones']"></tr>
                    <tr mat-row *matRowDef="let row; columns: ['objeto', 'ciiu', 'actividad', 'ingresos', 'tipo', 'vigencia', 'acciones'];"></tr>
                  </table>
                </div>

                <!-- Empty state -->
                <div *ngIf="(esPredi() && valoresPredial().length === 0) || (esICA() && valoresICA().length === 0)" class="empty-state">
                  <mat-icon>assessment</mat-icon>
                  <h3>No hay {{ getNombreTabValoresBase() }} registrados</h3>
                  <p>Comienza registrando los valores base de tus objetos tributarios</p>
                  <button mat-raised-button color="primary" (click)="abrirFormValoresBase()">
                    <mat-icon>add</mat-icon>
                    Registrar Primer Valor
                  </button>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <!-- ═══════════════════════════════════════════════════════════════════ -->
        <!-- SECCIÓN 3: REGLAS DE CÁLCULO (Cómo se calcula el tributo)          -->
        <!-- ═══════════════════════════════════════════════════════════════════ -->

        <!-- TAB 4: PARÁMETROS TRIBUTARIOS (Tarifas, Rangos, Factores) -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>tune</mat-icon>
            Parámetros
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>Parámetros Tributarios</h2>
                  <p class="tab-subtitle">Tarifas por rangos, factores de ajuste y multiplicadores</p>
                </div>
                <button mat-raised-button color="primary">
                  <mat-icon>add</mat-icon>
                  Nuevo Parámetro
                </button>
              </div>

              <mat-card class="data-card">
                <div class="parametros-placeholder">
                  <mat-icon>tune</mat-icon>
                  <h3>Configuración de Parámetros Tributarios</h3>
                  <p>Define las reglas que se aplican sobre los valores base:</p>
                  <ul style="text-align: left; max-width: 600px; margin: 16px auto;">
                    <li><strong>Tarifas por Rango:</strong> 0-50 SMLV → 0.5%, 50-100 SMLV → 1.2%, etc.</li>
                    <li><strong>Factores de Ajuste:</strong> Multiplicadores, porcentajes, valores fijos</li>
                    <li><strong>Condiciones:</strong> Aplicación por destino, estrato, actividad CIIU</li>
                    <li><strong>Vigencia:</strong> Parámetros variables por año</li>
                  </ul>
                  <p style="margin-top: 24px; color: #666; font-size: 14px;">
                    <mat-icon style="vertical-align: middle;">info</mat-icon>
                    Estos parámetros se aplican SOBRE los valores base para calcular la liquidación
                  </p>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <!-- TAB 5: BENEFICIOS TRIBUTARIOS (Descuentos & Exenciones Fusionados) -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>card_giftcard</mat-icon>
            Beneficios
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>Beneficios Tributarios</h2>
                  <p class="tab-subtitle">Descuentos, exenciones y beneficios aplicables</p>
                </div>
                <div style="display: flex; gap: 12px;">
                  <button mat-raised-button color="primary">
                    <mat-icon>discount</mat-icon>
                    Nuevo Descuento
                  </button>
                  <button mat-raised-button color="accent">
                    <mat-icon>star</mat-icon>
                    Nueva Exención
                  </button>
                </div>
              </div>

              <mat-card class="data-card">
                <!-- Pestañas internas para Descuentos y Exenciones -->
                <mat-tab-group class="beneficios-tabs" animationDuration="150ms">
                  
                  <!-- Sub-tab: Descuentos -->
                  <mat-tab>
                    <ng-template mat-tab-label>
                      <mat-icon>discount</mat-icon>
                      Descuentos
                    </ng-template>
                    <div class="descuentos-placeholder" style="padding: 24px;">
                      <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: #43A047;">discount</mat-icon>
                      <h3>Gestión de Descuentos</h3>
                      <p>Reducciones que disminuyen el valor liquidado:</p>
                      <div class="beneficios-grid">
                        <div class="beneficio-card">
                          <mat-icon>schedule</mat-icon>
                          <strong>Pronto Pago</strong>
                          <span>10% por pago anticipado antes del vencimiento</span>
                        </div>
                        <div class="beneficio-card">
                          <mat-icon>elderly</mat-icon>
                          <strong>Tercera Edad</strong>
                          <span>15% para mayores de 65 años</span>
                        </div>
                        <div class="beneficio-card">
                          <mat-icon>accessible</mat-icon>
                          <strong>Discapacidad</strong>
                          <span>20% con certificación vigente</span>
                        </div>
                        <div class="beneficio-card">
                          <mat-icon>agriculture</mat-icon>
                          <strong>Rural</strong>
                          <span>8% para predios rurales pequeños</span>
                        </div>
                      </div>
                      <p style="margin-top: 24px; color: #666; font-size: 13px;">
                        <mat-icon style="vertical-align: middle; font-size: 18px;">info</mat-icon>
                        Los descuentos se aplican DESPUÉS de calcular el valor base
                      </p>
                    </div>
                  </mat-tab>

                  <!-- Sub-tab: Exenciones -->
                  <mat-tab>
                    <ng-template mat-tab-label>
                      <mat-icon>star</mat-icon>
                      Exenciones
                    </ng-template>
                    <div class="exenciones-placeholder" style="padding: 24px;">
                      <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: #FFA726;">star</mat-icon>
                      <h3>Gestión de Exenciones</h3>
                      <p>Exoneraciones totales o parciales del tributo:</p>
                      <div class="beneficios-grid">
                        <div class="beneficio-card exencion">
                          <mat-icon>account_balance</mat-icon>
                          <strong>Entidades Públicas</strong>
                          <span>100% - Exención total para bienes del Estado</span>
                        </div>
                        <div class="beneficio-card exencion">
                          <mat-icon>church</mat-icon>
                          <strong>Cultos Religiosos</strong>
                          <span>100% - Templos y sitios de culto registrados</span>
                        </div>
                        <div class="beneficio-card exencion">
                          <mat-icon>volunteer_activism</mat-icon>
                          <strong>Sin Ánimo de Lucro</strong>
                          <span>50-100% según destinación social</span>
                        </div>
                        <div class="beneficio-card exencion">
                          <mat-icon>forest</mat-icon>
                          <strong>Conservación Ambiental</strong>
                          <span>30-70% para zonas de reserva o protección</span>
                        </div>
                      </div>
                      <p style="margin-top: 24px; color: #666; font-size: 13px;">
                        <mat-icon style="vertical-align: middle; font-size: 18px;">info</mat-icon>
                        Las exenciones requieren aprobación previa y renovación anual
                      </p>
                    </div>
                  </mat-tab>

                </mat-tab-group>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <!-- TAB 6: RUBROS DE LIQUIDACIÓN -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon [matBadge]="conceptos().length" matBadgeColor="primary">receipt_long</mat-icon>
            Rubros
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>Rubros de Liquidación</h2>
                  <p class="tab-subtitle">Define los rubros que componen la liquidación tributaria</p>
                </div>
                <button mat-raised-button color="primary" (click)="abrirDialogoConcepto()">
                  <mat-icon>add</mat-icon>
                  Nuevo Rubro
                </button>
              </div>

              <mat-card class="data-card">
                <div class="conceptos-grid" *ngIf="conceptos().length > 0">
                  <mat-card *ngFor="let concepto of conceptos()" class="concepto-card"
                            [class.concepto-inactivo]="concepto.estado === 'INACTIVO'">
                    <div class="concepto-header">
                      <div class="concepto-icon" [class]="'tipo-' + concepto.tipoConcepto.toLowerCase()">
                        <mat-icon>{{ getIconoTipoConcepto(concepto.tipoConcepto) }}</mat-icon>
                      </div>
                      <mat-chip [class]="'tipo-' + concepto.tipoConcepto.toLowerCase()">
                        {{ concepto.tipoConcepto }}
                      </mat-chip>
                    </div>
                    <h3>{{ concepto.nombre }}</h3>
                    <p class="concepto-codigo">{{ concepto.codigo }}</p>
                    <p class="concepto-descripcion">{{ concepto.descripcion || 'Sin descripción' }}</p>
                    
                    <div class="concepto-details">
                      <div class="detail-item">
                        <mat-icon>{{ concepto.operacion === 'SUMA' ? 'add' : 'remove' }}</mat-icon>
                        <span>{{ concepto.operacion === 'SUMA' ? 'Suma' : 'Resta' }}</span>
                      </div>
                      <div class="detail-item" *ngIf="concepto.cuentaContableId">
                        <mat-icon>account_balance_wallet</mat-icon>
                        <span>{{ concepto.cuentaContableId }}</span>
                      </div>
                      <div class="detail-item" *ngIf="concepto.esObligatorio">
                        <mat-icon>star</mat-icon>
                        <span>Obligatorio</span>
                      </div>
                    </div>

                    <div class="concepto-footer">
                      <button mat-icon-button (click)="editarConcepto(concepto)" [matTooltip]="'Editar'">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button (click)="eliminarConcepto(concepto)" [matTooltip]="'Eliminar'" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </mat-card>
                </div>

                <div *ngIf="conceptos().length === 0" class="empty-state">
                  <mat-icon>receipt_long</mat-icon>
                  <h3>No hay conceptos configurados</h3>
                  <p>Crea conceptos como Capital, Intereses, Descuentos, etc.</p>
                  <button mat-raised-button color="primary" (click)="abrirDialogoConcepto()">
                    <mat-icon>add</mat-icon>
                    Crear Primer Concepto
                  </button>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <!-- ═══════════════════════════════════════════════════════════════════ -->
        <!-- SECCIÓN 4: EJECUCIÓN (Cuándo y cómo se ejecuta el cobro)           -->
        <!-- ═══════════════════════════════════════════════════════════════════ -->

        <!-- TAB 7: MOTOR DE CÁLCULO -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>functions</mat-icon>
            Motor de Cálculo
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>Motor de Cálculo</h2>
                  <p class="tab-subtitle">Define las reglas y fórmulas de liquidación</p>
                </div>
                <button mat-raised-button color="primary">
                  <mat-icon>add</mat-icon>
                  Nueva Fórmula
                </button>
              </div>

              <mat-card class="data-card">
                <div class="formulacion-placeholder">
                  <mat-card *ngFor="let periodo of periodosLiquidacion()" class="periodo-card">
                    <div class="periodo-header">
                      <div class="periodo-badge" [class]="'periodo-' + periodo.tipoPeriodo.toLowerCase()">
                        {{ periodo.vigencia }}
                      </div>
                      <div class="periodo-info">
                        <h3>{{ periodo.descripcion }}</h3>
                        <p>{{ periodo.tipoPeriodo }} - Vigencia {{ periodo.vigencia }}</p>
                      </div>
                      <mat-chip [class]="'estado-' + periodo.estado.toLowerCase()">
                        {{ periodo.estado }}
                      </mat-chip>
                    </div>

                    <div class="periodo-dates">
                      <div class="date-item">
                        <mat-icon>event</mat-icon>
                        <div>
                          <strong>Período:</strong>
                          <span>{{ periodo.fechaInicio }} - {{ periodo.fechaFin }}</span>
                        </div>
                      </div>
                      <div class="date-item" *ngIf="periodo.fechaVencimiento">
                        <mat-icon>alarm</mat-icon>
                        <div>
                          <strong>Vencimiento:</strong>
                          <span>{{ periodo.fechaVencimiento }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="periodo-stats" *ngIf="periodo.numeroLiquidacionesGeneradas">
                      <div class="stat">
                        <mat-icon>description</mat-icon>
                        <span>{{ periodo.numeroLiquidacionesGeneradas }} liquidaciones</span>
                      </div>
                      <div class="stat">
                        <mat-icon>payments</mat-icon>
                        <span>{{ periodo.valorTotalLiquidado | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                      </div>
                      <div class="stat" [class.facturado]="periodo.numeroLiquidacionesGeneradas && periodo.numeroLiquidacionesGeneradas > 0">
                        <mat-icon>{{ (periodo.numeroLiquidacionesGeneradas && periodo.numeroLiquidacionesGeneradas > 0) ? 'check_circle' : 'pending' }}</mat-icon>
                        <span>{{ periodo.numeroLiquidacionesGeneradas || 0 }} Liquidados</span>
                      </div>
                    </div>

                    <div class="periodo-actions">
                      <button mat-button (click)="editarPeriodoLiquidacion(periodo)">
                        <mat-icon>edit</mat-icon>
                        Editar
                      </button>
                      <button mat-button (click)="verLiquidacionesPeriodo(periodo)">
                        <mat-icon>visibility</mat-icon>
                        Ver Liquidaciones
                      </button>
                      <button mat-icon-button color="warn" (click)="eliminarPeriodoLiquidacion(periodo)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </mat-card>
                </div>

                <div *ngIf="periodosLiquidacion().length === 0" class="empty-state">
                  <mat-icon>calendar_today</mat-icon>
                  <h3>No hay períodos configurados</h3>
                  <p>Define los períodos de liquidación (anual, bimestral, mensual, etc.)</p>
                  <button mat-raised-button color="primary" (click)="abrirDialogoPeriodoLiquidacion()">
                    <mat-icon>add</mat-icon>
                    Crear Primer Período
                  </button>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <!-- TAB 8: PERÍODOS DE LIQUIDACIÓN -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon [matBadge]="periodosLiquidacion().length" matBadgeColor="primary">calendar_today</mat-icon>
            Liquidación
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>Liquidación</h2>
                  <p class="tab-subtitle">Gestiona los períodos de liquidación de esta fuente</p>
                </div>
                <button mat-raised-button color="primary" (click)="abrirDialogoPeriodoLiquidacion()">
                  <mat-icon>add</mat-icon>
                  Nuevo Período
                </button>
              </div>

              <mat-card class="data-card">
                <div class="periodos-timeline" *ngIf="periodosLiquidacion().length > 0">
                  <mat-card *ngFor="let periodo of periodosLiquidacion()" class="periodo-card">
                    <div class="periodo-header">
                      <div class="periodo-badge" [class]="'periodo-' + periodo.tipoPeriodo.toLowerCase()">
                        {{ periodo.vigencia }}
                      </div>
                      <div class="periodo-info">
                        <h3>{{ periodo.descripcion }}</h3>
                        <p>{{ periodo.tipoPeriodo }} - Vigencia {{ periodo.vigencia }}</p>
                      </div>
                      <mat-chip [class]="'estado-' + periodo.estado.toLowerCase()">
                        {{ periodo.estado }}
                      </mat-chip>
                    </div>

                    <div class="periodo-dates">
                      <div class="date-item">
                        <mat-icon>event</mat-icon>
                        <div>
                          <strong>Período:</strong>
                          <span>{{ periodo.fechaInicio }} - {{ periodo.fechaFin }}</span>
                        </div>
                      </div>
                      <div class="date-item" *ngIf="periodo.fechaVencimiento">
                        <mat-icon>alarm</mat-icon>
                        <div>
                          <strong>Vencimiento:</strong>
                          <span>{{ periodo.fechaVencimiento }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="periodo-stats" *ngIf="periodo.numeroLiquidacionesGeneradas">
                      <div class="stat">
                        <mat-icon>description</mat-icon>
                        <span>{{ periodo.numeroLiquidacionesGeneradas }} liquidaciones</span>
                      </div>
                      <div class="stat">
                        <mat-icon>payments</mat-icon>
                        <span>{{ periodo.valorTotalLiquidado | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
                      </div>
                      <div class="stat" [class.facturado]="periodo.numeroLiquidacionesGeneradas && periodo.numeroLiquidacionesGeneradas > 0">
                        <mat-icon>{{ (periodo.numeroLiquidacionesGeneradas && periodo.numeroLiquidacionesGeneradas > 0) ? 'check_circle' : 'pending' }}</mat-icon>
                        <span>{{ periodo.numeroLiquidacionesGeneradas || 0 }} Liquidados</span>
                      </div>
                    </div>

                    <div class="periodo-actions">
                      <button mat-button (click)="editarPeriodoLiquidacion(periodo)">
                        <mat-icon>edit</mat-icon>
                        Editar
                      </button>
                      <button mat-button (click)="verLiquidacionesPeriodo(periodo)">
                        <mat-icon>visibility</mat-icon>
                        Ver Liquidaciones
                      </button>
                      <button mat-icon-button color="warn" (click)="eliminarPeriodoLiquidacion(periodo)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </mat-card>
                </div>

                <div *ngIf="periodosLiquidacion().length === 0" class="empty-state">
                  <mat-icon>calendar_today</mat-icon>
                  <h3>No hay períodos configurados</h3>
                  <p>Define los períodos de liquidación (anual, bimestral, mensual, etc.)</p>
                  <button mat-raised-button color="primary" (click)="abrirDialogoPeriodoLiquidacion()">
                    <mat-icon>add</mat-icon>
                    Crear Primer Período
                  </button>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

        <!-- TAB 10: CONFIGURACIÓN DE FACTURACIÓN -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>receipt</mat-icon>
            Facturación
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-content">
              <div class="tab-header">
                <div>
                  <h2>Configuración de Facturación</h2>
                  <p class="tab-subtitle">Plantillas, cuotas, resolución DIAN, formas de pago y configuración de cobro</p>
                </div>
                <button mat-raised-button color="primary" (click)="abrirDialogoTipoFacturacion()">
                  <mat-icon>add</mat-icon>
                  Nueva Configuración
                </button>
              </div>

              <mat-card class="data-card">
                <div class="facturacion-config-section">
                  <mat-icon>receipt</mat-icon>
                  <h3>Configuración Completa de Facturación</h3>
                  
                  <div class="config-sections">
                    <!-- Sección 1: Información Legal -->
                    <mat-card class="config-subsection">
                      <h4><mat-icon>gavel</mat-icon> Información Legal y DIAN</h4>
                      <ul>
                        <li>Resolución DIAN, numeración, prefijos</li>
                        <li>Datos de la entidad: NIT, dirección, contacto</li>
                        <li>Mensajes legales y términos</li>
                      </ul>
                    </mat-card>

                    <!-- Sección 2: División de Cuotas -->
                    <mat-card class="config-subsection">
                      <h4><mat-icon>payment</mat-icon> División en Cuotas (Períodos de Facturación)</h4>
                      <ul>
                        <li>Crear cuotas: Bimestre 1, 2, 3... o Trimestre 1, 2, etc.</li>
                        <li>Fechas específicas: rango y vencimiento de cada cuota</li>
                        <li>Valores: monto o porcentaje de cada cuota</li>
                        <li>Descuentos por pronto pago por cuota</li>
                      </ul>
                      <button mat-stroked-button color="primary" (click)="abrirDialogoPeriodoFacturacion()">
                        <mat-icon>add</mat-icon>
                        Configurar Cuotas
                      </button>
                    </mat-card>

                    <!-- Sección 3: Plantillas y Códigos -->
                    <mat-card class="config-subsection">
                      <h4><mat-icon>qr_code_2</mat-icon> Plantillas, Códigos y Formas de Pago</h4>
                      <ul>
                        <li>Códigos de barras y QR para facilitar el pago</li>
                        <li>Mensajes: encabezado, instrucciones, pie de factura</li>
                        <li>Intereses de mora (ej. 2.13% mensual)</li>
                        <li>Formas de pago: bancos, PSE, oficinas</li>
                      </ul>
                    </mat-card>
                  </div>

                  <p style="margin-top: 24px; color: #666; font-size: 14px;">
                    <mat-icon style="vertical-align: middle;">info</mat-icon>
                    Esta configuración define CÓMO se factura y cobra el tributo, incluyendo cuotas, plantillas y formas de pago
                  </p>
                </div>
              </mat-card>
            </div>
          </ng-template>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    .fuente-detalle-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }

    /* Header Mejorado */
    .fuente-header {
      padding: 20px 24px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;

        .back-button {
          mat-icon {
            color: #666;
          }
        }

        .fuente-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
            color: white;
          }
        }

        .header-info {
          .breadcrumb {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;

            .breadcrumb-item {
              cursor: pointer;
              transition: color 0.2s;

              &:hover {
                color: #43A047;
              }

              &.active {
                color: #333;
                font-weight: 500;
              }
            }

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
            }
          }

          h1 {
            margin: 0 0 4px 0;
            font-size: 24px;
            font-weight: 500;
          }

          .subtitle {
            margin: 0;
            font-size: 14px;
            color: #666;
            display: flex;
            align-items: center;
            gap: 8px;

            .codigo {
              font-family: monospace;
              background: #f5f5f5;
              padding: 2px 8px;
              border-radius: 4px;
            }

            .separator {
              color: #ddd;
            }

            .prescripcion {
              display: flex;
              align-items: center;
              gap: 4px;
              color: #f57c00;

              mat-icon {
                font-size: 16px;
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }

      // Barra de Completitud - Diseño Simplificado
      .completitud-bar {
        background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
        border: 1px solid #C8E6C9;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 24px;

        .completitud-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;

          mat-icon {
            color: #43A047;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }

          .completitud-title {
            font-size: 14px;
            font-weight: 600;
            color: #2E7D32;
          }
        }

        .completitud-progress {
          width: 100%;
          height: 8px;
          background: #C8E6C9;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;

          .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #43A047 0%, #66BB6A 100%);
            transition: width 0.6s ease;
            border-radius: 4px;
          }
        }

        .completitud-items-simple {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .completitud-badge {
          padding: 6px 12px;
          background: white;
          border: 1px solid #C8E6C9;
          border-radius: 16px;
          font-size: 12px;
          color: #666;
          transition: all 0.3s;

          &.completo {
            background: #43A047;
            color: white;
            border-color: #43A047;
            font-weight: 600;
          }

          &.bloqueado {
            opacity: 0.5;
            background: #f5f5f5;
            border-color: #ddd;
          }
        }
      }

      // Header Actions
      .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;

        mat-chip {
          font-size: 11px;
          height: 28px;
          font-weight: 600;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }

          &.estado-activo {
            background: #e8f5e9;
            color: #2e7d32;
          }

          &.estado-inactivo {
            background: #ffebee;
            color: #c62828;
          }
        }
      }
    }

    /* KPI Bar */
    .kpi-bar {
      display: flex;
      background: white;
      border-bottom: 1px solid #e0e0e0;

      .kpi-item {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        border-left: 3px solid;
        transition: all 0.2s;

        &:hover {
          background: #f9f9f9;
        }

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #667eea;
        }

        .kpi-content {
          display: flex;
          flex-direction: column;

          .kpi-value {
            font-size: 20px;
            font-weight: 600;
            color: #333;
          }

          .kpi-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            margin-top: 2px;
          }
        }
      }
    }

    /* Tabs */
    .fuente-tabs {
      flex: 1;
      background: white;

      ::ng-deep {
        .mat-mdc-tab {
          min-width: 140px;

          .mdc-tab__text-label {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        }
      }
    }

    /* Tab Content */
    .tab-content {
      padding: 24px;
      background: #f5f5f5;
      min-height: 500px;

      .tab-header {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        h2 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 500;
        }

        .tab-subtitle {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }
      }

      .data-card {
        .search-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;

          mat-form-field {
            flex: 1;
          }
        }
      }

      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: #999;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        p {
          margin: 0 0 24px 0;
          font-size: 14px;
        }
      }

      .placeholder-text {
        text-align: center;
        padding: 64px;
        color: #999;
        font-style: italic;
      }
    }

    /* Info Section Grid */
    .info-section-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;

      .info-card {
        mat-card-header {
          mat-card-title {
            display: flex;
            align-items: center;
            gap: 8px;
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
            flex-direction: column;
            gap: 4px;

            &.full-width {
              grid-column: 1 / -1;
            }

            label {
              font-size: 12px;
              color: #666;
              font-weight: 500;
            }

            span {
              font-size: 14px;
              color: #333;
            }
          }
        }

        &.audit-card {
          .audit-timeline {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .audit-item {
              display: flex;
              align-items: flex-start;
              gap: 12px;

              mat-icon {
                color: #667eea;
                margin-top: 2px;
              }

              strong {
                font-size: 13px;
              }

              small {
                font-size: 12px;
                color: #666;
              }
            }
          }
        }

        &.config-summary {
          .config-checklist {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .check-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 8px 12px;
              border-radius: 8px;
              background: #f9f9f9;

              mat-icon {
                color: #bbb;
              }

              span {
                font-size: 14px;
                color: #666;
              }

              &.completed {
                mat-icon {
                  color: #4caf50;
                }

                span {
                  color: #333;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }
    }

    /* Objetos Table */
    .objetos-table {
      width: 100%;

      th {
        font-weight: 600;
        color: #666;
        background: #f9f9f9;
      }

      td, th {
        padding: 12px 16px;
      }

      .table-row {
        transition: background 0.2s;

        &:hover {
          background: #f9f9f9;
        }
      }

      .objeto-info {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .principal {
          font-size: 14px;
          color: #333;
        }

        .secundario {
          font-size: 12px;
          color: #666;
        }
      }

      .estado-activo {
        background: #e8f5e9;
        color: #2e7d32;
      }

      .estado-inactivo {
        background: #ffebee;
        color: #c62828;
      }
    }

    /* Conceptos Grid */
    .conceptos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;

      .concepto-card {
        padding: 20px;
        transition: all 0.2s;
        border-left: 4px solid #667eea;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        &.concepto-inactivo {
          opacity: 0.6;
        }

        .concepto-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .concepto-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;

            &.tipo-capital {
              background: #e3f2fd;
              color: #1976d2;
            }

            &.tipo-interes {
              background: #fff3e0;
              color: #f57c00;
            }

            &.tipo-sancion {
              background: #ffebee;
              color: #d32f2f;
            }

            &.tipo-descuento {
              background: #e8f5e9;
              color: #388e3c;
            }

            &.tipo-novedad {
              background: #f3e5f5;
              color: #7b1fa2;
            }

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
            }
          }

          mat-chip {
            font-size: 10px;
            height: 20px;

            &.tipo-capital {
              background: #e3f2fd;
              color: #1976d2;
            }

            &.tipo-interes {
              background: #fff3e0;
              color: #f57c00;
            }

            &.tipo-sancion {
              background: #ffebee;
              color: #d32f2f;
            }

            &.tipo-descuento {
              background: #e8f5e9;
              color: #388e3c;
            }
          }
        }

        h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        .concepto-codigo {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #666;
          font-family: monospace;
        }

        .concepto-descripcion {
          margin: 0 0 16px 0;
          font-size: 13px;
          color: #666;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .concepto-details {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;

          .detail-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            padding: 4px 8px;
            background: #f5f5f5;
            border-radius: 4px;

            mat-icon {
              font-size: 14px;
              width: 14px;
              height: 14px;
              color: #666;
            }
          }
        }

        .concepto-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
      }
    }

    /* Períodos Timeline */
    .periodos-timeline {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .periodo-card {
        padding: 20px;
        transition: all 0.2s;

        &:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .periodo-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;

          .periodo-badge {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
            background: linear-gradient(135deg, #43A047 0%, #2E7D32 100%);
            color: white;
          }

          .periodo-info {
            flex: 1;

            h3 {
              margin: 0 0 4px 0;
              font-size: 16px;
            }

            p {
              margin: 0;
              font-size: 13px;
              color: #666;
            }
          }

          mat-chip {
            &.estado-activo {
              background: #e8f5e9;
              color: #2e7d32;
            }

            &.estado-cerrado {
              background: #f5f5f5;
              color: #666;
            }
          }
        }

        .periodo-dates {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;

          .date-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;

            mat-icon {
              color: #43A047;
              margin-top: 2px;
            }

            div {
              display: flex;
              flex-direction: column;
              gap: 2px;

              strong {
                font-size: 12px;
                color: #666;
              }

              span {
                font-size: 13px;
                color: #333;
              }
            }
          }
        }

        .periodo-stats {
          display: flex;
          gap: 24px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 16px;

          .stat {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #666;
            }

            &.facturado {
              color: #2e7d32;

              mat-icon {
                color: #2e7d32;
              }
            }
          }
        }

        .periodo-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
      }
    }

    /* Formulación y Facturación Placeholders */
    .formulacion-placeholder,
    .facturacion-placeholder,
    .valores-base-placeholder,
    .parametros-placeholder,
    .descuentos-placeholder,
    .exenciones-placeholder,
    .facturacion-config-section {
      text-align: center;
      padding: 64px 24px;
      color: #999;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        color: #333;
      }

      p {
        margin: 0 0 24px 0;
        font-size: 14px;
      }

      ul {
        li {
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;
        }
      }

      .formula-preview {
        max-width: 600px;
        margin: 0 auto;
        text-align: left;
        background: #1e1e1e;
        padding: 24px;
        border-radius: 8px;

        code {
          color: #d4d4d4;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
          display: block;
        }
      }
    }

    /* Configuración de Facturación (nuevo) */
    .facturacion-config-section {
      .config-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
        margin-top: 32px;
        text-align: left;

        .config-subsection {
          padding: 20px;

          h4 {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #333;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              color: #43A047;
            }
          }

          ul {
            margin: 0 0 16px 0;
            padding-left: 24px;

            li {
              margin-bottom: 8px;
              color: #666;
              font-size: 13px;
            }
          }

          button {
            width: 100%;
          }
        }
      }
    }

    /* Beneficios Tributarios - Grid de tarjetas */
    .beneficios-tabs {
      margin-top: 16px;
    }

    .beneficios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }

    .beneficio-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        border-color: #43A047;
        box-shadow: 0 4px 12px rgba(67, 160, 71, 0.15);
        transform: translateY(-2px);
      }

      &.exencion {
        background: linear-gradient(135deg, #FFF8E1 0%, #ffffff 100%);
        
        &:hover {
          border-color: #FFA726;
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.15);
        }

        mat-icon {
          color: #FFA726;
        }
      }

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #43A047;
      }

      strong {
        font-size: 14px;
        color: #212529;
        font-weight: 600;
      }

      span {
        font-size: 12px;
        color: #6c757d;
        line-height: 1.5;
      }
    }

    /* Valores Base - Filtros y Tabla */
    .filters-valores-base {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;

      mat-form-field {
        min-width: 200px;
      }
    }

    .valores-table {
      width: 100%;
      
      .mat-column-avaluo,
      .mat-column-ingresos {
        font-weight: 600;
        color: #2E7D32;
      }
    }

    /* Badges de Valores Base */
    .destinacion-residencial {
      background: #E8F5E9;
      color: #2E7D32;
    }

    .destinacion-comercial {
      background: #FFF3E0;
      color: #E65100;
    }

    .destinacion-industrial {
      background: #F3E5F5;
      color: #7B1FA2;
    }

    .destinacion-rural {
      background: #E0F2F1;
      color: #00695C;
    }

    .estrato-badge {
      background: #EDE7F6;
      color: #5E35B1;
      font-weight: 600;
    }

    .ciiu-badge {
      background: #E0F2F1;
      color: #00695C;
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }

    .tipo-persona-natural {
      background: #E3F2FD;
      color: #1565C0;
    }

    .tipo-persona-juridica {
      background: #F3E5F5;
      color: #6A1B9A;
    }

    .tipo-gran-contribuyente {
      background: #FFF3E0;
      color: #EF6C00;
    }

    .vigencia-badge {
      background: #FFF3E0;
      color: #E65100;
      font-weight: 600;
    }
  `]
})
export class FuenteDetalleV2Component implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private objetosService = inject(ObjetosTributariosService);

  fuente = signal<FuenteDetalle | null>(null);
  objetosTributarios = signal<ObjetoTributario[]>([]);
  conceptos = signal<ConceptoCobro[]>([]);
  periodosLiquidacion = signal<PeriodoLiquidacion[]>([]);
  displayedColumns = ['codigo', 'descripcion', 'estado', 'acciones'];
  selectedTabIndex = 0;

  // Valores Base - Signals integrados
  valoresPredial = signal<any[]>([]);
  valoresICA = signal<any[]>([]);
  vigenciaValoresBase = signal<number>(new Date().getFullYear());
  showFormValoresBase = signal(false);
  editModeValoresBase = signal(false);
  
  // Vigencias para Valores Base
  vigenciasDisponibles = computed(() => {
    const anioActual = new Date().getFullYear();
    return [anioActual - 2, anioActual - 1, anioActual, anioActual + 1];
  });

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.cargarFuente(id);
    this.cargarObjetosTributarios();
    this.cargarConceptos();
    this.cargarPeriodosLiquidacion();
    this.cargarValoresBase();
  }

  // Calcular porcentaje de completitud
  getCompletitudPercentage(): number {
    try {
      let completados = 0;
      const total = 5;

      // 1. Información básica (siempre completa si existe fuente)
      if (this.fuente()) completados++;

      // 2. Objetos tributarios
      if (this.objetosTributarios && this.objetosTributarios().length > 0) completados++;

      // 3. Valores base
      if ((this.valoresPredial && this.valoresPredial().length > 0) || (this.valoresICA && this.valoresICA().length > 0)) completados++;

      // 4. Conceptos/Rubros
      if (this.conceptos && this.conceptos().length > 0) completados++;

      // 5. Períodos de liquidación
      if (this.periodosLiquidacion && this.periodosLiquidacion().length > 0) completados++;

      return Math.round((completados / total) * 100);
    } catch (error) {
      return 0;
    }
  }

  cargarFuente(id: number) {
    // Simular carga
    this.fuente.set({
      id: 1,
      codigo: 'PRED-URB',
      nombre: 'Predial Unificado Urbano',
      descripcion: 'Impuesto predial unificado para predios urbanos del municipio según Acuerdo Municipal 015 de 2020',
      categoria: 'Impuestos Directos',
      estado: 'activo',
      color: '#2E7D32',
      icono: 'home',
      aplicaPrescripcion: true,
      aniosPrescripcion: 5,
      conceptosCount: 8,
      liquidacionesCount: 15234,
      objetosCount: 12567,
      periodosLiquidacionCount: 6,
      periodosFacturacionCount: 6,
      creadoPor: 'admin@sistema.com',
      fechaCreacion: '2024-01-15',
      modificadoPor: 'liquidador@sistema.com',
      fechaModificacion: '2024-02-01'
    });
  }

  cargarObjetosTributarios() {
    this.objetosTributarios.set([
      {
        id: 1,
        fuenteId: 1,
        tipoObjeto: 'Predio',
        codigo: '01-001-0001',
        valores: {
          matricula: '50N-123456',
          direccion: 'Calle 10 # 5-25',
          estrato: '3',
          avaluo: 120000000
        },
        activo: true
      },
      {
        id: 2,
        fuenteId: 1,
        tipoObjeto: 'Predio',
        codigo: '01-002-0045',
        valores: {
          matricula: '50N-789012',
          direccion: 'Carrera 15 # 20-30',
          estrato: '4',
          avaluo: 250000000
        },
        activo: true
      }
    ]);
  }

  cargarConceptos() {
    this.conceptos.set([
      {
        id: 1,
        codigo: 'CAP-01',
        nombre: 'Capital Impuesto Predial',
        descripcion: 'Valor principal del impuesto predial calculado sobre el avalúo catastral',
        fuenteIngresoId: 1,
        tipoConcepto: 'CAPITAL',
        operacion: 'SUMA',
        esObligatorio: true,
        aplicaEnFacturacion: true,
        generaInteres: false,
        permiteCero: false,
        cuentaContableId: '1110-01-001',
        cuentaContableNombre: 'Ingresos Tributarios - Predial',
        orden: 1,
        ordenCalculoFormula: 1,
        estado: 'ACTIVO'
      },
      {
        id: 2,
        codigo: 'INT-01',
        nombre: 'Intereses de Mora',
        descripcion: 'Intereses generados por pago extemporáneo del impuesto',
        fuenteIngresoId: 1,
        tipoConcepto: 'INTERES',
        operacion: 'SUMA',
        esObligatorio: false,
        aplicaEnFacturacion: true,
        generaInteres: false,
        permiteCero: true,
        cuentaContableId: '1110-01-002',
        orden: 2,
        ordenCalculoFormula: 2,
        estado: 'ACTIVO'
      },
      {
        id: 3,
        codigo: 'DESC-01',
        nombre: 'Descuento Pronto Pago',
        descripcion: 'Descuento del 10% por pago anticipado',
        fuenteIngresoId: 1,
        tipoConcepto: 'DESCUENTO',
        operacion: 'RESTA',
        esObligatorio: false,
        aplicaEnFacturacion: true,
        generaInteres: false,
        permiteCero: true,
        orden: 3,
        ordenCalculoFormula: 3,
        estado: 'ACTIVO'
      }
    ]);
  }

  cargarPeriodosLiquidacion() {
    this.periodosLiquidacion.set([
      {
        id: 'PL-1234567890-001',
        fuenteIngresoId: 1,
        vigencia: 2024,
        tipoPeriodo: 'BIMESTRAL',
        descripcion: 'Período Bimestral 2024',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        fechaVencimiento: '2024-12-31',
        numeroLiquidacionesGeneradas: 2156,
        valorTotalLiquidado: 18500000000,
        numeroPeriodosFacturacion: 6,
        estado: 'ACTIVO'
      },
      {
        id: 'PL-1234567890-002',
        fuenteIngresoId: 1,
        vigencia: 2025,
        tipoPeriodo: 'BIMESTRAL',
        descripcion: 'Período Bimestral 2025',
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31',
        fechaVencimiento: '2025-12-31',
        numeroLiquidacionesGeneradas: 0,
        valorTotalLiquidado: 0,
        numeroPeriodosFacturacion: 6,
        estado: 'ACTIVO'
      }
    ]);
  }

  volver() {
    this.router.navigate(['/fuentes']);
  }

  getTipoObjeto(): string {
    const tipos: Record<string, string> = {
      'Predial Unificado Urbano': 'Predio',
      'Predial Unificado Rural': 'Predio',
      'ICA Industrial': 'Establecimiento',
      'ICA Comercial': 'Establecimiento',
      'Sobretasa Ambiental': 'Predio',
      'Alumbrado Público': 'Suscriptor',
      'Valorización': 'Obra',
      'Espacio Público': 'Permiso'
    };
    return tipos[this.fuente()?.nombre || ''] || 'Objeto';
  }

  getNombreTabValoresBase(): string {
    const nombreFuente = this.fuente()?.nombre || '';
    
    // Mapeo de nombres según el tipo de fuente
    if (nombreFuente.includes('Predial')) {
      return 'Avalúos';
    } else if (nombreFuente.includes('ICA')) {
      return 'Base Actividad Económica';
    } else if (nombreFuente.includes('Alumbrado')) {
      return 'Consumo Energía';
    } else if (nombreFuente.includes('Valorización')) {
      return 'Área Beneficiada';
    } else if (nombreFuente.includes('Sobretasa')) {
      return 'Avalúos Ambientales';
    } else if (nombreFuente.includes('Espacio Público')) {
      return 'Área Ocupada';
    } else {
      return 'Valores Base';
    }
  }

  getIconoTipoConcepto(tipo: string): string {
    const iconos: Record<string, string> = {
      'CAPITAL': 'account_balance',
      'INTERES': 'percent',
      'SANCION': 'warning',
      'DESCUENTO': 'discount',
      'NOVEDAD': 'new_releases',
      'OTRO': 'more_horiz'
    };
    return iconos[tipo] || 'receipt';
  }

  // Objetos Tributarios
  abrirDialogoObjeto(objeto?: ObjetoTributario) {
    const dialogRef = this.dialog.open(ObjetoTributarioDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        tipoObjeto: this.getTipoObjeto(),
        fuenteId: this.fuente()!.id,
        objeto: objeto
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarObjetoTributario(result);
      }
    });
  }

  guardarObjetoTributario(objeto: ObjetoTributario) {
    const objetos = this.objetosTributarios();
    if (objeto.id) {
      const index = objetos.findIndex(o => o.id === objeto.id);
      objetos[index] = objeto;
    } else {
      objeto.id = Date.now();
      objetos.push(objeto);
    }
    this.objetosTributarios.set([...objetos]);
  }

  verDetalleObjeto(objeto: ObjetoTributario) {
    console.log('Ver detalle:', objeto);
  }

  eliminarObjetoTributario(objeto: ObjetoTributario) {
    if (confirm(`¿Está seguro de eliminar el objeto ${objeto.codigo}?`)) {
      const objetos = this.objetosTributarios().filter(o => o.id !== objeto.id);
      this.objetosTributarios.set(objetos);
    }
  }

  getValorPrincipal(objeto: ObjetoTributario): string {
    const tipoObjeto = this.getTipoObjeto();
    switch(tipoObjeto) {
      case 'Predio':
        return objeto.valores['direccion'] || objeto.valores['matricula'] || '-';
      case 'Establecimiento':
        return objeto.valores['razonSocial'] || objeto.valores['nombreComercial'] || '-';
      default:
        return '-';
    }
  }

  getValorSecundario(objeto: ObjetoTributario): string {
    const tipoObjeto = this.getTipoObjeto();
    if (tipoObjeto === 'Predio') {
      return `Matrícula: ${objeto.valores['matricula']} | Estrato ${objeto.valores['estrato']}`;
    }
    return '';
  }

  // Conceptos de Cobro
  abrirDialogoConcepto(concepto?: ConceptoCobro) {
    const dialogRef = this.dialog.open(ConceptoDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: {
        concepto: concepto,
        fuenteIngresoId: this.fuente()!.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarConcepto(result);
      }
    });
  }

  guardarConcepto(concepto: ConceptoCobro) {
    const conceptos = this.conceptos();
    if (concepto.id) {
      const index = conceptos.findIndex(c => c.id === concepto.id);
      conceptos[index] = concepto;
    } else {
      concepto.id = Date.now();
      conceptos.push(concepto);
    }
    this.conceptos.set([...conceptos]);
  }

  editarConcepto(concepto: ConceptoCobro) {
    this.abrirDialogoConcepto(concepto);
  }

  eliminarConcepto(concepto: ConceptoCobro) {
    if (confirm(`¿Está seguro de eliminar el concepto ${concepto.nombre}?`)) {
      const conceptos = this.conceptos().filter(c => c.id !== concepto.id);
      this.conceptos.set(conceptos);
    }
  }

  // Períodos de Liquidación
  abrirDialogoPeriodoLiquidacion(periodo?: PeriodoLiquidacion) {
    const dialogRef = this.dialog.open(PeriodoLiquidacionDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: {
        periodo: periodo,
        fuenteIngresoId: this.fuente()!.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarPeriodoLiquidacion(result);
      }
    });
  }

  guardarPeriodoLiquidacion(periodo: PeriodoLiquidacion) {
    const periodos = this.periodosLiquidacion();
    if (periodo.id) {
      const index = periodos.findIndex(p => p.id === periodo.id);
      periodos[index] = periodo;
    } else {
      periodo.id = Date.now();
      periodos.push(periodo);
    }
    this.periodosLiquidacion.set([...periodos]);
  }

  editarPeriodoLiquidacion(periodo: PeriodoLiquidacion) {
    this.abrirDialogoPeriodoLiquidacion(periodo);
  }

  eliminarPeriodoLiquidacion(periodo: PeriodoLiquidacion) {
    if (confirm(`¿Está seguro de eliminar el período ${periodo.descripcion}?`)) {
      const periodos = this.periodosLiquidacion().filter(p => p.id !== periodo.id);
      this.periodosLiquidacion.set(periodos);
    }
  }

  verLiquidacionesPeriodo(periodo: PeriodoLiquidacion) {
    console.log('Ver liquidaciones del período:', periodo);
  }

  // Tipos de Facturación (Configuración general de facturación)
  abrirDialogoTipoFacturacion(tipoFacturacion?: TipoFacturacion) {
    const dialogRef = this.dialog.open(TipoFacturacionDialogComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: {
        tipoFacturacion: tipoFacturacion,
        fuenteIngresoId: this.fuente()!.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Tipo de facturación guardado:', result);
        // Aquí puedes agregar la lógica para guardar el tipo de facturación
        // Este configura: mensajes, plantillas, códigos de barra, formas de pago, etc.
      }
    });
  }

  // Períodos de Facturación (Cuotas individuales de pago)
  abrirDialogoPeriodoFacturacion(periodoFacturacion?: PeriodoFacturacion) {
    // Obtener el primer período de liquidación disponible para asociar
    const periodoLiquidacion = this.periodosLiquidacion()[0];
    
    if (!periodoLiquidacion) {
      alert('Primero debe crear un Período de Liquidación en la pestaña "Períodos de Liquidación"');
      return;
    }

    const dialogRef = this.dialog.open(PeriodoFacturacionDialogComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: {
        periodoFacturacion: periodoFacturacion,
        periodoLiquidacion: periodoLiquidacion,
        fuenteIngresoId: this.fuente()!.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Período de facturación guardado:', result);
        // Aquí puedes agregar la lógica para guardar el período de facturación
        // Esto crea las cuotas: bimestre 1, 2, 3... con fechas y valores específicos
      }
    });
  }

  // ===== VALORES BASE =====
  cargarValoresBase() {
    // Simular carga de valores base según tipo de fuente
    if (this.esPredi()) {
      this.valoresPredial.set([
        {
          id: 1,
          objetoTributarioId: 1,
          vigencia: 2024,
          avaluoCatastral: 150000000,
          destinacionEconomica: 'RESIDENCIAL',
          estrato: 4,
          areaTerreno: 200,
          areaConstruida: 150,
          usoSuelo: 'Vivienda unifamiliar',
          fechaActualizacion: '2024-01-15'
        },
        {
          id: 2,
          objetoTributarioId: 2,
          vigencia: 2024,
          avaluoCatastral: 85000000,
          destinacionEconomica: 'RESIDENCIAL',
          estrato: 3,
          areaTerreno: 120,
          areaConstruida: 90,
          usoSuelo: 'Apartamento',
          fechaActualizacion: '2024-01-20'
        }
      ]);
    } else if (this.esICA()) {
      this.valoresICA.set([
        {
          id: 1,
          objetoTributarioId: 1,
          vigencia: 2024,
          actividadEconomica: '4711',
          descripcionActividad: 'Comercio al por menor en establecimientos no especializados',
          ingresosGravados: 500000000,
          tipoContribuyente: 'PERSONA_JURIDICA',
          municipioOperacion: 'Bogotá D.C.',
          fechaActualizacion: '2024-01-15'
        }
      ]);
    }
  }

  esPredi(): boolean {
    return this.fuente()?.nombre.includes('Predial') || false;
  }

  esICA(): boolean {
    return this.fuente()?.nombre.includes('ICA') || false;
  }

  getObjetoNombre(objetoId: number): string {
    const objeto = this.objetosTributarios().find(o => o.id === objetoId);
    return objeto ? objeto.codigo : `OBJ-${objetoId}`;
  }

  abrirFormValoresBase() {
    this.showFormValoresBase.set(true);
    this.editModeValoresBase.set(false);
  }

  editarValorBase(valor: any) {
    console.log('Editar valor base:', valor);
    // TODO: Abrir formulario en modo edición
  }

  eliminarValorBase(valor: any) {
    if (confirm('¿Está seguro de eliminar este valor base?')) {
      if (this.esPredi()) {
        const valores = this.valoresPredial().filter(v => v.id !== valor.id);
        this.valoresPredial.set(valores);
      } else if (this.esICA()) {
        const valores = this.valoresICA().filter(v => v.id !== valor.id);
        this.valoresICA.set(valores);
      }
    }
  }
}


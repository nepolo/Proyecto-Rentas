import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FuenteIngreso, ConceptoCobro } from '../../core/models';

interface TarifaRango {
  id?: number;
  fuenteIngresoId: number;
  vigencia: number;
  rangoMinimo: number;
  rangoMaximo: number;
  tarifa: number;
  destinacion?: string;
  activo: boolean;
}

interface FactorAjuste {
  id?: number;
  fuenteIngresoId: number;
  vigencia: number;
  nombre: string;
  tipo: 'MULTIPLICADOR' | 'PORCENTAJE' | 'FIJO';
  valor: number;
  descripcion?: string;
  activo: boolean;
}

@Component({
  selector: 'app-parametrizacion-fuente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatExpansionModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <div class="header-title">
              <span class="material-icons">tune</span>
              <h2>Parámetros Tributarios por Fuente</h2>
            </div>
            <p class="subtitle">Tarifas, rangos y factores de ajuste aplicables en el cálculo tributario</p>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="info-message">
            <mat-icon>info</mat-icon>
            Este módulo gestiona los parámetros tributarios (tarifas por rango, factores de ajuste) 
            que se aplican sobre los <strong>Valores Base</strong> del objeto tributario para calcular la liquidación.
          </p>
          <p class="dev-note">Módulo en desarrollo. Por ahora, use:</p>
          <ul class="modules-list">
            <li><mat-icon>assessment</mat-icon> Valores Base - Datos propios del objeto</li>
            <li><mat-icon>discount</mat-icon> Descuentos - Reducciones tributarias</li>
            <li><mat-icon>star</mat-icon> Exenciones - Exoneraciones tributarias</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .material-icons {
        font-size: 32px;
        color: #1976d2;
      }
      
      h2 {
        margin: 0;
        font-size: 24px;
      }
    }
    
    .subtitle {
      margin: 8px 0 0 44px;
      color: #666;
      font-size: 14px;
    }
    
    .info-message {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background-color: #e3f2fd;
      border-left: 4px solid #1976d2;
      margin: 20px 0;
      line-height: 1.6;
      
      mat-icon {
        color: #1976d2;
      }
    }
    
    .dev-note {
      margin: 20px 0 8px;
      font-weight: 500;
      color: #424242;
    }
    
    .modules-list {
      list-style: none;
      padding: 0;
      
      li {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        margin: 8px 0;
        background-color: #f5f5f5;
        border-radius: 8px;
        
        mat-icon {
          color: #1976d2;
        }
      }
    }
  `]
})
export class ParametrizacionFuenteComponent implements OnInit {
  // Señales reactivas
  fuentes = signal<FuenteIngreso[]>([]);
  fuenteSeleccionada = signal<FuenteIngreso | null>(null);
  vigenciaSeleccionada = signal<number>(new Date().getFullYear());
  
  // Datos de parametrización
  conceptos = signal<ConceptoCobro[]>([]);
  tarifasRangos = signal<TarifaRango[]>([]);
  factoresAjuste = signal<FactorAjuste[]>([]);
  
  // UI State
  tabSeleccionado = signal<number>(0);
  cargando = signal<boolean>(false);
  
  // Vigencias disponibles
  vigencias: number[] = [];
  
  // Columnas de tablas
  columnasConceptos = ['codigo', 'nombre', 'tipo', 'operacion', 'orden', 'activo', 'acciones'];
  columnasTarifas = ['rango', 'tarifa', 'destinacion', 'vigencia', 'activo', 'acciones'];
  columnasFactores = ['nombre', 'tipo', 'valor', 'vigencia', 'activo', 'acciones'];
  
  // Tipos de conceptos
  tiposConcepto = ['CAPITAL', 'INTERES', 'SANCION', 'DESCUENTO', 'NOVEDAD', 'OTRO'];
  tiposOperacion = ['SUMA', 'RESTA'];
  tiposFactor = ['MULTIPLICADOR', 'PORCENTAJE', 'FIJO'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarVigencias();
    this.cargarFuentes();
  }

  cargarVigencias(): void {
    const añoActual = new Date().getFullYear();
    this.vigencias = [];
    for (let i = 0; i <= 5; i++) {
      this.vigencias.push(añoActual - i);
    }
  }

  cargarFuentes(): void {
    // Simular carga desde backend
    const fuentesData: FuenteIngreso[] = [
      {
        id: 1,
        codigo: 'IPU',
        nombre: 'Impuesto Predial Unificado',
        descripcion: 'Gravamen sobre la propiedad o posesión de predios',
        categoria: 'IMPUESTO',
        periodicidad: 'ANUAL',
        baseLegal: 'Ley 44 de 1990',
        estado: 'ACTIVO',
        aplicaPrescripcion: true,
        aniosPrescripcion: 5,
        icono: 'home',
        color: '#4CAF50'
      },
      {
        id: 2,
        codigo: 'ICA',
        nombre: 'Impuesto de Industria y Comercio',
        descripcion: 'Gravamen sobre actividades industriales, comerciales y de servicios',
        categoria: 'IMPUESTO',
        periodicidad: 'BIMESTRAL',
        baseLegal: 'Ley 14 de 1983',
        estado: 'ACTIVO',
        aplicaPrescripcion: true,
        aniosPrescripcion: 5,
        icono: 'business',
        color: '#2196F3'
      },
      {
        id: 3,
        codigo: 'SOB',
        nombre: 'Sobretasa Bomberil',
        descripcion: 'Contribución para bomberos',
        categoria: 'SOBRETASA',
        periodicidad: 'ANUAL',
        estado: 'ACTIVO',
        aplicaPrescripcion: false,
        icono: 'local_fire_department',
        color: '#F44336'
      },
      {
        id: 4,
        codigo: 'AYT',
        nombre: 'Avisos y Tableros',
        descripcion: 'Impuesto complementario al ICA',
        categoria: 'COMPLEMENTARIO',
        periodicidad: 'ANUAL',
        estado: 'ACTIVO',
        aplicaPrescripcion: true,
        aniosPrescripcion: 5,
        icono: 'campaign',
        color: '#FF9800'
      }
    ];
    
    this.fuentes.set(fuentesData);
  }

  seleccionarFuente(fuente: FuenteIngreso): void {
    this.fuenteSeleccionada.set(fuente);
    this.cargarParametrizacion();
  }

  cambiarVigencia(): void {
    if (this.fuenteSeleccionada()) {
      this.cargarParametrizacion();
    }
  }

  cargarParametrizacion(): void {
    const fuente = this.fuenteSeleccionada();
    const vigencia = this.vigenciaSeleccionada();
    
    if (!fuente) return;
    
    this.cargando.set(true);
    
    // Simular carga desde backend
    setTimeout(() => {
      this.cargarConceptos(fuente.id!, vigencia);
      this.cargarTarifasRangos(fuente.id!, vigencia);
      this.cargarFactoresAjuste(fuente.id!, vigencia);
      // cargarDescuentosExenciones eliminado - ahora son módulos independientes
      this.cargando.set(false);
    }, 500);
  }

  cargarConceptos(fuenteId: number, vigencia: number): void {
    // Conceptos predefinidos según el tipo de fuente
    let conceptosData: ConceptoCobro[] = [];
    
    if (fuenteId === 1) { // IPU
      conceptosData = [
        {
          id: 1,
          codigo: 'IPU-BASE',
          nombre: 'Impuesto Predial Base',
          fuenteIngresoId: fuenteId,
          tipoConcepto: 'CAPITAL',
          operacion: 'SUMA',
          esObligatorio: true,
          permiteCero: false,
          aplicaEnFacturacion: true,
          ordenCalculoFormula: 1,
          estado: 'ACTIVO'
        },
        {
          id: 2,
          codigo: 'IPU-INT',
          nombre: 'Intereses de Mora',
          fuenteIngresoId: fuenteId,
          tipoConcepto: 'INTERES',
          operacion: 'SUMA',
          esObligatorio: false,
          permiteCero: true,
          aplicaEnFacturacion: true,
          ordenCalculoFormula: 2,
          estado: 'ACTIVO'
        }
      ];
    } else if (fuenteId === 2) { // ICA
      conceptosData = [
        {
          id: 3,
          codigo: 'ICA-BASE',
          nombre: 'ICA Base Gravable',
          fuenteIngresoId: fuenteId,
          tipoConcepto: 'CAPITAL',
          operacion: 'SUMA',
          esObligatorio: true,
          permiteCero: false,
          aplicaEnFacturacion: true,
          ordenCalculoFormula: 1,
          estado: 'ACTIVO'
        },
        {
          id: 4,
          codigo: 'AYT',
          nombre: 'Avisos y Tableros',
          fuenteIngresoId: fuenteId,
          tipoConcepto: 'OTRO',
          operacion: 'SUMA',
          esObligatorio: true,
          permiteCero: false,
          aplicaEnFacturacion: true,
          ordenCalculoFormula: 2,
          estado: 'ACTIVO'
        }
      ];
    }
    
    this.conceptos.set(conceptosData);
  }

  cargarTarifasRangos(fuenteId: number, vigencia: number): void {
    let tarifasData: TarifaRango[] = [];
    
    if (fuenteId === 1) { // IPU - Tarifas por rango de avalúo
      tarifasData = [
        {
          id: 1,
          fuenteIngresoId: fuenteId,
          vigencia: vigencia,
          rangoMinimo: 0,
          rangoMaximo: 50000000,
          tarifa: 0.004,
          destinacion: 'RESIDENCIAL',
          activo: true
        },
        {
          id: 2,
          fuenteIngresoId: fuenteId,
          vigencia: vigencia,
          rangoMinimo: 50000001,
          rangoMaximo: 100000000,
          tarifa: 0.006,
          destinacion: 'RESIDENCIAL',
          activo: true
        },
        {
          id: 3,
          fuenteIngresoId: fuenteId,
          vigencia: vigencia,
          rangoMinimo: 100000001,
          rangoMaximo: 999999999999,
          tarifa: 0.008,
          destinacion: 'RESIDENCIAL',
          activo: true
        },
        {
          id: 4,
          fuenteIngresoId: fuenteId,
          vigencia: vigencia,
          rangoMinimo: 0,
          rangoMaximo: 999999999999,
          tarifa: 0.01,
          destinacion: 'COMERCIAL',
          activo: true
        }
      ];
    } else if (fuenteId === 2) { // ICA - Tarifas por actividad
      tarifasData = [
        {
          id: 5,
          fuenteIngresoId: fuenteId,
          vigencia: vigencia,
          rangoMinimo: 0,
          rangoMaximo: 999999999999,
          tarifa: 0.011,
          destinacion: 'INDUSTRIAL',
          activo: true
        },
        {
          id: 6,
          fuenteIngresoId: fuenteId,
          vigencia: vigencia,
          rangoMinimo: 0,
          rangoMaximo: 999999999999,
          tarifa: 0.007,
          destinacion: 'COMERCIAL',
          activo: true
        },
        {
          id: 7,
          fuenteIngresoId: fuenteId,
          vigencia: vigencia,
          rangoMinimo: 0,
          rangoMaximo: 999999999999,
          tarifa: 0.005,
          destinacion: 'SERVICIOS',
          activo: true
        }
      ];
    }
    
    this.tarifasRangos.set(tarifasData);
  }

  cargarFactoresAjuste(fuenteId: number, vigencia: number): void {
    const factoresData: FactorAjuste[] = [
      {
        id: 1,
        fuenteIngresoId: fuenteId,
        vigencia: vigencia,
        nombre: 'Actualización Catastral',
        tipo: 'PORCENTAJE',
        valor: 3.5,
        descripcion: 'Incremento anual del avalúo catastral según IPC',
        activo: true
      },
      {
        id: 2,
        fuenteIngresoId: fuenteId,
        vigencia: vigencia,
        nombre: 'Límite Máximo Incremento',
        tipo: 'PORCENTAJE',
        valor: 25,
        descripcion: 'Límite constitucional de incremento anual',
        activo: true
      }
    ];
    
    this.factoresAjuste.set(factoresData);
  }

  // Métodos de gestión de conceptos
  nuevoConcepto(): void {
    console.log('Crear nuevo concepto');
    // Aquí abriría un diálogo para crear concepto
  }

  editarConcepto(concepto: ConceptoCobro): void {
    console.log('Editar concepto:', concepto);
  }

  eliminarConcepto(concepto: ConceptoCobro): void {
    console.log('Eliminar concepto:', concepto);
  }

  // Métodos de gestión de tarifas
  nuevaTarifa(): void {
    console.log('Crear nueva tarifa');
  }

  editarTarifa(tarifa: TarifaRango): void {
    console.log('Editar tarifa:', tarifa);
  }

  eliminarTarifa(tarifa: TarifaRango): void {
    console.log('Eliminar tarifa:', tarifa);
  }

  // Métodos de gestión de factores
  nuevoFactor(): void {
    console.log('Crear nuevo factor');
  }

  editarFactor(factor: FactorAjuste): void {
    console.log('Editar factor:', factor);
  }

  eliminarFactor(factor: FactorAjuste): void {
    console.log('Eliminar factor:', factor);
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  formatearPorcentaje(valor: number): string {
    return (valor * 100).toFixed(2) + '%';
  }
}

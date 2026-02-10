import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuenteIngreso } from '../../core/models';

interface Exencion {
  id?: number;
  fuenteIngresoId: number;
  vigencia: number;
  codigo: string;
  nombre: string;
  tipo: 'TOTAL' | 'PARCIAL' | 'CONDICIONAL';
  porcentaje?: number;
  valorMaximo?: number;
  condiciones?: string;
  baseLegal?: string;
  requiereAprobacion: boolean;
  beneficiario?: string;
  activo: boolean;
}

@Component({
  selector: 'app-exenciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './exenciones.component.html',
  styleUrls: ['./exenciones.component.scss']
})
export class ExencionesComponent implements OnInit {
  // Signals
  exenciones = signal<Exencion[]>([]);
  fuentesFiltradas = signal<FuenteIngreso[]>([]);
  loading = signal(false);
  
  // Filtros
  fuenteSeleccionada = signal<number | null>(null);
  vigenciaSeleccionada = signal<number>(new Date().getFullYear());
  
  // Computed
  excencionesFiltradas = computed(() => {
    let result = this.exenciones();
    
    const fuente = this.fuenteSeleccionada();
    if (fuente !== null) {
      result = result.filter(e => e.fuenteIngresoId === fuente);
    }
    
    const vigencia = this.vigenciaSeleccionada();
    result = result.filter(e => e.vigencia === vigencia);
    
    return result;
  });
  
  // Vigencias disponibles (últimos 6 años)
  vigenciasDisponibles = signal<number[]>([]);
  
  // Columnas de la tabla
  displayedColumns = ['codigo', 'nombre', 'tipo', 'porcentaje', 'beneficiario', 'vigencia', 'estado', 'acciones'];
  
  // Fuentes de ingreso mock
  fuentesIngreso = signal<FuenteIngreso[]>([
    {
      id: 1,
      codigo: 'IPU',
      nombre: 'Impuesto Predial Unificado',
      descripcion: 'Impuesto sobre la propiedad inmueble',
      categoria: 'DIRECTOS',
      periodicidad: 'ANUAL',
      baseLegal: 'Ley 44 de 1990',
      activo: true,
      estado: 'ACTIVO',
      aplicaPrescripcion: true,
      aniosPrescripcion: 5
    },
    {
      id: 2,
      codigo: 'ICA',
      nombre: 'Impuesto de Industria y Comercio',
      descripcion: 'Impuesto sobre actividades industriales, comerciales y de servicios',
      categoria: 'DIRECTOS',
      periodicidad: 'BIMESTRAL',
      baseLegal: 'Ley 14 de 1983',
      activo: true,
      estado: 'ACTIVO',
      aplicaPrescripcion: true,
      aniosPrescripcion: 5
    },
    {
      id: 3,
      codigo: 'SOBRETASA_BOMBERIL',
      nombre: 'Sobretasa Bomberil',
      descripcion: 'Sobretasa destinada al cuerpo de bomberos',
      categoria: 'INDIRECTOS',
      periodicidad: 'ANUAL',
      baseLegal: 'Ley 1575 de 2012',
      activo: true,
      estado: 'ACTIVO',
      aplicaPrescripcion: true,
      aniosPrescripcion: 3
    },
    {
      id: 4,
      codigo: 'PUBLICIDAD_EXTERIOR',
      nombre: 'Publicidad Exterior Visual',
      descripcion: 'Impuesto sobre vallas y publicidad exterior',
      categoria: 'INDIRECTOS',
      periodicidad: 'ANUAL',
      baseLegal: 'Ley 140 de 1994',
      activo: true,
      estado: 'ACTIVO',
      aplicaPrescripcion: true,
      aniosPrescripcion: 3
    }
  ]);
  
  // Formulario
  showForm = signal(false);
  editMode = signal(false);
  currentExencion = signal<Exencion>({
    fuenteIngresoId: 0,
    vigencia: new Date().getFullYear(),
    codigo: '',
    nombre: '',
    tipo: 'TOTAL',
    requiereAprobacion: false,
    activo: true
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.generarVigenciasDisponibles();
    this.cargarExenciones();
  }

  generarVigenciasDisponibles(): void {
    const anioActual = new Date().getFullYear();
    const vigencias = [];
    for (let i = 0; i < 6; i++) {
      vigencias.push(anioActual - i);
    }
    this.vigenciasDisponibles.set(vigencias);
  }

  cargarExenciones(): void {
    this.loading.set(true);
    
    // Datos mock de ejemplo
    setTimeout(() => {
      const excencionesMock: Exencion[] = [
        {
          id: 1,
          fuenteIngresoId: 1,
          vigencia: 2026,
          codigo: 'EXE-001',
          nombre: 'Exención Instituciones Educativas',
          tipo: 'TOTAL',
          porcentaje: 100,
          condiciones: 'Instituciones educativas sin ánimo de lucro',
          baseLegal: 'Artículo 15 Acuerdo Municipal 001-2020',
          requiereAprobacion: true,
          beneficiario: 'Colegios y universidades públicas',
          activo: true
        },
        {
          id: 2,
          fuenteIngresoId: 1,
          vigencia: 2026,
          codigo: 'EXE-002',
          nombre: 'Exención Centros de Salud',
          tipo: 'TOTAL',
          porcentaje: 100,
          condiciones: 'Centros de salud y hospitales públicos',
          baseLegal: 'Artículo 20 Acuerdo Municipal 001-2020',
          requiereAprobacion: true,
          beneficiario: 'Instituciones de salud pública',
          activo: true
        },
        {
          id: 3,
          fuenteIngresoId: 1,
          vigencia: 2026,
          codigo: 'EXE-003',
          nombre: 'Exención Parcial Vivienda de Interés Social',
          tipo: 'PARCIAL',
          porcentaje: 50,
          valorMaximo: 5000000,
          condiciones: 'Vivienda VIS hasta 70 SMLMV',
          baseLegal: 'Ley 1537 de 2012',
          requiereAprobacion: false,
          beneficiario: 'Propietarios de VIS',
          activo: true
        },
        {
          id: 4,
          fuenteIngresoId: 2,
          vigencia: 2026,
          codigo: 'EXE-004',
          nombre: 'Exención Cooperativas',
          tipo: 'CONDICIONAL',
          porcentaje: 80,
          condiciones: 'Cooperativas sin ánimo de lucro con régimen tributario especial',
          baseLegal: 'Ley 79 de 1988',
          requiereAprobacion: true,
          beneficiario: 'Cooperativas registradas',
          activo: true
        },
        {
          id: 5,
          fuenteIngresoId: 1,
          vigencia: 2026,
          codigo: 'EXE-005',
          nombre: 'Exención Templos Religiosos',
          tipo: 'TOTAL',
          porcentaje: 100,
          condiciones: 'Templos y lugares de culto debidamente registrados',
          baseLegal: 'Concordato de 1973',
          requiereAprobacion: true,
          beneficiario: 'Instituciones religiosas',
          activo: true
        }
      ];
      
      this.exenciones.set(excencionesMock);
      this.loading.set(false);
    }, 500);
  }

  openForm(): void {
    this.currentExencion.set({
      fuenteIngresoId: this.fuenteSeleccionada() || 0,
      vigencia: this.vigenciaSeleccionada(),
      codigo: '',
      nombre: '',
      tipo: 'TOTAL',
      requiereAprobacion: false,
      activo: true
    });
    this.editMode.set(false);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  saveExencion(): void {
    const exencion = this.currentExencion();
    
    if (this.editMode()) {
      // Update
      const index = this.exenciones().findIndex(e => e.id === exencion.id);
      if (index !== -1) {
        const updated = [...this.exenciones()];
        updated[index] = { ...exencion };
        this.exenciones.set(updated);
      }
    } else {
      // Create
      const newExencion = {
        ...exencion,
        id: Math.max(0, ...this.exenciones().map(e => e.id || 0)) + 1
      };
      this.exenciones.set([...this.exenciones(), newExencion]);
    }
    
    this.closeForm();
  }

  editExencion(exencion: Exencion): void {
    this.currentExencion.set({ ...exencion });
    this.editMode.set(true);
    this.showForm.set(true);
  }

  deleteExencion(id: number): void {
    if (confirm('¿Está seguro de eliminar esta exención?')) {
      this.exenciones.set(this.exenciones().filter(e => e.id !== id));
    }
  }

  copiarAVigencia(): void {
    const vigenciaDestino = this.vigenciaSeleccionada() + 1;
    
    if (confirm(`¿Copiar exenciones de ${this.vigenciaSeleccionada()} a ${vigenciaDestino}?`)) {
      const excencionesCopia = this.excencionesFiltradas().map(e => ({
        ...e,
        id: undefined,
        vigencia: vigenciaDestino
      }));
      
      this.exenciones.set([...this.exenciones(), ...excencionesCopia]);
    }
  }

  formatearPorcentaje(exencion: Exencion): string {
    return exencion.porcentaje ? `${exencion.porcentaje}%` : 'N/A';
  }

  getNombreFuente(fuenteId: number): string {
    const fuente = this.fuentesIngreso().find(f => f.id === fuenteId);
    return fuente ? fuente.nombre : 'N/A';
  }
}

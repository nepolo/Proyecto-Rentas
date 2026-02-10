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

interface Descuento {
  id?: number;
  fuenteIngresoId: number;
  vigencia: number;
  codigo: string;
  nombre: string;
  tipo: 'PORCENTAJE' | 'VALOR_FIJO';
  valor: number;
  condiciones?: string;
  baseLegal?: string;
  fechaInicio?: string;
  fechaFin?: string;
  beneficiario?: string;
  activo: boolean;
}

@Component({
  selector: 'app-descuentos',
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
  templateUrl: './descuentos.component.html',
  styleUrls: ['./descuentos.component.scss']
})
export class DescuentosComponent implements OnInit {
  // Signals
  descuentos = signal<Descuento[]>([]);
  fuentesFiltradas = signal<FuenteIngreso[]>([]);
  loading = signal(false);
  
  // Filtros
  fuenteSeleccionada = signal<number | null>(null);
  vigenciaSeleccionada = signal<number>(new Date().getFullYear());
  
  // Computed
  descuentosFiltrados = computed(() => {
    let result = this.descuentos();
    
    const fuente = this.fuenteSeleccionada();
    if (fuente !== null) {
      result = result.filter(d => d.fuenteIngresoId === fuente);
    }
    
    const vigencia = this.vigenciaSeleccionada();
    result = result.filter(d => d.vigencia === vigencia);
    
    return result;
  });
  
  // Vigencias disponibles (últimos 6 años)
  vigenciasDisponibles = signal<number[]>([]);
  
  // Columnas de la tabla
  displayedColumns = ['codigo', 'nombre', 'tipo', 'valor', 'beneficiario', 'vigencia', 'estado', 'acciones'];
  
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
  currentDescuento = signal<Descuento>({
    fuenteIngresoId: 0,
    vigencia: new Date().getFullYear(),
    codigo: '',
    nombre: '',
    tipo: 'PORCENTAJE',
    valor: 0,
    activo: true
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.generarVigenciasDisponibles();
    this.cargarDescuentos();
  }

  generarVigenciasDisponibles(): void {
    const anioActual = new Date().getFullYear();
    const vigencias = [];
    for (let i = 0; i < 6; i++) {
      vigencias.push(anioActual - i);
    }
    this.vigenciasDisponibles.set(vigencias);
  }

  cargarDescuentos(): void {
    this.loading.set(true);
    
    // Datos mock de ejemplo
    setTimeout(() => {
      const descuentosMock: Descuento[] = [
        {
          id: 1,
          fuenteIngresoId: 1,
          vigencia: 2026,
          codigo: 'DESC-001',
          nombre: 'Descuento por Pronto Pago',
          tipo: 'PORCENTAJE',
          valor: 10,
          condiciones: 'Pago dentro de los primeros 30 días',
          baseLegal: 'Acuerdo Municipal 001-2025',
          beneficiario: 'Contribuyentes puntuales',
          activo: true
        },
        {
          id: 2,
          fuenteIngresoId: 1,
          vigencia: 2026,
          codigo: 'DESC-002',
          nombre: 'Descuento Tercera Edad',
          tipo: 'PORCENTAJE',
          valor: 20,
          condiciones: 'Mayores de 65 años propietarios de un único inmueble',
          baseLegal: 'Acuerdo Municipal 015-2024',
          beneficiario: 'Adultos mayores',
          activo: true
        },
        {
          id: 3,
          fuenteIngresoId: 2,
          vigencia: 2026,
          codigo: 'DESC-003',
          nombre: 'Descuento Nuevas Empresas',
          tipo: 'PORCENTAJE',
          valor: 50,
          condiciones: 'Primeros 2 años de operación',
          baseLegal: 'Acuerdo Municipal 020-2025',
          fechaInicio: '2026-01-01',
          fechaFin: '2027-12-31',
          beneficiario: 'Emprendedores',
          activo: true
        },
        {
          id: 4,
          fuenteIngresoId: 3,
          vigencia: 2026,
          codigo: 'DESC-004',
          nombre: 'Descuento Estrato 1 y 2',
          tipo: 'VALOR_FIJO',
          valor: 50000,
          condiciones: 'Propiedades de estrato 1 y 2',
          baseLegal: 'Acuerdo Municipal 008-2025',
          beneficiario: 'Estratos bajos',
          activo: true
        }
      ];
      
      this.descuentos.set(descuentosMock);
      this.loading.set(false);
    }, 500);
  }

  openForm(): void {
    this.currentDescuento.set({
      fuenteIngresoId: this.fuenteSeleccionada() || 0,
      vigencia: this.vigenciaSeleccionada(),
      codigo: '',
      nombre: '',
      tipo: 'PORCENTAJE',
      valor: 0,
      activo: true
    });
    this.editMode.set(false);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  saveDescuento(): void {
    const descuento = this.currentDescuento();
    
    if (this.editMode()) {
      // Update
      const index = this.descuentos().findIndex(d => d.id === descuento.id);
      if (index !== -1) {
        const updated = [...this.descuentos()];
        updated[index] = { ...descuento };
        this.descuentos.set(updated);
      }
    } else {
      // Create
      const newDescuento = {
        ...descuento,
        id: Math.max(0, ...this.descuentos().map(d => d.id || 0)) + 1
      };
      this.descuentos.set([...this.descuentos(), newDescuento]);
    }
    
    this.closeForm();
  }

  editDescuento(descuento: Descuento): void {
    this.currentDescuento.set({ ...descuento });
    this.editMode.set(true);
    this.showForm.set(true);
  }

  deleteDescuento(id: number): void {
    if (confirm('¿Está seguro de eliminar este descuento?')) {
      this.descuentos.set(this.descuentos().filter(d => d.id !== id));
    }
  }

  copiarAVigencia(): void {
    const vigenciaDestino = this.vigenciaSeleccionada() + 1;
    
    if (confirm(`¿Copiar descuentos de ${this.vigenciaSeleccionada()} a ${vigenciaDestino}?`)) {
      const descuentosCopia = this.descuentosFiltrados().map(d => ({
        ...d,
        id: undefined,
        vigencia: vigenciaDestino
      }));
      
      this.descuentos.set([...this.descuentos(), ...descuentosCopia]);
    }
  }

  formatearValor(descuento: Descuento): string {
    if (descuento.tipo === 'PORCENTAJE') {
      return `${descuento.valor}%`;
    } else {
      return `$${descuento.valor.toLocaleString('es-CO')}`;
    }
  }

  getNombreFuente(fuenteId: number): string {
    const fuente = this.fuentesIngreso().find(f => f.id === fuenteId);
    return fuente ? fuente.nombre : 'N/A';
  }
}

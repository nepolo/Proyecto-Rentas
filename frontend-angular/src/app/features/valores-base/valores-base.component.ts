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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// Valores Base para Predial
interface ValorBasePredial {
  id?: number;
  objetoTributarioId: number;
  vigencia: number;
  avaluoCatastral: number;
  destinacionEconomica: 'RESIDENCIAL' | 'COMERCIAL' | 'INDUSTRIAL' | 'RURAL';
  estrato: number;
  areaTerreno: number;
  areaConstruida: number;
  usoSuelo: string;
  fechaActualizacion?: string;
}

// Valores Base para ICA
interface ValorBaseICA {
  id?: number;
  objetoTributarioId: number;
  vigencia: number;
  actividadEconomica: string; // Código CIIU
  descripcionActividad: string;
  ingresosGravados: number;
  tipoContribuyente: 'PERSONA_NATURAL' | 'PERSONA_JURIDICA' | 'GRAN_CONTRIBUYENTE';
  municipioOperacion: string;
  fechaActualizacion?: string;
}

@Component({
  selector: 'app-valores-base',
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
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './valores-base.component.html',
  styleUrls: ['./valores-base.component.scss']
})
export class ValoresBaseComponent implements OnInit {
  // Signals
  valoresPredial = signal<ValorBasePredial[]>([]);
  valoresICA = signal<ValorBaseICA[]>([]);
  loading = signal(false);
  
  // Filtros
  vigenciaSeleccionada = signal<number>(new Date().getFullYear());
  objetoSeleccionado = signal<string>('');
  
  // Vigencias disponibles
  vigenciasDisponibles = signal<number[]>([]);
  
  // Tabs
  tabSeleccionado = signal(0);
  
  // Columnas de tablas
  columnasPredial = ['objeto', 'avaluo', 'destinacion', 'estrato', 'areaTerreno', 'areaConstruida', 'vigencia', 'acciones'];
  columnasICA = ['objeto', 'ciiu', 'actividad', 'ingresos', 'tipo', 'vigencia', 'acciones'];
  
  // Formularios
  showFormPredial = signal(false);
  showFormICA = signal(false);
  editMode = signal(false);
  
  currentValorPredial = signal<ValorBasePredial>({
    objetoTributarioId: 0,
    vigencia: new Date().getFullYear(),
    avaluoCatastral: 0,
    destinacionEconomica: 'RESIDENCIAL',
    estrato: 3,
    areaTerreno: 0,
    areaConstruida: 0,
    usoSuelo: ''
  });
  
  currentValorICA = signal<ValorBaseICA>({
    objetoTributarioId: 0,
    vigencia: new Date().getFullYear(),
    actividadEconomica: '',
    descripcionActividad: '',
    ingresosGravados: 0,
    tipoContribuyente: 'PERSONA_JURIDICA',
    municipioOperacion: ''
  });

  ngOnInit(): void {
    this.generarVigenciasDisponibles();
    this.cargarDatos();
  }

  generarVigenciasDisponibles(): void {
    const anioActual = new Date().getFullYear();
    const vigencias = [];
    for (let i = 0; i < 6; i++) {
      vigencias.push(anioActual - i);
    }
    this.vigenciasDisponibles.set(vigencias);
  }

  cargarDatos(): void {
    this.loading.set(true);
    
    setTimeout(() => {
      // Datos mock Predial
      const mockPredial: ValorBasePredial[] = [
        {
          id: 1,
          objetoTributarioId: 1001,
          vigencia: 2026,
          avaluoCatastral: 150000000,
          destinacionEconomica: 'RESIDENCIAL',
          estrato: 4,
          areaTerreno: 200,
          areaConstruida: 150,
          usoSuelo: 'Vivienda unifamiliar',
          fechaActualizacion: '2026-01-15'
        },
        {
          id: 2,
          objetoTributarioId: 1002,
          vigencia: 2026,
          avaluoCatastral: 85000000,
          destinacionEconomica: 'RESIDENCIAL',
          estrato: 3,
          areaTerreno: 120,
          areaConstruida: 90,
          usoSuelo: 'Apartamento',
          fechaActualizacion: '2026-01-20'
        },
        {
          id: 3,
          objetoTributarioId: 1003,
          vigencia: 2026,
          avaluoCatastral: 300000000,
          destinacionEconomica: 'COMERCIAL',
          estrato: 5,
          areaTerreno: 500,
          areaConstruida: 450,
          usoSuelo: 'Local comercial',
          fechaActualizacion: '2026-01-10'
        },
        {
          id: 4,
          objetoTributarioId: 1004,
          vigencia: 2026,
          avaluoCatastral: 45000000,
          destinacionEconomica: 'RESIDENCIAL',
          estrato: 2,
          areaTerreno: 80,
          areaConstruida: 60,
          usoSuelo: 'Vivienda de interés social',
          fechaActualizacion: '2026-01-25'
        }
      ];
      
      // Datos mock ICA
      const mockICA: ValorBaseICA[] = [
        {
          id: 1,
          objetoTributarioId: 2001,
          vigencia: 2026,
          actividadEconomica: '4711',
          descripcionActividad: 'Comercio al por menor en establecimientos no especializados',
          ingresosGravados: 500000000,
          tipoContribuyente: 'PERSONA_JURIDICA',
          municipioOperacion: 'Bogotá D.C.',
          fechaActualizacion: '2026-02-01'
        },
        {
          id: 2,
          objetoTributarioId: 2002,
          vigencia: 2026,
          actividadEconomica: '6201',
          descripcionActividad: 'Actividades de desarrollo de sistemas informáticos',
          ingresosGravados: 800000000,
          tipoContribuyente: 'GRAN_CONTRIBUYENTE',
          municipioOperacion: 'Bogotá D.C.',
          fechaActualizacion: '2026-02-05'
        },
        {
          id: 3,
          objetoTributarioId: 2003,
          vigencia: 2026,
          actividadEconomica: '5611',
          descripcionActividad: 'Expendio a la mesa de comidas preparadas',
          ingresosGravados: 250000000,
          tipoContribuyente: 'PERSONA_NATURAL',
          municipioOperacion: 'Bogotá D.C.',
          fechaActualizacion: '2026-01-28'
        }
      ];
      
      this.valoresPredial.set(mockPredial);
      this.valoresICA.set(mockICA);
      this.loading.set(false);
    }, 500);
  }

  // Predial Methods
  openFormPredial(): void {
    this.currentValorPredial.set({
      objetoTributarioId: 0,
      vigencia: this.vigenciaSeleccionada(),
      avaluoCatastral: 0,
      destinacionEconomica: 'RESIDENCIAL',
      estrato: 3,
      areaTerreno: 0,
      areaConstruida: 0,
      usoSuelo: ''
    });
    this.editMode.set(false);
    this.showFormPredial.set(true);
  }

  closeFormPredial(): void {
    this.showFormPredial.set(false);
  }

  saveValorPredial(): void {
    const valor = this.currentValorPredial();
    
    if (this.editMode()) {
      const index = this.valoresPredial().findIndex(v => v.id === valor.id);
      if (index !== -1) {
        const updated = [...this.valoresPredial()];
        updated[index] = { ...valor };
        this.valoresPredial.set(updated);
      }
    } else {
      const newValor = {
        ...valor,
        id: Math.max(0, ...this.valoresPredial().map(v => v.id || 0)) + 1,
        fechaActualizacion: new Date().toISOString().split('T')[0]
      };
      this.valoresPredial.set([...this.valoresPredial(), newValor]);
    }
    
    this.closeFormPredial();
  }

  editValorPredial(valor: ValorBasePredial): void {
    this.currentValorPredial.set({ ...valor });
    this.editMode.set(true);
    this.showFormPredial.set(true);
  }

  deleteValorPredial(id: number): void {
    if (confirm('¿Está seguro de eliminar este valor base?')) {
      this.valoresPredial.set(this.valoresPredial().filter(v => v.id !== id));
    }
  }

  // ICA Methods
  openFormICA(): void {
    this.currentValorICA.set({
      objetoTributarioId: 0,
      vigencia: this.vigenciaSeleccionada(),
      actividadEconomica: '',
      descripcionActividad: '',
      ingresosGravados: 0,
      tipoContribuyente: 'PERSONA_JURIDICA',
      municipioOperacion: 'Bogotá D.C.'
    });
    this.editMode.set(false);
    this.showFormICA.set(true);
  }

  closeFormICA(): void {
    this.showFormICA.set(false);
  }

  saveValorICA(): void {
    const valor = this.currentValorICA();
    
    if (this.editMode()) {
      const index = this.valoresICA().findIndex(v => v.id === valor.id);
      if (index !== -1) {
        const updated = [...this.valoresICA()];
        updated[index] = { ...valor };
        this.valoresICA.set(updated);
      }
    } else {
      const newValor = {
        ...valor,
        id: Math.max(0, ...this.valoresICA().map(v => v.id || 0)) + 1,
        fechaActualizacion: new Date().toISOString().split('T')[0]
      };
      this.valoresICA.set([...this.valoresICA(), newValor]);
    }
    
    this.closeFormICA();
  }

  editValorICA(valor: ValorBaseICA): void {
    this.currentValorICA.set({ ...valor });
    this.editMode.set(true);
    this.showFormICA.set(true);
  }

  deleteValorICA(id: number): void {
    if (confirm('¿Está seguro de eliminar este valor base?')) {
      this.valoresICA.set(this.valoresICA().filter(v => v.id !== id));
    }
  }

  // Formatters
  formatearMoneda(valor: number): string {
    return `$${valor.toLocaleString('es-CO')}`;
  }

  formatearArea(valor: number): string {
    return `${valor.toLocaleString('es-CO')} m²`;
  }

  getObjetoIdentificacion(id: number): string {
    return `OBJ-${id.toString().padStart(6, '0')}`;
  }
}

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { SelectionModel } from '@angular/cdk/collections';
import { FuenteIngreso, ObjetoTributario } from '../../core/models';

interface LogEntry {
  timestamp: Date;
  tipo: 'info' | 'success' | 'error';
  mensaje: string;
  objetoId?: number;
}

@Component({
  selector: 'app-nueva-liquidacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './nueva-liquidacion-clean.component.html',
  styleUrls: ['./nueva-liquidacion-clean.component.scss']
})
export class NuevaLiquidacionComponent implements OnInit {
  // Señales para estado reactivo
  objetos = signal<ObjetoTributario[]>([]);
  objetosFiltrados = signal<ObjetoTributario[]>([]);
  logs = signal<LogEntry[]>([]);
  ejecutando = signal(false);
  cargando = signal(false);
  objetosProcesados = signal(0);
  totalAProcesar = signal(0);
  stats = signal<{ exitosos: number; errores: number; montoTotal: number } | null>(null);
  
  // Progreso computado
  progreso = computed(() => {
    const total = this.totalAProcesar();
    const procesados = this.objetosProcesados();
    return total > 0 ? (procesados / total) * 100 : 0;
  });

  // Datos de selección
  fuentes: FuenteIngreso[] = [];
  fuenteSeleccionada: FuenteIngreso | null = null;
  vigencias: number[] = [];
  vigenciaSeleccionada: number = new Date().getFullYear();

  // Filtros
  filtroIdentificacion = '';
  filtroNombre = '';
  filtroEstado = 'TODOS';

  // Tabla
  displayedColumns = ['select', 'identificacion', 'nombre', 'tipo', 'estado'];
  selection = new SelectionModel<ObjetoTributario>(true, []);

  ngOnInit(): void {
    this.cargarFuentes();
    this.cargarVigencias();
  }

  cargarFuentes(): void {
    // Simular carga de fuentes desde el backend
    this.fuentes = [
      { id: 1, codigo: 'IPU', nombre: 'Impuesto Predial Unificado', estado: 'ACTIVO', aplicaPrescripcion: true },
      { id: 2, codigo: 'ICA', nombre: 'Impuesto de Industria y Comercio', estado: 'ACTIVO', aplicaPrescripcion: true },
      { id: 3, codigo: 'SOB', nombre: 'Sobretasa Bomberil', estado: 'ACTIVO', aplicaPrescripcion: false },
      { id: 4, codigo: 'PUB', nombre: 'Publicidad Exterior Visual', estado: 'ACTIVO', aplicaPrescripcion: true }
    ];
  }

  cargarVigencias(): void {
    const añoActual = new Date().getFullYear();
    this.vigencias = [];
    for (let i = 0; i <= 5; i++) {
      this.vigencias.push(añoActual - i);
    }
  }

  onFuenteChange(): void {
    this.objetos.set([]);
    this.objetosFiltrados.set([]);
    this.selection.clear();
    this.limpiarProceso();
  }

  cargarObjetos(): void {
    if (!this.fuenteSeleccionada) return;

    this.cargando.set(true);
    
    // Simular carga desde el backend
    setTimeout(() => {
      const objetosSimulados: ObjetoTributario[] = [];
      const numObjetos = Math.floor(Math.random() * 30) + 20; // Entre 20 y 50 objetos

      for (let i = 1; i <= numObjetos; i++) {
        const identificacion = String(Math.floor(Math.random() * 900000000) + 100000000);
        const nombre = this.getNombreAleatorio() + ' ' + this.getApellidoAleatorio();
        const calleNum = Math.floor(Math.random() * 100);
        const carrera = Math.floor(Math.random() * 50);
        const numero = Math.floor(Math.random() * 100);
        const direccion = 'Calle ' + calleNum + ' #' + carrera + '-' + numero;
        const telefono = String(Math.floor(Math.random() * 9000000) + 3000000000);
        const email = 'usuario' + i + '@example.com';
        const estados: ('ACTIVO' | 'INACTIVO' | 'SUSPENDIDO')[] = ['ACTIVO', 'ACTIVO', 'ACTIVO', 'INACTIVO', 'SUSPENDIDO'];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        const tipos = ['PREDIO', 'ESTABLECIMIENTO', 'VEHICULO'];
        const tipoObjeto = tipos[Math.floor(Math.random() * tipos.length)];
        
        objetosSimulados.push({
          id: i,
          fuenteIngresoId: this.fuenteSeleccionada!.id!,
          identificacion: identificacion,
          tipoIdentificacion: Math.random() > 0.5 ? 'CC' : 'NIT',
          nombre: nombre,
          direccion: direccion,
          telefono: telefono,
          email: email,
          estado: estado,
          tipoObjeto: tipoObjeto,
          valorCatastral: Math.floor(Math.random() * 500000000) + 50000000,
          fechaRegistro: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
        });
      }

      this.objetos.set(objetosSimulados);
      this.aplicarFiltros();
      this.cargando.set(false);
      
      const mensaje = 'Se cargaron ' + numObjetos + ' objetos tributarios de ' + this.fuenteSeleccionada!.nombre;
      this.addLog('info', mensaje);
    }, 1500);
  }

  aplicarFiltros(): void {
    let filtrados = [...this.objetos()];

    if (this.filtroIdentificacion) {
      filtrados = filtrados.filter(obj => 
        obj.identificacion.includes(this.filtroIdentificacion)
      );
    }

    if (this.filtroNombre) {
      filtrados = filtrados.filter(obj => 
        obj.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }

    if (this.filtroEstado !== 'TODOS') {
      filtrados = filtrados.filter(obj => obj.estado === this.filtroEstado);
    }

    this.objetosFiltrados.set(filtrados);
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.objetosFiltrados().length;
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.objetosFiltrados().forEach(obj => this.selection.select(obj));
    }
  }

  ejecutarLiquidacion(): void {
    if (this.selection.selected.length === 0) return;

    this.ejecutando.set(true);
    this.logs.set([]);
    this.objetosProcesados.set(0);
    this.totalAProcesar.set(this.selection.selected.length);
    
    let exitosos = 0;
    let errores = 0;
    let montoTotal = 0;

    const mensaje1 = 'Iniciando liquidacion de ' + this.selection.selected.length + ' objetos...';
    const mensaje2 = 'Fuente: ' + this.fuenteSeleccionada?.nombre + ' | Vigencia: ' + this.vigenciaSeleccionada;
    this.addLog('info', mensaje1);
    this.addLog('info', mensaje2);

    // Procesar cada objeto con delay para mostrar en tiempo real
    this.procesarObjetoSecuencial(this.selection.selected, 0, exitosos, errores, montoTotal);
  }

  private procesarObjetoSecuencial(
    objetos: ObjetoTributario[], 
    index: number, 
    exitosos: number, 
    errores: number, 
    montoTotal: number
  ): void {
    if (index >= objetos.length) {
      // Proceso completado
      this.ejecutando.set(false);
      this.stats.set({ exitosos, errores, montoTotal });
      const mensaje1 = 'Proceso completado: ' + exitosos + ' exitosos, ' + errores + ' errores';
      const montoFormateado = montoTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 });
      const mensaje2 = 'Monto total liquidado: $' + montoFormateado;
      this.addLog('success', mensaje1);
      this.addLog('success', mensaje2);
      return;
    }

    const objeto = objetos[index];
    const delay = 300; // 300ms por objeto para visualización

    setTimeout(() => {
      // Simular liquidación
      const exito = Math.random() > 0.1; // 90% de éxito
      const monto = Math.floor(Math.random() * 1000000) + 100000;

      if (exito) {
        const montoFormateado = monto.toLocaleString('es-CO');
        const mensaje = 'Liquidacion exitosa: ' + objeto.nombre + ' (' + objeto.identificacion + ') - $' + montoFormateado;
        this.addLog('success', mensaje);
        exitosos++;
        montoTotal += monto;
      } else {
        const mensaje = 'Error en liquidacion: ' + objeto.nombre + ' (' + objeto.identificacion + ') - Error de validacion';
        this.addLog('error', mensaje);
        errores++;
      }

      this.objetosProcesados.set(index + 1);
      this.stats.set({ exitosos, errores, montoTotal });

      // Procesar siguiente objeto
      this.procesarObjetoSecuencial(objetos, index + 1, exitosos, errores, montoTotal);
    }, delay);
  }

  addLog(tipo: 'info' | 'success' | 'error', mensaje: string, objetoId?: number): void {
    const newLogs = [...this.logs(), { timestamp: new Date(), tipo, mensaje, objetoId }];
    this.logs.set(newLogs);
    
    // Auto-scroll al final
    setTimeout(() => {
      const logContainer = document.querySelector('.log-container');
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }, 100);
  }

  getIconForLogType(tipo: string): string {
    switch (tipo) {
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  progresoFormateado(): string {
    return Math.floor(this.progreso()).toString();
  }

  formatearMonto(monto: number): string {
    return monto.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  limpiarProceso(): void {
    this.logs.set([]);
    this.selection.clear();
    this.objetosProcesados.set(0);
    this.totalAProcesar.set(0);
    this.stats.set(null);
    this.filtroIdentificacion = '';
    this.filtroNombre = '';
    this.filtroEstado = 'TODOS';
  }

  private getNombreAleatorio(): string {
    const nombres = ['Juan', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Luisa', 'Jorge', 'Carmen', 'Roberto', 'Elena', 'Francisco', 'Laura'];
    return nombres[Math.floor(Math.random() * nombres.length)];
  }

  private getApellidoAleatorio(): string {
    const apellidos = ['Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez'];
    return apellidos[Math.floor(Math.random() * apellidos.length)];
  }
}

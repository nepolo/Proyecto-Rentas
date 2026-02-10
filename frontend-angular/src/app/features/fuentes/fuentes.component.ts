import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

interface FuenteIngreso {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: 'directos' | 'indirectos' | 'tasas' | 'otros';
  estado: 'activo' | 'inactivo' | 'configuracion';
  conceptosCount: number;
  tiposCount: number;
  liquidacionesCount: number;
  color: string;
  icono: string;
}

@Component({
  selector: 'app-fuentes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <div class="fuentes-container">
      <div class="fuentes-header">
        <div class="header-content">
          <h1>Fuentes de Ingreso</h1>
          <p class="subtitle">Gestión y parametrización de fuentes tributarias</p>
        </div>
        <button mat-raised-button color="primary" (click)="nuevaFuente()">
          <mat-icon>add_circle</mat-icon>
          Nueva Fuente
        </button>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="search-bar">
        <mat-form-field class="search-field">
          <mat-label>Buscar fuentes</mat-label>
          <input matInput [(ngModel)]="filtro" placeholder="Nombre, código, categoría...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="category-chips">
          <mat-chip-set>
            <mat-chip [class.selected]="categoriaSeleccionada() === 'todas'"
                      (click)="filtrarPorCategoria('todas')">
              Todas ({{ fuentes().length }})
            </mat-chip>
            <mat-chip [class.selected]="categoriaSeleccionada() === 'directos'"
                      (click)="filtrarPorCategoria('directos')">
              Impuestos Directos ({{ contarPorCategoria('directos') }})
            </mat-chip>
            <mat-chip [class.selected]="categoriaSeleccionada() === 'indirectos'"
                      (click)="filtrarPorCategoria('indirectos')">
              Impuestos Indirectos ({{ contarPorCategoria('indirectos') }})
            </mat-chip>
            <mat-chip [class.selected]="categoriaSeleccionada() === 'tasas'"
                      (click)="filtrarPorCategoria('tasas')">
              Tasas ({{ contarPorCategoria('tasas') }})
            </mat-chip>
            <mat-chip [class.selected]="categoriaSeleccionada() === 'otros'"
                      (click)="filtrarPorCategoria('otros')">
              Otros ({{ contarPorCategoria('otros') }})
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Grid de fuentes con diseño adaptativo -->
      <div class="fuentes-grid" [class.list-view]="fuentesFiltradas().length > 12">
        <mat-card *ngFor="let fuente of fuentesFiltradas()" 
                  class="fuente-card"
                  [style.border-left-color]="fuente.color"
                  (click)="verFuente(fuente)">
          <mat-card-header>
            <div class="fuente-icon" [style.background-color]="fuente.color + '20'">
              <mat-icon [style.color]="fuente.color">{{ fuente.icono }}</mat-icon>
            </div>
            <mat-card-title>{{ fuente.nombre }}</mat-card-title>
            <mat-card-subtitle>{{ fuente.codigo }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p class="fuente-descripcion">{{ fuente.descripcion }}</p>
            
            <div class="fuente-stats">
              <div class="stat-item" [matTooltip]="'Conceptos de cobro configurados'">
                <mat-icon>receipt_long</mat-icon>
                <span>{{ fuente.conceptosCount }} conceptos</span>
              </div>
              <div class="stat-item" [matTooltip]="'Tipos de liquidación'">
                <mat-icon>category</mat-icon>
                <span>{{ fuente.tiposCount }} tipos</span>
              </div>
              <div class="stat-item" [matTooltip]="'Liquidaciones generadas'">
                <mat-icon>description</mat-icon>
                <span>{{ fuente.liquidacionesCount | number }} liq.</span>
              </div>
            </div>

            <div class="fuente-footer">
              <mat-chip [class]="'estado-' + fuente.estado">
                {{ getEstadoLabel(fuente.estado) }}
              </mat-chip>
              <mat-chip class="categoria">
                {{ getCategoriaLabel(fuente.categoria) }}
              </mat-chip>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button color="primary" (click)="verFuente(fuente); $event.stopPropagation()">
              <mat-icon>visibility</mat-icon>
              Ver
            </button>
            <button mat-button (click)="configurarFuente(fuente); $event.stopPropagation()">
              <mat-icon>settings</mat-icon>
              Configurar
            </button>
            <button mat-icon-button [matTooltip]="'Más opciones'">
              <mat-icon>more_vert</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Estado vacío -->
      <div class="empty-state" *ngIf="fuentesFiltradas().length === 0">
        <mat-icon>search_off</mat-icon>
        <h2>No se encontraron fuentes</h2>
        <p>Intenta con otros términos de búsqueda o crea una nueva fuente</p>
        <button mat-raised-button color="primary" (click)="limpiarFiltros()">
          <mat-icon>clear</mat-icon>
          Limpiar filtros
        </button>
      </div>
    </div>
  `,
  styles: [`
    .fuentes-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .fuentes-header {
      padding: 24px 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-content {
        h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 500;
        }

        .subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }
      }
    }

    .search-bar {
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      gap: 16px;
      align-items: center;

      .search-field {
        flex: 0 0 400px;
      }

      .category-chips {
        flex: 1;

        mat-chip {
          cursor: pointer;
          transition: all 0.2s;

          &.selected {
            background: #667eea;
            color: white;
          }

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        }
      }
    }

    .fuentes-grid {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      align-content: start;

      &.list-view {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }

    .fuente-card {
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 4px solid;
      height: fit-content;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      }

      mat-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .fuente-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 28px;
            width: 28px;
            height: 28px;
          }
        }

        mat-card-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        mat-card-subtitle {
          font-size: 12px;
          margin: 4px 0 0 0;
        }
      }

      mat-card-content {
        .fuente-descripcion {
          font-size: 13px;
          color: #666;
          margin: 0 0 16px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .fuente-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #555;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #999;
            }
          }
        }

        .fuente-footer {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          mat-chip {
            font-size: 11px;
            height: 24px;

            &.estado-activo {
              background: #e8f5e9;
              color: #2e7d32;
            }

            &.estado-inactivo {
              background: #ffebee;
              color: #c62828;
            }

            &.estado-configuracion {
              background: #fff3e0;
              color: #e65100;
            }

            &.categoria {
              background: #e3f2fd;
              color: #1565c0;
            }
          }
        }
      }

      mat-card-actions {
        padding: 8px 16px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
      }
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
      }

      p {
        margin: 0 0 24px 0;
        font-size: 14px;
      }
    }
  `]
})
export class FuentesComponent {
  private router = inject(Router);

  filtro = '';
  categoriaSeleccionada = signal<string>('todas');

  fuentes = signal<FuenteIngreso[]>([
    {
      id: 1,
      codigo: 'PRED-URB',
      nombre: 'Predial Unificado Urbano',
      descripcion: 'Impuesto predial unificado para predios urbanos del municipio',
      categoria: 'directos',
      estado: 'activo',
      conceptosCount: 8,
      tiposCount: 3,
      liquidacionesCount: 15234,
      color: '#1976d2',
      icono: 'home'
    },
    {
      id: 2,
      codigo: 'PRED-RUR',
      nombre: 'Predial Unificado Rural',
      descripcion: 'Impuesto predial unificado para predios rurales',
      categoria: 'directos',
      estado: 'activo',
      conceptosCount: 6,
      tiposCount: 2,
      liquidacionesCount: 4567,
      color: '#2e7d32',
      icono: 'agriculture'
    },
    {
      id: 3,
      codigo: 'ICA-IND',
      nombre: 'ICA Industrial',
      descripcion: 'Impuesto de Industria y Comercio sector industrial',
      categoria: 'indirectos',
      estado: 'activo',
      conceptosCount: 12,
      tiposCount: 5,
      liquidacionesCount: 8956,
      color: '#f57c00',
      icono: 'factory'
    },
    {
      id: 4,
      codigo: 'ICA-COM',
      nombre: 'ICA Comercial',
      descripcion: 'Impuesto de Industria y Comercio sector comercial',
      categoria: 'indirectos',
      estado: 'activo',
      conceptosCount: 10,
      tiposCount: 4,
      liquidacionesCount: 12345,
      color: '#d32f2f',
      icono: 'storefront'
    },
    {
      id: 5,
      codigo: 'SOBR-AMB',
      nombre: 'Sobretasa Ambiental',
      descripcion: 'Sobretasa ambiental al predial',
      categoria: 'directos',
      estado: 'activo',
      conceptosCount: 4,
      tiposCount: 1,
      liquidacionesCount: 8901,
      color: '#388e3c',
      icono: 'eco'
    },
    {
      id: 6,
      codigo: 'ALUMB-PUB',
      nombre: 'Alumbrado Público',
      descripcion: 'Contribución especial de alumbrado público',
      categoria: 'tasas',
      estado: 'activo',
      conceptosCount: 5,
      tiposCount: 2,
      liquidacionesCount: 23456,
      color: '#fbc02d',
      icono: 'lightbulb'
    },
    {
      id: 7,
      codigo: 'VAL-PLUS',
      nombre: 'Valorización',
      descripcion: 'Contribución por valorización de obras públicas',
      categoria: 'tasas',
      estado: 'activo',
      conceptosCount: 15,
      tiposCount: 6,
      liquidacionesCount: 1234,
      color: '#7b1fa2',
      icono: 'trending_up'
    },
    {
      id: 8,
      codigo: 'ESP-PUB',
      nombre: 'Espacio Público',
      descripcion: 'Aprovechamiento económico del espacio público',
      categoria: 'tasas',
      estado: 'activo',
      conceptosCount: 7,
      tiposCount: 3,
      liquidacionesCount: 3456,
      color: '#0288d1',
      icono: 'location_city'
    }
  ]);

  fuentesFiltradas = computed(() => {
    let resultado = this.fuentes();

    // Filtro por categoría
    if (this.categoriaSeleccionada() !== 'todas') {
      resultado = resultado.filter(f => f.categoria === this.categoriaSeleccionada());
    }

    // Filtro por texto
    if (this.filtro) {
      const filtroLower = this.filtro.toLowerCase();
      resultado = resultado.filter(f =>
        f.nombre.toLowerCase().includes(filtroLower) ||
        f.codigo.toLowerCase().includes(filtroLower) ||
        f.descripcion.toLowerCase().includes(filtroLower) ||
        this.getCategoriaLabel(f.categoria).toLowerCase().includes(filtroLower)
      );
    }

    return resultado;
  });

  contarPorCategoria(categoria: string): number {
    return this.fuentes().filter(f => f.categoria === categoria).length;
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaSeleccionada.set(categoria);
  }

  getCategoriaLabel(categoria: string): string {
    const labels: Record<string, string> = {
      directos: 'Imp. Directos',
      indirectos: 'Imp. Indirectos',
      tasas: 'Tasas',
      otros: 'Otros'
    };
    return labels[categoria] || categoria;
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      activo: 'Activo',
      inactivo: 'Inactivo',
      configuracion: 'En Configuración'
    };
    return labels[estado] || estado;
  }

  limpiarFiltros() {
    this.filtro = '';
    this.categoriaSeleccionada.set('todas');
  }

  nuevaFuente() {
    console.log('Crear nueva fuente');
  }

  verFuente(fuente: FuenteIngreso) {
    this.router.navigate(['/fuentes', fuente.id]);
  }

  configurarFuente(fuente: FuenteIngreso) {
    this.router.navigate(['/fuentes', fuente.id, 'configurar']);
  }
}

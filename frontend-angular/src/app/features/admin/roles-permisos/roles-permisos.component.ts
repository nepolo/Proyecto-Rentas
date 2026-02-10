import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  modulo: string;
}

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
  usuariosCount: number;
}

@Component({
  selector: 'app-roles-permisos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="roles-container">
      <div class="roles-grid">
        <!-- Lista de Roles -->
        <mat-card class="roles-list">
          <mat-card-header>
            <mat-card-title>Roles del Sistema</mat-card-title>
            <button mat-raised-button color="primary" (click)="nuevoRol()">
              <mat-icon>add</mat-icon>
              Nuevo Rol
            </button>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let rol of roles()" 
                             [class.selected]="rolSeleccionado()?.id === rol.id"
                             (click)="seleccionarRol(rol)">
                <div class="rol-item">
                  <div class="rol-info">
                    <strong>{{ rol.nombre }}</strong>
                    <span class="rol-desc">{{ rol.descripcion }}</span>
                    <mat-chip-set>
                      <mat-chip>{{ rol.usuariosCount }} usuarios</mat-chip>
                      <mat-chip>{{ rol.permisos.length }} permisos</mat-chip>
                    </mat-chip-set>
                  </div>
                  <button mat-icon-button (click)="editarRol(rol); $event.stopPropagation()">
                    <mat-icon>edit</mat-icon>
                  </button>
                </div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Permisos del Rol -->
        <mat-card class="permisos-card" *ngIf="rolSeleccionado()">
          <mat-card-header>
            <mat-card-title>Permisos: {{ rolSeleccionado()?.nombre }}</mat-card-title>
            <button mat-raised-button color="accent" (click)="guardarPermisos()">
              <mat-icon>save</mat-icon>
              Guardar
            </button>
          </mat-card-header>
          <mat-card-content>
            <mat-accordion>
              <mat-expansion-panel *ngFor="let grupo of permisosPorModulo()">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    {{ grupo.modulo }}
                    <mat-chip class="permisos-count">
                      {{ contarPermisosSeleccionados(grupo.permisos) }}/{{ grupo.permisos.length }}
                    </mat-chip>
                  </mat-panel-title>
                </mat-expansion-panel-header>
                
                <div class="permisos-list">
                  <mat-checkbox *ngFor="let permiso of grupo.permisos"
                                [checked]="tienePermiso(permiso.id)"
                                (change)="togglePermiso(permiso.id)">
                    <div class="permiso-item">
                      <strong>{{ permiso.nombre }}</strong>
                      <span class="permiso-desc">{{ permiso.descripcion }}</span>
                    </div>
                  </mat-checkbox>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-card-content>
        </mat-card>

        <div class="placeholder" *ngIf="!rolSeleccionado()">
          <mat-icon>shield</mat-icon>
          <p>Selecciona un rol para gestionar sus permisos</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .roles-container {
      height: 100%;
    }

    .roles-grid {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 16px;
      height: 100%;
    }

    .roles-list {
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      mat-list-item {
        cursor: pointer;
        border-bottom: 1px solid #eee;

        &.selected {
          background: #f5f5f5;
        }

        &:hover {
          background: #fafafa;
        }

        .rol-item {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;

          .rol-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .rol-desc {
              font-size: 13px;
              color: #666;
            }

            mat-chip {
              font-size: 11px;
              height: 24px;
            }
          }
        }
      }
    }

    .permisos-card {
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .permisos-count {
        margin-left: 8px;
        font-size: 11px;
        height: 24px;
      }

      .permisos-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;

        .permiso-item {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .permiso-desc {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }

    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }
    }
  `]
})
export class RolesPermisosComponent {
  private snackBar = inject(MatSnackBar);

  rolSeleccionado = signal<Rol | null>(null);

  roles = signal<Rol[]>([
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      permisos: ['liquidaciones.crear', 'liquidaciones.editar', 'liquidaciones.aprobar', 'admin.usuarios', 'admin.roles'],
      usuariosCount: 3
    },
    {
      id: 2,
      nombre: 'Liquidador',
      descripcion: 'Creación y gestión de liquidaciones',
      permisos: ['liquidaciones.crear', 'liquidaciones.editar', 'liquidaciones.ver'],
      usuariosCount: 12
    },
    {
      id: 3,
      nombre: 'Aprobador',
      descripcion: 'Aprobación de liquidaciones',
      permisos: ['liquidaciones.ver', 'liquidaciones.aprobar'],
      usuariosCount: 5
    },
    {
      id: 4,
      nombre: 'Consulta',
      descripcion: 'Solo lectura',
      permisos: ['liquidaciones.ver', 'fuentes.ver'],
      usuariosCount: 8
    }
  ]);

  permisos: Permiso[] = [
    // Liquidaciones
    { id: 'liquidaciones.ver', nombre: 'Ver liquidaciones', descripcion: 'Consultar liquidaciones existentes', modulo: 'Liquidaciones' },
    { id: 'liquidaciones.crear', nombre: 'Crear liquidaciones', descripcion: 'Crear nuevas liquidaciones', modulo: 'Liquidaciones' },
    { id: 'liquidaciones.editar', nombre: 'Editar liquidaciones', descripcion: 'Modificar liquidaciones existentes', modulo: 'Liquidaciones' },
    { id: 'liquidaciones.aprobar', nombre: 'Aprobar liquidaciones', descripcion: 'Aprobar o rechazar liquidaciones', modulo: 'Liquidaciones' },
    { id: 'liquidaciones.anular', nombre: 'Anular liquidaciones', descripcion: 'Anular liquidaciones aprobadas', modulo: 'Liquidaciones' },
    // Fuentes
    { id: 'fuentes.ver', nombre: 'Ver fuentes', descripcion: 'Consultar fuentes de ingreso', modulo: 'Fuentes de Ingreso' },
    { id: 'fuentes.crear', nombre: 'Crear fuentes', descripcion: 'Crear nuevas fuentes de ingreso', modulo: 'Fuentes de Ingreso' },
    { id: 'fuentes.editar', nombre: 'Editar fuentes', descripcion: 'Modificar configuración de fuentes', modulo: 'Fuentes de Ingreso' },
    { id: 'fuentes.parametrizar', nombre: 'Parametrizar fuentes', descripcion: 'Configurar conceptos y tarifas', modulo: 'Fuentes de Ingreso' },
    // Administración
    { id: 'admin.usuarios', nombre: 'Gestionar usuarios', descripcion: 'Crear y modificar usuarios', modulo: 'Administración' },
    { id: 'admin.roles', nombre: 'Gestionar roles', descripcion: 'Configurar roles y permisos', modulo: 'Administración' },
    { id: 'admin.config', nombre: 'Configuración global', descripcion: 'Modificar configuración del sistema', modulo: 'Administración' },
    { id: 'admin.auditoria', nombre: 'Ver auditoría', descripcion: 'Consultar logs de auditoría', modulo: 'Administración' }
  ];

  permisosPorModulo = () => {
    const grupos = new Map<string, Permiso[]>();
    this.permisos.forEach(p => {
      if (!grupos.has(p.modulo)) {
        grupos.set(p.modulo, []);
      }
      grupos.get(p.modulo)!.push(p);
    });
    return Array.from(grupos.entries()).map(([modulo, permisos]) => ({ modulo, permisos }));
  };

  seleccionarRol(rol: Rol) {
    this.rolSeleccionado.set(rol);
  }

  tienePermiso(permisoId: string): boolean {
    return this.rolSeleccionado()?.permisos.includes(permisoId) || false;
  }

  togglePermiso(permisoId: string) {
    const rol = this.rolSeleccionado();
    if (!rol) return;

    const permisos = [...rol.permisos];
    const index = permisos.indexOf(permisoId);
    
    if (index > -1) {
      permisos.splice(index, 1);
    } else {
      permisos.push(permisoId);
    }

    this.rolSeleccionado.set({ ...rol, permisos });
  }

  contarPermisosSeleccionados(permisos: Permiso[]): number {
    return permisos.filter(p => this.tienePermiso(p.id)).length;
  }

  nuevoRol() {
    this.snackBar.open('Funcionalidad en desarrollo', 'Cerrar', { duration: 2000 });
  }

  editarRol(rol: Rol) {
    this.snackBar.open(`Editando rol: ${rol.nombre}`, 'Cerrar', { duration: 2000 });
  }

  guardarPermisos() {
    this.snackBar.open('Permisos guardados correctamente', 'Cerrar', { duration: 2000 });
  }
}

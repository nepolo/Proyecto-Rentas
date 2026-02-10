import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  username: string;
  roles: string[];
  entidad?: string;
  estado: 'activo' | 'inactivo';
  ultimoAcceso?: Date;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="usuarios-container">
      <div class="header-actions">
        <mat-form-field class="search-field">
          <mat-label>Buscar usuarios</mat-label>
          <input matInput [(ngModel)]="filtro" placeholder="Nombre, email, username...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="nuevoUsuario()">
          <mat-icon>person_add</mat-icon>
          Nuevo Usuario
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="usuariosFiltrados()" class="usuarios-table">
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let usuario">
              <div class="usuario-info">
                <strong>{{ usuario.nombre }}</strong>
                <span class="username">{{ usuario.username }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let usuario">{{ usuario.email }}</td>
          </ng-container>

          <ng-container matColumnDef="roles">
            <th mat-header-cell *matHeaderCellDef>Roles</th>
            <td mat-cell *matCellDef="let usuario">
              <mat-chip-set>
                <mat-chip *ngFor="let rol of usuario.roles" class="role-chip">
                  {{ rol }}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="entidad">
            <th mat-header-cell *matHeaderCellDef>Entidad</th>
            <td mat-cell *matCellDef="let usuario">{{ usuario.entidad || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let usuario">
              <span [class]="'estado-badge ' + usuario.estado">
                {{ usuario.estado }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let usuario">
              <button mat-icon-button [matTooltip]="'Editar'" (click)="editarUsuario(usuario)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button [matTooltip]="'Cambiar contraseña'" (click)="cambiarPassword(usuario)">
                <mat-icon>lock_reset</mat-icon>
              </button>
              <button mat-icon-button 
                      [matTooltip]="usuario.estado === 'activo' ? 'Desactivar' : 'Activar'"
                      (click)="toggleEstado(usuario)">
                <mat-icon>{{ usuario.estado === 'activo' ? 'block' : 'check_circle' }}</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .usuarios-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;

      .search-field {
        flex: 1;
      }
    }

    mat-card {
      flex: 1;
      overflow: auto;
    }

    .usuarios-table {
      width: 100%;

      .usuario-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .username {
          font-size: 12px;
          color: #666;
        }
      }

      .role-chip {
        font-size: 11px;
        height: 24px;
      }

      .estado-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.activo {
          background: #e8f5e9;
          color: #2e7d32;
        }

        &.inactivo {
          background: #ffebee;
          color: #c62828;
        }
      }
    }
  `]
})
export class UsuariosComponent {
  private snackBar = inject(MatSnackBar);
  
  filtro = '';
  displayedColumns = ['nombre', 'email', 'roles', 'entidad', 'estado', 'acciones'];

  usuarios = signal<Usuario[]>([
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@alcaldia.gov.co',
      username: 'jperez',
      roles: ['Administrador', 'Liquidador'],
      entidad: 'Secretaría de Hacienda',
      estado: 'activo',
      ultimoAcceso: new Date()
    },
    {
      id: 2,
      nombre: 'María González',
      email: 'maria.gonzalez@alcaldia.gov.co',
      username: 'mgonzalez',
      roles: ['Liquidador'],
      entidad: 'Secretaría de Hacienda',
      estado: 'activo',
      ultimoAcceso: new Date()
    }
  ]);

  usuariosFiltrados = () => {
    const filtro = this.filtro.toLowerCase();
    if (!filtro) return this.usuarios();
    
    return this.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(filtro) ||
      u.email.toLowerCase().includes(filtro) ||
      u.username.toLowerCase().includes(filtro)
    );
  };

  nuevoUsuario() {
    this.snackBar.open('Funcionalidad en desarrollo', 'Cerrar', { duration: 2000 });
  }

  editarUsuario(usuario: Usuario) {
    this.snackBar.open(`Editando usuario: ${usuario.nombre}`, 'Cerrar', { duration: 2000 });
  }

  cambiarPassword(usuario: Usuario) {
    this.snackBar.open(`Cambiar contraseña para: ${usuario.nombre}`, 'Cerrar', { duration: 2000 });
  }

  toggleEstado(usuario: Usuario) {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    this.snackBar.open(
      `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`,
      'Cerrar',
      { duration: 2000 }
    );
  }
}

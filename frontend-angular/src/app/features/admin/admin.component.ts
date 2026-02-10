import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RolesPermisosComponent } from './roles-permisos/roles-permisos.component';
import { EntidadesComponent } from './entidades/entidades.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterModule, 
    MatTabsModule,
    UsuariosComponent,
    RolesPermisosComponent,
    EntidadesComponent,
    ConfiguracionComponent,
    AuditoriaComponent
  ],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Administración del Sistema</h1>
        <p class="subtitle">Gestión de usuarios, roles, permisos y configuración global</p>
      </div>

      <mat-tab-group class="admin-tabs" animationDuration="0ms">
        <mat-tab label="Usuarios">
          <ng-template matTabContent>
            <app-usuarios></app-usuarios>
          </ng-template>
        </mat-tab>

        <mat-tab label="Roles y Permisos">
          <ng-template matTabContent>
            <app-roles-permisos></app-roles-permisos>
          </ng-template>
        </mat-tab>

        <mat-tab label="Entidades">
          <ng-template matTabContent>
            <app-entidades></app-entidades>
          </ng-template>
        </mat-tab>

        <mat-tab label="Configuración">
          <ng-template matTabContent>
            <app-configuracion></app-configuracion>
          </ng-template>
        </mat-tab>

        <mat-tab label="Auditoría">
          <ng-template matTabContent>
            <app-auditoria></app-auditoria>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .admin-header {
      padding: 24px 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

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

    .admin-tabs {
      flex: 1;
      
      ::ng-deep .mat-mdc-tab-body-wrapper {
        flex: 1;
        padding: 24px;
      }
    }
  `]
})
export class AdminComponent { }

import { Component, Inject, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { ObjetosTributariosService, CampoDinamico, ObjetoTributario } from '../../../core/services/objetos-tributarios.service';

@Component({
  selector: 'app-objeto-tributario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCardModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <mat-icon>{{ data.objeto ? 'edit' : 'add' }}</mat-icon>
        {{ data.objeto ? 'Editar' : 'Registrar' }} {{ data.tipoObjeto }}
      </h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <form [formGroup]="objetoForm">
        <!-- Código del Objeto -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Código</mat-label>
          <input matInput formControlName="codigo" placeholder="Código único del objeto">
          <mat-icon matPrefix>tag</mat-icon>
          <mat-error *ngIf="objetoForm.get('codigo')?.hasError('required')">
            El código es obligatorio
          </mat-error>
        </mat-form-field>

        <!-- Campos Dinámicos por Grupo -->
        <mat-accordion multi>
          <mat-expansion-panel *ngFor="let grupo of gruposOrdenados()" [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>{{ getIconoGrupo(grupo) }}</mat-icon>
                {{ grupo }}
              </mat-panel-title>
              <mat-panel-description>
                {{ camposPorGrupo()[grupo].length }} campos
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="campos-grid">
              <ng-container *ngFor="let campo of camposPorGrupo()[grupo]">
                <!-- Campo de Texto -->
                <mat-form-field *ngIf="campo.tipo === 'texto'" appearance="outline" 
                  [class.full-width]="campo.nombre === 'direccion' || campo.nombre === 'razonSocial'">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <input matInput [formControlName]="campo.nombre">
                  <mat-icon *ngIf="campo.ayuda" matTooltip="{{ campo.ayuda }}" matSuffix>info</mat-icon>
                  <mat-error *ngIf="objetoForm.get(campo.nombre)?.hasError('required')">
                    {{ campo.etiqueta }} es obligatorio
                  </mat-error>
                </mat-form-field>

                <!-- Campo Numérico -->
                <mat-form-field *ngIf="campo.tipo === 'numero'" appearance="outline">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <input matInput type="number" [formControlName]="campo.nombre">
                  <mat-icon *ngIf="campo.ayuda" matTooltip="{{ campo.ayuda }}" matSuffix>info</mat-icon>
                  <mat-error *ngIf="objetoForm.get(campo.nombre)?.hasError('required')">
                    {{ campo.etiqueta }} es obligatorio
                  </mat-error>
                </mat-form-field>

                <!-- Campo Moneda -->
                <mat-form-field *ngIf="campo.tipo === 'moneda'" appearance="outline">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <span matPrefix>$ &nbsp;</span>
                  <input matInput type="number" [formControlName]="campo.nombre">
                  <mat-icon *ngIf="campo.ayuda" matTooltip="{{ campo.ayuda }}" matSuffix>info</mat-icon>
                  <mat-error *ngIf="objetoForm.get(campo.nombre)?.hasError('required')">
                    {{ campo.etiqueta }} es obligatorio
                  </mat-error>
                </mat-form-field>

                <!-- Campo Porcentaje -->
                <mat-form-field *ngIf="campo.tipo === 'porcentaje'" appearance="outline">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <input matInput type="number" [formControlName]="campo.nombre" [step]="0.01">
                  <span matSuffix>%</span>
                  <mat-error *ngIf="objetoForm.get(campo.nombre)?.hasError('required')">
                    {{ campo.etiqueta }} es obligatorio
                  </mat-error>
                </mat-form-field>

                <!-- Campo Lista/Select -->
                <mat-form-field *ngIf="campo.tipo === 'lista'" appearance="outline">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <mat-select [formControlName]="campo.nombre">
                    <mat-option *ngFor="let opcion of campo.opciones" [value]="opcion">
                      {{ opcion }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="objetoForm.get(campo.nombre)?.hasError('required')">
                    {{ campo.etiqueta }} es obligatorio
                  </mat-error>
                </mat-form-field>

                <!-- Campo Fecha -->
                <mat-form-field *ngIf="campo.tipo === 'fecha'" appearance="outline">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <input matInput [matDatepicker]="picker" [formControlName]="campo.nombre">
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="objetoForm.get(campo.nombre)?.hasError('required')">
                    {{ campo.etiqueta }} es obligatorio
                  </mat-error>
                </mat-form-field>

                <!-- Campo Email -->
                <mat-form-field *ngIf="campo.tipo === 'email'" appearance="outline" class="full-width">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <input matInput type="email" [formControlName]="campo.nombre">
                  <mat-icon matPrefix>email</mat-icon>
                  <mat-error *ngIf="objetoForm.get(campo.nombre)?.hasError('email')">
                    Email inválido
                  </mat-error>
                </mat-form-field>

                <!-- Campo Teléfono -->
                <mat-form-field *ngIf="campo.tipo === 'telefono'" appearance="outline">
                  <mat-label>{{ campo.etiqueta }}</mat-label>
                  <input matInput type="tel" [formControlName]="campo.nombre">
                  <mat-icon matPrefix>phone</mat-icon>
                </mat-form-field>

                <!-- Campo Boolean -->
                <div *ngIf="campo.tipo === 'boolean'" class="checkbox-field">
                  <mat-checkbox [formControlName]="campo.nombre">
                    {{ campo.etiqueta }}
                  </mat-checkbox>
                </div>
              </ng-container>
            </div>
          </mat-expansion-panel>
        </mat-accordion>

        <!-- Botón para agregar campos personalizados -->
        <div class="add-field-section" *ngIf="!mostrarNuevoCampo()">
          <button mat-stroked-button color="accent" (click)="mostrarFormularioCampo()" type="button">
            <mat-icon>add_circle</mat-icon>
            Agregar Campo Personalizado
          </button>
        </div>

        <!-- Formulario para nuevo campo -->
        <mat-card *ngIf="mostrarNuevoCampo()" class="nuevo-campo-card">
          <mat-card-header>
            <mat-card-title>Nuevo Campo Personalizado</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-grid-nuevo-campo">
              <mat-form-field appearance="outline">
                <mat-label>Nombre del Campo</mat-label>
                <input matInput [(ngModel)]="nuevoCampo.nombre" [ngModelOptions]="{standalone: true}">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Etiqueta</mat-label>
                <input matInput [(ngModel)]="nuevoCampo.etiqueta" [ngModelOptions]="{standalone: true}">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Tipo de Campo</mat-label>
                <mat-select [(ngModel)]="nuevoCampo.tipo" [ngModelOptions]="{standalone: true}">
                  <mat-option value="texto">Texto</mat-option>
                  <mat-option value="numero">Número</mat-option>
                  <mat-option value="moneda">Moneda</mat-option>
                  <mat-option value="porcentaje">Porcentaje</mat-option>
                  <mat-option value="fecha">Fecha</mat-option>
                  <mat-option value="email">Email</mat-option>
                  <mat-option value="telefono">Teléfono</mat-option>
                  <mat-option value="boolean">Sí/No</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Grupo</mat-label>
                <input matInput [(ngModel)]="nuevoCampo.grupo" [ngModelOptions]="{standalone: true}" placeholder="Ej: Información Adicional">
              </mat-form-field>

              <div class="checkbox-field">
                <mat-checkbox [(ngModel)]="nuevoCampo.obligatorio" [ngModelOptions]="{standalone: true}">
                  Campo Obligatorio
                </mat-checkbox>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="cancelarNuevoCampo()" type="button">Cancelar</button>
            <button mat-raised-button color="primary" (click)="agregarCampoPersonalizado()" type="button">
              <mat-icon>check</mat-icon>
              Agregar Campo
            </button>
          </mat-card-actions>
        </mat-card>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="!objetoForm.valid">
        <mat-icon>save</mat-icon>
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px 0;

      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
      }
    }

    mat-dialog-content {
      padding: 24px;
      min-width: 600px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .campos-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 16px 0;

      .full-width {
        grid-column: 1 / -1;
      }
    }

    .checkbox-field {
      padding: 16px 0;
    }

    mat-expansion-panel {
      margin-bottom: 16px;

      mat-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .add-field-section {
      margin-top: 24px;
      text-align: center;
      padding: 16px;
      border: 2px dashed #ddd;
      border-radius: 8px;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .nuevo-campo-card {
      margin-top: 16px;
      background: #f5f5f5;

      .form-grid-nuevo-campo {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class ObjetoTributarioDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private objetosService = inject(ObjetosTributariosService);

  objetoForm!: FormGroup;
  camposBase: CampoDinamico[] = [];
  mostrarNuevoCampo = signal(false);
  camposPorGrupo = signal<{ [grupo: string]: CampoDinamico[] }>({});

  nuevoCampo = {
    nombre: '',
    etiqueta: '',
    tipo: 'texto' as any,
    grupo: 'Personalizado',
    obligatorio: false
  };

  constructor(
    public dialogRef: MatDialogRef<ObjetoTributarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoObjeto: string; fuenteId: number; objeto?: ObjetoTributario }
  ) {}

  ngOnInit() {
    this.camposBase = this.objetosService.obtenerPlantilla(this.data.tipoObjeto);
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const group: any = {
      codigo: ['', Validators.required]
    };

    this.camposBase.forEach(campo => {
      const validators = campo.obligatorio ? [Validators.required] : [];
      if (campo.tipo === 'email') {
        validators.push(Validators.email);
      }
      group[campo.nombre] = [campo.valorPorDefecto || '', validators];
    });

    this.objetoForm = this.fb.group(group);

    if (this.data.objeto) {
      this.objetoForm.patchValue(this.data.objeto.valores);
      this.objetoForm.patchValue({ codigo: this.data.objeto.codigo });
    }

    this.actualizarGrupos();
  }

  actualizarGrupos() {
    this.camposPorGrupo.set(this.objetosService.agruparCampos(this.camposBase));
  }

  gruposOrdenados(): string[] {
    const grupos = Object.keys(this.camposPorGrupo());
    const ordenPreferido = ['Identificación', 'Personal', 'Ubicación', 'Clasificación', 'Características', 'Valoración', 'Medidas', 'Financiero', 'Tributario', 'Legal', 'Contacto', 'Servicio', 'Beneficiarios', 'Cronograma', 'Vigencia'];
    
    return grupos.sort((a, b) => {
      const indexA = ordenPreferido.indexOf(a);
      const indexB = ordenPreferido.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }

  getIconoGrupo(grupo: string): string {
    const iconos: { [key: string]: string } = {
      'Identificación': 'badge',
      'Personal': 'person',
      'Ubicación': 'location_on',
      'Clasificación': 'category',
      'Características': 'widgets',
      'Valoración': 'monetization_on',
      'Medidas': 'straighten',
      'Financiero': 'account_balance',
      'Tributario': 'receipt_long',
      'Legal': 'gavel',
      'Contacto': 'contact_phone',
      'Servicio': 'build',
      'Beneficiarios': 'groups',
      'Cronograma': 'schedule',
      'Vigencia': 'event'
    };
    return iconos[grupo] || 'folder';
  }

  mostrarFormularioCampo() {
    this.mostrarNuevoCampo.set(true);
  }

  agregarCampoPersonalizado() {
    if (!this.nuevoCampo.nombre || !this.nuevoCampo.etiqueta) {
      alert('Complete el nombre y la etiqueta del campo');
      return;
    }

    const campo: CampoDinamico = {
      id: `custom_${Date.now()}`,
      nombre: this.nuevoCampo.nombre,
      etiqueta: this.nuevoCampo.etiqueta,
      tipo: this.nuevoCampo.tipo,
      obligatorio: this.nuevoCampo.obligatorio,
      grupo: this.nuevoCampo.grupo || 'Personalizado',
      orden: this.camposBase.length + 1
    };

    this.camposBase.push(campo);
    
    // Agregar control al formulario
    const validators = campo.obligatorio ? [Validators.required] : [];
    this.objetoForm.addControl(campo.nombre, new FormControl('', validators));

    this.actualizarGrupos();
    this.cancelarNuevoCampo();
  }

  cancelarNuevoCampo() {
    this.mostrarNuevoCampo.set(false);
    this.nuevoCampo = {
      nombre: '',
      etiqueta: '',
      tipo: 'texto',
      grupo: 'Personalizado',
      obligatorio: false
    };
  }

  guardar() {
    if (this.objetoForm.valid) {
      const { codigo, ...valores } = this.objetoForm.value;
      const objeto: ObjetoTributario = {
        id: this.data.objeto?.id,
        fuenteId: this.data.fuenteId,
        tipoObjeto: this.data.tipoObjeto,
        codigo: codigo,
        valores: valores,
        activo: true
      };
      this.dialogRef.close(objeto);
    }
  }
}

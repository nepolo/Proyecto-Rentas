import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametrizacionService } from '../../core/services/parametrizacion.service';
import { Renta } from '../../core/models';

@Component({
  selector: 'app-parametrizacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametrizacion.component.html',
  styleUrl: './parametrizacion.component.scss'
})
export class ParametrizacionComponent implements OnInit {
  rentas: Renta[] = [];
  loading = false;
  showForm = false;
  editMode = false;

  currentRenta: Renta = {
    nombre: '',
    tipo: 'ANUAL',
    periodicidad: 'ANUAL'
  };

  constructor(private parametrizacionService: ParametrizacionService) {}

  ngOnInit(): void {
    this.loadRentas();
  }

  loadRentas(): void {
    this.loading = true;
    this.parametrizacionService.getRentas().subscribe({
      next: (data) => {
        this.rentas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando rentas:', error);
        this.loading = false;
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.currentRenta = {
      nombre: '',
      tipo: 'ANUAL',
      periodicidad: 'ANUAL'
    };
  }

  closeForm(): void {
    this.showForm = false;
    this.currentRenta = {
      nombre: '',
      tipo: 'ANUAL',
      periodicidad: 'ANUAL'
    };
  }

  saveRenta(): void {
    if (!this.currentRenta.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    if (this.editMode && this.currentRenta.id) {
      this.parametrizacionService.updateRenta(this.currentRenta.id, this.currentRenta).subscribe({
        next: () => {
          this.loadRentas();
          this.closeForm();
        },
        error: (error) => console.error('Error actualizando renta:', error)
      });
    } else {
      this.parametrizacionService.createRenta(this.currentRenta).subscribe({
        next: () => {
          this.loadRentas();
          this.closeForm();
        },
        error: (error) => console.error('Error creando renta:', error)
      });
    }
  }

  editRenta(renta: Renta): void {
    this.currentRenta = { ...renta };
    this.editMode = true;
    this.showForm = true;
  }

  deleteRenta(id: number): void {
    if (confirm('¿Está seguro de eliminar esta renta?')) {
      this.parametrizacionService.deleteRenta(id).subscribe({
        next: () => this.loadRentas(),
        error: (error) => console.error('Error eliminando renta:', error)
      });
    }
  }
}

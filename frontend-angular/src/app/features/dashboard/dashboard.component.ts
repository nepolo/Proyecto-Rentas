import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  fuentesRecaudo = signal([
    {
      id: 1,
      nombre: 'Predial Unificado',
      icono: 'home',
      color: '#1976d2',
      objetos: 15234,
      facturado: '$156.0B',
      recaudado: '$128.5B',
      efectividad: 82.4
    },
    {
      id: 2,
      nombre: 'ICA Industrial',
      icono: 'factory',
      color: '#f57c00',
      objetos: 3456,
      facturado: '$89.3B',
      recaudado: '$71.2B',
      efectividad: 79.7
    },
    {
      id: 3,
      nombre: 'ICA Comercial',
      icono: 'storefront',
      color: '#d32f2f',
      objetos: 5678,
      facturado: '$124.5B',
      recaudado: '$102.8B',
      efectividad: 82.6
    },
    {
      id: 4,
      nombre: 'Alumbrado Público',
      icono: 'lightbulb',
      color: '#fbc02d',
      objetos: 23456,
      facturado: '$145.2B',
      recaudado: '$118.4B',
      efectividad: 81.5
    },
    {
      id: 5,
      nombre: 'Valorización',
      icono: 'trending_up',
      color: '#7b1fa2',
      objetos: 1234,
      facturado: '$67.8B',
      recaudado: '$48.6B',
      efectividad: 71.7
    },
    {
      id: 6,
      nombre: 'Espacio Público',
      icono: 'location_city',
      color: '#0288d1',
      objetos: 891,
      facturado: '$30.0B',
      recaudado: '$16.7B',
      efectividad: 55.7
    }
  ]);

  ngOnInit(): void {
    // Datos de ejemplo cargados
  }
}

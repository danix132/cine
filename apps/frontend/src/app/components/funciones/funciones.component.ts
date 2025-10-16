import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { Funcion } from '../../models/funcion.model';

@Component({
  selector: 'app-funciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.scss']
})
export class FuncionesComponent implements OnInit {
  funciones: Funcion[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private funcionesService: FuncionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFunciones();
  }

  loadFunciones(): void {
    this.isLoading = true;
    this.funcionesService.getFuncionesDisponibles().subscribe({
      next: (funciones) => {
        this.funciones = funciones;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las funciones';
        this.isLoading = false;
        console.error('Error loading funciones:', error);
      }
    });
  }

  seleccionarAsientos(funcion: Funcion): void {
    this.router.navigate(['/seleccion-asientos', funcion.id]);
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/default-poster.svg';
    }
  }
}

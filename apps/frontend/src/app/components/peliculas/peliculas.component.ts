import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeliculasService } from '../../services/peliculas.service';
import { Pelicula } from '../../models/pelicula.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.scss']
})
export class PeliculasComponent implements OnInit {
  peliculas: Pelicula[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private peliculasService: PeliculasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPeliculas();
  }

  loadPeliculas(): void {
    this.isLoading = true;
    this.peliculasService.getPeliculasActivas().subscribe({
      next: (peliculas) => {
        this.peliculas = peliculas;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las películas';
        this.isLoading = false;
        console.error('Error loading peliculas:', error);
      }
    });
  }

  verDetalle(pelicula: Pelicula): void {
    this.router.navigate(['/pelicula', pelicula.id]);
  }

  verFunciones(pelicula: Pelicula): void {
    this.router.navigate(['/funciones', pelicula.id]);
  }

  getGenerosString(generos: string[]): string {
    return generos.join(', ');
  }

  getDuracionString(duracionMin: number): string {
    const horas = Math.floor(duracionMin / 60);
    const minutos = duracionMin % 60;
    return `${horas}h ${minutos}m`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/default-poster.svg';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  proximosEstrenos: Pelicula[] = [];
  peliculasCartelera: Pelicula[] = [];
  isLoading = true;
  errorMessage = '';
  peliculaSeleccionada: Pelicula | null = null;
  mostrarModal = false;
  mostrarModalTrailer = false;
  trailerUrl: SafeResourceUrl | null = null;

  constructor(
    private peliculasService: PeliculasService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadPeliculas();
  }

  loadPeliculas(): void {
    this.isLoading = true;
    this.peliculasService.getPeliculasActivas().subscribe({
      next: (peliculas) => {
        // Separar películas en próximos estrenos y en cartelera
        this.proximosEstrenos = peliculas.filter((pelicula: any) => 
          pelicula.esProximoEstreno === true
        );

        // Películas en cartelera: activas, no marcadas como próximo estreno y con funciones
        this.peliculasCartelera = peliculas.filter((pelicula: any) => 
          !pelicula.esProximoEstreno && 
          pelicula.funciones && 
          pelicula.funciones.length > 0
        );

        // Mantener todas las películas para compatibilidad
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

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  verDetalle(pelicula: Pelicula): void {
    console.log('🎬 Método verDetalle llamado');
    console.log('🎬 Película recibida:', pelicula);
    this.peliculaSeleccionada = pelicula;
    this.mostrarModal = true;
    console.log('🎬 peliculaSeleccionada:', this.peliculaSeleccionada);
    console.log('🎬 mostrarModal:', this.mostrarModal);
    
    // Forzar detección de cambios
    setTimeout(() => {
      console.log('🎬 Después de timeout - mostrarModal:', this.mostrarModal);
      console.log('🎬 Después de timeout - peliculaSeleccionada:', this.peliculaSeleccionada);
    }, 100);
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.peliculaSeleccionada 
    = null;
  }

  verTrailer(url: string): void {
    // Convertir la URL de YouTube a formato embed
    let embedUrl = url;
    
    // Si es una URL normal de YouTube, convertirla a formato embed
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    // Sanitizar la URL para uso en iframe
    this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.mostrarModalTrailer = true;
  }

  cerrarModalTrailer(): void {
    this.mostrarModalTrailer = false;
    this.trailerUrl = null;
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

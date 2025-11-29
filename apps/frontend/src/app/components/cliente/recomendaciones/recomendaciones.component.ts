import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RecomendacionesService } from '../../../services/recomendaciones.service';

interface RecomendacionResponse {
  recomendacion: string;
  peliculas: any[];
}

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendaciones.component.html',
  styleUrls: ['./recomendaciones.component.scss']
})
export class RecomendacionesComponent implements OnInit {
  recomendaciones: RecomendacionResponse | null = null;
  cargandoRecomendaciones = false;
  errorRecomendaciones = '';
  trailerUrl: SafeResourceUrl | null = null;
  peliculaActual: any = null;

  constructor(
    private recomendacionesService: RecomendacionesService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarRecomendaciones();
  }

  cargarRecomendaciones(): void {
    this.cargandoRecomendaciones = true;
    this.errorRecomendaciones = '';

    this.recomendacionesService.getRecomendacionesPersonalizadas().subscribe({
      next: (data) => {
        this.recomendaciones = data;
        this.cargandoRecomendaciones = false;
      },
      error: (error) => {
        console.error('Error al cargar recomendaciones:', error);
        this.errorRecomendaciones = error.error?.message || 'Error al cargar recomendaciones';
        this.cargandoRecomendaciones = false;
      }
    });
  }

  verTrailer(url: string, pelicula: any): void {
    if (!url) {
      alert('Esta película no tiene tráiler disponible');
      return;
    }

    // Convertir URL de YouTube a formato embed
    let embedUrl = url;
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    this.peliculaActual = pelicula;
    this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  cerrarTrailer(): void {
    this.trailerUrl = null;
    this.peliculaActual = null;
  }

  verDetallesPelicula(peliculaId: string): void {
    this.router.navigate(['/funciones'], { queryParams: { peliculaId } });
  }

  volver(): void {
    this.router.navigate(['/cliente']);
  }

  irAPerfil(): void {
    this.router.navigate(['/cliente/perfil']);
  }

  irACartelera(): void {
    this.router.navigate(['/peliculas']);
  }
}

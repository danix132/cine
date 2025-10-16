import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
  selector: 'app-cartelera',
  templateUrl: './cartelera.component.html'
})
export class CarteleraComponent implements OnInit {
  peliculas: any[] = [];

  constructor(private peliculasService: PeliculasService) {}

  ngOnInit() {
    this.peliculas = this.peliculasService.getPeliculas();
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  constructor() {}

  getPeliculas() {
    return [
      { titulo: 'Matrix', director: 'Lana Wachowski', anio: 1999 },
      { titulo: 'Inception', director: 'Christopher Nolan', anio: 2010 },
      { titulo: 'Interstellar', director: 'Christopher Nolan', anio: 2014 }
    ];
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pelicula } from '../models/pelicula.model';

export interface RecomendacionResponse {
  recomendacion: string;
  peliculas: Pelicula[];
  tienePeferencias: boolean;
  generosPreferidos?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  private apiUrl = `${environment.apiUrl}/peliculas`;

  constructor(private http: HttpClient) {}

  getRecomendacionesPersonalizadas(): Observable<RecomendacionResponse> {
    return this.http.get<RecomendacionResponse>(`${this.apiUrl}/recomendaciones/personalizadas`);
  }
}

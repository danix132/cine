import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Pelicula, 
  CreatePeliculaRequest, 
  UpdatePeliculaRequest 
} from '../models/pelicula.model';
import { PaginatedResponse, PaginationDto } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  private readonly API_URL = `${environment.apiUrl}/peliculas`;

  constructor(private http: HttpClient) {}

  getPeliculas(params?: PaginationDto): Observable<PaginatedResponse<Pelicula>> {
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResponse<Pelicula>>(this.API_URL, { params: httpParams });
  }

  getPelicula(id: string): Observable<Pelicula> {
    return this.http.get<Pelicula>(`${this.API_URL}/${id}`);
  }

  createPelicula(pelicula: CreatePeliculaRequest): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.API_URL, pelicula);
  }

  updatePelicula(id: string, pelicula: UpdatePeliculaRequest): Observable<Pelicula> {
    return this.http.patch<Pelicula>(`${this.API_URL}/${id}`, pelicula);
  }

  deletePelicula(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getPeliculasActivas(): Observable<Pelicula[]> {
    console.log('Solicitando películas activas (público)');
    return this.http.get<Pelicula[]>(`${this.API_URL}/activas`);
  }

  // Método de prueba para debugging
  testAuthenticatedRequest(): Observable<any> {
    console.log('🧪 Probando petición autenticada a películas');
    const token = localStorage.getItem('token');
    console.log('🧪 Token en localStorage para test:', !!token, token?.substring(0, 20) + '...' || 'No token');
    return this.http.get(`${this.API_URL}`);
  }
  
  // Test específico para salas
  testSalasRequest(): Observable<any> {
    console.log('🧪 Probando petición autenticada a salas');
    const token = localStorage.getItem('token');
    console.log('🧪 Token en localStorage para salas:', !!token, token?.substring(0, 20) + '...' || 'No token');
    return this.http.get(`${environment.apiUrl}/salas`);
  }
}

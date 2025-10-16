import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Sala, 
  CreateSalaRequest, 
  UpdateSalaRequest,
  UpdateAsientosDanadosRequest 
} from '../models/sala.model';
import { PaginatedResponse, PaginationDto } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class SalasService {
  private readonly API_URL = `${environment.apiUrl}/salas`;

  constructor(private http: HttpClient) {}

  getSalas(params?: PaginationDto): Observable<PaginatedResponse<Sala>> {
    console.log('🏢 SalasService - Obteniendo salas con params:', params);
    
    // Debug del token antes de la petición (solo en navegador)
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('🏢 Estado de autenticación para salas:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        hasUser: !!user,
        tokenStart: token?.substring(0, 20) + '...' || 'No token'
      });
    } else {
      console.log('🏢 SSR - No localStorage disponible');
    }
    
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResponse<Sala>>(this.API_URL, { params: httpParams });
  }

  getSala(id: string): Observable<Sala> {
    return this.http.get<Sala>(`${this.API_URL}/${id}`);
  }

  createSala(sala: CreateSalaRequest): Observable<Sala> {
    return this.http.post<Sala>(this.API_URL, sala);
  }

  updateSala(id: string, sala: UpdateSalaRequest): Observable<Sala> {
    console.log('🔄 SalasService - Actualizando sala:', { id, sala });
    console.log('🔄 URL de actualización:', `${this.API_URL}/${id}`);
    console.log('🔄 Tipos de datos en el servicio:', {
      nombre: typeof sala.nombre,
      filas: typeof sala.filas,
      asientosPorFila: typeof sala.asientosPorFila,
      filasValue: sala.filas,
      asientosPorFilaValue: sala.asientosPorFila
    });
    console.log('🔄 JSON.stringify del objeto:', JSON.stringify(sala));
    return this.http.patch<Sala>(`${this.API_URL}/${id}`, sala);
  }

  deleteSala(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateAsientosDanados(salaId: string, asientosDanados: UpdateAsientosDanadosRequest): Observable<Sala> {
    return this.http.patch<Sala>(`${this.API_URL}/${salaId}/asientos-danados`, asientosDanados);
  }

  getAsientosDisponibles(salaId: string, funcionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${salaId}/asientos-disponibles/${funcionId}`);
  }
}

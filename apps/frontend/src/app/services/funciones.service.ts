import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Funcion, 
  CreateFuncionRequest, 
  UpdateFuncionRequest 
} from '../models/funcion.model';
import { PaginatedResponse, PaginationDto } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  private readonly API_URL = `${environment.apiUrl}/funciones`;

  constructor(private http: HttpClient) {}

  getFunciones(params?: any): Observable<PaginatedResponse<Funcion>> {
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.peliculaId) httpParams = httpParams.set('peliculaId', params.peliculaId);
    if (params?.salaId) httpParams = httpParams.set('salaId', params.salaId);
    if (params?.desde) httpParams = httpParams.set('desde', params.desde);
    if (params?.hasta) httpParams = httpParams.set('hasta', params.hasta);
    if (params?.cancelada !== undefined) httpParams = httpParams.set('cancelada', params.cancelada.toString());

    return this.http.get<PaginatedResponse<Funcion>>(this.API_URL, { params: httpParams });
  }

  getFuncion(id: string): Observable<Funcion> {
    return this.http.get<Funcion>(`${this.API_URL}/${id}`);
  }

  createFuncion(funcion: CreateFuncionRequest): Observable<Funcion> {
    return this.http.post<Funcion>(this.API_URL, funcion);
  }

  updateFuncion(id: string, funcion: UpdateFuncionRequest): Observable<Funcion> {
    return this.http.patch<Funcion>(`${this.API_URL}/${id}`, funcion);
  }

  deleteFuncion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getFuncionesPorPelicula(peliculaId: string): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${this.API_URL}/pelicula/${peliculaId}`);
  }

  getFuncionesPorSala(salaId: string): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${this.API_URL}/sala/${salaId}`);
  }

  getFuncionesDisponibles(): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${this.API_URL}/disponibles`);
  }

  debugConflictos(funcion: CreateFuncionRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/debug`, funcion);
  }

  cancelarFuncion(id: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/cancelar`, {});
  }

  reactivarFuncion(id: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/reactivar`, {});
  }
}

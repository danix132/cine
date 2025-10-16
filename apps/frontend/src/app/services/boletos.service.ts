import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Boleto, 
  CreateBoletoRequest, 
  UpdateBoletoRequest 
} from '../models/boleto.model';
import { PaginatedResponse, PaginationDto } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class BoletosService {
  private readonly API_URL = `${environment.apiUrl}/boletos`;

  constructor(private http: HttpClient) {}

  getBoletos(params?: PaginationDto): Observable<PaginatedResponse<Boleto>> {
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResponse<Boleto>>(this.API_URL, { params: httpParams });
  }

  getBoleto(id: string): Observable<Boleto> {
    return this.http.get<Boleto>(`${this.API_URL}/${id}`);
  }

  createBoleto(boleto: CreateBoletoRequest): Observable<Boleto> {
    return this.http.post<Boleto>(this.API_URL, boleto);
  }

  updateBoleto(id: string, boleto: UpdateBoletoRequest): Observable<Boleto> {
    return this.http.patch<Boleto>(`${this.API_URL}/${id}`, boleto);
  }

  deleteBoleto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getBoletosPorUsuario(usuarioId: string): Observable<Boleto[]> {
    return this.http.get<Boleto[]>(`${this.API_URL}/usuario/${usuarioId}`);
  }

  getBoletosPorFuncion(funcionId: string): Observable<Boleto[]> {
    return this.http.get<Boleto[]>(`${this.API_URL}/funcion/${funcionId}`);
  }

  validarBoleto(codigoQR: string): Observable<Boleto> {
    return this.http.get<Boleto>(`${this.API_URL}/validar/${codigoQR}`);
  }

  pagarBoleto(id: string): Observable<Boleto> {
    return this.http.patch<Boleto>(`${this.API_URL}/${id}/pagar`, {});
  }

  cancelarBoleto(id: string): Observable<Boleto> {
    return this.http.patch<Boleto>(`${this.API_URL}/${id}/cancelar`, {});
  }

  // Crear múltiples boletos a la vez (compra de cliente)
  crearBoletosCompra(data: {
    funcionId: string;
    asientoIds: string[];
    usuarioId?: string;
  }): Observable<Boleto[]> {
    return this.http.post<Boleto[]>(`${this.API_URL}/compra`, data);
  }

  // Obtener todos los boletos (para admin)
  obtenerTodos(): Observable<Boleto[]> {
    return this.http.get<Boleto[]>(this.API_URL);
  }
}

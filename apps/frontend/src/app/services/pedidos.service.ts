import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Pedido, 
  CreatePedidoRequest, 
  UpdatePedidoRequest 
} from '../models/pedido.model';
import { PaginatedResponse, PaginationDto } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private readonly API_URL = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  getPedidos(params?: PaginationDto): Observable<PaginatedResponse<Pedido>> {
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResponse<Pedido>>(this.API_URL, { params: httpParams });
  }

  getPedido(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.API_URL}/${id}`);
  }

  createPedido(pedido: CreatePedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.API_URL, pedido);
  }

  updatePedido(id: string, pedido: UpdatePedidoRequest): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.API_URL}/${id}`, pedido);
  }

  deletePedido(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getPedidosPorUsuario(usuarioId: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API_URL}/usuario/${usuarioId}`);
  }

  getMisPedidos(usuarioId: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API_URL}/mios?usuarioId=${usuarioId}`);
  }

  getPedidosPorVendedor(vendedorId: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.API_URL}/vendedor/${vendedorId}`);
  }

  procesarPedidoDesdeCarrito(carritoId: string): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.API_URL}/procesar-carrito/${carritoId}`, {});
  }
}

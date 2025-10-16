import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Carrito, 
  CreateCarritoRequest, 
  AddItemRequest, 
  UpdateItemRequest 
} from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritosService {
  private readonly API_URL = `${environment.apiUrl}/carritos`;

  constructor(private http: HttpClient) {}

  createCarrito(carrito: CreateCarritoRequest): Observable<Carrito> {
    return this.http.post<Carrito>(this.API_URL, carrito);
  }

  getCarrito(id: string): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.API_URL}/${id}`);
  }

  addItem(carritoId: string, item: AddItemRequest): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.API_URL}/${carritoId}/items`, item);
  }

  updateItem(carritoId: string, itemId: string, item: UpdateItemRequest): Observable<Carrito> {
    return this.http.patch<Carrito>(`${this.API_URL}/${carritoId}/items/${itemId}`, item);
  }

  removeItem(carritoId: string, itemId: string): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.API_URL}/${carritoId}/items/${itemId}`);
  }

  clearCarrito(carritoId: string): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.API_URL}/${carritoId}/items`);
  }

  getCarritoActivo(usuarioId?: string): Observable<Carrito | null> {
    let httpParams = new HttpParams();
    if (usuarioId) {
      httpParams = httpParams.set('usuarioId', usuarioId);
    }
    return this.http.get<Carrito | null>(`${this.API_URL}/activo`, { params: httpParams });
  }

  calcularTotal(carritoId: string): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.API_URL}/${carritoId}/total`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  DulceriaItem, 
  CreateDulceriaItemRequest, 
  UpdateDulceriaItemRequest,
  InventarioMov 
} from '../models/dulceria.model';
import { PaginatedResponse, PaginationDto } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class DulceriaService {
  private readonly API_URL = `${environment.apiUrl}/dulceria`;

  constructor(private http: HttpClient) {}

  getItems(params?: PaginationDto): Observable<PaginatedResponse<DulceriaItem>> {
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResponse<DulceriaItem>>(this.API_URL, { params: httpParams });
  }

  getItem(id: string): Observable<DulceriaItem> {
    return this.http.get<DulceriaItem>(`${this.API_URL}/${id}`);
  }

  createItem(item: CreateDulceriaItemRequest): Observable<DulceriaItem> {
    return this.http.post<DulceriaItem>(this.API_URL, item);
  }

  updateItem(id: string, item: UpdateDulceriaItemRequest): Observable<DulceriaItem> {
    return this.http.patch<DulceriaItem>(`${this.API_URL}/${id}`, item);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getItemsActivos(): Observable<DulceriaItem[]> {
    return this.http.get<DulceriaItem[]>(`${this.API_URL}/activos`);
  }

  getMovimientosInventario(itemId: string): Observable<InventarioMov[]> {
    return this.http.get<InventarioMov[]>(`${this.API_URL}/${itemId}/movimientos`);
  }

  ajustarInventario(itemId: string, delta: number, motivo: string): Observable<InventarioMov> {
    return this.http.post<InventarioMov>(`${this.API_URL}/${itemId}/ajustar`, {
      delta,
      motivo
    });
  }

  procesarVenta(items: { dulceriaItemId: string; cantidad: number }[]): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/venta`, { items });
  }
}

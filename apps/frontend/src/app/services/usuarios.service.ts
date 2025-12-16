import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/common.model';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
  createdAt: string;
  updatedAt: string;
  _count?: {
    boletos: number;
    carritos: number;
    pedidos: number;
  };
}

export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
}

export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios con paginación y filtros
  getUsuarios(params: {
    page?: number;
    limit?: number;
    search?: string;
    rol?: string;
  } = {}): Observable<PaginatedResponse<Usuario>> {
    let httpParams = new HttpParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Usuario>>(this.apiUrl, { params: httpParams });
  }

  // Obtener usuario por ID
  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Crear nuevo usuario
  createUsuario(usuario: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // Actualizar usuario
  updateUsuario(id: string, usuario: UpdateUsuarioDto): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // Eliminar usuario (solo admin)
  deleteUsuario(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Cambiar mi contraseña
  changeMyPassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/me/change-password`, {
      currentPassword,
      newPassword
    });
  }

  // Eliminar mi propia cuenta
  deleteMyAccount(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/me/delete-account`);
  }

  // Actualizar mis preferencias de géneros
  updateMyPreferencias(generosPreferidos: string): Observable<{ message: string; generosPreferidos: string }> {
    return this.http.patch<{ message: string; generosPreferidos: string }>(
      `${this.apiUrl}/me/preferencias`,
      { generosPreferidos }
    );
  }
}
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  console.log('Interceptor activado para URL:', req.url);
  
  // No interceptar peticiones de login/register
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    console.log('Saltando interceptor para:', req.url);
    return next(req);
  }
  
  const token = authService.getToken();
  const user = authService.getCurrentUser();
  
  console.log('Estado de autenticación en interceptor:', {
    hasToken: !!token,
    hasUser: !!user,
    tokenLength: token?.length || 0,
    userRole: user?.rol || 'No role',
    url: req.url
  });
  
  if (token) {
    console.log('✅ Enviando token para', req.url + ':', token.substring(0, 20) + '...');
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq).pipe(
      catchError(error => {
        console.log('Error en petición HTTP:', {
          status: error.status,
          url: req.url,
          message: error.error?.message,
          error: error.error
        });
        
        // Solo cerrar sesión en casos muy específicos de autenticación
        if (error.status === 401) {
          const errorMessage = error.error?.message || '';
          const isAuthRoute = req.url.includes('/auth/');
          
          // Solo cerrar sesión si:
          // 1. No es una ruta de auth
          // 2. El mensaje indica claramente problema de token
          // 3. Realmente tenemos un token que se considera inválido
          const hasToken = !!token;
          const isTokenError = (
            errorMessage.includes('Token inválido') || 
            errorMessage.includes('Token expirado') ||
            errorMessage.includes('token expirado') ||
            errorMessage.includes('token invalid') ||
            errorMessage.includes('JWT') ||
            errorMessage.includes('jwt')
          ) && hasToken;
          
          if (isTokenError && !isAuthRoute) {
            console.log('🚨 Token realmente inválido, cerrando sesión:', errorMessage);
            console.log('Detalles del error:', {
              hasToken,
              errorMessage,
              url: req.url
            });
            authService.logout();
            router.navigate(['/login']);
          } else {
            console.log('⚠️ Error 401 pero no cerrar sesión:', {
              isAuthRoute,
              hasToken,
              errorMessage,
              url: req.url
            });
          }
        }
        return throwError(() => error);
      })
    );
  } else {
    console.log('No hay token disponible');
  }
  
  return next(req);
};

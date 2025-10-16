import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PeliculasService } from '../../services/peliculas.service';
import { SalasService } from '../../services/salas.service';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: monospace;">
      <h2>🔧 Debug de Autenticación</h2>
      
      <div style="margin-bottom: 20px;">
        <h3>Estado Actual</h3>
        <div>Token: {{ getTokenStatus() }}</div>
        <div>Usuario: {{ getUserStatus() }}</div>
        <div>Autenticado: {{ authService.isAuthenticated() }}</div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3>Acciones de Test</h3>
        <button (click)="testLogin()" style="margin-right: 10px; padding: 10px;">
          🔑 Test Login
        </button>
        <button (click)="testPeliculas()" style="margin-right: 10px; padding: 10px;">
          🎬 Test Películas
        </button>
        <button (click)="testSalas()" style="margin-right: 10px; padding: 10px;">
          🏢 Test Salas
        </button>
        <button (click)="clearStorage()" style="margin-right: 10px; padding: 10px;">
          🗑️ Limpiar Storage
        </button>
      </div>

      <div style="margin-bottom: 20px;">
        <h3>Logs</h3>
        <div style="background: #f0f0f0; padding: 10px; height: 300px; overflow-y: scroll;">
          <div *ngFor="let log of logs" [innerHTML]="log"></div>
        </div>
      </div>
    </div>
  `
})
export class DebugComponent {
  logs: string[] = [];

  constructor(
    public authService: AuthService,
    private peliculasService: PeliculasService,
    private salasService: SalasService
  ) {}

  log(message: string, data?: any) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}`;
    this.logs.push(logEntry);
    console.log(message, data);
  }

  getTokenStatus(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      return token ? `${token.length} chars (${token.substring(0, 20)}...)` : 'No token';
    }
    return 'SSR - No localStorage';
  }

  getUserStatus(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          return `${parsedUser.email} (${parsedUser.rol})`;
        } catch {
          return 'Usuario corrupto';
        }
      }
      return 'No usuario';
    }
    return 'SSR - No localStorage';
  }

  testLogin() {
    this.log('🔑 Iniciando test de login...');
    
    const loginData = {
      email: 'admin@cine.com',
      password: 'Admin123'
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.log('✅ Login exitoso', response);
        
        // Verificar inmediatamente
        setTimeout(() => {
          const token = localStorage.getItem('token');
          const user = localStorage.getItem('user');
          this.log('📊 Estado post-login', {
            hasToken: !!token,
            hasUser: !!user,
            tokenLength: token?.length,
            isAuthenticated: this.authService.isAuthenticated()
          });
        }, 100);
      },
      error: (error) => {
        this.log('❌ Error en login', error);
      }
    });
  }

  testPeliculas() {
    this.log('🎬 Probando petición a películas...');
    
    this.peliculasService.testAuthenticatedRequest().subscribe({
      next: (response) => {
        this.log('✅ Películas OK', response);
      },
      error: (error) => {
        this.log('❌ Error películas', error);
      }
    });
  }

  testSalas() {
    this.log('🏢 Probando petición a salas...');
    
    this.salasService.getSalas().subscribe({
      next: (response) => {
        this.log('✅ Salas OK', response);
      },
      error: (error) => {
        this.log('❌ Error salas', error);
      }
    });
  }

  clearStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      this.log('🗑️ Storage limpiado');
    } else {
      this.log('⚠️ No se puede limpiar storage en SSR');
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = this.loginForm.value;
      console.log('📋 Formulario de login enviado:', { email: loginData.email });
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso, respuesta:', response);
          this.isLoading = false;
          
          // Verificar inmediatamente el estado después del login
          setTimeout(() => {
            const token = this.authService.getToken();
            const user = this.authService.getCurrentUser();
            const isAuth = this.authService.isAuthenticated();
            
            console.log('🔍 Estado post-login:', {
              hasToken: !!token,
              hasUser: !!user,
              isAuthenticated: isAuth,
              userRole: user?.rol
            });
            
            // Redirigir según el rol del usuario
            this.redirectByRole(response.user.rol);
          }, 100);
        },
        error: (error) => {
          console.error('❌ Error en login:', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        }
      });
    }
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'VENDEDOR':
        this.router.navigate(['/vendedor']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/cliente']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'CiMeme';
  currentUser: User | null = null;
  menuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isVendedor(): boolean {
    return this.authService.isVendedor();
  }

  isCliente(): boolean {
    return this.authService.isCliente();
  }

  navigateToAdminPanel(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.isVendedor()) {
      this.router.navigate(['/reportes']);
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  onLogoClick(): void {
    // Solo redirigir en móvil (< 992px)
    if (window.innerWidth < 992 && this.isAuthenticated() && this.isCliente()) {
      this.router.navigate(['/cliente']);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ReportesService, ReporteDashboardKPIs } from '../../services/reportes.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  reporteDashboard: ReporteDashboardKPIs | null = null;
  cargandoDashboard = false;
  mostrarDashboard = false;

  constructor(
    private reportesService: ReportesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar la ruta actual
    this.verificarRuta(this.router.url);

    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.verificarRuta(event.url);
    });
  }

  verificarRuta(url: string): void {
    // Mostrar dashboard solo si estamos exactamente en /admin
    this.mostrarDashboard = url === '/admin' || url === '/admin/';
    
    if (this.mostrarDashboard && !this.reporteDashboard) {
      this.cargarDashboard();
    }
  }

  cargarDashboard(): void {
    this.cargandoDashboard = true;
    
    // Obtener fechas del último mes
    const hasta = new Date();
    const desde = new Date();
    desde.setMonth(desde.getMonth() - 1);

    const desdeStr = desde.toISOString().split('T')[0];
    const hastaStr = hasta.toISOString().split('T')[0];

    this.reportesService.getReporteDashboardKPIs(desdeStr, hastaStr).subscribe({
      next: (data) => {
        this.reporteDashboard = data;
        this.cargandoDashboard = false;
      },
      error: (error) => {
        console.error('Error al cargar dashboard:', error);
        this.cargandoDashboard = false;
      }
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU'
    }).format(valor);
  }
}

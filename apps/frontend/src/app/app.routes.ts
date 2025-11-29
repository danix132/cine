import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/peliculas',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'peliculas',
    loadComponent: () => import('./components/peliculas/peliculas.component').then(m => m.PeliculasComponent)
  },
  {
    path: 'funciones',
    loadComponent: () => import('./components/funciones/funciones.component').then(m => m.FuncionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'funciones/:peliculaId',
    loadComponent: () => import('./components/funciones/funciones.component').then(m => m.FuncionesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'seleccion-asientos/:funcionId',
    loadComponent: () => import('./components/seleccion-asientos/seleccion-asientos.component').then(m => m.SeleccionAsientosComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'carrito',
    loadComponent: () => import('./components/carrito/carrito.component').then(m => m.CarritoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'peliculas',
        loadComponent: () => import('./components/admin/peliculas/admin-peliculas.component').then(m => m.AdminPeliculasComponent)
      },
      {
        path: 'funciones',
        loadComponent: () => import('./components/admin/funciones/admin-funciones.component').then(m => m.AdminFuncionesComponent)
      },
      {
        path: 'salas',
        loadComponent: () => import('./components/admin/salas/admin-salas.component').then(m => m.AdminSalasComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/admin/usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent)
      },
      {
        path: 'boletos',
        loadComponent: () => import('./components/admin/boletos/admin-boletos.component').then(m => m.AdminBoletosComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./components/admin/reportes/admin-reportes.component').then(m => m.AdminReportesComponent)
      },
      {
        path: 'reportes/boletos',
        loadComponent: () => import('./components/admin/reportes/reporte-boletos/reporte-boletos.component').then(m => m.ReporteBoletosComponent)
      },
      {
        path: 'reportes/dulceria',
        loadComponent: () => import('./components/admin/reportes/reporte-dulceria/reporte-dulceria.component').then(m => m.ReporteDulceriaComponent)
      },
      {
        path: 'dulceria',
        loadComponent: () => import('./components/admin/dulceria/admin-dulceria.component').then(m => m.AdminDulceriaComponent)
      }
    ]
  },
  // Ruta directa para reportes (accesible por vendedores)
  {
    path: 'reportes',
    loadComponent: () => import('./components/admin/reportes/admin-reportes.component').then(m => m.AdminReportesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR', 'ADMIN'] }
  },
  {
    path: 'vendedor',
    loadComponent: () => import('./components/vendedor/vendedor.component').then(m => m.VendedorComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR', 'ADMIN'] }
  },
  {
    path: 'vendedor/boletos',
    loadComponent: () => import('./components/vendedor/vender-boletos/vender-boletos.component').then(m => m.VenderBoletosComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR', 'ADMIN'] }
  },
  {
    path: 'dulceria',
    loadComponent: () => import('./components/dulceria/dulceria.component').then(m => m.DulceriaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vendedor/dulceria',
    loadComponent: () => import('./components/vendedor/vender-dulceria/vender-dulceria.component').then(m => m.VenderDulceriaComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR', 'ADMIN'] }
  },
  {
    path: 'vendedor/mis-ventas',
    loadComponent: () => import('./pages/mis-ventas/mis-ventas.component').then(m => m.MisVentasComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR', 'ADMIN'] }
  },
  {
    path: 'vendedor/validar',
    loadComponent: () => import('./components/vendedor/validar-boletos/validar-boletos.component').then(m => m.ValidarBoletosComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR', 'ADMIN'] }
  },
  {
    path: 'vendedor/validar-dulceria',
    loadComponent: () => import('./components/vendedor/validar-dulceria/validar-dulceria.component').then(m => m.ValidarDulceriaComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['VENDEDOR', 'ADMIN'] }
  },
  {
    path: 'cliente',
    loadComponent: () => import('./components/cliente/cliente.component').then(m => m.ClienteComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },
  {
    path: 'cliente/historial',
    loadComponent: () => import('./components/cliente/historial-compras/historial-compras.component').then(m => m.HistorialComprasComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },
  {
    path: 'cliente/perfil',
    loadComponent: () => import('./components/cliente/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },
  {
    path: 'cliente/recomendaciones',
    loadComponent: () => import('./components/cliente/recomendaciones/recomendaciones.component').then(m => m.RecomendacionesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'debug',
    loadComponent: () => import('./components/debug/debug.component').then(m => m.DebugComponent)
  },
  {
    path: '**',
    redirectTo: '/peliculas'
  }
];

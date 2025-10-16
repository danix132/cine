"use strict";
exports.__esModule = true;
exports.routes = void 0;
var auth_guard_1 = require("./guards/auth.guard");
var role_guard_1 = require("./guards/role.guard");
exports.routes = [
    {
        path: '',
        redirectTo: '/peliculas',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/login/login.component'); }).then(function (m) { return m.LoginComponent; }); }
    },
    {
        path: 'register',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/register/register.component'); }).then(function (m) { return m.RegisterComponent; }); }
    },
    {
        path: 'peliculas',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/peliculas/peliculas.component'); }).then(function (m) { return m.PeliculasComponent; }); }
    },
    {
        path: 'funciones',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/funciones/funciones.component'); }).then(function (m) { return m.FuncionesComponent; }); },
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'seleccion-asientos/:funcionId',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/seleccion-asientos/seleccion-asientos.component'); }).then(function (m) { return m.SeleccionAsientosComponent; }); },
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'dulceria',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/dulceria/dulceria.component'); }).then(function (m) { return m.DulceriaComponent; }); }
    },
    {
        path: 'carrito',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/carrito/carrito.component'); }).then(function (m) { return m.CarritoComponent; }); },
        canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'admin',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/admin.component'); }).then(function (m) { return m.AdminComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            {
                path: 'peliculas',
                loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/peliculas/admin-peliculas.component'); }).then(function (m) { return m.AdminPeliculasComponent; }); }
            },
            {
                path: 'funciones',
                loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/funciones/admin-funciones.component'); }).then(function (m) { return m.AdminFuncionesComponent; }); }
            },
            {
                path: 'salas',
                loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/salas/admin-salas.component'); }).then(function (m) { return m.AdminSalasComponent; }); }
            },
            {
                path: 'usuarios',
                loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/usuarios/admin-usuarios.component'); }).then(function (m) { return m.AdminUsuariosComponent; }); }
            },
            {
                path: 'reportes',
                loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/reportes/admin-reportes.component'); }).then(function (m) { return m.AdminReportesComponent; }); }
            },
            {
                path: 'dulceria',
                loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/dulceria/admin-dulceria.component'); }).then(function (m) { return m.AdminDulceriaComponent; }); }
            }
        ]
    },
    // Ruta directa para reportes (accesible por vendedores)
    {
        path: 'reportes',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/admin/reportes/admin-reportes.component'); }).then(function (m) { return m.AdminReportesComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['VENDEDOR', 'ADMIN'] }
    },
    {
        path: 'vendedor',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/vendedor/vendedor.component'); }).then(function (m) { return m.VendedorComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['VENDEDOR', 'ADMIN'] }
    },
    {
        path: 'vendedor/boletos',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/vendedor/vender-boletos/vender-boletos.component'); }).then(function (m) { return m.VenderBoletosComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['VENDEDOR', 'ADMIN'] }
    },
    {
        path: 'vendedor/dulceria',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/vendedor/vender-dulceria/vender-dulceria.component'); }).then(function (m) { return m.VenderDulceriaComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['VENDEDOR', 'ADMIN'] }
    },
    {
        path: 'vendedor/mis-ventas',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./pages/mis-ventas/mis-ventas.component'); }).then(function (m) { return m.MisVentasComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['VENDEDOR', 'ADMIN'] }
    },
    {
        path: 'vendedor/validar',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/vendedor/validar-boletos/validar-boletos.component'); }).then(function (m) { return m.ValidarBoletosComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['VENDEDOR', 'ADMIN'] }
    },
    {
        path: 'cliente',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/cliente/cliente.component'); }).then(function (m) { return m.ClienteComponent; }); },
        canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard],
        data: { roles: ['CLIENTE', 'ADMIN'] }
    },
    {
        path: 'unauthorized',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/unauthorized/unauthorized.component'); }).then(function (m) { return m.UnauthorizedComponent; }); }
    },
    {
        path: 'debug',
        loadComponent: function () { return Promise.resolve().then(function () { return require('./components/debug/debug.component'); }).then(function (m) { return m.DebugComponent; }); }
    },
    {
        path: '**',
        redirectTo: '/peliculas'
    }
];

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminFuncionesComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var AdminFuncionesComponent = /** @class */ (function () {
    function AdminFuncionesComponent(funcionesService, peliculasService, salasService, fb) {
        this.funcionesService = funcionesService;
        this.peliculasService = peliculasService;
        this.salasService = salasService;
        this.fb = fb;
        this.funcionesPaginadas = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1
        };
        this.peliculas = [];
        this.salas = [];
        this.funcionSeleccionada = null;
        this.loading = false;
        this.guardando = false;
        this.modoEdicion = false;
        // Control de modales
        this.mostrarModalFuncion = false;
        this.mostrarModalDetalles = false;
        // Filtros
        this.filtroFecha = '';
        this.filtroPeliculaId = '';
        this.filtroSalaId = '';
        // Modo offline para desarrollo
        this.modoOffline = false;
        // Paginación
        this.paginaActual = 1;
        this.itemsPorPagina = 10;
        this.funcionForm = this.fb.group({
            pelicula_id: ['', [forms_1.Validators.required]],
            sala_id: ['', [forms_1.Validators.required]],
            fecha: ['', [forms_1.Validators.required]],
            hora: ['', [forms_1.Validators.required]],
            precio: ['', [forms_1.Validators.required, forms_1.Validators.min(0.01)]],
            estado: ['ACTIVA']
        });
    }
    AdminFuncionesComponent.prototype.ngOnInit = function () {
        this.cargarDatos();
    };
    AdminFuncionesComponent.prototype.cargarDatos = function () {
        console.log('🔄 Iniciando carga de datos...');
        this.verificarConectividad();
    };
    AdminFuncionesComponent.prototype.verificarConectividad = function () {
        var _this = this;
        console.log('🔍 Verificando conectividad con el backend...');
        // Try a simple health check first
        this.funcionesService.getFunciones({ page: 1, limit: 1 }).subscribe({
            next: function (response) {
                console.log('✅ Backend conectado correctamente');
                _this.cargarFunciones();
                _this.cargarPeliculas();
                _this.cargarSalas();
            },
            error: function (error) {
                console.error('❌ Error de conectividad:', error);
                _this.loading = false;
                var errorMsg = '❌ No se puede conectar al servidor backend.\n\n';
                if (error.status === 0) {
                    errorMsg += 'Posibles causas:\n';
                    errorMsg += '• El servidor backend no está ejecutándose\n';
                    errorMsg += '• Problemas de red o CORS\n';
                    errorMsg += '• Puerto 3000 bloqueado\n\n';
                    errorMsg += 'Soluciones:\n';
                    errorMsg += '• Ejecuta "npm run start:dev" en el backend\n';
                    errorMsg += '• Verifica que el puerto 3000 esté disponible';
                }
                else if (error.status === 404) {
                    errorMsg += 'El endpoint /api/funciones no existe';
                }
                else if (error.status >= 500) {
                    errorMsg += 'Error interno del servidor';
                }
                // Ask user if they want to continue in offline mode
                var continuar = confirm(errorMsg + '\n\n¿Deseas continuar en modo demo sin backend?');
                if (continuar) {
                    _this.activarModoOffline();
                }
            }
        });
    };
    AdminFuncionesComponent.prototype.activarModoOffline = function () {
        this.modoOffline = true;
        console.log('🔄 Activando modo offline/demo');
        // Set demo data
        this.funcionesPaginadas = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        };
        this.peliculas = [
            { id: '1', titulo: 'Película Demo 1', estado: 'ACTIVA' },
            { id: '2', titulo: 'Película Demo 2', estado: 'ACTIVA' }
        ];
        this.salas = [
            { id: '1', nombre: 'Sala 1', filas: 10, asientosPorFila: 15, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: '2', nombre: 'Sala 2', filas: 8, asientosPorFila: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        this.loading = false;
        alert('✅ Modo demo activado. Los filtros funcionarán pero no hay datos del servidor.');
    };
    AdminFuncionesComponent.prototype.mostrarAyudaConexion = function () {
        var mensaje = "\uD83D\uDD27 AYUDA DE CONEXI\u00D3N AL BACKEND\n\n\uD83D\uDCCD Estado actual:\n" + (this.modoOffline ? '🔴 Modo offline/demo activo' : '🟡 Intentando conectar...') + "\n\n\uD83D\uDE80 Pasos para iniciar el servidor backend:\n\n1\uFE0F\u20E3 Abrir terminal en el backend:\n   cd C:\\Users\\AdminORT\\cine-app\\apps\\backend\n\n2\uFE0F\u20E3 Instalar dependencias (si es necesario):\n   npm install\n\n3\uFE0F\u20E3 Configurar base de datos:\n   npm run db:generate\n   npm run db:push\n\n4\uFE0F\u20E3 Iniciar servidor:\n   npm run start:dev\n\n5\uFE0F\u20E3 Verificar que est\u00E9 ejecut\u00E1ndose:\n   \u2705 Debe mostrar: \"Application is running on: http://localhost:3000\"\n   \u2705 En el navegador: http://localhost:3000/api\n\n\uD83D\uDCA1 Problemas comunes:\n\u2022 Puerto 3000 ocupado \u2192 Cambiar puerto o cerrar proceso\n\u2022 Falta Prisma \u2192 Ejecutar: npm run db:generate\n\u2022 Error de permisos \u2192 Ejecutar terminal como admin\n\n\uD83D\uDD04 Una vez iniciado, recarga esta p\u00E1gina";
        alert(mensaje);
    };
    AdminFuncionesComponent.prototype.cargarFunciones = function () {
        var _this = this;
        this.loading = true;
        // First, try to load all functions without filters
        var basicParams = {
            page: this.paginaActual,
            limit: this.itemsPorPagina
        };
        console.log('Cargando funciones con parámetros básicos:', basicParams);
        this.funcionesService.getFunciones(basicParams).subscribe({
            next: function (response) {
                console.log('Respuesta del servidor:', response);
                // Apply client-side filtering if needed
                var funcionesFiltradas = response.data || [];
                // Filter by date
                if (_this.filtroFecha) {
                    funcionesFiltradas = funcionesFiltradas.filter(function (funcion) {
                        var fechaFuncion = new Date(funcion.inicio).toISOString().split('T')[0];
                        return fechaFuncion === _this.filtroFecha;
                    });
                }
                // Filter by movie
                if (_this.filtroPeliculaId && _this.filtroPeliculaId !== '') {
                    funcionesFiltradas = funcionesFiltradas.filter(function (funcion) {
                        return funcion.peliculaId === _this.filtroPeliculaId;
                    });
                }
                // Filter by room
                if (_this.filtroSalaId && _this.filtroSalaId !== '') {
                    funcionesFiltradas = funcionesFiltradas.filter(function (funcion) {
                        return funcion.salaId === _this.filtroSalaId;
                    });
                }
                // Update the response with filtered data
                _this.funcionesPaginadas = __assign(__assign({}, response), { data: funcionesFiltradas, total: funcionesFiltradas.length });
                _this.loading = false;
                console.log('Funciones filtradas:', _this.funcionesPaginadas);
            },
            error: function (error) {
                var _a;
                console.error('Error detallado al cargar funciones:', error);
                _this.loading = false;
                // Show more specific error message
                var errorMessage = 'Error al cargar las funciones';
                if (error.status === 0) {
                    errorMessage = 'Error de conexión: Verifica que el servidor backend esté ejecutándose en http://localhost:3000';
                }
                else if (error.status === 404) {
                    errorMessage = 'Error 404: Endpoint no encontrado';
                }
                else if (error.status === 500) {
                    errorMessage = 'Error del servidor interno';
                }
                else if ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) {
                    errorMessage = "Error: " + error.error.message;
                }
                alert(errorMessage);
            }
        });
    };
    AdminFuncionesComponent.prototype.cargarPeliculas = function () {
        var _this = this;
        this.peliculasService.getPeliculas({ page: 1, limit: 1000 }).subscribe({
            next: function (response) {
                _this.peliculas = response.data.filter(function (p) { return p.estado === 'ACTIVA'; });
            },
            error: function (error) {
                console.error('Error al cargar películas:', error);
            }
        });
    };
    AdminFuncionesComponent.prototype.cargarSalas = function () {
        var _this = this;
        this.salasService.getSalas({ page: 1, limit: 1000 }).subscribe({
            next: function (response) {
                _this.salas = response.data;
            },
            error: function (error) {
                console.error('Error al cargar salas:', error);
            }
        });
    };
    AdminFuncionesComponent.prototype.aplicarFiltros = function () {
        console.log('Aplicando filtros:', {
            fecha: this.filtroFecha,
            peliculaId: this.filtroPeliculaId,
            salaId: this.filtroSalaId
        });
        // Validate filters before applying
        if (this.filtroFecha && this.filtroFecha.length === 0) {
            this.filtroFecha = '';
        }
        if (this.filtroPeliculaId && this.filtroPeliculaId.length === 0) {
            this.filtroPeliculaId = '';
        }
        if (this.filtroSalaId && this.filtroSalaId.length === 0) {
            this.filtroSalaId = '';
        }
        // Reset pagination to first page when applying filters
        this.paginaActual = 1;
        this.cargarFunciones();
    };
    AdminFuncionesComponent.prototype.limpiarFiltros = function () {
        this.filtroFecha = '';
        this.filtroPeliculaId = '';
        this.filtroSalaId = '';
        // Reset pagination and reload all functions
        this.paginaActual = 1;
        this.cargarFunciones();
        console.log('Filtros limpiados');
    };
    AdminFuncionesComponent.prototype.hayFiltrosActivos = function () {
        return !!(this.filtroFecha || this.filtroPeliculaId || this.filtroSalaId);
    };
    AdminFuncionesComponent.prototype.contarFiltrosActivos = function () {
        var count = 0;
        if (this.filtroFecha)
            count++;
        if (this.filtroPeliculaId)
            count++;
        if (this.filtroSalaId)
            count++;
        return count;
    };
    AdminFuncionesComponent.prototype.abrirModalCrear = function () {
        this.modoEdicion = false;
        this.funcionForm.reset();
        this.funcionForm.patchValue({ estado: 'ACTIVA' });
        this.mostrarModalFuncion = true;
    };
    AdminFuncionesComponent.prototype.editarFuncion = function (funcion) {
        this.modoEdicion = true;
        this.funcionSeleccionada = funcion;
        // Convertir la fecha completa a fecha y hora separadas (manteniendo zona horaria local)
        var fechaObj = new Date(funcion.inicio);
        // Obtener fecha en formato local para evitar problemas de zona horaria
        var año = fechaObj.getFullYear();
        var mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        var dia = String(fechaObj.getDate()).padStart(2, '0');
        var fecha = año + "-" + mes + "-" + dia;
        // Obtener hora en formato local
        var horas = String(fechaObj.getHours()).padStart(2, '0');
        var minutos = String(fechaObj.getMinutes()).padStart(2, '0');
        var hora = horas + ":" + minutos;
        // Debug para verificar conversión de fechas
        console.log('📅 Editando función - conversión de fecha:', {
            funcionInicio: funcion.inicio,
            fechaObj: fechaObj,
            fechaFormato: fecha,
            horaFormato: hora
        });
        this.funcionForm.patchValue({
            pelicula_id: funcion.peliculaId,
            sala_id: funcion.salaId,
            fecha: fecha,
            hora: hora,
            precio: funcion.precio,
            estado: funcion.cancelada ? 'CANCELADA' : 'ACTIVA'
        });
        this.mostrarModalFuncion = true;
    };
    AdminFuncionesComponent.prototype.guardarFuncion = function () {
        var _this = this;
        if (!this.funcionForm.valid) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        this.guardando = true;
        var formData = this.funcionForm.value;
        if (this.modoEdicion && this.funcionSeleccionada) {
            // Actualizar función existente
            var updateData_1 = {
                peliculaId: formData.pelicula_id,
                salaId: formData.sala_id,
                inicio: this.crearFechaHoraISO(formData.fecha, formData.hora),
                precio: parseFloat(formData.precio)
            };
            // Verificar si cambió el estado de cancelada
            var estadoFormulario_1 = formData.estado === 'CANCELADA';
            var estadoActual_1 = this.funcionSeleccionada.cancelada;
            console.log('🔄 Actualizando función con datos:', updateData_1);
            this.funcionesService.updateFuncion(this.funcionSeleccionada.id, updateData_1).subscribe({
                next: function () {
                    // Si cambió el estado de cancelada, manejar por separado
                    if (estadoFormulario_1 !== estadoActual_1) {
                        var operacionEstado = estadoFormulario_1 ?
                            _this.funcionesService.cancelarFuncion(_this.funcionSeleccionada.id) :
                            _this.funcionesService.reactivarFuncion(_this.funcionSeleccionada.id);
                        operacionEstado.subscribe({
                            next: function () {
                                _this.guardando = false;
                                alert('Función actualizada exitosamente');
                                _this.mostrarModalFuncion = false;
                                _this.cargarFunciones();
                            },
                            error: function (error) {
                                var _a;
                                _this.guardando = false;
                                console.error('Error al cambiar estado:', error);
                                alert("Error al cambiar el estado: " + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido'));
                            }
                        });
                    }
                    else {
                        _this.guardando = false;
                        alert('Función actualizada exitosamente');
                        _this.mostrarModalFuncion = false;
                        _this.cargarFunciones();
                    }
                },
                error: function (error) {
                    var _a;
                    _this.guardando = false;
                    console.error('Error al actualizar función:', error);
                    var mensaje = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido';
                    // Detectar si es un error de conflicto directo (409)
                    if (error.status === 409 || mensaje.includes('Ya existe una función') || mensaje.includes('se solapan')) {
                        _this.mostrarMensajeConflicto(mensaje, false);
                    }
                    // Detectar si es una advertencia por funciones cercanas (400 con mensaje de advertencia)
                    else if (error.status === 400 && mensaje.includes('ADVERTENCIA') && mensaje.includes('funciones muy cercanas')) {
                        _this.manejarAdvertenciaFuncionesCercanas(mensaje, updateData_1);
                    }
                    else {
                        alert("Error al actualizar la funci\u00F3n: " + mensaje);
                    }
                }
            });
        }
        else {
            // Crear nueva función
            var createData_1 = {
                peliculaId: formData.pelicula_id,
                salaId: formData.sala_id,
                inicio: this.crearFechaHoraISO(formData.fecha, formData.hora),
                precio: parseFloat(formData.precio)
            };
            this.funcionesService.createFuncion(createData_1).subscribe({
                next: function () {
                    _this.guardando = false;
                    alert('Función creada exitosamente');
                    _this.mostrarModalFuncion = false;
                    _this.cargarFunciones();
                },
                error: function (error) {
                    var _a;
                    _this.guardando = false;
                    console.error('Error al crear función:', error);
                    var mensaje = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido';
                    // Detectar si es un error de conflicto directo (409)
                    if (error.status === 409 || mensaje.includes('Ya existe una función') || mensaje.includes('se solapan')) {
                        _this.mostrarMensajeConflicto(mensaje, true);
                    }
                    // Detectar si es una advertencia por funciones cercanas (400 con mensaje de advertencia)
                    else if (error.status === 400 && mensaje.includes('ADVERTENCIA') && mensaje.includes('funciones muy cercanas')) {
                        _this.manejarAdvertenciaFuncionesCercanasCreacion(mensaje, createData_1);
                    }
                    else {
                        alert("Error al crear la funci\u00F3n: " + mensaje);
                    }
                }
            });
        }
    };
    AdminFuncionesComponent.prototype.verDetalles = function (funcion) {
        this.funcionSeleccionada = funcion;
        this.mostrarModalDetalles = true;
    };
    AdminFuncionesComponent.prototype.cambiarEstado = function (funcion) {
        var _this = this;
        var esCancelada = funcion.cancelada;
        var mensaje = esCancelada ?
            '¿Está seguro de que desea reactivar esta función?' :
            '¿Está seguro de que desea cancelar esta función?';
        if (confirm(mensaje)) {
            var operacion = esCancelada ?
                this.funcionesService.reactivarFuncion(funcion.id) :
                this.funcionesService.cancelarFuncion(funcion.id);
            operacion.subscribe({
                next: function (response) {
                    var estadoTexto = esCancelada ? 'reactivada' : 'cancelada';
                    alert("Funci\u00F3n " + estadoTexto + " exitosamente");
                    _this.cargarFunciones();
                },
                error: function (error) {
                    var _a;
                    console.error('Error al cambiar estado:', error);
                    var mensaje = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido';
                    alert("Error al cambiar el estado: " + mensaje);
                }
            });
        }
    };
    AdminFuncionesComponent.prototype.eliminarFuncion = function (funcion) {
        var _this = this;
        var _a;
        var confirmar = confirm("\u00BFEst\u00E1s seguro de que quieres eliminar permanentemente la funci\u00F3n de \"" + (((_a = funcion.pelicula) === null || _a === void 0 ? void 0 : _a.titulo) || 'función') + "\" el " + new Date(funcion.inicio).toLocaleString() + "?\n\n" +
            'Esta acción no se puede deshacer y se eliminará toda la información asociada.');
        if (confirmar) {
            this.funcionesService.deleteFuncion(funcion.id).subscribe({
                next: function () {
                    alert('Función eliminada exitosamente');
                    _this.cargarFunciones();
                },
                error: function (error) {
                    var _a;
                    console.error('Error al eliminar función:', error);
                    alert("Error al eliminar la funci\u00F3n: " + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido'));
                }
            });
        }
    };
    AdminFuncionesComponent.prototype.cambiarPagina = function (pagina) {
        if (pagina >= 1 && pagina <= this.funcionesPaginadas.totalPages) {
            this.paginaActual = pagina;
            this.cargarFunciones();
        }
    };
    AdminFuncionesComponent.prototype.getPaginas = function () {
        var totalPages = this.funcionesPaginadas.totalPages;
        var currentPage = this.funcionesPaginadas.page;
        var pages = [];
        var startPage = Math.max(1, currentPage - 2);
        var endPage = Math.min(totalPages, currentPage + 2);
        for (var i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };
    AdminFuncionesComponent.prototype.formatearFecha = function (fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    AdminFuncionesComponent.prototype.formatearHora = function (fecha) {
        return new Date(fecha).toLocaleTimeString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    AdminFuncionesComponent.prototype.calcularPorcentajeOcupacion = function (funcion) {
        var _a;
        if (!funcion.sala)
            return 0;
        var capacidadTotal = (funcion.sala.filas || 0) * (funcion.sala.asientosPorFila || 0);
        if (capacidadTotal === 0)
            return 0;
        var boletosVendidos = ((_a = funcion._count) === null || _a === void 0 ? void 0 : _a.boletos) || 0;
        return Math.round((boletosVendidos / capacidadTotal) * 100);
    };
    AdminFuncionesComponent.prototype.getBoletosVendidos = function (funcion) {
        var _a;
        return ((_a = funcion._count) === null || _a === void 0 ? void 0 : _a.boletos) || 0;
    };
    AdminFuncionesComponent.prototype.getCapacidadTotal = function (funcion) {
        if (!funcion.sala)
            return 0;
        return (funcion.sala.filas || 0) * (funcion.sala.asientosPorFila || 0);
    };
    AdminFuncionesComponent.prototype.crearFechaHoraISO = function (fecha, hora) {
        // Crear fecha en zona horaria local y convertir a ISO
        var fechaCompleta = fecha + "T" + hora + ":00";
        var fechaObj = new Date(fechaCompleta);
        // Log para debugging
        console.log('🕐 Conversión de fecha:', {
            input: fechaCompleta,
            fechaObj: fechaObj,
            iso: fechaObj.toISOString()
        });
        return fechaObj.toISOString();
    };
    AdminFuncionesComponent.prototype.manejarAdvertenciaFuncionesCercanas = function (mensaje, updateData) {
        // Limpiar el mensaje de advertencia
        var mensajeLimpio = mensaje
            .replace('⚠️ ADVERTENCIA: ', '')
            .replace('¿Deseas continuar de todas formas?', '');
        var confirmar = confirm("\u26A0\uFE0F FUNCIONES MUY CERCANAS DETECTADAS\n\n" + mensajeLimpio + "\n\n" +
            "\uD83C\uDFAC RECOMENDACI\u00D3N:\n" +
            "- Deja al menos 60 minutos entre funciones\n" +
            "- Esto permite tiempo para limpieza de sala\n" +
            "- Evita aglomeraciones en entrada/salida\n\n" +
            "\u2753 \u00BFDeseas continuar con este horario de todas formas?");
        if (confirmar) {
            // Si el usuario confirma, forzar la actualización
            console.log('🔄 Usuario confirmó actualización con funciones cercanas');
            this.forzarActualizacionFuncion(updateData);
        }
        else {
            // Si cancela, permitir que edite el horario
            alert('💡 Por favor, elige un horario con más separación entre funciones.');
        }
    };
    AdminFuncionesComponent.prototype.manejarAdvertenciaFuncionesCercanasCreacion = function (mensaje, createData) {
        // Limpiar el mensaje de advertencia
        var mensajeLimpio = mensaje
            .replace('⚠️ ADVERTENCIA: ', '')
            .replace('¿Deseas continuar de todas formas?', '');
        var confirmar = confirm("\u26A0\uFE0F FUNCIONES MUY CERCANAS DETECTADAS\n\n" + mensajeLimpio + "\n\n" +
            "\uD83C\uDFAC RECOMENDACI\u00D3N:\n" +
            "- Deja al menos 60 minutos entre funciones\n" +
            "- Esto permite tiempo para limpieza de sala\n" +
            "- Evita aglomeraciones en entrada/salida\n\n" +
            "\u2753 \u00BFDeseas continuar con este horario de todas formas?");
        if (confirmar) {
            // Si el usuario confirma, forzar la creación
            console.log('🔄 Usuario confirmó creación con funciones cercanas');
            this.forzarCreacionFuncion(createData);
        }
        else {
            // Si cancela, permitir que edite el horario
            alert('💡 Por favor, elige un horario con más separación entre funciones.');
        }
    };
    AdminFuncionesComponent.prototype.forzarCreacionFuncion = function (createData) {
        var _this = this;
        // Agregar flag para forzar la creación saltándose las advertencias
        var createDataForzado = __assign(__assign({}, createData), { forzarCreacion: true });
        this.guardando = true;
        console.log('🔄 Forzando creación con datos:', createDataForzado);
        this.funcionesService.createFuncion(createDataForzado).subscribe({
            next: function () {
                _this.guardando = false;
                alert('✅ Función creada exitosamente (con funciones cercanas detectadas)');
                _this.mostrarModalFuncion = false;
                _this.cargarFunciones();
            },
            error: function (error) {
                var _a;
                _this.guardando = false;
                console.error('Error al forzar creación:', error);
                alert("Error al crear la funci\u00F3n: " + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido'));
            }
        });
    };
    AdminFuncionesComponent.prototype.forzarActualizacionFuncion = function (updateData) {
        var _this = this;
        // Agregar flag para forzar la actualización saltándose las advertencias
        var updateDataForzado = __assign(__assign({}, updateData), { forzarActualizacion: true });
        this.guardando = true;
        console.log('🔄 Forzando actualización con datos:', updateDataForzado);
        this.funcionesService.updateFuncion(this.funcionSeleccionada.id, updateDataForzado).subscribe({
            next: function () {
                _this.guardando = false;
                alert('✅ Función actualizada exitosamente (con funciones cercanas detectadas)');
                _this.mostrarModalFuncion = false;
                _this.cargarFunciones();
            },
            error: function (error) {
                var _a;
                _this.guardando = false;
                console.error('Error al forzar actualización:', error);
                alert("Error al actualizar la funci\u00F3n: " + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido'));
            }
        });
    };
    AdminFuncionesComponent.prototype.mostrarMensajeConflicto = function (mensaje, esCreacion) {
        if (esCreacion === void 0) { esCreacion = true; }
        var accion = esCreacion ? 'crear' : 'actualizar';
        var titulo = esCreacion ? 'CREAR FUNCIÓN' : 'ACTUALIZAR FUNCIÓN';
        // Crear mensaje más legible
        var mensajeLimpio = mensaje;
        // Reemplazar emojis y texto técnico por versión más amigable
        mensajeLimpio = mensajeLimpio
            .replace(/⚠️/g, '')
            .replace(/🔄/g, '')
            .replace(/Error al actualizar: /g, '')
            .replace(/Nueva función programada:/g, 'Horario que intentas asignar:')
            .replace(/Tu función programada:/g, 'Horario que intentas asignar:');
        var mensajeFinal = "\u274C NO SE PUEDE " + titulo.toUpperCase() + "\n\n" + mensajeLimpio + "\n\n\uD83D\uDCA1 SOLUCI\u00D3N:\n- Elige un horario diferente\n- Verifica que no coincida con otras funciones\n- Recuerda que debe haber 30 min de separaci\u00F3n entre funciones";
        alert(mensajeFinal);
    };
    AdminFuncionesComponent.prototype.cerrarModal = function (event) {
        this.mostrarModalFuncion = false;
        this.funcionForm.reset();
    };
    AdminFuncionesComponent.prototype.cerrarModalDetalles = function (event) {
        this.mostrarModalDetalles = false;
        this.funcionSeleccionada = null;
    };
    AdminFuncionesComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-funciones',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.ReactiveFormsModule, forms_1.FormsModule],
            templateUrl: './admin-funciones.component.html',
            styleUrls: ['./admin-funciones.component.scss']
        })
    ], AdminFuncionesComponent);
    return AdminFuncionesComponent;
}());
exports.AdminFuncionesComponent = AdminFuncionesComponent;

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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.AdminPeliculasComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var AdminPeliculasComponent = /** @class */ (function () {
    function AdminPeliculasComponent(fb, peliculasService, funcionesService, salasService, authService) {
        this.fb = fb;
        this.peliculasService = peliculasService;
        this.funcionesService = funcionesService;
        this.salasService = salasService;
        this.authService = authService;
        this.peliculas = [];
        this.todasLasPeliculas = [];
        this.peliculasFiltradas = [];
        this.salas = [];
        this.mostrarFormulario = false;
        this.disponibilidadInfo = '';
        // Propiedades del filtro
        this.filtroBusqueda = '';
        this.filtroEstado = '';
        this.filtroGenero = '';
        this.generosDisponibles = [];
        // Propiedades para sugerencias
        this.mostrarSugerencias = false;
        this.sugerenciasPeliculas = [];
        this.sugerenciaSeleccionada = -1;
        this.peliculaForm = this.fb.group({
            titulo: ['', forms_1.Validators.required],
            sinopsis: [''],
            duracionMin: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]],
            clasificacion: ['', forms_1.Validators.required],
            posterUrl: [''],
            trailerUrl: [''],
            generos: [''],
            estado: ['ACTIVA']
        });
        this.funcionForm = this.fb.group({
            peliculaId: ['', forms_1.Validators.required],
            salaId: ['', forms_1.Validators.required],
            inicio: ['', [forms_1.Validators.required, AdminPeliculasComponent_1.validarFechaFutura]],
            precio: ['', [forms_1.Validators.required, forms_1.Validators.min(0.01)]]
        });
    }
    AdminPeliculasComponent_1 = AdminPeliculasComponent;
    AdminPeliculasComponent.prototype.ngOnInit = function () {
        console.log('=== INICIALIZANDO ADMIN PELICULAS ===');
        // Verificar estado de autenticación antes de cargar datos
        console.log('Estado de autenticación:', {
            isAuthenticated: this.authService.isAuthenticated(),
            currentUser: this.authService.getCurrentUser(),
            isAdmin: this.authService.isAdmin()
        });
        if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
            console.log('✅ Usuario autenticado y es admin, cargando datos...');
            this.cargarPeliculas();
            this.cargarSalas();
            this.testearConexion();
        }
        else {
            console.log('❌ Usuario no autenticado o no es admin');
            console.log('Intentando login automático para pruebas...');
            this.loginAutomaticoParaPruebas();
        }
    };
    // Método temporal para desarrollo - login automático
    AdminPeliculasComponent.prototype.loginAutomaticoParaPruebas = function () {
        var _this = this;
        console.log('🔑 Intentando login automático con admin@cine.com...');
        var loginData = {
            email: 'admin@cine.com',
            password: 'Admin123'
        };
        this.authService.login(loginData).subscribe({
            next: function (response) {
                console.log('✅ Login automático exitoso:', response);
                console.log('Ahora cargando datos...');
                // Esperar un momento para que el token se guarde
                setTimeout(function () {
                    _this.cargarPeliculas();
                    _this.cargarSalas();
                    _this.testearConexion();
                }, 500);
            },
            error: function (error) {
                console.error('❌ Error en login automático:', error);
                alert('❌ Error de autenticación. Ve a http://localhost:4200/login para iniciar sesión manualmente.');
            }
        });
    };
    AdminPeliculasComponent.prototype.testearConexion = function () {
        console.log('Probando conexión a servicios...');
        // Probar servicio de funciones
        this.funcionesService.getFunciones().subscribe({
            next: function (response) {
                console.log('✅ Servicio de funciones disponible:', response);
            },
            error: function (error) {
                console.error('❌ Error en servicio de funciones:', error);
            }
        });
    };
    AdminPeliculasComponent.prototype.cargarPeliculas = function () {
        var _this = this;
        console.log('Iniciando carga de películas en admin');
        // Primero probar una petición simple
        this.peliculasService.testAuthenticatedRequest().subscribe({
            next: function (response) {
                console.log('Petición autenticada exitosa:', response);
                // Ahora cargar las películas normalmente
                _this.peliculasService.getPeliculas().subscribe({
                    next: function (response) {
                        console.log('Películas cargadas exitosamente:', response);
                        _this.peliculas = response.data || [];
                        _this.todasLasPeliculas = __spreadArrays(_this.peliculas);
                        _this.inicializarFiltros();
                        _this.aplicarFiltroBusqueda();
                    },
                    error: function (error) {
                        console.error('Error al cargar películas:', error);
                        console.error('Status:', error.status);
                        console.error('Error completo:', error);
                    }
                });
            },
            error: function (error) {
                var _a;
                console.error('Error en petición autenticada de prueba:', error);
                console.error('Status:', error.status);
                console.error('Mensaje:', (_a = error.error) === null || _a === void 0 ? void 0 : _a.message);
            }
        });
    };
    AdminPeliculasComponent.prototype.cargarSalas = function () {
        var _this = this;
        console.log('Cargando salas...');
        console.log('Estado de autenticación antes de cargar salas:', {
            isAuthenticated: this.authService.isAuthenticated(),
            isAdmin: this.authService.isAdmin(),
            currentUser: this.authService.getCurrentUser()
        });
        this.salasService.getSalas().subscribe({
            next: function (response) {
                _this.salas = response.data;
                console.log('✅ Salas cargadas:', _this.salas);
                console.log('Número de salas:', _this.salas.length);
            },
            error: function (error) {
                var _a, _b;
                console.error('❌ Error al cargar salas:', error);
                console.error('Detalles del error:', {
                    status: error.status,
                    message: (_a = error.error) === null || _a === void 0 ? void 0 : _a.message,
                    url: error.url,
                    fullError: error
                });
                if (error.status === 401) {
                    console.log('Error 401 - No autorizado. Necesitas hacer login como ADMIN.');
                    alert('❌ Necesitas hacer login como administrador para acceder a esta sección.');
                }
                else if (error.status === 0) {
                    console.log('Error de conexión - El servidor no responde');
                    alert('❌ Error de conexión al servidor. Verifica que el backend esté ejecutándose en http://localhost:3000');
                }
                else {
                    alert("\u274C Error al cargar las salas (" + error.status + "): " + (((_b = error.error) === null || _b === void 0 ? void 0 : _b.message) || 'Error desconocido'));
                }
            }
        });
    };
    AdminPeliculasComponent.prototype.nuevaPelicula = function () {
        this.peliculaSeleccionada = undefined;
        this.peliculaForm.reset({ estado: 'ACTIVA' });
        this.mostrarFormulario = true;
    };
    AdminPeliculasComponent.prototype.editarPelicula = function (pelicula) {
        var _a;
        this.peliculaSeleccionada = pelicula;
        this.peliculaForm.patchValue({
            titulo: pelicula.titulo,
            sinopsis: pelicula.sinopsis,
            duracionMin: pelicula.duracionMin,
            clasificacion: pelicula.clasificacion,
            posterUrl: pelicula.posterUrl,
            trailerUrl: pelicula.trailerUrl,
            generos: (_a = pelicula.generos) === null || _a === void 0 ? void 0 : _a.join(', '),
            estado: pelicula.estado
        });
        this.mostrarFormulario = true;
    };
    AdminPeliculasComponent.prototype.guardarPelicula = function () {
        var _this = this;
        if (this.peliculaForm.invalid) {
            console.log('Formulario inválido:', this.peliculaForm.errors);
            return;
        }
        var peliculaData = __assign(__assign({}, this.peliculaForm.value), { generos: this.peliculaForm.value.generos.split(',').map(function (g) { return g.trim(); }) });
        console.log('Datos a enviar:', peliculaData);
        if (this.peliculaSeleccionada) {
            // Actualizar película existente
            console.log('Actualizando película con ID:', this.peliculaSeleccionada.id);
            this.peliculasService.updatePelicula(this.peliculaSeleccionada.id, peliculaData).subscribe({
                next: function (response) {
                    console.log('Película actualizada exitosamente:', response);
                    _this.mostrarFormulario = false;
                    _this.cargarPeliculas();
                },
                error: function (error) {
                    console.error('Error al actualizar película:', error);
                    if (error.error) {
                        console.error('Detalles del error:', error.error);
                    }
                }
            });
        }
        else {
            // Crear nueva película
            this.peliculasService.createPelicula(peliculaData).subscribe({
                next: function () {
                    _this.mostrarFormulario = false;
                    _this.cargarPeliculas();
                },
                error: function (error) { return console.error('Error al crear película:', error); }
            });
        }
    };
    AdminPeliculasComponent.prototype.eliminarPelicula = function (id) {
        var _this = this;
        if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
            console.log('Eliminando película con ID:', id);
            this.peliculasService.deletePelicula(id).subscribe({
                next: function (response) {
                    console.log('✅ Película eliminada exitosamente:', response);
                    alert('✅ Película eliminada exitosamente');
                    _this.cargarPeliculas();
                },
                error: function (error) {
                    var _a, _b;
                    console.error('❌ Error al eliminar película:', error);
                    if (error.status === 400) {
                        // Error de validación del negocio
                        var message = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'No se puede eliminar la película';
                        alert("\u274C " + message);
                    }
                    else if (error.status === 401) {
                        alert('❌ No tienes permisos para eliminar películas. Necesitas ser administrador.');
                    }
                    else if (error.status === 404) {
                        alert('❌ La película no fue encontrada.');
                    }
                    else if (error.status === 0) {
                        alert('❌ Error de conexión al servidor. Verifica que el backend esté ejecutándose.');
                    }
                    else {
                        alert("\u274C Error al eliminar pel\u00EDcula: " + (((_b = error.error) === null || _b === void 0 ? void 0 : _b.message) || 'Error desconocido'));
                    }
                }
            });
        }
    };
    AdminPeliculasComponent.prototype.crearFuncion = function (pelicula) {
        var _a;
        console.log('Iniciando creación de función para película:', pelicula);
        this.funcionForm.patchValue({ peliculaId: pelicula.id });
        this.disponibilidadInfo = ''; // Limpiar info anterior
        // Verificar que se configuró correctamente
        console.log('Formulario después de configurar película:', {
            peliculaId: (_a = this.funcionForm.get('peliculaId')) === null || _a === void 0 ? void 0 : _a.value,
            formValue: this.funcionForm.value
        });
    };
    AdminPeliculasComponent.prototype.verificarDisponibilidadSala = function () {
        var _this = this;
        var _a, _b;
        var salaId = (_a = this.funcionForm.get('salaId')) === null || _a === void 0 ? void 0 : _a.value;
        var inicio = (_b = this.funcionForm.get('inicio')) === null || _b === void 0 ? void 0 : _b.value;
        if (salaId && inicio) {
            var salaSeleccionada_1 = this.salas.find(function (s) { return s.id === salaId; });
            console.log('Verificando disponibilidad para sala:', salaSeleccionada_1 === null || salaSeleccionada_1 === void 0 ? void 0 : salaSeleccionada_1.nombre, 'en fecha:', inicio);
            this.funcionesService.getFuncionesPorSala(salaId).subscribe({
                next: function (funciones) {
                    var fechaInicio = new Date(inicio);
                    var funcionesEnFecha = funciones.filter(function (f) {
                        var fechaFuncion = new Date(f.inicio);
                        return fechaFuncion.toDateString() === fechaInicio.toDateString() && !f.cancelada;
                    });
                    if (funcionesEnFecha.length > 0) {
                        var horariosOcupados = funcionesEnFecha.map(function (f) {
                            var _a, _b;
                            var fecha = new Date(f.inicio);
                            var duracion = ((_a = f.pelicula) === null || _a === void 0 ? void 0 : _a.duracionMin) || 120; // Duración por defecto si no está disponible
                            var fechaFin = new Date(fecha.getTime() + duracion * 60000);
                            return fecha.getHours().toString().padStart(2, '0') + ":" + fecha.getMinutes().toString().padStart(2, '0') + " - " + fechaFin.getHours().toString().padStart(2, '0') + ":" + fechaFin.getMinutes().toString().padStart(2, '0') + " (" + (((_b = f.pelicula) === null || _b === void 0 ? void 0 : _b.titulo) || 'Sin título') + ")";
                        }).join('\n');
                        _this.disponibilidadInfo = "\u26A0\uFE0F Funciones existentes en " + (salaSeleccionada_1 === null || salaSeleccionada_1 === void 0 ? void 0 : salaSeleccionada_1.nombre) + " el " + fechaInicio.toLocaleDateString() + ":\n\n" + horariosOcupados;
                        console.log('Funciones existentes en la fecha:', funcionesEnFecha);
                        alert("\u26A0\uFE0F Atenci\u00F3n: La sala \"" + (salaSeleccionada_1 === null || salaSeleccionada_1 === void 0 ? void 0 : salaSeleccionada_1.nombre) + "\" ya tiene funciones programadas el " + fechaInicio.toLocaleDateString() + ":\n\n" + horariosOcupados + "\n\nAseg\u00FArate de que no haya solapamiento de horarios. Recuerda incluir tiempo entre funciones para limpieza.");
                    }
                    else {
                        _this.disponibilidadInfo = "\u2705 La sala \"" + (salaSeleccionada_1 === null || salaSeleccionada_1 === void 0 ? void 0 : salaSeleccionada_1.nombre) + "\" est\u00E1 disponible el " + fechaInicio.toLocaleDateString();
                        console.log('✅ No hay funciones en esa fecha para la sala');
                        alert("\u2705 \u00A1Perfecto! La sala \"" + (salaSeleccionada_1 === null || salaSeleccionada_1 === void 0 ? void 0 : salaSeleccionada_1.nombre) + "\" est\u00E1 disponible el " + fechaInicio.toLocaleDateString());
                    }
                },
                error: function (error) {
                    console.error('Error al verificar disponibilidad:', error);
                    _this.disponibilidadInfo = '❌ Error al verificar disponibilidad';
                    alert('❌ Error al verificar la disponibilidad de la sala');
                }
            });
        }
        else {
            alert('⚠️ Selecciona una sala y fecha/hora antes de verificar disponibilidad');
        }
    };
    AdminPeliculasComponent.prototype.guardarFuncion = function () {
        var _this = this;
        console.log('=== INICIANDO CREACIÓN DE FUNCIÓN ===');
        console.log('Estado del formulario:', {
            valid: this.funcionForm.valid,
            invalid: this.funcionForm.invalid,
            value: this.funcionForm.value,
            errors: this.funcionForm.errors
        });
        // Verificar cada campo individualmente
        Object.keys(this.funcionForm.controls).forEach(function (key) {
            var control = _this.funcionForm.get(key);
            console.log("Campo " + key + ":", {
                value: control === null || control === void 0 ? void 0 : control.value,
                valid: control === null || control === void 0 ? void 0 : control.valid,
                errors: control === null || control === void 0 ? void 0 : control.errors
            });
        });
        if (this.funcionForm.invalid) {
            console.log('❌ Formulario de función inválido');
            this.mostrarErroresFormulario();
            return;
        }
        var funcionData = this.funcionForm.value;
        console.log('✅ Creando función con datos:', funcionData);
        // Información adicional para debugging
        var peliculaInfo = this.peliculas.find(function (p) { return p.id === funcionData.peliculaId; });
        var salaInfo = this.salas.find(function (s) { return s.id === funcionData.salaId; });
        var fechaHora = new Date(funcionData.inicio);
        console.log('📝 Información completa de la función a crear:');
        console.log('  Película:', peliculaInfo);
        console.log('  Sala:', salaInfo);
        console.log('  Fecha/Hora:', {
            raw: funcionData.inicio,
            parsed: fechaHora.toLocaleString(),
            timestamp: fechaHora.getTime(),
            timezone: fechaHora.getTimezoneOffset()
        });
        this.funcionesService.createFuncion(funcionData).subscribe({
            next: function (response) {
                console.log('✅ Función creada exitosamente:', response);
                alert('🎉 ¡Función creada exitosamente!');
                _this.funcionForm.reset();
                _this.disponibilidadInfo = '';
                _this.cargarPeliculas();
            },
            error: function (error) {
                var _a, _b, _c;
                console.error('❌ ERROR COMPLETO AL CREAR FUNCIÓN:', {
                    status: error.status,
                    statusText: error.statusText,
                    url: error.url,
                    error: error.error,
                    message: error.message,
                    funcionData: funcionData
                });
                if (error.status === 409) {
                    var mensaje = ((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Hay un conflicto de horario con otra función en esta sala';
                    console.error('Detalles del conflicto:', error.error);
                    // Mostrar información más detallada
                    var salaSeleccionada = _this.salas.find(function (s) { return s.id === funcionData.salaId; });
                    var fechaHora_1 = new Date(funcionData.inicio);
                    alert("\u274C CONFLICTO DE HORARIO:\n\n" + mensaje + "\n\nDetalles:\n\u2022 Sala: " + (salaSeleccionada === null || salaSeleccionada === void 0 ? void 0 : salaSeleccionada.nombre) + "\n\u2022 Fecha/Hora: " + fechaHora_1.toLocaleString() + "\n\u2022 Precio: $" + funcionData.precio + "\n\nIntenta:\n1. Cambiar a otra sala\n2. Elegir otro horario (considera 30min entre funciones)\n3. Verificar disponibilidad antes de crear");
                }
                else if (error.status === 404) {
                    alert('❌ Error: Película o sala no encontrada. Verifica que ambas existan.');
                }
                else if (error.status === 400) {
                    var mensaje = ((_b = error.error) === null || _b === void 0 ? void 0 : _b.message) || 'Datos inválidos';
                    alert("\u274C Error en los datos:\n\n" + mensaje);
                }
                else if (error.status === 401) {
                    alert('❌ Error: No tienes permisos para crear funciones. Debes ser administrador.');
                }
                else {
                    alert("\u274C Error inesperado: " + (((_c = error.error) === null || _c === void 0 ? void 0 : _c.message) || 'No se pudo crear la función'));
                }
            }
        });
    };
    AdminPeliculasComponent.prototype.mostrarErroresFormulario = function () {
        var _a, _b, _c, _d;
        var errores = [];
        if ((_a = this.funcionForm.get('salaId')) === null || _a === void 0 ? void 0 : _a.invalid) {
            errores.push('- Debe seleccionar una sala');
        }
        if ((_b = this.funcionForm.get('inicio')) === null || _b === void 0 ? void 0 : _b.invalid) {
            var inicioErrors = (_c = this.funcionForm.get('inicio')) === null || _c === void 0 ? void 0 : _c.errors;
            if (inicioErrors === null || inicioErrors === void 0 ? void 0 : inicioErrors['required']) {
                errores.push('- Debe seleccionar fecha y hora de inicio');
            }
            else if (inicioErrors === null || inicioErrors === void 0 ? void 0 : inicioErrors['fechaPasada']) {
                errores.push('- La fecha debe ser futura (no puede ser en el pasado)');
            }
        }
        if ((_d = this.funcionForm.get('precio')) === null || _d === void 0 ? void 0 : _d.invalid) {
            errores.push('- El precio debe ser mayor a 0');
        }
        if (errores.length > 0) {
            alert("\u274C Formulario incompleto:\n\n" + errores.join('\n'));
        }
    };
    AdminPeliculasComponent.validarFechaFutura = function (control) {
        if (!control.value)
            return null;
        var fechaSeleccionada = new Date(control.value);
        var ahora = new Date();
        if (fechaSeleccionada <= ahora) {
            return { fechaPasada: true };
        }
        return null;
    };
    AdminPeliculasComponent.prototype.debugFormulario = function () {
        var _this = this;
        console.log('=== DEBUG DETALLADO DEL FORMULARIO ===');
        console.log('Formulario completo:', this.funcionForm);
        console.log('Valor del formulario:', this.funcionForm.value);
        console.log('Estado válido:', this.funcionForm.valid);
        console.log('Errores del formulario:', this.funcionForm.errors);
        Object.keys(this.funcionForm.controls).forEach(function (key) {
            var control = _this.funcionForm.get(key);
            console.log("\nCampo: " + key);
            console.log('  Valor:', control === null || control === void 0 ? void 0 : control.value);
            console.log('  Válido:', control === null || control === void 0 ? void 0 : control.valid);
            console.log('  Errores:', control === null || control === void 0 ? void 0 : control.errors);
            console.log('  Touched:', control === null || control === void 0 ? void 0 : control.touched);
            console.log('  Dirty:', control === null || control === void 0 ? void 0 : control.dirty);
        });
        // Mostrar también en alerta
        var estado = Object.keys(this.funcionForm.controls).map(function (key) {
            var control = _this.funcionForm.get(key);
            return key + ": \"" + (control === null || control === void 0 ? void 0 : control.value) + "\" (" + ((control === null || control === void 0 ? void 0 : control.valid) ? 'Válido' : 'Inválido') + ")";
        }).join('\n');
        alert("Estado del formulario:\n\n" + estado + "\n\nRevisa la consola para m\u00E1s detalles.");
    };
    AdminPeliculasComponent.prototype.cancelarFuncion = function () {
        this.funcionForm.reset();
        this.disponibilidadInfo = '';
    };
    AdminPeliculasComponent.prototype.mostrarTodasLasFunciones = function () {
        var _this = this;
        console.log('Obteniendo todas las funciones del sistema...');
        this.funcionesService.getFunciones().subscribe({
            next: function (response) {
                var _a;
                console.log('📋 Todas las funciones en el sistema:', response);
                var funcionesActivas = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.filter(function (f) { return !f.cancelada; })) || [];
                if (funcionesActivas.length === 0) {
                    alert('✅ No hay funciones programadas en el sistema');
                    return;
                }
                var funcionesInfo = funcionesActivas.map(function (f) {
                    var _a;
                    var inicio = new Date(f.inicio);
                    var sala = _this.salas.find(function (s) { return s.id === f.salaId; });
                    return "\u2022 " + inicio.toLocaleDateString() + " " + _this.formatearHora12(inicio) + " - Sala: " + ((sala === null || sala === void 0 ? void 0 : sala.nombre) || 'Desconocida') + " - " + (((_a = f.pelicula) === null || _a === void 0 ? void 0 : _a.titulo) || 'Sin título');
                }).join('\n');
                alert("\uD83D\uDCCB FUNCIONES EXISTENTES (" + funcionesActivas.length + "):\n\n" + funcionesInfo + "\n\nEvita crear funciones que se solapen con estas.");
            },
            error: function (error) {
                console.error('Error al obtener funciones:', error);
                alert('❌ Error al obtener las funciones existentes');
            }
        });
    };
    AdminPeliculasComponent.prototype.analizarConflicto = function () {
        var _this = this;
        var funcionData = this.funcionForm.value;
        var salaId = funcionData.salaId;
        var inicioNuevo = new Date(funcionData.inicio);
        if (!salaId || !funcionData.inicio) {
            alert('⚠️ Primero selecciona sala y fecha/hora para analizar conflictos');
            return;
        }
        console.log('🔍 Analizando conflictos para:', __assign(__assign({}, funcionData), { inicioFormatted: inicioNuevo.toLocaleString(), timestamp: inicioNuevo.getTime() }));
        // Obtener funciones de la sala específica
        this.funcionesService.getFuncionesPorSala(salaId).subscribe({
            next: function (funciones) {
                var funcionesActivas = funciones.filter(function (f) { return !f.cancelada; });
                if (funcionesActivas.length === 0) {
                    alert('✅ No hay funciones en esta sala. ¡Libre para usar!');
                    return;
                }
                // Analizar cada función existente
                var conflictos = funcionesActivas.map(function (f) {
                    var _a;
                    var inicioExistente = new Date(f.inicio);
                    var duracionExistente = ((_a = f.pelicula) === null || _a === void 0 ? void 0 : _a.duracionMin) || 120;
                    var finExistente = new Date(inicioExistente.getTime() + duracionExistente * 60000);
                    var peliculaNueva = _this.peliculas.find(function (p) { return p.id === funcionData.peliculaId; });
                    var duracionNueva = (peliculaNueva === null || peliculaNueva === void 0 ? void 0 : peliculaNueva.duracionMin) || 120;
                    var finNuevo = new Date(inicioNuevo.getTime() + duracionNueva * 60000);
                    // Verificar solapamiento
                    var haySolapamiento = (inicioNuevo < finExistente && finNuevo > inicioExistente);
                    return {
                        funcion: f,
                        inicioExistente: inicioExistente,
                        finExistente: finExistente,
                        haySolapamiento: haySolapamiento,
                        diferencia: Math.abs(inicioNuevo.getTime() - inicioExistente.getTime()) / (1000 * 60) // minutos
                    };
                });
                var conflictosReales = conflictos.filter(function (c) { return c.haySolapamiento; });
                if (conflictosReales.length === 0) {
                    var funcionesCercanas = conflictos.filter(function (c) { return c.diferencia < 180; }); // 3 horas
                    if (funcionesCercanas.length > 0) {
                        var info = funcionesCercanas.map(function (c) { var _a; return "\u2022 " + _this.formatearHora12(c.inicioExistente) + " - " + _this.formatearHora12(c.finExistente) + " (" + ((_a = c.funcion.pelicula) === null || _a === void 0 ? void 0 : _a.titulo) + ")"; }).join('\n');
                        alert("\u26A0\uFE0F No hay conflicto directo, pero hay funciones cercanas:\n\n" + info + "\n\nRecomendado: Deja al menos 30 minutos entre funciones.");
                    }
                    else {
                        alert('✅ ¡No hay conflictos! Puedes crear la función.');
                    }
                }
                else {
                    var peliculaNueva = _this.peliculas.find(function (p) { return p.id === funcionData.peliculaId; });
                    var duracionNueva = (peliculaNueva === null || peliculaNueva === void 0 ? void 0 : peliculaNueva.duracionMin) || 120;
                    var finNuevo_1 = new Date(inicioNuevo.getTime() + duracionNueva * 60000);
                    var info = conflictosReales.map(function (c) { var _a; return "\u2022 CONFLICTO: " + _this.formatearHora12(c.inicioExistente) + " - " + _this.formatearHora12(c.finExistente) + "\n  Pel\u00EDcula: " + ((_a = c.funcion.pelicula) === null || _a === void 0 ? void 0 : _a.titulo) + "\n  Se solapa con tu horario: " + _this.formatearHora12(inicioNuevo) + " - " + _this.formatearHora12(finNuevo_1); }).join('\n\n');
                    alert("\u274C CONFLICTOS DETECTADOS:\n\n" + info + "\n\nCambia el horario para evitar solapamientos.");
                }
            },
            error: function (error) {
                console.error('Error al analizar conflictos:', error);
                alert('❌ Error al analizar conflictos');
            }
        });
    };
    AdminPeliculasComponent.prototype.simularCreacion = function () {
        var funcionData = this.funcionForm.value;
        if (this.funcionForm.invalid) {
            alert('❌ Completa todos los campos primero');
            return;
        }
        console.log('🧪 SIMULANDO CREACIÓN DE FUNCIÓN');
        console.log('Datos que se enviarían:', funcionData);
        // Usar el endpoint de debug del backend
        this.funcionesService.debugConflictos(funcionData).subscribe({
            next: function (response) {
                console.log('🐛 Respuesta del debug:', response);
                if (response.hayConflictos) {
                    var conflictos = response.analisisConflictos
                        .filter(function (a) { return a.haySolapamiento; })
                        .map(function (a) { return "\u2022 " + a.pelicula + ": " + a.inicioExistente + " - " + a.finExistente; })
                        .join('\n');
                    alert("\uD83D\uDEAB CONFLICTOS DETECTADOS:\n\n" + response.datosNuevaFuncion.pelicula + "\nSala: " + response.datosNuevaFuncion.sala + "\nHorario propuesto: " + response.datosNuevaFuncion.inicio + " - " + response.datosNuevaFuncion.fin + "\n\nConflictos:\n" + conflictos + "\n\n" + response.mensaje);
                }
                else {
                    alert("\u2705 SIN CONFLICTOS:\n\n" + response.datosNuevaFuncion.pelicula + "\nSala: " + response.datosNuevaFuncion.sala + "\nHorario: " + response.datosNuevaFuncion.inicio + " - " + response.datosNuevaFuncion.fin + "\n\nFunciones existentes en sala: " + response.funcionesExistentes + "\n\n" + response.mensaje + "\n\n\u00A1Puedes crear la funci\u00F3n sin problemas!");
                }
            },
            error: function (error) {
                var _a;
                console.error('❌ Error en debug:', error);
                alert("\u274C Error al hacer debug:\n\n" + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || error.message) + "\n\nRevisa la consola para m\u00E1s detalles.");
            }
        });
    };
    AdminPeliculasComponent.prototype.limpiarBaseDatos = function () {
        var _this = this;
        if (confirm('⚠️ ¿Estás seguro de que quieres ver todas las funciones en la base de datos? (Esto no eliminará nada, solo mostrará información)')) {
            // Obtener funciones por fecha específica
            var funcionData = this.funcionForm.value;
            if (funcionData.inicio) {
                var fecha_1 = new Date(funcionData.inicio);
                var fechaStr = fecha_1.toISOString().split('T')[0];
                console.log('📅 Buscando funciones para la fecha:', fechaStr);
                this.funcionesService.getFunciones({
                    page: 1,
                    limit: 100
                }).subscribe({
                    next: function (response) {
                        console.log('📅 Funciones en la fecha seleccionada:', response);
                        if (!response.data || response.data.length === 0) {
                            alert("\u2705 NO HAY FUNCIONES programadas para el " + fecha_1.toLocaleDateString() + ".\n\nEsto confirma que NO deber\u00EDa haber conflictos.");
                        }
                        else {
                            var funcionesInfo = response.data.map(function (f) {
                                var _a, _b;
                                var inicio = new Date(f.inicio);
                                return "\u2022 " + _this.formatearHora12(inicio) + " - " + (((_a = f.pelicula) === null || _a === void 0 ? void 0 : _a.titulo) || 'Sin título') + " - Sala: " + (((_b = f.sala) === null || _b === void 0 ? void 0 : _b.nombre) || 'Desconocida') + (f.cancelada ? ' (CANCELADA)' : '');
                            }).join('\n');
                            alert("\uD83D\uDCC5 FUNCIONES ENCONTRADAS para " + fecha_1.toLocaleDateString() + ":\n\n" + funcionesInfo + "\n\nSi alguna est\u00E1 CANCELADA, no deber\u00EDa causar conflicto.");
                        }
                    },
                    error: function (error) {
                        console.error('Error al buscar funciones por fecha:', error);
                        alert('❌ Error al buscar funciones por fecha');
                    }
                });
            }
        }
    };
    // Método de prueba forzada - bypassa validaciones del frontend
    AdminPeliculasComponent.prototype.probarCreacionForzada = function () {
        var _this = this;
        if (!this.funcionForm.valid) {
            alert('❌ El formulario no está válido');
            return;
        }
        var funcionData = this.funcionForm.value;
        alert('🔄 PRUEBA FORZADA: Enviando datos directamente al backend sin validaciones adicionales del frontend...');
        console.log('🚀 DATOS DE LA FUNCIÓN PARA PRUEBA FORZADA:', {
            pelicula_id: funcionData.pelicula_id,
            sala_id: funcionData.sala_id,
            fecha: funcionData.fecha,
            hora: funcionData.hora,
            precio: funcionData.precio,
            fechaCompleta: funcionData.fecha + "T" + funcionData.hora
        });
        // Llamada directa al servicio sin validaciones adicionales
        this.funcionesService.createFuncion(funcionData).subscribe({
            next: function (response) {
                console.log('✅ ÉXITO EN PRUEBA FORZADA:', response);
                alert('🎉 ¡FUNCIÓN CREADA EXITOSAMENTE EN PRUEBA FORZADA!');
                _this.cargarPeliculas();
                _this.funcionForm.reset();
            },
            error: function (error) {
                var _a, _b;
                console.error('❌ ERROR EN PRUEBA FORZADA:', {
                    error: error,
                    status: error.status,
                    statusText: error.statusText,
                    message: (_a = error.error) === null || _a === void 0 ? void 0 : _a.message,
                    fullError: error.error
                });
                alert("\u274C ERROR EN PRUEBA FORZADA:\nStatus: " + error.status + "\nMensaje: " + (((_b = error.error) === null || _b === void 0 ? void 0 : _b.message) || 'Error desconocido'));
            }
        });
    };
    AdminPeliculasComponent.prototype.formatearHora12 = function (fecha) {
        var date = fecha instanceof Date ? fecha : new Date(fecha);
        return date.toLocaleTimeString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    // Métodos para filtros de búsqueda
    AdminPeliculasComponent.prototype.inicializarFiltros = function () {
        // Extraer géneros únicos de todas las películas
        var todosLosGeneros = this.todasLasPeliculas
            .flatMap(function (pelicula) { return pelicula.generos || []; })
            .filter(function (genero, index, array) { return array.indexOf(genero) === index; })
            .sort();
        this.generosDisponibles = todosLosGeneros;
        console.log('Géneros disponibles:', this.generosDisponibles);
    };
    AdminPeliculasComponent.prototype.aplicarFiltroBusqueda = function () {
        var _this = this;
        console.log('Aplicando filtros:', {
            busqueda: this.filtroBusqueda,
            estado: this.filtroEstado,
            genero: this.filtroGenero
        });
        var peliculasTemp = __spreadArrays(this.todasLasPeliculas);
        // Filtro por texto de búsqueda
        if (this.filtroBusqueda && this.filtroBusqueda.trim() !== '') {
            var busqueda_1 = this.filtroBusqueda.toLowerCase().trim();
            peliculasTemp = peliculasTemp.filter(function (pelicula) {
                var _a, _b;
                return pelicula.titulo.toLowerCase().includes(busqueda_1) || ((_a = pelicula.clasificacion) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(busqueda_1)) ||
                    (pelicula.generos && pelicula.generos.some(function (genero) {
                        return genero.toLowerCase().includes(busqueda_1);
                    })) || ((_b = pelicula.sinopsis) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(busqueda_1));
            });
        }
        // Filtro por estado
        if (this.filtroEstado && this.filtroEstado !== '') {
            peliculasTemp = peliculasTemp.filter(function (pelicula) {
                return pelicula.estado === _this.filtroEstado;
            });
        }
        // Filtro por género
        if (this.filtroGenero && this.filtroGenero !== '') {
            peliculasTemp = peliculasTemp.filter(function (pelicula) {
                return pelicula.generos && pelicula.generos.includes(_this.filtroGenero);
            });
        }
        this.peliculasFiltradas = peliculasTemp;
        console.log("Filtros aplicados: " + this.peliculasFiltradas.length + " de " + this.todasLasPeliculas.length + " pel\u00EDculas");
    };
    AdminPeliculasComponent.prototype.limpiarFiltros = function () {
        this.filtroBusqueda = '';
        this.filtroEstado = '';
        this.filtroGenero = '';
        this.aplicarFiltroBusqueda();
        console.log('Filtros limpiados');
    };
    AdminPeliculasComponent.prototype.hayFiltrosActivos = function () {
        return !!(this.filtroBusqueda || this.filtroEstado || this.filtroGenero);
    };
    AdminPeliculasComponent.prototype.contarFiltrosActivos = function () {
        var count = 0;
        if (this.filtroBusqueda)
            count++;
        if (this.filtroEstado)
            count++;
        if (this.filtroGenero)
            count++;
        return count;
    };
    // Métodos para sugerencias de búsqueda
    AdminPeliculasComponent.prototype.onBusquedaInput = function (event) {
        var _this = this;
        var query = event.target.value;
        this.filtroBusqueda = query;
        if (query && query.trim().length > 0) {
            this.actualizarSugerencias(query);
            this.mostrarSugerencias = true;
        }
        else {
            this.sugerenciasPeliculas = [];
            this.mostrarSugerencias = false;
        }
        // Aplicar filtros después de un pequeño delay para mejor UX
        setTimeout(function () {
            _this.aplicarFiltroBusqueda();
        }, 100);
    };
    AdminPeliculasComponent.prototype.actualizarSugerencias = function (query) {
        if (!query || query.trim().length === 0) {
            this.sugerenciasPeliculas = [];
            return;
        }
        var busqueda = query.toLowerCase().trim();
        var sugerencias = this.todasLasPeliculas
            .filter(function (pelicula) {
            var _a;
            return pelicula.titulo.toLowerCase().includes(busqueda) || ((_a = pelicula.clasificacion) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(busqueda)) ||
                (pelicula.generos && pelicula.generos.some(function (genero) {
                    return genero.toLowerCase().includes(busqueda);
                }));
        })
            .slice(0, 6); // Limitar a 6 sugerencias máximo
        this.sugerenciasPeliculas = sugerencias;
        this.sugerenciaSeleccionada = -1;
    };
    AdminPeliculasComponent.prototype.seleccionarSugerencia = function (pelicula) {
        var _this = this;
        this.filtroBusqueda = pelicula.titulo;
        this.mostrarSugerencias = false;
        this.sugerenciasPeliculas = [];
        // Aplicar filtro con la película seleccionada
        setTimeout(function () {
            _this.aplicarFiltroBusqueda();
        }, 50);
    };
    AdminPeliculasComponent.prototype.ocultarSugerencias = function () {
        var _this = this;
        // Delay para permitir que el click en una sugerencia se procese
        setTimeout(function () {
            _this.mostrarSugerencias = false;
            _this.sugerenciaSeleccionada = -1;
        }, 200);
    };
    var AdminPeliculasComponent_1;
    AdminPeliculasComponent = AdminPeliculasComponent_1 = __decorate([
        core_1.Component({
            selector: 'app-admin-peliculas',
            standalone: true,
            imports: [common_1.CommonModule, router_1.RouterModule, forms_1.FormsModule, forms_1.ReactiveFormsModule],
            templateUrl: './admin-peliculas.component.html',
            styleUrls: ['./admin-peliculas.component.scss']
        })
    ], AdminPeliculasComponent);
    return AdminPeliculasComponent;
}());
exports.AdminPeliculasComponent = AdminPeliculasComponent;

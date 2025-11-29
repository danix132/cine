import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { PeliculasService } from '../../../services/peliculas.service';
import { FuncionesService } from '../../../services/funciones.service';
import { SalasService } from '../../../services/salas.service';
import { AuthService } from '../../../services/auth.service';
import { GeminiService } from '../../../services/gemini.service';
import { Pelicula } from '../../../models/pelicula.model';
import { Sala } from '../../../models/sala.model';
import { PaginatedResponse } from '../../../models/common.model';

@Component({
  selector: 'app-admin-peliculas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-peliculas.component.html',
  styleUrls: ['./admin-peliculas.component.scss']
})
export class AdminPeliculasComponent implements OnInit {
  peliculas: Pelicula[] = [];
  todasLasPeliculas: Pelicula[] = [];
  peliculasFiltradas: Pelicula[] = [];
  salas: Sala[] = [];
  peliculaForm: FormGroup;
  funcionForm: FormGroup;
  peliculaSeleccionada?: Pelicula;
  mostrarFormulario = false;
  disponibilidadInfo: string = '';

  // Propiedades de paginación
  paginaActual = 1;
  peliculasPorPagina = 10;
  totalPaginas = 1;
  totalPeliculas = 0;

  // Propiedades del filtro
  filtroBusqueda = '';
  filtroEstado = '';
  filtroGenero = '';
  generosDisponibles: string[] = [];

  // Propiedades para sugerencias
  mostrarSugerencias = false;
  sugerenciasPeliculas: Pelicula[] = [];
  sugerenciaSeleccionada = -1;

  // Propiedad para IA
  cargandoIA = false;

  // Fecha mínima para el campo de fecha de estreno (hoy)
  fechaMinima: string = '';
  
  constructor(
    private fb: FormBuilder,
    private peliculasService: PeliculasService,
    private funcionesService: FuncionesService,
    private salasService: SalasService,
    private authService: AuthService,
    private geminiService: GeminiService
  ) {
    this.peliculaForm = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: [''],
      duracionMin: ['', [Validators.required, Validators.min(1)]],
      clasificacion: ['', Validators.required],
      posterUrl: [''],
      trailerUrl: [''],
      generos: [''],
      estado: ['ACTIVA'],
      esProximoEstreno: [false],
      fechaEstreno: ['']
    });

    this.funcionForm = this.fb.group({
      peliculaId: ['', Validators.required],
      salaId: ['', Validators.required],
      inicio: ['', [Validators.required, AdminPeliculasComponent.validarFechaFutura]],
      precio: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    console.log('=== INICIALIZANDO ADMIN PELICULAS ===');
    
    // Establecer fecha mínima como hoy (para el campo de fecha de estreno)
    const today = new Date();
    this.fechaMinima = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
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
    } else {
      console.log('❌ Usuario no autenticado o no es admin');
      console.log('Intentando login automático para pruebas...');
      this.loginAutomaticoParaPruebas();
    }
  }

  // Método temporal para desarrollo - login automático
  loginAutomaticoParaPruebas() {
    console.log('🔑 Intentando login automático con admin@cine.com...');
    
    const loginData = {
      email: 'admin@cine.com',
      password: 'Admin123'
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('✅ Login automático exitoso:', response);
        console.log('Ahora cargando datos...');
        
        // Esperar un momento para que el token se guarde
        setTimeout(() => {
          this.cargarPeliculas();
          this.cargarSalas();
          this.testearConexion();
        }, 500);
      },
      error: (error) => {
        console.error('❌ Error en login automático:', error);
        alert('❌ Error de autenticación. Ve a http://localhost:4200/login para iniciar sesión manualmente.');
      }
    });
  }

  testearConexion() {
    console.log('Probando conexión a servicios...');
    
    // Probar servicio de funciones
    this.funcionesService.getFunciones().subscribe({
      next: (response) => {
        console.log('✅ Servicio de funciones disponible:', response);
      },
      error: (error) => {
        console.error('❌ Error en servicio de funciones:', error);
      }
    });
  }

  cargarPeliculas() {
    console.log('Iniciando carga de películas en admin - Página:', this.paginaActual);
    
    // Primero probar una petición simple
    this.peliculasService.testAuthenticatedRequest().subscribe({
      next: (response) => {
        console.log('Petición autenticada exitosa:', response);
        
        // Cargar películas con paginación, ordenadas por más recientes primero
        this.peliculasService.getPeliculas({ 
          page: this.paginaActual, 
          limit: this.peliculasPorPagina 
        }).subscribe({
          next: (response) => {
            console.log('Películas cargadas exitosamente:', response);
            this.peliculas = response.data || [];
            this.totalPeliculas = response.total;
            this.totalPaginas = response.totalPages;
            
            // El backend ya envía las películas ordenadas por createdAt desc
            this.todasLasPeliculas = [...this.peliculas];
            this.inicializarFiltros();
            this.aplicarFiltroBusqueda();
          },
          error: (error) => {
            console.error('Error al cargar películas:', error);
            console.error('Status:', error.status);
            console.error('Error completo:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error en petición autenticada de prueba:', error);
        console.error('Status:', error.status);
        console.error('Mensaje:', error.error?.message);
      }
    });
  }

  // Métodos de paginación
  irAPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarPeliculas();
    }
  }

  irAPaginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarPeliculas();
    }
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarPeliculas();
    }
  }

  get paginasArray(): number[] {
    const paginas = [];
    const maxPaginas = 5; // Mostrar máximo 5 números de página
    let inicio = Math.max(1, this.paginaActual - 2);
    let fin = Math.min(this.totalPaginas, inicio + maxPaginas - 1);
    
    // Ajustar inicio si estamos cerca del final
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  cargarSalas() {
    console.log('Cargando salas...');
    console.log('Estado de autenticación antes de cargar salas:', {
      isAuthenticated: this.authService.isAuthenticated(),
      isAdmin: this.authService.isAdmin(),
      currentUser: this.authService.getCurrentUser()
    });
    
    this.salasService.getSalas().subscribe({
      next: (response: PaginatedResponse<Sala>) => {
        this.salas = response.data;
        console.log('✅ Salas cargadas:', this.salas);
        console.log('Número de salas:', this.salas.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar salas:', error);
        console.error('Detalles del error:', {
          status: error.status,
          message: error.error?.message,
          url: error.url,
          fullError: error
        });
        
        if (error.status === 401) {
          console.log('Error 401 - No autorizado. Necesitas hacer login como ADMIN.');
          alert('❌ Necesitas hacer login como administrador para acceder a esta sección.');
        } else if (error.status === 0) {
          console.log('Error de conexión - El servidor no responde');
          alert('❌ Error de conexión al servidor. Verifica que el backend esté ejecutándose en http://localhost:3000');
        } else {
          alert(`❌ Error al cargar las salas (${error.status}): ${error.error?.message || 'Error desconocido'}`);
        }
      }
    });
  }

  nuevaPelicula() {
    this.peliculaSeleccionada = undefined;
    this.peliculaForm.reset({ estado: 'ACTIVA' });
    this.mostrarFormulario = true;
  }

  editarPelicula(pelicula: Pelicula) {
    this.peliculaSeleccionada = pelicula;
    
    // Formatear la fecha si existe
    let fechaEstrenoFormatted = '';
    if ((pelicula as any).fechaEstreno) {
      const fecha = new Date((pelicula as any).fechaEstreno);
      fechaEstrenoFormatted = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
    
    this.peliculaForm.patchValue({
      titulo: pelicula.titulo,
      sinopsis: pelicula.sinopsis,
      duracionMin: pelicula.duracionMin,
      clasificacion: pelicula.clasificacion,
      posterUrl: pelicula.posterUrl,
      trailerUrl: pelicula.trailerUrl,
      generos: pelicula.generos || [], // Ahora es un array para el select múltiple
      estado: pelicula.estado,
      esProximoEstreno: (pelicula as any).esProximoEstreno || false,
      fechaEstreno: fechaEstrenoFormatted
    });
    this.mostrarFormulario = true;
  }

  async autocompletarConIA() {
    const titulo = this.peliculaForm.get('titulo')?.value;
    if (!titulo || titulo.trim() === '') {
      alert('Por favor, ingresa el título de la película primero');
      return;
    }

    this.cargandoIA = true;

    try {
      const datosIA = await this.geminiService.obtenerDatosPelicula(titulo);

      // Rellenar el formulario con los datos obtenidos
      this.peliculaForm.patchValue({
        sinopsis: datosIA.sinopsis || '',
        duracionMin: datosIA.duracionMin || '',
        clasificacion: datosIA.clasificacion || '',
        generos: Array.isArray(datosIA.generos) ? datosIA.generos : (datosIA.generos ? datosIA.generos.split(',').map((g: string) => g.trim()) : []),
        posterUrl: datosIA.posterUrl || '',
        trailerUrl: datosIA.trailerUrl || ''
      });

      alert('✅ Datos autocompletados con éxito!\n\nRevisa y ajusta si es necesario antes de guardar.');
      
    } catch (error: any) {
      console.error('❌ Error completo al consultar Gemini:', error);
      console.error('❌ Tipo de error:', typeof error);
      console.error('❌ Error.name:', error?.name);
      console.error('❌ Error.message:', error?.message);
      console.error('❌ Error.stack:', error?.stack);
      
      let mensajeError = '❌ Error al consultar la IA.\n\n';
      
      if (error.message) {
        if (error.message.includes('API key') || error.message.includes('API_KEY_INVALID')) {
          mensajeError += '🔑 Tu API key no es válida o está bloqueada.\n';
          mensajeError += 'Verifica en: https://aistudio.google.com/app/apikey\n';
        } else if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
          mensajeError += '📊 Límite de solicitudes alcanzado.\n';
          mensajeError += 'Espera unos minutos e intenta de nuevo.\n';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          mensajeError += '🌐 No se puede conectar con Gemini.\n';
          mensajeError += 'Esto puede ser un problema de firewall o proxy.\n';
        } else if (error.message.includes('CORS')) {
          mensajeError += '🔒 Error de permisos (CORS).\n';
        } else {
          mensajeError += `📝 Detalle técnico: ${error.message}\n`;
        }
      } else {
        mensajeError += '⚠️ Error desconocido sin mensaje.\n';
      }
      
      mensajeError += '\n💡 Sugerencias:\n';
      mensajeError += '1. Abre la consola del navegador (F12) para ver más detalles\n';
      mensajeError += '2. Intenta con otro título de película\n';
      mensajeError += '3. O completa los campos manualmente';
      
      alert(mensajeError);
    } finally {
      this.cargandoIA = false;
    }
  }

  onProximoEstrenoChange() {
    const esProximoEstreno = this.peliculaForm.get('esProximoEstreno')?.value;
    if (!esProximoEstreno) {
      // Si se desmarca, limpiar la fecha de estreno
      this.peliculaForm.patchValue({ fechaEstreno: '' });
    }
  }

  guardarPelicula() {
    if (this.peliculaForm.invalid) {
      console.log('Formulario inválido:', this.peliculaForm.errors);
      return;
    }

    // Manejar géneros: puede ser un array (del select múltiple) o un string (de la IA)
    let generos = this.peliculaForm.value.generos;
    if (typeof generos === 'string') {
      generos = generos.split(',').map((g: string) => g.trim());
    } else if (!Array.isArray(generos)) {
      generos = [];
    }

    // Preparar datos de la película
    const peliculaData: any = {
      ...this.peliculaForm.value,
      generos: generos
    };

    // Convertir esProximoEstreno a boolean explícitamente
    peliculaData.esProximoEstreno = Boolean(peliculaData.esProximoEstreno);

    // Si fechaEstreno está vacío, convertirlo a null o eliminarlo
    if (!peliculaData.fechaEstreno || peliculaData.fechaEstreno === '') {
      delete peliculaData.fechaEstreno;
    } else {
      // Convertir la fecha al formato ISO esperado por el backend
      peliculaData.fechaEstreno = new Date(peliculaData.fechaEstreno).toISOString();
    }

    // Si esProximoEstreno es false, eliminar campos relacionados y el propio campo si es false
    if (!peliculaData.esProximoEstreno) {
      delete peliculaData.fechaEstreno;
      delete peliculaData.esProximoEstreno; // No enviar si es false
    }

    console.log('Datos a enviar:', peliculaData);

    if (this.peliculaSeleccionada) {
      // Actualizar película existente
      console.log('Actualizando película con ID:', this.peliculaSeleccionada.id);
      this.peliculasService.updatePelicula(this.peliculaSeleccionada.id, peliculaData).subscribe({
        next: (response) => {
          console.log('Película actualizada exitosamente:', response);
          alert('✅ Película actualizada correctamente');
          this.mostrarFormulario = false;
          this.cargarPeliculas();
        },
        error: (error) => {
          console.error('Error al actualizar película:', error);
          if (error.error) {
            console.error('Detalles del error:', error.error);
          }
          const mensaje = error.error?.message || error.message || 'Error desconocido';
          alert('❌ Error al actualizar película: ' + mensaje);
        }
      });
    } else {
      // Crear nueva película
      console.log('Creando nueva película...');
      this.peliculasService.createPelicula(peliculaData).subscribe({
        next: (response) => {
          console.log('Película creada exitosamente:', response);
          alert('✅ Película creada correctamente');
          this.mostrarFormulario = false;
          this.cargarPeliculas();
        },
        error: (error) => {
          console.error('Error al crear película:', error);
          if (error.error) {
            console.error('Detalles del error:', error.error);
          }
          const mensaje = error.error?.message || error.message || 'Error desconocido';
          alert('❌ Error al crear película: ' + mensaje);
        }
      });
    }
  }

  eliminarPelicula(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      console.log('Eliminando película con ID:', id);
      
      this.peliculasService.deletePelicula(id).subscribe({
        next: (response) => {
          console.log('✅ Película eliminada exitosamente:', response);
          alert('✅ Película eliminada exitosamente');
          this.cargarPeliculas();
        },
        error: (error) => {
          console.error('❌ Error al eliminar película:', error);
          
          if (error.status === 400) {
            // Error de validación del negocio
            const message = error.error?.message || 'No se puede eliminar la película';
            alert(`❌ ${message}`);
          } else if (error.status === 401) {
            alert('❌ No tienes permisos para eliminar películas. Necesitas ser administrador.');
          } else if (error.status === 404) {
            alert('❌ La película no fue encontrada.');
          } else if (error.status === 0) {
            alert('❌ Error de conexión al servidor. Verifica que el backend esté ejecutándose.');
          } else {
            alert(`❌ Error al eliminar película: ${error.error?.message || 'Error desconocido'}`);
          }
        }
      });
    }
  }

  crearFuncion(pelicula: Pelicula) {
    console.log('Iniciando creación de función para película:', pelicula);
    this.funcionForm.patchValue({ peliculaId: pelicula.id });
    this.disponibilidadInfo = ''; // Limpiar info anterior
    
    // Verificar que se configuró correctamente
    console.log('Formulario después de configurar película:', {
      peliculaId: this.funcionForm.get('peliculaId')?.value,
      formValue: this.funcionForm.value
    });
  }

  verificarDisponibilidadSala() {
    const salaId = this.funcionForm.get('salaId')?.value;
    const inicio = this.funcionForm.get('inicio')?.value;

    if (salaId && inicio) {
      const salaSeleccionada = this.salas.find(s => s.id === salaId);
      console.log('Verificando disponibilidad para sala:', salaSeleccionada?.nombre, 'en fecha:', inicio);
      
      this.funcionesService.getFuncionesPorSala(salaId).subscribe({
        next: (funciones) => {
          const fechaInicio = new Date(inicio);
          const funcionesEnFecha = funciones.filter(f => {
            const fechaFuncion = new Date(f.inicio);
            return fechaFuncion.toDateString() === fechaInicio.toDateString() && !f.cancelada;
          });

          if (funcionesEnFecha.length > 0) {
            const horariosOcupados = funcionesEnFecha.map(f => {
              const fecha = new Date(f.inicio);
              const duracion = f.pelicula?.duracionMin || 120; // Duración por defecto si no está disponible
              const fechaFin = new Date(fecha.getTime() + duracion * 60000);
              
              return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')} - ${fechaFin.getHours().toString().padStart(2, '0')}:${fechaFin.getMinutes().toString().padStart(2, '0')} (${f.pelicula?.titulo || 'Sin título'})`;
            }).join('\n');
            
            this.disponibilidadInfo = `⚠️ Funciones existentes en ${salaSeleccionada?.nombre} el ${fechaInicio.toLocaleDateString()}:\n\n${horariosOcupados}`;
            
            console.log('Funciones existentes en la fecha:', funcionesEnFecha);
            alert(`⚠️ Atención: La sala "${salaSeleccionada?.nombre}" ya tiene funciones programadas el ${fechaInicio.toLocaleDateString()}:\n\n${horariosOcupados}\n\nAsegúrate de que no haya solapamiento de horarios. Recuerda incluir tiempo entre funciones para limpieza.`);
          } else {
            this.disponibilidadInfo = `✅ La sala "${salaSeleccionada?.nombre}" está disponible el ${fechaInicio.toLocaleDateString()}`;
            console.log('✅ No hay funciones en esa fecha para la sala');
            alert(`✅ ¡Perfecto! La sala "${salaSeleccionada?.nombre}" está disponible el ${fechaInicio.toLocaleDateString()}`);
          }
        },
        error: (error) => {
          console.error('Error al verificar disponibilidad:', error);
          this.disponibilidadInfo = '❌ Error al verificar disponibilidad';
          alert('❌ Error al verificar la disponibilidad de la sala');
        }
      });
    } else {
      alert('⚠️ Selecciona una sala y fecha/hora antes de verificar disponibilidad');
    }
  }

  guardarFuncion() {
    console.log('=== INICIANDO CREACIÓN DE FUNCIÓN ===');
    console.log('Estado del formulario:', {
      valid: this.funcionForm.valid,
      invalid: this.funcionForm.invalid,
      value: this.funcionForm.value,
      errors: this.funcionForm.errors
    });
    
    // Verificar cada campo individualmente
    Object.keys(this.funcionForm.controls).forEach(key => {
      const control = this.funcionForm.get(key);
      console.log(`Campo ${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors
      });
    });

    if (this.funcionForm.invalid) {
      console.log('❌ Formulario de función inválido');
      this.mostrarErroresFormulario();
      return;
    }

    const funcionData = this.funcionForm.value;
    console.log('✅ Creando función con datos:', funcionData);
    
    // Información adicional para debugging
    const peliculaInfo = this.peliculas.find(p => p.id === funcionData.peliculaId);
    const salaInfo = this.salas.find(s => s.id === funcionData.salaId);
    const fechaHora = new Date(funcionData.inicio);
    
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
      next: (response) => {
        console.log('✅ Función creada exitosamente:', response);
        alert('🎉 ¡Función creada exitosamente!');
        this.funcionForm.reset();
        this.disponibilidadInfo = '';
        this.cargarPeliculas();
      },
      error: (error) => {
        console.error('❌ ERROR COMPLETO AL CREAR FUNCIÓN:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
          message: error.message,
          funcionData: funcionData
        });
        
        if (error.status === 409) {
          const mensaje = error.error?.message || 'Hay un conflicto de horario con otra función en esta sala';
          console.error('Detalles del conflicto:', error.error);
          
          // Mostrar información más detallada
          const salaSeleccionada = this.salas.find(s => s.id === funcionData.salaId);
          const fechaHora = new Date(funcionData.inicio);
          
          alert(`❌ CONFLICTO DE HORARIO:\n\n${mensaje}\n\nDetalles:\n• Sala: ${salaSeleccionada?.nombre}\n• Fecha/Hora: ${fechaHora.toLocaleString()}\n• Precio: $${funcionData.precio}\n\nIntenta:\n1. Cambiar a otra sala\n2. Elegir otro horario (considera 30min entre funciones)\n3. Verificar disponibilidad antes de crear`);
        } else if (error.status === 404) {
          alert('❌ Error: Película o sala no encontrada. Verifica que ambas existan.');
        } else if (error.status === 400) {
          const mensaje = error.error?.message || 'Datos inválidos';
          alert(`❌ Error en los datos:\n\n${mensaje}`);
        } else if (error.status === 401) {
          alert('❌ Error: No tienes permisos para crear funciones. Debes ser administrador.');
        } else {
          alert(`❌ Error inesperado: ${error.error?.message || 'No se pudo crear la función'}`);
        }
      }
    });
  }

  private mostrarErroresFormulario() {
    const errores = [];
    if (this.funcionForm.get('salaId')?.invalid) {
      errores.push('- Debe seleccionar una sala');
    }
    if (this.funcionForm.get('inicio')?.invalid) {
      const inicioErrors = this.funcionForm.get('inicio')?.errors;
      if (inicioErrors?.['required']) {
        errores.push('- Debe seleccionar fecha y hora de inicio');
      } else if (inicioErrors?.['fechaPasada']) {
        errores.push('- La fecha debe ser futura (no puede ser en el pasado)');
      }
    }
    if (this.funcionForm.get('precio')?.invalid) {
      errores.push('- El precio debe ser mayor a 0');
    }
    
    if (errores.length > 0) {
      alert(`❌ Formulario incompleto:\n\n${errores.join('\n')}`);
    }
  }

  static validarFechaFutura(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const fechaSeleccionada = new Date(control.value);
    const ahora = new Date();
    
    if (fechaSeleccionada <= ahora) {
      return { fechaPasada: true };
    }
    
    return null;
  }

  debugFormulario() {
    console.log('=== DEBUG DETALLADO DEL FORMULARIO ===');
    console.log('Formulario completo:', this.funcionForm);
    console.log('Valor del formulario:', this.funcionForm.value);
    console.log('Estado válido:', this.funcionForm.valid);
    console.log('Errores del formulario:', this.funcionForm.errors);
    
    Object.keys(this.funcionForm.controls).forEach(key => {
      const control = this.funcionForm.get(key);
      console.log(`\nCampo: ${key}`);
      console.log('  Valor:', control?.value);
      console.log('  Válido:', control?.valid);
      console.log('  Errores:', control?.errors);
      console.log('  Touched:', control?.touched);
      console.log('  Dirty:', control?.dirty);
    });

    // Mostrar también en alerta
    const estado = Object.keys(this.funcionForm.controls).map(key => {
      const control = this.funcionForm.get(key);
      return `${key}: "${control?.value}" (${control?.valid ? 'Válido' : 'Inválido'})`;
    }).join('\n');
    
    alert(`Estado del formulario:\n\n${estado}\n\nRevisa la consola para más detalles.`);
  }

  cancelarFuncion() {
    this.funcionForm.reset();
    this.disponibilidadInfo = '';
  }

  mostrarTodasLasFunciones() {
    console.log('Obteniendo todas las funciones del sistema...');
    
    this.funcionesService.getFunciones().subscribe({
      next: (response) => {
        console.log('📋 Todas las funciones en el sistema:', response);
        
        const funcionesActivas = response.data?.filter(f => !f.cancelada) || [];
        
        if (funcionesActivas.length === 0) {
          alert('✅ No hay funciones programadas en el sistema');
          return;
        }

        const funcionesInfo = funcionesActivas.map(f => {
          const inicio = new Date(f.inicio);
          const sala = this.salas.find(s => s.id === f.salaId);
          return `• ${inicio.toLocaleDateString()} ${this.formatearHora12(inicio)} - Sala: ${sala?.nombre || 'Desconocida'} - ${f.pelicula?.titulo || 'Sin título'}`;
        }).join('\n');

        alert(`📋 FUNCIONES EXISTENTES (${funcionesActivas.length}):\n\n${funcionesInfo}\n\nEvita crear funciones que se solapen con estas.`);
      },
      error: (error) => {
        console.error('Error al obtener funciones:', error);
        alert('❌ Error al obtener las funciones existentes');
      }
    });
  }

  analizarConflicto() {
    const funcionData = this.funcionForm.value;
    const salaId = funcionData.salaId;
    const inicioNuevo = new Date(funcionData.inicio);

    if (!salaId || !funcionData.inicio) {
      alert('⚠️ Primero selecciona sala y fecha/hora para analizar conflictos');
      return;
    }

    console.log('🔍 Analizando conflictos para:', {
      ...funcionData,
      inicioFormatted: inicioNuevo.toLocaleString(),
      timestamp: inicioNuevo.getTime()
    });

    // Obtener funciones de la sala específica
    this.funcionesService.getFuncionesPorSala(salaId).subscribe({
      next: (funciones) => {
        const funcionesActivas = funciones.filter(f => !f.cancelada);
        
        if (funcionesActivas.length === 0) {
          alert('✅ No hay funciones en esta sala. ¡Libre para usar!');
          return;
        }

        // Analizar cada función existente
        const conflictos = funcionesActivas.map(f => {
          const inicioExistente = new Date(f.inicio);
          const duracionExistente = f.pelicula?.duracionMin || 120;
          const finExistente = new Date(inicioExistente.getTime() + duracionExistente * 60000);

          const peliculaNueva = this.peliculas.find(p => p.id === funcionData.peliculaId);
          const duracionNueva = peliculaNueva?.duracionMin || 120;
          const finNuevo = new Date(inicioNuevo.getTime() + duracionNueva * 60000);

          // Verificar solapamiento
          const haySolapamiento = (inicioNuevo < finExistente && finNuevo > inicioExistente);

          return {
            funcion: f,
            inicioExistente,
            finExistente,
            haySolapamiento,
            diferencia: Math.abs(inicioNuevo.getTime() - inicioExistente.getTime()) / (1000 * 60) // minutos
          };
        });

        const conflictosReales = conflictos.filter(c => c.haySolapamiento);

        if (conflictosReales.length === 0) {
          const funcionesCercanas = conflictos.filter(c => c.diferencia < 180); // 3 horas
          if (funcionesCercanas.length > 0) {
            const info = funcionesCercanas.map(c => 
              `• ${this.formatearHora12(c.inicioExistente)} - ${this.formatearHora12(c.finExistente)} (${c.funcion.pelicula?.titulo})`
            ).join('\n');
            alert(`⚠️ No hay conflicto directo, pero hay funciones cercanas:\n\n${info}\n\nRecomendado: Deja al menos 30 minutos entre funciones.`);
          } else {
            alert('✅ ¡No hay conflictos! Puedes crear la función.');
          }
        } else {
          const peliculaNueva = this.peliculas.find(p => p.id === funcionData.peliculaId);
          const duracionNueva = peliculaNueva?.duracionMin || 120;
          const finNuevo = new Date(inicioNuevo.getTime() + duracionNueva * 60000);
          
          const info = conflictosReales.map(c => 
            `• CONFLICTO: ${this.formatearHora12(c.inicioExistente)} - ${this.formatearHora12(c.finExistente)}\n  Película: ${c.funcion.pelicula?.titulo}\n  Se solapa con tu horario: ${this.formatearHora12(inicioNuevo)} - ${this.formatearHora12(finNuevo)}`
          ).join('\n\n');
          
          alert(`❌ CONFLICTOS DETECTADOS:\n\n${info}\n\nCambia el horario para evitar solapamientos.`);
        }
      },
      error: (error) => {
        console.error('Error al analizar conflictos:', error);
        alert('❌ Error al analizar conflictos');
      }
    });
  }

  simularCreacion() {
    const funcionData = this.funcionForm.value;
    
    if (this.funcionForm.invalid) {
      alert('❌ Completa todos los campos primero');
      return;
    }

    console.log('🧪 SIMULANDO CREACIÓN DE FUNCIÓN');
    console.log('Datos que se enviarían:', funcionData);

    // Usar el endpoint de debug del backend
    this.funcionesService.debugConflictos(funcionData).subscribe({
      next: (response) => {
        console.log('🐛 Respuesta del debug:', response);
        
        if (response.hayConflictos) {
          const conflictos = response.analisisConflictos
            .filter((a: any) => a.haySolapamiento)
            .map((a: any) => `• ${a.pelicula}: ${a.inicioExistente} - ${a.finExistente}`)
            .join('\n');
            
          alert(`🚫 CONFLICTOS DETECTADOS:\n\n${response.datosNuevaFuncion.pelicula}\nSala: ${response.datosNuevaFuncion.sala}\nHorario propuesto: ${response.datosNuevaFuncion.inicio} - ${response.datosNuevaFuncion.fin}\n\nConflictos:\n${conflictos}\n\n${response.mensaje}`);
        } else {
          alert(`✅ SIN CONFLICTOS:\n\n${response.datosNuevaFuncion.pelicula}\nSala: ${response.datosNuevaFuncion.sala}\nHorario: ${response.datosNuevaFuncion.inicio} - ${response.datosNuevaFuncion.fin}\n\nFunciones existentes en sala: ${response.funcionesExistentes}\n\n${response.mensaje}\n\n¡Puedes crear la función sin problemas!`);
        }
      },
      error: (error) => {
        console.error('❌ Error en debug:', error);
        alert(`❌ Error al hacer debug:\n\n${error.error?.message || error.message}\n\nRevisa la consola para más detalles.`);
      }
    });
  }

  limpiarBaseDatos() {
    if (confirm('⚠️ ¿Estás seguro de que quieres ver todas las funciones en la base de datos? (Esto no eliminará nada, solo mostrará información)')) {
      
      // Obtener funciones por fecha específica
      const funcionData = this.funcionForm.value;
      if (funcionData.inicio) {
        const fecha = new Date(funcionData.inicio);
        const fechaStr = fecha.toISOString().split('T')[0];
        
        console.log('📅 Buscando funciones para la fecha:', fechaStr);
        
        this.funcionesService.getFunciones({
          page: 1,
          limit: 100
        }).subscribe({
          next: (response) => {
            console.log('📅 Funciones en la fecha seleccionada:', response);
            
            if (!response.data || response.data.length === 0) {
              alert(`✅ NO HAY FUNCIONES programadas para el ${fecha.toLocaleDateString()}.\n\nEsto confirma que NO debería haber conflictos.`);
            } else {
              const funcionesInfo = response.data.map(f => {
                const inicio = new Date(f.inicio);
                return `• ${this.formatearHora12(inicio)} - ${f.pelicula?.titulo || 'Sin título'} - Sala: ${f.sala?.nombre || 'Desconocida'}${f.cancelada ? ' (CANCELADA)' : ''}`;
              }).join('\n');
              
              alert(`📅 FUNCIONES ENCONTRADAS para ${fecha.toLocaleDateString()}:\n\n${funcionesInfo}\n\nSi alguna está CANCELADA, no debería causar conflicto.`);
            }
          },
          error: (error) => {
            console.error('Error al buscar funciones por fecha:', error);
            alert('❌ Error al buscar funciones por fecha');
          }
        });
      }
    }
  }

  // Método de prueba forzada - bypassa validaciones del frontend
  probarCreacionForzada(): void {
    if (!this.funcionForm.valid) {
      alert('❌ El formulario no está válido');
      return;
    }

    const funcionData = this.funcionForm.value;
    
    alert('🔄 PRUEBA FORZADA: Enviando datos directamente al backend sin validaciones adicionales del frontend...');
    
    console.log('🚀 DATOS DE LA FUNCIÓN PARA PRUEBA FORZADA:', {
      pelicula_id: funcionData.pelicula_id,
      sala_id: funcionData.sala_id,
      fecha: funcionData.fecha,
      hora: funcionData.hora,
      precio: funcionData.precio,
      fechaCompleta: `${funcionData.fecha}T${funcionData.hora}`
    });

    // Llamada directa al servicio sin validaciones adicionales
    this.funcionesService.createFuncion(funcionData).subscribe({
      next: (response: any) => {
        console.log('✅ ÉXITO EN PRUEBA FORZADA:', response);
        alert('🎉 ¡FUNCIÓN CREADA EXITOSAMENTE EN PRUEBA FORZADA!');
        this.cargarPeliculas();
        this.funcionForm.reset();
      },
      error: (error: any) => {
        console.error('❌ ERROR EN PRUEBA FORZADA:', {
          error: error,
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message,
          fullError: error.error
        });
        alert(`❌ ERROR EN PRUEBA FORZADA:\nStatus: ${error.status}\nMensaje: ${error.error?.message || 'Error desconocido'}`);
      }
    });
  }

  formatearHora12(fecha: Date | string): string {
    const date = fecha instanceof Date ? fecha : new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Métodos para filtros de búsqueda
  inicializarFiltros(): void {
    // Extraer géneros únicos de todas las películas
    const todosLosGeneros = this.todasLasPeliculas
      .flatMap(pelicula => pelicula.generos || [])
      .filter((genero, index, array) => array.indexOf(genero) === index)
      .sort();
    
    this.generosDisponibles = todosLosGeneros;
    console.log('Géneros disponibles:', this.generosDisponibles);
  }

  aplicarFiltroBusqueda(): void {
    console.log('Aplicando filtros:', {
      busqueda: this.filtroBusqueda,
      estado: this.filtroEstado,
      genero: this.filtroGenero
    });

    let peliculasTemp = [...this.todasLasPeliculas];

    // Filtro por texto de búsqueda
    if (this.filtroBusqueda && this.filtroBusqueda.trim() !== '') {
      const busqueda = this.filtroBusqueda.toLowerCase().trim();
      peliculasTemp = peliculasTemp.filter(pelicula => 
        pelicula.titulo.toLowerCase().includes(busqueda) ||
        pelicula.clasificacion?.toLowerCase().includes(busqueda) ||
        (pelicula.generos && pelicula.generos.some(genero => 
          genero.toLowerCase().includes(busqueda)
        )) ||
        pelicula.sinopsis?.toLowerCase().includes(busqueda)
      );
    }

    // Filtro por estado
    if (this.filtroEstado && this.filtroEstado !== '') {
      peliculasTemp = peliculasTemp.filter(pelicula => 
        pelicula.estado === this.filtroEstado
      );
    }

    // Filtro por género
    if (this.filtroGenero && this.filtroGenero !== '') {
      peliculasTemp = peliculasTemp.filter(pelicula => 
        pelicula.generos && pelicula.generos.includes(this.filtroGenero)
      );
    }

    this.peliculasFiltradas = peliculasTemp;
    
    console.log(`Filtros aplicados: ${this.peliculasFiltradas.length} de ${this.todasLasPeliculas.length} películas`);
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroEstado = '';
    this.filtroGenero = '';
    this.aplicarFiltroBusqueda();
    console.log('Filtros limpiados');
  }

  hayFiltrosActivos(): boolean {
    return !!(this.filtroBusqueda || this.filtroEstado || this.filtroGenero);
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.filtroBusqueda) count++;
    if (this.filtroEstado) count++;
    if (this.filtroGenero) count++;
    return count;
  }

  // Métodos para sugerencias de búsqueda
  onBusquedaInput(event: any): void {
    const query = event.target.value;
    this.filtroBusqueda = query;
    
    if (query && query.trim().length > 0) {
      this.actualizarSugerencias(query);
      this.mostrarSugerencias = true;
    } else {
      this.sugerenciasPeliculas = [];
      this.mostrarSugerencias = false;
    }
    
    // Aplicar filtros después de un pequeño delay para mejor UX
    setTimeout(() => {
      this.aplicarFiltroBusqueda();
    }, 100);
  }

  actualizarSugerencias(query: string): void {
    if (!query || query.trim().length === 0) {
      this.sugerenciasPeliculas = [];
      return;
    }

    const busqueda = query.toLowerCase().trim();
    const sugerencias = this.todasLasPeliculas
      .filter(pelicula => 
        pelicula.titulo.toLowerCase().includes(busqueda) ||
        pelicula.clasificacion?.toLowerCase().includes(busqueda) ||
        (pelicula.generos && pelicula.generos.some(genero => 
          genero.toLowerCase().includes(busqueda)
        ))
      )
      .slice(0, 6); // Limitar a 6 sugerencias máximo

    this.sugerenciasPeliculas = sugerencias;
    this.sugerenciaSeleccionada = -1;
  }

  seleccionarSugerencia(pelicula: Pelicula): void {
    this.filtroBusqueda = pelicula.titulo;
    this.mostrarSugerencias = false;
    this.sugerenciasPeliculas = [];
    
    // Aplicar filtro con la película seleccionada
    setTimeout(() => {
      this.aplicarFiltroBusqueda();
    }, 50);
  }

  ocultarSugerencias(): void {
    // Delay para permitir que el click en una sugerencia se procese
    setTimeout(() => {
      this.mostrarSugerencias = false;
      this.sugerenciaSeleccionada = -1;
    }, 200);
  }
}
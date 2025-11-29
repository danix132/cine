# 🎬 CiMeme - Sistema de Gestión de Cine

Una aplicación web completa para la gestión de un cine, desarrollada con **Angular 17** (frontend) y **NestJS** (backend), utilizando **Prisma ORM** con **SQLite**.

## 🚀 Características Principales

### 👥 Gestión de Usuarios
- **Admin**: Control total del sistema
- **Vendedor**: Venta de boletos y dulcería en mostrador
- **Cliente**: Compra de boletos y dulcería online

### 🏢 Gestión de Salas
- Crear y configurar salas con filas y asientos
- Marcar asientos como dañados
- Visualización de disponibilidad en tiempo real

### 🎬 Gestión de Películas
- CRUD completo de películas
- Clasificaciones y géneros
- Estados activo/inactivo

### 🎭 Gestión de Funciones
- Programar funciones con sala, película, fecha y precio
- Validación de conflictos de horario
- Cancelación de funciones

### 🎫 Sistema de Boletos
- Reserva de asientos con bloqueo temporal
- Generación de códigos QR únicos
- Estados: reservado, pagado, cancelado

### 🛒 Carritos de Compra
- Carritos con expiración automática
- Gestión de items (boletos y dulcería)
- Cálculo automático de totales

### 🍿 Dulcería
- Gestión de combos y dulces
- Control de inventario
- Precios configurables

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS** - Framework de Node.js
- **Prisma ORM** - ORM moderno para TypeScript
- **SQLite** - Base de datos (configurable para PostgreSQL)
- **JWT** - Autenticación y autorización
- **Swagger** - Documentación de API
- **Moment.js** - Manejo de fechas y zonas horarias

### Frontend (Próximamente)
- **Angular 17** - Framework de frontend
- **Angular Material** - Componentes UI
- **Tailwind CSS** - Framework de estilos
- **RxJS** - Programación reactiva
- **Angular Signals** - Estado reactivo

## 📋 Requisitos Previos

- **Node.js** 18+ 
- **npm** o **pnpm**
- **Git**

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd cine-app
```

### 2. Instalar Dependencias del Backend
```bash
cd apps/backend
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus configuraciones
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu-super-secreto-jwt-muy-seguro-para-produccion"
JWT_EXPIRES_IN="24h"
PORT=3000
TZ="America/Mazatlan"
```

### 4. Configurar Base de Datos
```bash
# Generar cliente Prisma
npm run db:generate

# Crear base de datos y tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 5. Ejecutar el Backend
```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 📚 API Endpoints

### 🔐 Autenticación
- `POST /api/auth/register` - Registro de clientes
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario

### 👥 Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### 🏢 Salas
- `GET /api/salas` - Listar salas
- `POST /api/salas` - Crear sala
- `GET /api/salas/:id` - Obtener sala con asientos
- `PATCH /api/salas/:id` - Actualizar sala
- `PATCH /api/salas/:id/asientos-danados` - Marcar asientos dañados

### 🎬 Películas
- `GET /api/peliculas` - Listar películas
- `GET /api/peliculas/activas` - Películas activas
- `POST /api/peliculas` - Crear película
- `GET /api/peliculas/:id` - Obtener película con funciones

### 🎭 Funciones
- `GET /api/funciones` - Listar funciones
- `GET /api/funciones/proximas` - Funciones próximas
- `POST /api/funciones` - Crear función
- `POST /api/funciones/:id/cancelar` - Cancelar función

### 🛒 Carritos
- `POST /api/carritos` - Crear carrito
- `GET /api/carritos/mi-carrito` - Mi carrito
- `POST /api/carritos/:id/items` - Agregar item
- `GET /api/carritos/:id/total` - Calcular total

### 🍿 Dulcería
- `GET /api/dulceria` - Listar items
- `GET /api/dulceria/activos` - Items activos
- `POST /api/dulceria` - Crear item
- `GET /api/dulceria/inventario` - Ver inventario

## 🔑 Usuarios de Prueba

Después de ejecutar el seed, tendrás acceso a:

| Rol | Email | Contraseña |
|-----|-------|------------|
| 👨‍💼 Admin | `admin@cine.com` | `Admin123` |
| 👨‍💻 Vendedor | `vend@cine.com` | `Vendedor123` |
| 👤 Cliente | `cli@cine.com` | `Cliente123` |

## 📖 Documentación de API

Una vez que el backend esté ejecutándose, accede a la documentación Swagger en:

```
http://localhost:3000/docs
```

## 🧪 Scripts Disponibles

### Backend
```bash
# Desarrollo
npm run start:dev          # Ejecutar en modo desarrollo
npm run start:debug        # Ejecutar en modo debug

# Base de Datos
npm run db:generate        # Generar cliente Prisma
npm run db:push           # Sincronizar esquema
npm run db:migrate        # Ejecutar migraciones
npm run db:seed           # Poblar con datos de ejemplo
npm run db:studio         # Abrir Prisma Studio
npm run db:reset          # Resetear base de datos

# Producción
npm run build             # Compilar aplicación
npm run start:prod        # Ejecutar en producción

# Testing
npm run test              # Ejecutar tests
npm run test:watch        # Tests en modo watch
npm run test:cov          # Tests con cobertura
```

## 🌍 Configuración de Zona Horaria

La aplicación está configurada para usar la zona horaria **America/Mazatlan** por defecto. Puedes cambiar esto en el archivo `.env`:

```env
TZ="America/Mazatlan"
```

## 🔒 Seguridad

- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **Guards** para control de acceso por roles
- **Validación** de datos con class-validator
- **CORS** configurado para desarrollo

## 📱 Próximas Funcionalidades

### Frontend Angular 17
- [ ] Dashboard de administración
- [ ] Sistema de ventas POS para vendedores
- [ ] Portal de cliente para compra de boletos
- [ ] Gestor de asientos visual
- [ ] Sistema de impresión de boletos
- [ ] Reportes y estadísticas

### Funcionalidades Adicionales
- [ ] Sistema de pagos
- [ ] Notificaciones por email
- [ ] App móvil
- [ ] Integración con redes sociales
- [ ] Sistema de fidelización

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request




**¡Disfruta construyendo tu sistema de cine! 🎬✨**

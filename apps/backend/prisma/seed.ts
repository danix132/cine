import { PrismaClient, UserRole, PeliculaEstado, DulceriaItemTipo } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment-timezone';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar base de datos
  await prisma.$transaction([
    prisma.pedidoItem.deleteMany(),
    prisma.pedido.deleteMany(),
    prisma.carritoItem.deleteMany(),
    prisma.carrito.deleteMany(),
    prisma.boleto.deleteMany(),
    prisma.funcion.deleteMany(),
    prisma.asiento.deleteMany(),
    prisma.sala.deleteMany(),
    prisma.pelicula.deleteMany(),
    prisma.inventarioMov.deleteMany(),
    prisma.dulceriaItem.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✅ Base de datos limpiada');

  // Crear usuarios
  const adminPassword = await bcrypt.hash('Admin123', 12);
  const vendedorPassword = await bcrypt.hash('Vendedor123', 12);
  const clientePassword = await bcrypt.hash('Cliente123', 12);

  const admin = await prisma.user.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@cine.com',
      passwordHash: adminPassword,
      rol: UserRole.ADMIN,
    },
  });

  const vendedor = await prisma.user.create({
    data: {
      nombre: 'Vendedor Mostrador',
      email: 'vend@cine.com',
      passwordHash: vendedorPassword,
      rol: UserRole.VENDEDOR,
    },
  });

  const cliente = await prisma.user.create({
    data: {
      nombre: 'Cliente Demo',
      email: 'cli@cine.com',
      passwordHash: clientePassword,
      rol: UserRole.CLIENTE,
    },
  });

  console.log('✅ Usuarios creados');

  // Crear salas
  const sala1 = await prisma.sala.create({
    data: {
      nombre: 'Sala 1',
      filas: 8,
      asientosPorFila: 12,
    },
  });

  const sala2 = await prisma.sala.create({
    data: {
      nombre: 'Sala 2',
      filas: 10,
      asientosPorFila: 15,
    },
  });

  console.log('✅ Salas creadas');

  // Generar asientos para las salas
  const asientosSala1 = [];
  for (let fila = 1; fila <= 8; fila++) {
    for (let numero = 1; numero <= 12; numero++) {
      asientosSala1.push({
        salaId: sala1.id,
        fila,
        numero,
        estado: 'DISPONIBLE',
      });
    }
  }

  const asientosSala2 = [];
  for (let fila = 1; fila <= 10; fila++) {
    for (let numero = 1; numero <= 15; numero++) {
      asientosSala2.push({
        salaId: sala2.id,
        fila,
        numero,
        estado: 'DISPONIBLE',
      });
    }
  }

  await prisma.asiento.createMany({
    data: [...asientosSala1, ...asientosSala2],
  });

  console.log('✅ Asientos generados');

  // Crear películas
  const pelicula1 = await prisma.pelicula.create({
    data: {
      titulo: 'Avengers: Endgame',
      sinopsis: 'Los Vengadores se reúnen una vez más para revertir el daño causado por Thanos y restaurar el equilibrio del universo.',
      duracionMin: 181,
      clasificacion: 'B-13',
      posterUrl: 'https://example.com/avengers-poster.jpg',
      trailerUrl: 'https://youtube.com/watch?v=TcMBFSGVi1c',
      generos: ['Acción', 'Aventura', 'Ciencia Ficción'],
      estado: PeliculaEstado.ACTIVA,
    },
  });

  const pelicula2 = await prisma.pelicula.create({
    data: {
      titulo: 'Spider-Man: No Way Home',
      sinopsis: 'Peter Parker se enfrenta a villanos de diferentes universos mientras busca la ayuda del Doctor Strange.',
      duracionMin: 148,
      clasificacion: 'B-13',
      posterUrl: 'https://example.com/spiderman-poster.jpg',
      trailerUrl: 'https://youtube.com/watch?v=JfVOs4VSpmA',
      generos: ['Acción', 'Aventura', 'Ciencia Ficción'],
      estado: PeliculaEstado.ACTIVA,
    },
  });

  console.log('✅ Películas creadas');

  // Crear funciones
  const ahora = moment.tz('America/Mazatlan');
  
  const funcion1 = await prisma.funcion.create({
    data: {
      peliculaId: pelicula1.id,
      salaId: sala1.id,
      inicio: ahora.clone().add(2, 'hours').toDate(),
      precio: 150.00,
    },
  });

  const funcion2 = await prisma.funcion.create({
    data: {
      peliculaId: pelicula1.id,
      salaId: sala2.id,
      inicio: ahora.clone().add(5, 'hours').toDate(),
      precio: 150.00,
    },
  });

  const funcion3 = await prisma.funcion.create({
    data: {
      peliculaId: pelicula2.id,
      salaId: sala1.id,
      inicio: ahora.clone().add(8, 'hours').toDate(),
      precio: 140.00,
    },
  });

  const funcion4 = await prisma.funcion.create({
    data: {
      peliculaId: pelicula2.id,
      salaId: sala2.id,
      inicio: ahora.clone().add(1, 'day').add(2, 'hours').toDate(),
      precio: 140.00,
    },
  });

  console.log('✅ Funciones creadas');

  // Crear items de dulcería
  const comboNachos = await prisma.dulceriaItem.create({
    data: {
      nombre: 'Combo Nachos Grande',
      tipo: DulceriaItemTipo.COMBO,
      descripcion: 'Nachos con queso, guacamole, salsa y refresco grande',
      precio: 89.99,
      activo: true,
    },
  });

  const comboPalomitas = await prisma.dulceriaItem.create({
    data: {
      nombre: 'Combo Palomitas',
      tipo: DulceriaItemTipo.COMBO,
      descripcion: 'Palomitas grandes con refresco y dulce',
      precio: 75.50,
      activo: true,
    },
  });

  const palomitas = await prisma.dulceriaItem.create({
    data: {
      nombre: 'Palomitas Grandes',
      tipo: DulceriaItemTipo.DULCE,
      descripcion: 'Palomitas de maíz grandes con mantequilla',
      precio: 45.00,
      activo: true,
    },
  });

  const refresco = await prisma.dulceriaItem.create({
    data: {
      nombre: 'Refresco Grande',
      tipo: DulceriaItemTipo.DULCE,
      descripcion: 'Refresco de 500ml',
      precio: 25.00,
      activo: true,
    },
  });

  const chocolate = await prisma.dulceriaItem.create({
    data: {
      nombre: 'Chocolate',
      tipo: DulceriaItemTipo.DULCE,
      descripcion: 'Chocolate de leche',
      precio: 15.00,
      activo: true,
    },
  });

  console.log('✅ Items de dulcería creados');

  // Registrar movimientos de inventario inicial
  await prisma.inventarioMov.createMany({
    data: [
      { dulceriaItemId: comboNachos.id, delta: 50, motivo: 'Inventario inicial' },
      { dulceriaItemId: comboPalomitas.id, delta: 50, motivo: 'Inventario inicial' },
      { dulceriaItemId: palomitas.id, delta: 100, motivo: 'Inventario inicial' },
      { dulceriaItemId: refresco.id, delta: 200, motivo: 'Inventario inicial' },
      { dulceriaItemId: chocolate.id, delta: 150, motivo: 'Inventario inicial' },
    ],
  });

  console.log('✅ Inventario inicial registrado');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📋 Datos creados:');
  console.log(`👥 Usuarios: ${await prisma.user.count()}`);
  console.log(`🏢 Salas: ${await prisma.sala.count()}`);
  console.log(`🪑 Asientos: ${await prisma.asiento.count()}`);
  console.log(`🎬 Películas: ${await prisma.pelicula.count()}`);
  console.log(`🎭 Funciones: ${await prisma.funcion.count()}`);
  console.log(`🍿 Items de dulcería: ${await prisma.dulceriaItem.count()}`);
  console.log(`📦 Movimientos de inventario: ${await prisma.inventarioMov.count()}`);

  console.log('\n🔑 Credenciales de acceso:');
  console.log('👨‍💼 Admin: admin@cine.com / Admin123');
  console.log('👨‍💻 Vendedor: vend@cine.com / Vendedor123');
  console.log('👤 Cliente: cli@cine.com / Cliente123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

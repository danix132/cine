// Script para verificar boletos y su relación con funciones
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarBoletos() {
  console.log('🔍 Verificando boletos en la base de datos...\n');

  // 1. Total de boletos
  const totalBoletos = await prisma.boleto.count();
  console.log(`📊 Total de boletos en la BD: ${totalBoletos}`);

  // 2. Boletos por estado
  const boletosPorEstado = await prisma.boleto.groupBy({
    by: ['estado'],
    _count: true
  });
  console.log('\n📋 Boletos por estado:');
  boletosPorEstado.forEach(group => {
    console.log(`   - ${group.estado}: ${group._count}`);
  });

  // 3. Verificar funciones específicas
  const funcionesConBoletos = await prisma.funcion.findMany({
    where: {
      inicio: {
        gte: new Date('2025-09-01'),
        lte: new Date('2025-10-31')
      },
      cancelada: false
    },
    select: {
      id: true,
      inicio: true,
      pelicula: { select: { titulo: true } },
      sala: { select: { nombre: true } },
      _count: {
        select: { boletos: true }
      }
    }
  });

  console.log('\n🎬 Funciones en Sep-Oct 2025:');
  funcionesConBoletos.forEach(funcion => {
    console.log(`   - ${funcion.pelicula.titulo} | ${funcion.sala.nombre} | ${funcion.inicio.toLocaleDateString()}`);
    console.log(`     Total boletos: ${funcion._count.boletos}`);
  });

  // 4. Ver algunos boletos de ejemplo
  const boletosMuestra = await prisma.boleto.findMany({
    take: 5,
    include: {
      funcion: {
        select: {
          inicio: true,
          pelicula: { select: { titulo: true } }
        }
      }
    }
  });

  console.log('\n🎫 Muestra de boletos (primeros 5):');
  boletosMuestra.forEach((boleto, i) => {
    console.log(`   ${i+1}. ID: ${boleto.id.substring(0, 8)}...`);
    console.log(`      Estado: ${boleto.estado}`);
    console.log(`      Función: ${boleto.funcion?.pelicula?.titulo || 'N/A'}`);
    console.log(`      Fecha función: ${boleto.funcion?.inicio ? new Date(boleto.funcion.inicio).toLocaleDateString() : 'N/A'}`);
    console.log('');
  });

  // 5. Verificar si hay funciones SIN boletos
  const funcionesSinBoletos = funcionesConBoletos.filter(f => f._count.boletos === 0);
  console.log(`\n⚠️  Funciones sin boletos: ${funcionesSinBoletos.length}/${funcionesConBoletos.length}`);

  await prisma.$disconnect();
}

verificarBoletos().catch(console.error);

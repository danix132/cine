// Script para verificar los tipos de pedidos en la base de datos
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando pedidos en la base de datos...\n');
  
  const pedidos = await prisma.pedido.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      usuario: { select: { nombre: true, email: true } },
      vendedor: { select: { nombre: true, email: true } },
      items: { select: { tipo: true, descripcion: true } }
    }
  });
  
  console.log(`📊 Total pedidos recientes: ${pedidos.length}\n`);
  
  const pedidosWEB = pedidos.filter(p => p.tipo === 'WEB');
  const pedidosMOSTRADOR = pedidos.filter(p => p.tipo === 'MOSTRADOR');
  
  console.log(`🌐 Pedidos WEB: ${pedidosWEB.length}`);
  console.log(`🏪 Pedidos MOSTRADOR: ${pedidosMOSTRADOR.length}\n`);
  
  console.log('═══════════════════════════════════════════════\n');
  
  pedidos.forEach((pedido, index) => {
    console.log(`\n📦 Pedido #${index + 1}:`);
    console.log(`   ID: ${pedido.id.substring(0, 8)}...`);
    console.log(`   Tipo: ${pedido.tipo} ${pedido.tipo === 'WEB' ? '🌐' : '🏪'}`);
    console.log(`   Usuario: ${pedido.usuario?.nombre || 'Sin usuario'} (${pedido.usuario?.email || 'N/A'})`);
    console.log(`   Vendedor: ${pedido.vendedor?.nombre || 'Sin vendedor'}`);
    console.log(`   Total: $${pedido.total}`);
    console.log(`   Estado: ${pedido.estado}`);
    console.log(`   Método Pago: ${pedido.metodoPago || 'N/A'}`);
    console.log(`   Items: ${pedido.items.length}`);
    pedido.items.forEach((item, i) => {
      console.log(`      ${i + 1}. ${item.tipo}: ${item.descripcion || 'Sin descripción'}`);
    });
    console.log(`   Fecha: ${pedido.createdAt.toLocaleString('es-ES')}`);
  });
  
  console.log('\n═══════════════════════════════════════════════\n');
  
  // Verificar si hay pedidos WEB con vendedorId (esto sería incorrecto)
  const pedidosWEBConVendedor = pedidos.filter(p => p.tipo === 'WEB' && p.vendedorId);
  if (pedidosWEBConVendedor.length > 0) {
    console.log(`⚠️  ADVERTENCIA: ${pedidosWEBConVendedor.length} pedidos WEB tienen vendedorId (esto es incorrecto)`);
  }
  
  // Verificar si hay pedidos MOSTRADOR sin vendedorId (esto sería incorrecto)
  const pedidosMOSTRADORSinVendedor = pedidos.filter(p => p.tipo === 'MOSTRADOR' && !p.vendedorId);
  if (pedidosMOSTRADORSinVendedor.length > 0) {
    console.log(`⚠️  ADVERTENCIA: ${pedidosMOSTRADORSinVendedor.length} pedidos MOSTRADOR sin vendedorId (esto podría ser incorrecto)`);
  }
  
  console.log('\n✅ Verificación completada\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

// Script para corregir los pedidos de dulcería mal marcados
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Corrigiendo pedidos de dulcería...\n');
  
  // Encontrar pedidos tipo MOSTRADOR donde el usuario es CLIENTE
  // (esto indica que fueron compras web marcadas incorrectamente como mostrador)
  const pedidosIncorrectos = await prisma.pedido.findMany({
    where: {
      tipo: 'MOSTRADOR',
    },
    include: {
      usuario: { select: { nombre: true, email: true, rol: true } },
      vendedor: { select: { nombre: true, email: true, rol: true } },
      items: { select: { tipo: true } }
    }
  });
  
  console.log(`📦 Pedidos encontrados que necesitan corrección: ${pedidosIncorrectos.length}\n`);
  
  for (const pedido of pedidosIncorrectos) {
    // Verificar si el usuario Y el vendedor son la MISMA persona con rol CLIENTE
    // Esto indica una compra web incorrectamente marcada como mostrador
    if (pedido.usuario && pedido.usuario.rol === 'CLIENTE' && 
        pedido.vendedor && pedido.vendedor.rol === 'CLIENTE' &&
        pedido.usuarioId === pedido.vendedorId) {
      console.log(`\n🔄 Corrigiendo pedido ${pedido.id.substring(0, 8)}...`);
      console.log(`   Usuario: ${pedido.usuario.nombre} (${pedido.usuario.email})`);
      console.log(`   Tipo actual: MOSTRADOR ❌`);
      console.log(`   Tipo correcto: WEB ✅`);
      console.log(`   Items: ${pedido.items.length} (${pedido.items.map(i => i.tipo).join(', ')})`);
      
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: {
          tipo: 'WEB',
          estado: 'COMPLETADO',
          metodoPago: 'TARJETA',
          vendedorId: null, // Quitar vendedorId en compras web
        }
      });
      
      console.log(`   ✅ Pedido corregido a WEB sin vendedor`);
    } else if (pedido.vendedor && pedido.vendedor.rol === 'VENDEDOR') {
      console.log(`\n✅ Pedido ${pedido.id.substring(0, 8)} es correcto (venta real de mostrador)`);
      console.log(`   Vendedor: ${pedido.vendedor.nombre}`);
    }
  }
  
  console.log('\n\n✅ Corrección completada');
  
  // Mostrar resumen actualizado
  const pedidosWEB = await prisma.pedido.count({ where: { tipo: 'WEB' } });
  const pedidosMOSTRADOR = await prisma.pedido.count({ where: { tipo: 'MOSTRADOR' } });
  
  console.log('\n📊 Resumen actualizado:');
  console.log(`   🌐 Pedidos WEB: ${pedidosWEB}`);
  console.log(`   🏪 Pedidos MOSTRADOR: ${pedidosMOSTRADOR}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

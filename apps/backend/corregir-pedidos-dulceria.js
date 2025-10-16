const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function corregirPedidosDulceria() {
  try {
    console.log('🔍 Buscando pedidos de dulcería con tipo incorrecto...\n');

    // 1. Buscar todos los pedidos de dulcería (tienen items de tipo DULCERIA)
    const pedidos = await prisma.pedido.findMany({
      include: {
        items: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            rol: true
          }
        }
      },
      where: {
        items: {
          some: {
            tipo: 'DULCERIA'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📦 Total de pedidos de dulcería encontrados: ${pedidos.length}\n`);

    let pedidosCorregidos = 0;
    let pedidosIncorrectos = 0;

    for (const pedido of pedidos) {
      // Determinar el tipo correcto basado en el rol del usuario
      const tipoEsperado = pedido.usuario?.rol === 'VENDEDOR' ? 'MOSTRADOR' : 'WEB';
      const metodoPagoEsperado = tipoEsperado === 'WEB' ? 'TARJETA' : 'EFECTIVO';
      const vendedorIdEsperado = tipoEsperado === 'MOSTRADOR' ? pedido.usuarioId : null;

      // Verificar si el pedido tiene datos incorrectos
      const esIncorrecto = 
        pedido.tipo !== tipoEsperado || 
        pedido.metodoPago !== metodoPagoEsperado ||
        pedido.vendedorId !== vendedorIdEsperado;

      if (esIncorrecto) {
        pedidosIncorrectos++;
        
        console.log(`❌ Pedido incorrecto encontrado:`);
        console.log(`   ID: ${pedido.id}`);
        console.log(`   Usuario: ${pedido.usuario?.nombre} (${pedido.usuario?.email})`);
        console.log(`   Rol del usuario: ${pedido.usuario?.rol}`);
        console.log(`   Tipo actual: ${pedido.tipo} → Debería ser: ${tipoEsperado}`);
        console.log(`   Método pago actual: ${pedido.metodoPago} → Debería ser: ${metodoPagoEsperado}`);
        console.log(`   VendedorId actual: ${pedido.vendedorId} → Debería ser: ${vendedorIdEsperado}`);
        console.log(`   Fecha: ${pedido.createdAt.toLocaleString()}`);
        console.log(`   Items: ${pedido.items.length}`);
        
        // Corregir el pedido
        await prisma.pedido.update({
          where: { id: pedido.id },
          data: {
            tipo: tipoEsperado,
            metodoPago: metodoPagoEsperado,
            vendedorId: vendedorIdEsperado
          }
        });

        pedidosCorregidos++;
        console.log(`   ✅ Pedido corregido\n`);
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   Total pedidos revisados: ${pedidos.length}`);
    console.log(`   Pedidos incorrectos encontrados: ${pedidosIncorrectos}`);
    console.log(`   Pedidos corregidos: ${pedidosCorregidos}`);
    console.log(`   Pedidos correctos: ${pedidos.length - pedidosIncorrectos}`);

    if (pedidosCorregidos > 0) {
      console.log('\n✅ Corrección completada exitosamente');
    } else {
      console.log('\n✨ No se encontraron pedidos para corregir');
    }

  } catch (error) {
    console.error('❌ Error al corregir pedidos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
corregirPedidosDulceria()
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });

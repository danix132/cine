// Script para monitorear en tiempo real las compras de dulcería
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarUltimaCompra() {
  console.log('\n🔍 Verificando última compra de dulcería...\n');
  
  const ultimoPedido = await prisma.pedido.findFirst({
    where: {
      items: {
        some: {
          tipo: 'DULCERIA'
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      usuario: { select: { nombre: true, email: true, rol: true } },
      vendedor: { select: { nombre: true, email: true, rol: true } },
      items: { 
        select: { 
          tipo: true, 
          descripcion: true,
          cantidad: true,
          precio: true,
          subtotal: true
        } 
      }
    }
  });
  
  if (!ultimoPedido) {
    console.log('❌ No hay pedidos de dulcería en la base de datos');
    return;
  }
  
  console.log('═══════════════════════════════════════════════');
  console.log('📦 ÚLTIMO PEDIDO DE DULCERÍA');
  console.log('═══════════════════════════════════════════════\n');
  
  console.log(`🆔 ID: ${ultimoPedido.id.substring(0, 8)}...`);
  console.log(`📅 Fecha: ${ultimoPedido.createdAt.toLocaleString('es-ES')}`);
  console.log(`💵 Total: $${ultimoPedido.total}`);
  console.log(`📊 Estado: ${ultimoPedido.estado}`);
  console.log(`💳 Método Pago: ${ultimoPedido.metodoPago || 'N/A'}`);
  console.log('');
  
  // Información del usuario
  console.log('👤 USUARIO (quien compra):');
  console.log(`   Nombre: ${ultimoPedido.usuario?.nombre || 'Sin usuario'}`);
  console.log(`   Email: ${ultimoPedido.usuario?.email || 'N/A'}`);
  console.log(`   Rol: ${ultimoPedido.usuario?.rol || 'N/A'}`);
  console.log('');
  
  // Información del vendedor (si existe)
  if (ultimoPedido.vendedor) {
    console.log('🏪 VENDEDOR (quien vendió):');
    console.log(`   Nombre: ${ultimoPedido.vendedor.nombre}`);
    console.log(`   Email: ${ultimoPedido.vendedor.email}`);
    console.log(`   Rol: ${ultimoPedido.vendedor.rol}`);
    console.log('');
  }
  
  // TIPO DE PEDIDO (lo más importante)
  const iconoTipo = ultimoPedido.tipo === 'WEB' ? '🌐' : '🏪';
  const tipoTexto = ultimoPedido.tipo === 'WEB' ? 'COMPRA WEB (Cliente desde internet)' : 'VENTA MOSTRADOR (Vendedor en físico)';
  
  console.log('════════════════════════════════════════');
  console.log(`${iconoTipo} TIPO: ${ultimoPedido.tipo}`);
  console.log(`   ${tipoTexto}`);
  console.log('════════════════════════════════════════\n');
  
  // Items
  console.log('📦 ITEMS:');
  ultimoPedido.items.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.descripcion}`);
    console.log(`      Cantidad: ${item.cantidad}`);
    console.log(`      Precio: $${item.precio}`);
    console.log(`      Subtotal: $${item.subtotal}`);
  });
  console.log('');
  
  // Validación
  console.log('✅ VALIDACIÓN:');
  
  if (ultimoPedido.tipo === 'WEB') {
    if (!ultimoPedido.vendedorId && ultimoPedido.usuario?.rol === 'CLIENTE') {
      console.log('   ✅ CORRECTO: Compra WEB de cliente sin vendedor');
    } else if (ultimoPedido.vendedorId) {
      console.log('   ❌ ERROR: Compra WEB NO debe tener vendedorId');
    } else {
      console.log('   ⚠️  ADVERTENCIA: Usuario no es CLIENTE');
    }
  } else if (ultimoPedido.tipo === 'MOSTRADOR') {
    if (ultimoPedido.vendedorId && ultimoPedido.vendedor?.rol === 'VENDEDOR') {
      console.log('   ✅ CORRECTO: Venta MOSTRADOR con vendedor autorizado');
    } else if (!ultimoPedido.vendedorId) {
      console.log('   ❌ ERROR: Venta MOSTRADOR debe tener vendedorId');
    } else {
      console.log('   ⚠️  ADVERTENCIA: Vendedor no tiene rol VENDEDOR');
    }
  }
  
  console.log('\n═══════════════════════════════════════════════\n');
}

// Función para monitorear continuamente
async function monitorear() {
  await verificarUltimaCompra();
  
  console.log('👂 Esperando nueva compra... (presiona Ctrl+C para salir)\n');
  
  let ultimoPedidoId = null;
  const pedidoActual = await prisma.pedido.findFirst({
    where: { items: { some: { tipo: 'DULCERIA' } } },
    orderBy: { createdAt: 'desc' },
    select: { id: true }
  });
  
  if (pedidoActual) {
    ultimoPedidoId = pedidoActual.id;
  }
  
  setInterval(async () => {
    const nuevoPedido = await prisma.pedido.findFirst({
      where: { items: { some: { tipo: 'DULCERIA' } } },
      orderBy: { createdAt: 'desc' },
      select: { id: true }
    });
    
    if (nuevoPedido && nuevoPedido.id !== ultimoPedidoId) {
      console.log('\n🔔 ¡NUEVA COMPRA DETECTADA!\n');
      await verificarUltimaCompra();
      ultimoPedidoId = nuevoPedido.id;
    }
  }, 2000); // Verificar cada 2 segundos
}

// Ejecutar
monitorear().catch(console.error);

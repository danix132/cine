async function testCreateBoleto() {
  try {
    console.log('🧪 Probando creación de boleto...');
    
    // Primero, intentar hacer login para obtener el token
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);
    
    if (!loginData.token || !loginData.user) {
      console.log('❌ Login failed:', loginData);
      return;
    }
    
    const token = loginData.token;
    const userId = loginData.user.id;
    
    console.log('Token:', token.substring(0, 20) + '...');
    console.log('User ID:', userId);
    
    // Obtener una función disponible
    const funcionesResponse = await fetch('http://localhost:3000/api/funciones', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const funciones = await funcionesResponse.json();
    if (funciones.length === 0) {
      console.log('❌ No hay funciones disponibles');
      return;
    }
    
    const funcionId = funciones[0].id;
    console.log('Función seleccionada:', funcionId);
    
    // Obtener asientos de la sala
    const salaId = funciones[0].salaId;
    const asientosResponse = await fetch(`http://localhost:3000/api/salas/${salaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const salaData = await asientosResponse.json();
    const asientos = salaData.asientos;
    if (asientos.length === 0) {
      console.log('❌ No hay asientos disponibles');
      return;
    }
    
    const asientoId = asientos[0].id;
    console.log('Asiento seleccionado:', asientoId);
    
    // Crear boleto
    const boletoData = {
      funcionId: funcionId,
      asientoId: asientoId,
      usuarioId: userId,
      estado: 'PAGADO'
    };
    
    console.log('📤 Enviando datos de boleto:', boletoData);
    
    const boletoResponse = await fetch('http://localhost:3000/api/boletos', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(boletoData)
    });
    
    const boletoResult = await boletoResponse.json();
    
    if (boletoResponse.ok) {
      console.log('✅ Boleto creado exitosamente:', boletoResult);
    } else {
      console.error('❌ Error al crear boleto:', boletoResult);
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error.message);
  }
}

testCreateBoleto();
// Script de prueba para verificar la API key de Gemini
// Ejecutar con: node test-gemini-api.js

const API_KEY = 'AIzaSyAGFfa4rQlvInWUpZ6RYM1HgXpocXukSek';

async function testGeminiAPI() {
  console.log('🧪 Probando conexión con Gemini API...\n');
  console.log('🔑 API Key:', API_KEY.substring(0, 20) + '...\n');

  try {
    // Usar v1 en lugar de v1beta y gemini-pro en lugar de gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    
    console.log('📡 Enviando solicitud a:', url.replace(API_KEY, 'API_KEY_OCULTA'), '\n');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Di "Hola" en una sola palabra.'
          }]
        }]
      })
    });

    console.log('📥 Status code:', response.status);
    console.log('📥 Status text:', response.statusText, '\n');

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error de la API:');
      console.error(JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error('\n🔍 Detalles del error:');
        console.error('- Código:', data.error.code);
        console.error('- Mensaje:', data.error.message);
        console.error('- Estado:', data.error.status);
        
        if (data.error.code === 400) {
          console.error('\n💡 Error 400: API key inválida o mal formada');
        } else if (data.error.code === 429) {
          console.error('\n💡 Error 429: Límite de solicitudes excedido');
        } else if (data.error.code === 403) {
          console.error('\n💡 Error 403: API key no tiene permisos o está deshabilitada');
        }
      }
      return;
    }

    console.log('✅ ¡Conexión exitosa!');
    console.log('📝 Respuesta de Gemini:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0]) {
      const texto = data.candidates[0].content.parts[0].text;
      console.log('\n💬 Texto generado:', texto);
      console.log('\n🎉 ¡Tu API key funciona correctamente!');
    }

  } catch (error) {
    console.error('❌ Error al probar la API:');
    console.error('- Tipo:', error.constructor.name);
    console.error('- Mensaje:', error.message);
    
    if (error.message.includes('fetch')) {
      console.error('\n💡 Error de red: Verifica tu conexión a internet');
      console.error('💡 También puede ser un firewall o proxy bloqueando la conexión');
    }
  }
}

// Ejecutar la prueba
testGeminiAPI();

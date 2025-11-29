// Script de prueba para verificar la conexión con Gemini
// Ejecutar en la consola del navegador (F12)

async function testGeminiConnection() {
  console.log('🧪 Iniciando prueba de conexión con Gemini...');
  
  try {
    // Importar la librería
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    console.log('✅ Librería importada correctamente');
    
    // Inicializar con la API key
    const API_KEY = 'AIzaSyBtWK2dny_wXCzoDM1-4DZmD-s_MBOCLdg';
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log('✅ Cliente Gemini inicializado');
    
    // Crear el modelo
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Modelo cargado: gemini-1.5-flash');
    
    // Hacer una prueba simple
    console.log('📡 Enviando consulta de prueba...');
    const result = await model.generateContent('Di solo "Hola" en español');
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Respuesta recibida:', text);
    console.log('✅ ¡Conexión exitosa con Gemini!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    console.error('Mensaje:', error.message);
    return false;
  }
}

// Ejecutar la prueba
testGeminiConnection();

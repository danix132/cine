// Listar modelos disponibles en Gemini API
const API_KEY = 'AIzaSyAGFfa4rQlvInWUpZ6RYM1HgXpocXukSek';

async function listModels() {
  console.log('🔍 Listando modelos disponibles en Gemini API...\n');

  try {
    // Probar v1beta
    console.log('📡 Probando API v1beta...');
    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Modelos disponibles en v1beta:');
      if (data.models) {
        data.models.forEach(model => {
          console.log(`  - ${model.name}`);
          if (model.supportedGenerationMethods) {
            console.log(`    Métodos: ${model.supportedGenerationMethods.join(', ')}`);
          }
        });
      }
    } else {
      console.log('❌ Error en v1beta:', response.status, response.statusText);
    }

    // Probar v1
    console.log('\n📡 Probando API v1...');
    response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Modelos disponibles en v1:');
      if (data.models) {
        data.models.forEach(model => {
          console.log(`  - ${model.name}`);
          if (model.supportedGenerationMethods) {
            console.log(`    Métodos: ${model.supportedGenerationMethods.join(', ')}`);
          }
        });
      }
    } else {
      console.log('❌ Error en v1:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listModels();

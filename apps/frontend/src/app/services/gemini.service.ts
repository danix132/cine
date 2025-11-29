import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private GEMINI_API_KEY = 'AIzaSyAGFfa4rQlvInWUpZ6RYM1HgXpocXukSek';
  private GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
  
  // TMDB API Configuration
  private TMDB_API_KEY = '26094485b387b8167ae14428b4071973'; // ✅ API key configurada
  private TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  private TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

  constructor() {
    console.log('✅ Servicio Gemini + TMDB inicializado');
  }

  async obtenerDatosPelicula(titulo: string): Promise<any> {
    console.log(`🤖 Consultando Gemini para película: "${titulo}"`);
    
    const prompt = `Eres un experto en cine. Proporciona información detallada sobre la película "${titulo}".

INSTRUCCIONES CRÍTICAS: 
- Completa TODOS los campos con información real y precisa
- La sinopsis debe ser atractiva, detallada y tener entre 200-500 caracteres
- La duración debe ser en minutos (número entero)
- La clasificación debe ser una de: G, PG, PG-13, R, NC-17
- Los géneros deben ser precisos (máximo 3 géneros principales)
- NO incluyas posterUrl ni trailerUrl (los obtendremos de TMDB automáticamente)

Responde en formato JSON válido con EXACTAMENTE esta estructura:
{
  "sinopsis": "Sinopsis detallada y atractiva de la película",
  "duracionMin": número_entero_en_minutos,
  "clasificacion": "G/PG/PG-13/R/NC-17",
  "generos": ["Género1", "Género2", "Género3"]
}

EJEMPLO de respuesta correcta para "Inception":
{
  "sinopsis": "Un ladrón que roba secretos corporativos a través del uso de tecnología de sueños compartidos, recibe la tarea inversa de plantar una idea en la mente de un CEO. Una obra maestra de ciencia ficción que desafía la percepción de la realidad.",
  "duracionMin": 148,
  "clasificacion": "PG-13",
  "generos": ["Ciencia Ficción", "Acción", "Suspenso"]
}

Responde SOLO con el JSON, sin texto adicional, sin markdown, sin explicaciones.`;

    try {
      console.log('📡 Enviando solicitud a Gemini API...');
      
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      console.log('📥 Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de API:', errorData);
        throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]) {
        throw new Error('No se recibió respuesta válida de Gemini');
      }

      const text = data.candidates[0].content.parts[0].text;
      
      console.log('📥 Respuesta cruda de Gemini:', text);

      if (!text || text.trim() === '') {
        throw new Error('Gemini devolvió una respuesta vacía');
      }

      // Limpiar la respuesta para extraer solo el JSON
      let jsonText = text.trim();
      
      // Remover markdown code blocks si existen
      if (jsonText.includes('```json')) {
        const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
          jsonText = match[1];
        }
      } else if (jsonText.includes('```')) {
        const match = jsonText.match(/```\s*([\s\S]*?)\s*```/);
        if (match) {
          jsonText = match[1];
        }
      }

      jsonText = jsonText.trim();
      console.log('🧹 JSON limpio:', jsonText);

      // Intentar parsear el JSON
      const datosIA = JSON.parse(jsonText);
      
      // Validar que tenga los campos mínimos requeridos
      if (!datosIA.sinopsis && !datosIA.duracionMin) {
        throw new Error('La respuesta de Gemini no contiene datos válidos');
      }

      console.log('✅ Datos de Gemini parseados exitosamente:', datosIA);
      
      // Ahora buscar en TMDB para obtener URLs reales de póster y tráiler
      console.log('🎬 Buscando en TMDB para obtener URLs reales...');
      console.log('🔑 TMDB API Key configurada:', this.TMDB_API_KEY ? 'Sí ✅' : 'No ❌');
      
      try {
        const tmdbData = await this.buscarEnTMDB(titulo);
        
        console.log('📦 Datos recibidos de TMDB:', tmdbData);
        
        if (tmdbData) {
          datosIA.posterUrl = tmdbData.posterUrl || '';
          datosIA.trailerUrl = tmdbData.trailerUrl || '';
          
          console.log('🖼️ posterUrl asignado:', datosIA.posterUrl);
          console.log('🎥 trailerUrl asignado:', datosIA.trailerUrl);
          
          if (datosIA.posterUrl && datosIA.trailerUrl) {
            console.log('✅ URLs de TMDB obtenidas exitosamente');
          } else if (datosIA.posterUrl || datosIA.trailerUrl) {
            console.log('⚠️ Solo se obtuvo una URL de TMDB:', 
              datosIA.posterUrl ? 'Póster ✅' : 'Póster ❌', 
              datosIA.trailerUrl ? 'Tráiler ✅' : 'Tráiler ❌');
          } else {
            console.log('⚠️ No se encontraron URLs en TMDB para esta película');
          }
        } else {
          console.log('❌ buscarEnTMDB retornó null');
          datosIA.posterUrl = '';
          datosIA.trailerUrl = '';
        }
      } catch (tmdbError: any) {
        console.error('❌ Error al buscar en TMDB:', tmdbError.message);
        console.error('   Stack:', tmdbError.stack);
        // Continuar sin URLs en caso de error
        datosIA.posterUrl = '';
        datosIA.trailerUrl = '';
      }
      
      console.log('📋 Datos finales que se retornarán:', {
        sinopsis: datosIA.sinopsis ? '✅' : '❌',
        duracionMin: datosIA.duracionMin ? '✅' : '❌',
        clasificacion: datosIA.clasificacion ? '✅' : '❌',
        generos: datosIA.generos ? '✅' : '❌',
        posterUrl: datosIA.posterUrl ? '✅' : '❌',
        trailerUrl: datosIA.trailerUrl ? '✅' : '❌'
      });
      
      return datosIA;
      
    } catch (error: any) {
      console.error('❌ Error detallado al consultar Gemini:');
      console.error('- Tipo:', error.constructor.name);
      console.error('- Mensaje:', error.message);
      console.error('- Stack:', error.stack);
      
      if (error instanceof SyntaxError) {
        console.error('💥 Error de sintaxis JSON. La respuesta no es JSON válido.');
      }
      
      throw new Error(`Error de Gemini: ${error.message || 'Error desconocido'}`);
    }
  }

  /**
   * Busca una película en TMDB y obtiene poster y trailer URLs
   */
  private async buscarEnTMDB(titulo: string): Promise<{posterUrl: string, trailerUrl: string}> {
    console.log('🔍 === INICIO buscarEnTMDB ===');
    console.log('   Título recibido:', titulo);
    console.log('   TMDB_API_KEY:', this.TMDB_API_KEY);
    console.log('   TMDB_BASE_URL:', this.TMDB_BASE_URL);
    
    if (!this.TMDB_API_KEY || this.TMDB_API_KEY === 'TU_API_KEY_DE_TMDB_AQUI') {
      console.warn('⚠️ TMDB API key no configurada. Omitiendo búsqueda de URLs.');
      return { posterUrl: '', trailerUrl: '' };
    }

    try {
      // 1. Buscar la película por título
      console.log(`🔍 Buscando "${titulo}" en TMDB...`);
      const searchUrl = `${this.TMDB_BASE_URL}/search/movie?api_key=${this.TMDB_API_KEY}&query=${encodeURIComponent(titulo)}&language=es-MX&include_adult=false`;
      console.log('🌐 URL de búsqueda:', searchUrl);
      
      const searchResponse = await fetch(searchUrl);
      console.log('📡 Respuesta de búsqueda - Status:', searchResponse.status);
      if (!searchResponse.ok) {
        console.error(`❌ Error HTTP ${searchResponse.status} al buscar en TMDB`);
        return { posterUrl: '', trailerUrl: '' };
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.results || searchData.results.length === 0) {
        console.log(`❌ No se encontraron resultados para "${titulo}" en TMDB`);
        return { posterUrl: '', trailerUrl: '' };
      }

      // Tomar el primer resultado (más relevante)
      const pelicula = searchData.results[0];
      const peliculaId = pelicula.id;
      
      console.log(`✅ Película encontrada en TMDB:`);
      console.log(`   - Título: ${pelicula.title}`);
      console.log(`   - Año: ${pelicula.release_date?.substring(0, 4) || 'Desconocido'}`);
      console.log(`   - ID: ${peliculaId}`);
      console.log(`   - Popularidad: ${pelicula.popularity}`);

      // 2. Obtener el póster
      let posterUrl = '';
      if (pelicula.poster_path) {
        posterUrl = `${this.TMDB_IMAGE_BASE_URL}${pelicula.poster_path}`;
        console.log('✅ Póster obtenido:', posterUrl);
      } else {
        console.log('⚠️ No hay póster disponible para esta película en TMDB');
      }

      // 3. Obtener videos (tráiler) - Prioridad: Español Latino > Español España > Inglés
      let trailerUrl = '';
      let trailer: any = null;
      
      // Lista de idiomas en orden de prioridad
      const idiomas = [
        { code: 'es-MX', name: 'Español Latino' },
        { code: 'es-ES', name: 'Español España' },
        { code: 'en-US', name: 'Inglés' }
      ];

      // Intentar buscar tráiler en cada idioma según prioridad
      for (const idioma of idiomas) {
        if (trailer) break; // Si ya encontramos uno, salir del loop
        
        console.log(`🔍 Buscando tráiler en ${idioma.name} (${idioma.code})...`);
        const videosUrl = `${this.TMDB_BASE_URL}/movie/${peliculaId}/videos?api_key=${this.TMDB_API_KEY}&language=${idioma.code}`;
        const videosResponse = await fetch(videosUrl);
        
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          console.log(`   📹 ${videosData.results?.length || 0} videos encontrados`);
          
          // Buscar tráiler oficial primero
          trailer = videosData.results?.find((video: any) => 
            video.site === 'YouTube' && 
            (video.type === 'Trailer' || video.type === 'Teaser') &&
            video.official === true
          );

          // Si no hay oficial, buscar cualquier tráiler
          if (!trailer) {
            trailer = videosData.results?.find((video: any) => 
              video.site === 'YouTube' && 
              (video.type === 'Trailer' || video.type === 'Teaser')
            );
          }

          if (trailer) {
            console.log(`   ✅ Tráiler encontrado en ${idioma.name}!`);
            break;
          } else {
            console.log(`   ❌ No hay tráiler en ${idioma.name}`);
          }
        }
      }

      // Si encontramos un tráiler, generar la URL
      if (trailer) {
        trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        console.log('✅ Tráiler obtenido exitosamente!');
        console.log(`   - URL: ${trailerUrl}`);
        console.log(`   - Tipo: ${trailer.type}`);
        console.log(`   - Idioma: ${trailer.iso_639_1}`);
        console.log(`   - Oficial: ${trailer.official ? 'Sí' : 'No'}`);
      } else {
        console.log('⚠️ No se encontró ningún tráiler disponible en TMDB');
        console.log('   (Se buscó en Español Latino, Español España e Inglés)');
      }

      // Resumen final
      const resultado = { posterUrl, trailerUrl };
      console.log('📊 === RESUMEN BÚSQUEDA TMDB ===');
      console.log('   Título buscado:', titulo);
      console.log('   Póster:', posterUrl ? '✅ Encontrado' : '❌ No disponible');
      console.log('   Tráiler:', trailerUrl ? '✅ Encontrado' : '❌ No disponible');
      console.log('   Objeto a retornar:', resultado);
      console.log('🔍 === FIN buscarEnTMDB ===');

      return resultado;

    } catch (error: any) {
      console.error('❌ Error inesperado al buscar en TMDB:', error.message);
      console.error('   Stack:', error.stack);
      // Retornar vacíos en caso de error para no bloquear el proceso
      const errorResult = { posterUrl: '', trailerUrl: '' };
      console.log('⚠️ Retornando resultado vacío por error:', errorResult);
      return errorResult;
    }
  }
}

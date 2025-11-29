import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAGFfa4rQlvInWUpZ6RYM1HgXpocXukSek';
  private GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

  constructor() {
    console.log('✅ Servicio Gemini inicializado');
  }

  async generateText(prompt: string): Promise<string> {
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de Gemini API:', errorData);
        throw new Error(errorData.error?.message || `Error ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]) {
        throw new Error('No se recibió respuesta válida de Gemini');
      }

      const text = data.candidates[0].content.parts[0].text;
      
      console.log('✅ Respuesta de Gemini recibida');
      
      return text.trim();
      
    } catch (error: any) {
      console.error('❌ Error al consultar Gemini:', error.message);
      throw new Error('No se pudo generar la recomendación con IA');
    }
  }
}

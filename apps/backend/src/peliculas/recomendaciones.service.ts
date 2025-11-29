import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { GeminiService } from '../modules/gemini.service';
import { PeliculasService } from '../peliculas/peliculas.service';

@Injectable()
export class RecomendacionesService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
    private peliculasService: PeliculasService
  ) {}

  async getRecomendacionesParaUsuario(userId: string) {
    // Obtener el usuario con sus preferencias
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        nombre: true,
        generosPreferidos: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si el usuario no tiene preferencias, retornar películas populares
    if (!user.generosPreferidos || user.generosPreferidos.trim() === '') {
      const peliculasPopulares = await this.prisma.pelicula.findMany({
        where: {
          estado: 'ACTIVA',
          esProximoEstreno: false,
        },
        include: {
          funciones: {
            where: {
              inicio: { gt: new Date() },
              cancelada: false,
            },
            include: {
              sala: true,
            },
            orderBy: {
              inicio: 'asc'
            },
            take: 3
          },
        },
        take: 6,
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        recomendacion: '¡Hola! Aún no has seleccionado tus géneros favoritos. Aquí te mostramos las películas más recientes en cartelera. Ve a tu perfil para personalizar tus recomendaciones.',
        peliculas: peliculasPopulares,
        tienePeferencias: false
      };
    }

    // Parsear géneros preferidos
    const generosArray = user.generosPreferidos.split(',').map(g => g.trim());

    // Obtener películas que coincidan con las preferencias
    const peliculasRecomendadas = await this.peliculasService.getPeliculasPorPreferencias(generosArray);

    // Filtrar solo películas que tengan al menos una función disponible
    const peliculasConFunciones = peliculasRecomendadas.filter(
      pelicula => pelicula.funciones && pelicula.funciones.length > 0
    );

    // Si no hay películas con funciones, retornar mensaje
    if (peliculasConFunciones.length === 0) {
      return {
        recomendacion: `No encontramos películas en cartelera que coincidan exactamente con tus géneros favoritos (${user.generosPreferidos}). ¡Pero sigue atento! Pronto habrá nuevas películas.`,
        peliculas: [],
        tienePeferencias: true
      };
    }

    // Generar recomendación personalizada con IA
    const prompt = `Eres un asistente de cine experto y entusiasta. Un usuario llamado ${user.nombre} tiene como géneros favoritos: ${user.generosPreferidos}.

Tenemos estas películas disponibles en cartelera que coinciden con sus preferencias:
${peliculasConFunciones.map((p, i) => `${i + 1}. "${p.titulo}" - Géneros: ${p.generos?.join(', ') || 'N/A'} - ${p.sinopsis}`).join('\n')}

Genera un mensaje personalizado, cálido y entusiasta (máximo 150 palabras) recomendando estas películas al usuario. 
- Menciona por qué estas películas son perfectas para sus gustos
- Usa un tono amigable y cercano
- Sé conciso pero emotivo
- NO uses emojis
- Menciona alguna película específica del listado`;

    const recomendacionIA = await this.geminiService.generateText(prompt);

    return {
      recomendacion: recomendacionIA,
      peliculas: peliculasConFunciones,
      tienePeferencias: true,
      generosPreferidos: generosArray
    };
  }
}

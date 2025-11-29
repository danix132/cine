import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface DatosDulceriaTicket {
  numeroOrden: string;
  fecha: string;
  hora: string;
  tarjeta: string;
  items: Array<{
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
  total: number;
  pedidoId: string; // Cambiado de number a string para que coincida con UUID
  incluirQR?: boolean; // Si es false, no se genera el QR (para ventas de mostrador)
}

export interface DatosBoletoTicket {
  numeroOrden: string;
  fecha: string;
  hora: string;
  tarjeta: string;
  pelicula: {
    titulo: string;
    fechaFuncion: string;
    horaFuncion: string;
    sala: string;
  };
  asientos: Array<{
    fila: string;
    numero: number;
  }>;
  total: number;
  qrCode: string; // Base64 del QR
}

@Injectable({
  providedIn: 'root'
})
export class TicketPdfService {
  
  constructor() { }

  /**
   * Genera y descarga un PDF de ticket para boletos
   * @param datos Datos del pedido de boletos
   * @param soloGenerar Si es true, solo genera y retorna el base64 sin descargar
   * @returns Base64 del PDF si soloGenerar es true
   */
  async generarTicketBoletos(datos: DatosBoletoTicket, soloGenerar: boolean = false): Promise<string | void> {
    console.log('📄 Generando ticket PDF de boletos...');
    console.log('🔍 Datos del ticket:', {
      numeroOrden: datos.numeroOrden,
      pelicula: datos.pelicula.titulo,
      soloGenerar
    });
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Configurar fuente
    doc.setFont('helvetica');

    // ====== ENCABEZADO ======
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234); // Color morado
    doc.text('RECIBO DE COMPRA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('www.cineapp.com', pageWidth / 2, yPosition, { align: 'center' });
    
    // Línea separadora
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // ====== INFORMACIÓN DE LA ORDEN ======
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DE LA ORDEN', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Orden: ${datos.numeroOrden}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Fecha: ${datos.fecha}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Hora: ${datos.hora}`, 20, yPosition);

    // ====== INFORMACIÓN DE LA PELÍCULA ======
    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('PELÍCULA', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(datos.pelicula.titulo, 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha función: ${datos.pelicula.fechaFuncion}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Hora: ${datos.pelicula.horaFuncion}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Sala: ${datos.pelicula.sala}`, 20, yPosition);

    // ====== ASIENTOS ======
    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('ASIENTOS SELECCIONADOS', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    datos.asientos.forEach((asiento) => {
      doc.text(`• Fila ${asiento.fila}, Asiento ${asiento.numero}`, 25, yPosition);
      yPosition += 6;
    });

    // ====== INFORMACIÓN DE PAGO ======
    yPosition += 6;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('INFORMACIÓN DE PAGO', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tarjeta: ${datos.tarjeta}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Tipo de compra: Compra Web`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Total de boletos: ${datos.asientos.length}`, 20, yPosition);
    
    // Total con fondo de color
    yPosition += 10;
    doc.setFillColor(102, 126, 234);
    doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const totalFormateado = this.formatearPrecio(datos.total);
    doc.text(`TOTAL: ${totalFormateado}`, pageWidth / 2, yPosition, { align: 'center' });

    // ====== CÓDIGO QR ======
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('CÓDIGO QR DE VALIDACIÓN', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Presente este código QR en la entrada del cine', 20, yPosition);
    
    yPosition += 5;
    
    // Agregar QR (ya viene en base64)
    const qrSize = 50;
    const qrX = (pageWidth - qrSize) / 2;
    doc.addImage(datos.qrCode, 'PNG', qrX, yPosition, qrSize, qrSize);
    console.log('✅ QR agregado exitosamente en posición:', { x: qrX, y: yPosition, size: qrSize });
    yPosition += qrSize + 5;

    // ====== FOOTER ======
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('¡Gracias por su compra!', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Disfrute de la función', pageWidth / 2, yPosition, { align: 'center' });

    // Línea decorativa final
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // Guardar o retornar el PDF según el parámetro
    if (soloGenerar) {
      const pdfBase64 = doc.output('datauristring');
      console.log('✅ PDF de boletos generado en base64');
      console.log('   Tamaño:', pdfBase64.length);
      console.log('   Primeros 50 chars:', pdfBase64.substring(0, 50));
      return pdfBase64;
    } else {
      doc.save(`recibo-${datos.numeroOrden}.pdf`);
      console.log('✅ PDF de boletos generado y descargado exitosamente');
      return undefined;
    }
  }

  /**
   * Genera y descarga un PDF de ticket para dulcería
   * @param datos Datos del pedido de dulcería
   * @param soloGenerar Si es true, solo genera y retorna el base64 sin descargar
   * @returns Base64 del PDF si soloGenerar es true
   */
  async generarTicketDulceria(datos: DatosDulceriaTicket, soloGenerar: boolean = false): Promise<string | void> {
    console.log('📄 Generando ticket PDF de dulcería...');
    console.log('🔍 Datos del ticket:', {
      numeroOrden: datos.numeroOrden,
      pedidoId: datos.pedidoId,
      soloGenerar
    });
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Configurar fuente
    doc.setFont('helvetica');

    // ====== ENCABEZADO ======
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234); // Color morado
    doc.text('RECIBO DE COMPRA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('www.cineapp.com', pageWidth / 2, yPosition, { align: 'center' });
    
    // Línea separadora
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // ====== INFORMACIÓN DE LA ORDEN ======
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DE LA ORDEN', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Orden: ${datos.numeroOrden}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Fecha: ${datos.fecha}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Hora: ${datos.hora}`, 20, yPosition);

    // ====== PRODUCTOS ======
    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('PRODUCTOS', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    datos.items.forEach((item) => {
      const precioFormateado = this.formatearPrecio(item.subtotal);
      doc.text(`• ${item.nombre} (x${item.cantidad}) - ${precioFormateado}`, 25, yPosition);
      yPosition += 6;
    });

    // ====== INFORMACIÓN DE PAGO ======
    yPosition += 6;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('INFORMACIÓN DE PAGO', 20, yPosition);
    
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tarjeta: ${datos.tarjeta}`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Tipo de compra: Compra Web`, 20, yPosition);
    
    yPosition += 6;
    doc.text(`Total de items: ${datos.items.length}`, 20, yPosition);
    
    // Total con fondo de color
    yPosition += 10;
    doc.setFillColor(102, 126, 234);
    doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const totalFormateado = this.formatearPrecio(datos.total);
    doc.text(`TOTAL: ${totalFormateado}`, pageWidth / 2, yPosition, { align: 'center' });

    // ====== CÓDIGO QR (solo si incluirQR es true o undefined) ======
    if (datos.incluirQR !== false) {
      yPosition += 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 126, 234);
      doc.text('CÓDIGO QR DE VALIDACIÓN', 20, yPosition);
      
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Presente este código QR en el mostrador de dulcería', 20, yPosition);
      
      yPosition += 5;
      
      try {
        // Generar QR
        const codigoQR = `DULC-${datos.pedidoId}`;
        const qrDataUrl = await QRCode.toDataURL(codigoQR, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        const qrSize = 50;
        const qrX = (pageWidth - qrSize) / 2;
        doc.addImage(qrDataUrl, 'PNG', qrX, yPosition, qrSize, qrSize);
        console.log('✅ QR agregado exitosamente en posición:', { x: qrX, y: yPosition, size: qrSize });
        yPosition += qrSize + 5;
      } catch (error) {
        console.error('❌ Error al agregar QR al PDF:', error);
      }
    }

    // ====== FOOTER ======
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('¡Gracias por su compra!', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Disfrute de su experiencia en el cine', pageWidth / 2, yPosition, { align: 'center' });

    // Línea decorativa final
    yPosition += 8;
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // Guardar o retornar el PDF según el parámetro
    if (soloGenerar) {
      const pdfBase64 = doc.output('datauristring');
      console.log('✅ PDF de dulcería generado en base64');
      console.log('   Tamaño:', pdfBase64.length);
      console.log('   Primeros 50 chars:', pdfBase64.substring(0, 50));
      return pdfBase64;
    } else {
      doc.save(`recibo-${datos.numeroOrden}.pdf`);
      console.log('✅ PDF de dulcería generado y descargado exitosamente');
      return undefined;
    }
  }

  /**
   * Formatea un número como precio en pesos uruguayos
   */
  private formatearPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }
}

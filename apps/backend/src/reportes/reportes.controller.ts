import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('reportes')
@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('ventas')
  @ApiOperation({ summary: 'Reporte de ventas por período' })
  @ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' })
  @ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' })
  async reporteVentas(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    console.log('🔍 CONTROLLER: Parámetros recibidos para reporte de ventas:', { desde, hasta });
    
    // Convertir fechas string a Date y ajustar al final del día para 'hasta'
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    
    // Ajustar 'hasta' al final del día (23:59:59.999)
    fechaHasta.setHours(23, 59, 59, 999);
    
    console.log('📅 CONTROLLER: Fechas convertidas:', { fechaDesde, fechaHasta });
    
    return this.reportesService.reporteVentas(fechaDesde, fechaHasta);
  }

  @Get('ocupacion')
  @ApiOperation({ summary: 'Reporte de ocupación de salas por período' })
  @ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' })
  @ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' })
  async reporteOcupacion(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.reportesService.reporteOcupacion(new Date(desde), new Date(hasta));
  }

  @Get('top-peliculas')
  @ApiOperation({ summary: 'Top películas por ventas en período' })
  @ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' })
  @ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados' })
  async reporteTopPeliculas(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Query('limit') limit = 10,
  ) {
    return this.reportesService.reporteTopPeliculas(new Date(desde), new Date(hasta), limit);
  }

  @Get('ventas-por-vendedor')
  @ApiOperation({ summary: 'Reporte de ventas por vendedor en período' })
  @ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' })
  @ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' })
  async reporteVentasPorVendedor(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.reportesService.reporteVentasPorVendedor(new Date(desde), new Date(hasta));
  }

  @Get('mis-ventas/:vendedorId/desglose')
  @Roles('VENDEDOR', 'ADMIN')
  @ApiOperation({ summary: 'Desglose de ventas por tipo (boletos/dulcería) de un vendedor' })
  @ApiQuery({ name: 'desde', required: false, type: String, description: 'Fecha desde (ISO string)' })
  @ApiQuery({ name: 'hasta', required: false, type: String, description: 'Fecha hasta (ISO string)' })
  async reporteDesglosePorTipo(
    @Param('vendedorId') vendedorId: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const fechaDesde = desde ? new Date(desde) : new Date(new Date().setDate(new Date().getDate() - 30));
    const fechaHasta = hasta ? new Date(hasta) : new Date();
    
    // Ajustar 'hasta' al final del día
    fechaHasta.setHours(23, 59, 59, 999);
    
    return this.reportesService.reporteDesglosePorTipo(vendedorId, fechaDesde, fechaHasta);
  }

  @Get('mis-ventas/:vendedorId')
  @Roles('VENDEDOR', 'ADMIN')
  @ApiOperation({ summary: 'Reporte de ventas de un vendedor específico' })
  @ApiQuery({ name: 'desde', required: false, type: String, description: 'Fecha desde (ISO string)' })
  @ApiQuery({ name: 'hasta', required: false, type: String, description: 'Fecha hasta (ISO string)' })
  async reporteMisVentas(
    @Param('vendedorId') vendedorId: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    const fechaDesde = desde ? new Date(desde) : new Date(new Date().setDate(new Date().getDate() - 30));
    const fechaHasta = hasta ? new Date(hasta) : new Date();
    
    // Ajustar 'hasta' al final del día
    fechaHasta.setHours(23, 59, 59, 999);
    
    return this.reportesService.reporteMisVentasVendedor(vendedorId, fechaDesde, fechaHasta);
  }

  @Get('ventas-dulceria')
  @ApiOperation({ summary: 'Reporte de ventas de dulcería por período' })
  @ApiQuery({ name: 'desde', required: true, type: String, description: 'Fecha desde (ISO string)' })
  @ApiQuery({ name: 'hasta', required: true, type: String, description: 'Fecha hasta (ISO string)' })
  async reporteVentasDulceria(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    console.log('🍿 CONTROLLER: Generando reporte de ventas de dulcería');
    console.log('📅 CONTROLLER: Período:', { desde, hasta });
    
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    
    // Ajustar 'hasta' al final del día
    fechaHasta.setHours(23, 59, 59, 999);
    
    return this.reportesService.reporteVentasDulceria(fechaDesde, fechaHasta);
  }

  @Get('ventas-por-canal')
  @ApiOperation({ summary: 'Reporte de ventas por canal (online/taquilla)' })
  @ApiQuery({ name: 'desde', required: true, type: String })
  @ApiQuery({ name: 'hasta', required: true, type: String })
  async reporteVentasPorCanal(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);
    return this.reportesService.reporteVentasPorCanal(fechaDesde, fechaHasta);
  }

  @Get('descuentos-promociones')
  @ApiOperation({ summary: 'Reporte de descuentos y promociones' })
  @ApiQuery({ name: 'desde', required: true, type: String })
  @ApiQuery({ name: 'hasta', required: true, type: String })
  async reporteDescuentosPromociones(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);
    return this.reportesService.reporteDescuentosPromociones(fechaDesde, fechaHasta);
  }

  @Get('horarios-pico')
  @ApiOperation({ summary: 'Reporte de horarios pico de demanda' })
  @ApiQuery({ name: 'desde', required: true, type: String })
  @ApiQuery({ name: 'hasta', required: true, type: String })
  async reporteHorariosPico(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);
    return this.reportesService.reporteHorariosPico(fechaDesde, fechaHasta);
  }

  @Get('ingresos-por-pelicula')
  @ApiOperation({ summary: 'Reporte de ingresos por película con detalle' })
  @ApiQuery({ name: 'desde', required: true, type: String })
  @ApiQuery({ name: 'hasta', required: true, type: String })
  async reporteIngresosPorPelicula(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);
    return this.reportesService.reporteIngresosPorPelicula(fechaDesde, fechaHasta);
  }

  @Get('dashboard-kpis')
  @ApiOperation({ summary: 'Dashboard con KPIs principales' })
  @ApiQuery({ name: 'desde', required: true, type: String })
  @ApiQuery({ name: 'hasta', required: true, type: String })
  async reporteDashboardKPIs(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);
    return this.reportesService.reporteDashboardKPIs(fechaDesde, fechaHasta);
  }

  @Get('serie-temporal')
  @ApiOperation({ summary: 'Serie temporal de ventas por día' })
  @ApiQuery({ name: 'desde', required: true, type: String })
  @ApiQuery({ name: 'hasta', required: true, type: String })
  async reporteSerieTemporal(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);
    return this.reportesService.reporteSerieTemporal(fechaDesde, fechaHasta);
  }
}

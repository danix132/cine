import { ReportesService } from './reportes.service';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    reporteVentas(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        totalVentas: number;
        cantidadPedidos: number;
        ventas: ({
            usuario: {
                nombre: string;
                email: string;
            };
            vendedor: {
                nombre: string;
                email: string;
            };
            items: {
                tipo: import("@prisma/client").$Enums.PedidoItemTipo;
                descripcion: string;
                cantidad: number;
                precio: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            id: string;
            usuarioId: string | null;
            vendedorId: string | null;
            total: import("@prisma/client/runtime/library").Decimal;
            tipo: import("@prisma/client").$Enums.PedidoTipo;
            estado: import("@prisma/client").$Enums.PedidoEstado;
            metodoPago: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    reporteOcupacion(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        totalFunciones: number;
        ocupacionPorFuncion: {
            funcionId: any;
            pelicula: any;
            sala: any;
            inicio: any;
            totalAsientos: number;
            asientosOcupados: any;
            porcentajeOcupacion: number;
        }[];
        promedioOcupacion: number;
    }>;
    reporteTopPeliculas(desde: string, hasta: string, limit?: number): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        topPeliculas: {
            id: string;
            titulo: string;
            totalBoletos: number;
            totalFunciones: number;
            promedioBoletosPorFuncion: number;
        }[];
    }>;
    reporteVentasPorVendedor(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        ventasPorVendedor: {
            vendedorId: string;
            nombre: string;
            email: string;
            rol: import("@prisma/client").$Enums.UserRole;
            totalVentas: number;
            cantidadPedidos: number;
        }[];
    }>;
    reporteDesglosePorTipo(vendedorId: string, desde?: string, hasta?: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        vendedorId: string;
        desglose: {
            boletos: {
                cantidad: number;
                total: number;
            };
            dulceria: {
                cantidad: number;
                total: number;
            };
        };
    }>;
    reporteMisVentas(vendedorId: string, desde?: string, hasta?: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        ventasPorVendedor: {
            vendedorId: string;
            nombre: string;
            email: string;
            totalVentas: number;
            cantidadPedidos: number;
        }[];
    }>;
    reporteVentasDulceria(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        totalVentas: number;
        totalProductosVendidos: number;
        ventasPorProducto: {
            productoId: string;
            nombre: string;
            tipo: string;
            cantidadVendida: number;
            totalVentas: number;
        }[];
        ventasPorDia: {
            fecha: string;
            cantidadProductos: number;
            totalVentas: number;
        }[];
    }>;
    reporteVentasPorCanal(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        ventasPorCanal: {
            online: {
                cantidad: number;
                total: number;
            };
            taquilla: {
                cantidad: number;
                total: number;
            };
        };
        ventasPorMetodoPago: {
            cantidad: number;
            total: number;
            metodo: string;
        }[];
        totalPedidos: number;
        totalVentas: number;
    }>;
    reporteDescuentosPromociones(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        totalPedidos: number;
        pedidosConDescuento: number;
        porcentajeDescuento: number;
        totalDescuentos: number;
        promedioDescuento: number;
    }>;
    reporteHorariosPico(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        horariosPico: {
            ocupacionPromedio: number;
            funciones: number;
            totalBoletos: number;
            capacidadTotal: number;
            hora: number;
        }[];
        horaMasPopular: number;
    }>;
    reporteIngresosPorPelicula(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        peliculas: any[];
        totalIngresos: any;
    }>;
    reporteDashboardKPIs(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        kpis: {
            totalIngresos: number;
            totalPedidos: number;
            totalBoletos: number;
            ticketPromedio: number;
            precioPromedioBoleto: number;
            ocupacionPromedio: number;
            ventasDulceria: number;
            clientesUnicos: number;
            funcionesTotales: number;
        };
    }>;
    reporteSerieTemporal(desde: string, hasta: string): Promise<{
        periodo: {
            desde: Date;
            hasta: Date;
        };
        serie: {
            fecha: string;
            ingresos: number;
            pedidos: number;
            ingresosBoletos: number;
            ingresosDulceria: number;
            cantidadBoletos: number;
            cantidadDulceria: number;
        }[];
    }>;
}

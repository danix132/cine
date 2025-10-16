-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VENDEDOR', 'CLIENTE');

-- CreateEnum
CREATE TYPE "AsientoEstado" AS ENUM ('DISPONIBLE', 'DANADO');

-- CreateEnum
CREATE TYPE "PeliculaEstado" AS ENUM ('ACTIVA', 'INACTIVA');

-- CreateEnum
CREATE TYPE "BoletoEstado" AS ENUM ('RESERVADO', 'PAGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "CarritoTipo" AS ENUM ('CLIENTE', 'MOSTRADOR');

-- CreateEnum
CREATE TYPE "CarritoItemTipo" AS ENUM ('BOLETO', 'DULCERIA');

-- CreateEnum
CREATE TYPE "PedidoTipo" AS ENUM ('WEB', 'MOSTRADOR');

-- CreateEnum
CREATE TYPE "PedidoItemTipo" AS ENUM ('BOLETO', 'DULCERIA');

-- CreateEnum
CREATE TYPE "DulceriaItemTipo" AS ENUM ('COMBO', 'DULCE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "UserRole" NOT NULL DEFAULT 'CLIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "filas" INTEGER NOT NULL,
    "asientosPorFila" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asientos" (
    "id" TEXT NOT NULL,
    "salaId" TEXT NOT NULL,
    "fila" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "estado" "AsientoEstado" NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "asientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peliculas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "sinopsis" TEXT,
    "duracionMin" INTEGER NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "posterUrl" TEXT,
    "trailerUrl" TEXT,
    "generos" TEXT[],
    "estado" "PeliculaEstado" NOT NULL DEFAULT 'ACTIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peliculas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funciones" (
    "id" TEXT NOT NULL,
    "peliculaId" TEXT NOT NULL,
    "salaId" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "cancelada" BOOLEAN NOT NULL DEFAULT false,
    "precio" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletos" (
    "id" TEXT NOT NULL,
    "funcionId" TEXT NOT NULL,
    "asientoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "estado" "BoletoEstado" NOT NULL DEFAULT 'RESERVADO',
    "codigoQR" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boletos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carritos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "vendedorId" TEXT,
    "tipo" "CarritoTipo" NOT NULL,
    "expiracion" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito_items" (
    "id" TEXT NOT NULL,
    "carritoId" TEXT NOT NULL,
    "tipo" "CarritoItemTipo" NOT NULL,
    "referenciaId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carrito_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "vendedorId" TEXT,
    "total" DECIMAL(10,2) NOT NULL,
    "tipo" "PedidoTipo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_items" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "tipo" "PedidoItemTipo" NOT NULL,
    "referenciaId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dulceria_items" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "DulceriaItemTipo" NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dulceria_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario_mov" (
    "id" TEXT NOT NULL,
    "dulceriaItemId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventario_mov_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "salas_nombre_key" ON "salas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "asientos_salaId_fila_numero_key" ON "asientos"("salaId", "fila", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "boletos_codigoQR_key" ON "boletos"("codigoQR");

-- CreateIndex
CREATE UNIQUE INDEX "boletos_funcionId_asientoId_key" ON "boletos"("funcionId", "asientoId");

-- AddForeignKey
ALTER TABLE "asientos" ADD CONSTRAINT "asientos_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funciones" ADD CONSTRAINT "funciones_peliculaId_fkey" FOREIGN KEY ("peliculaId") REFERENCES "peliculas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funciones" ADD CONSTRAINT "funciones_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_funcionId_fkey" FOREIGN KEY ("funcionId") REFERENCES "funciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "asientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_items" ADD CONSTRAINT "carrito_items_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "carritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_mov" ADD CONSTRAINT "inventario_mov_dulceriaItemId_fkey" FOREIGN KEY ("dulceriaItemId") REFERENCES "dulceria_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

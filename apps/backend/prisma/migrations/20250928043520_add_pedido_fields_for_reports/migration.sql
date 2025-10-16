/*
  Warnings:

  - Added the required column `precio` to the `pedido_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `pedido_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PedidoEstado" AS ENUM ('PENDIENTE', 'COMPLETADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "boletos" ADD COLUMN     "pedidoId" TEXT;

-- AlterTable
ALTER TABLE "pedido_items" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "precio" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "estado" "PedidoEstado" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "metodoPago" TEXT;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

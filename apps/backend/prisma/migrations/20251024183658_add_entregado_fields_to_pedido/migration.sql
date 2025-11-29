-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "entregado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "entregadoPorId" TEXT,
ADD COLUMN     "fechaEntrega" TIMESTAMP(3);

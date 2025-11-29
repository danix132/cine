-- AlterTable
ALTER TABLE "peliculas" ADD COLUMN     "esProximoEstreno" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fechaEstreno" TIMESTAMP(3);

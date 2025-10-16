-- DropIndex
DROP INDEX "boletos_codigoQR_key";

-- CreateIndex
CREATE INDEX "boletos_codigoQR_idx" ON "boletos"("codigoQR");

-- CreateTable
CREATE TABLE "Bitacora" (
    "idBitacora" SERIAL NOT NULL,
    "id_Usuario" UUID NOT NULL,
    "descripcion" JSON NOT NULL,

    CONSTRAINT "Bitacora_pkey" PRIMARY KEY ("idBitacora")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "idUsuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "correo" VARCHAR(100) NOT NULL,
    "id_TipoIdentificacion" INTEGER NOT NULL,
    "identificacion" VARCHAR(50) NOT NULL,
    "nombreCompleto" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "id_TipoUsuario" INTEGER NOT NULL,
    "id_EstadoUsuario" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario","correo")
);

-- CreateTable
CREATE TABLE "usuario_telefonos" (
    "idTelefono" SERIAL NOT NULL,
    "id_Usuario" UUID NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "tipo" INTEGER NOT NULL,

    CONSTRAINT "usuario_telefonos_pkey" PRIMARY KEY ("idTelefono")
);

-- CreateTable
CREATE TABLE "usuario_carreras" (
    "id_Usuario" UUID NOT NULL,
    "id_Carrera" INTEGER NOT NULL,

    CONSTRAINT "usuario_carreras_pkey" PRIMARY KEY ("id_Usuario","id_Carrera")
);

-- CreateTable
CREATE TABLE "usuario_areas" (
    "id_Usuario" UUID NOT NULL,
    "id_Area" INTEGER NOT NULL,

    CONSTRAINT "usuario_areas_pkey" PRIMARY KEY ("id_Usuario","id_Area")
);

-- CreateTable
CREATE TABLE "usuario_fotografia" (
    "idUsuarioFotografia" SERIAL NOT NULL,
    "id_Usuario" UUID NOT NULL,
    "fotoBase64" TEXT NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_fotografia_pkey" PRIMARY KEY ("idUsuarioFotografia")
);

-- CreateTable
CREATE TABLE "usuario_qr" (
    "idUsuarioQr" SERIAL NOT NULL,
    "id_Usuario" UUID NOT NULL,
    "qrBase64" TEXT NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_qr_pkey" PRIMARY KEY ("idUsuarioQr")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_idUsuario_key" ON "usuarios"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_telefonos_numero_key" ON "usuario_telefonos"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_fotografia_id_Usuario_key" ON "usuario_fotografia"("id_Usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_qr_id_Usuario_key" ON "usuario_qr"("id_Usuario");

-- AddForeignKey
ALTER TABLE "usuario_telefonos" ADD CONSTRAINT "usuario_telefonos_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_carreras" ADD CONSTRAINT "usuario_carreras_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_areas" ADD CONSTRAINT "usuario_areas_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_fotografia" ADD CONSTRAINT "usuario_fotografia_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_qr" ADD CONSTRAINT "usuario_qr_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

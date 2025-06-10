-- CreateTable
CREATE TABLE "carreras" (
    "idCarrera" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "director" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("idCarrera")
);

-- CreateTable
CREATE TABLE "tipos_usuario" (
    "idTipoUsuario" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipos_usuario_pkey" PRIMARY KEY ("idTipoUsuario")
);

-- CreateTable
CREATE TABLE "tipos_identificacion" (
    "idTipoIdentificacion" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipos_identificacion_pkey" PRIMARY KEY ("idTipoIdentificacion")
);

-- CreateTable
CREATE TABLE "estados_usuario" (
    "idEstado" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL DEFAULT 'activo',

    CONSTRAINT "estados_usuario_pkey" PRIMARY KEY ("idEstado")
);

-- CreateTable
CREATE TABLE "areas_trabajo" (
    "idArea" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "areas_trabajo_pkey" PRIMARY KEY ("idArea")
);

-- CreateIndex
CREATE UNIQUE INDEX "carreras_nombre_key" ON "carreras"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "carreras_email_key" ON "carreras"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_usuario_nombre_key" ON "tipos_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_identificacion_nombre_key" ON "tipos_identificacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estados_usuario_nombre_key" ON "estados_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "areas_trabajo_nombre_key" ON "areas_trabajo"("nombre");

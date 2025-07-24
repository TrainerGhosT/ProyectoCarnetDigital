import { JsonValue } from '@prisma/client/runtime/library';

export interface BitacoraResponse {
  idBitacora: number;
  usuario: string;
  descripcion: JsonValue;
}

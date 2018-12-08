export class ApartamentoMensaje {
  id: number;
  apartamento_id: number;
  nombres: string;
  telefono: string;
  email: string;
  titulo: string;
  mensaje: string;
  estado: Boolean = true;
  created_at: Date;
}

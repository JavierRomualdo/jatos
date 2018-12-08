import { Casa } from './entidad.casa';
import { Servicios } from './entidad.servicios';

export class Casaservicio {
  id: number;
  casa_id: number;
  servicio_id: number;
  estado: Boolean = true;
}

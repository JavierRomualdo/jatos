import { MensajeTO } from '../empresa/MensajeTO';

export class MailTO {
    nombres: string = "";
    emailEmisor: string = "";
    emailReceptor: string = "";
    mensaje: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.nombres = data.nombres ? data.nombres : this.nombres;
        this.emailEmisor = data.emailEmisor ? data.emailEmisor : this.emailEmisor;
        this.emailReceptor = data.emailReceptor ? data.emailReceptor : this.emailReceptor;
        this.mensaje = data.mensaje ? data.mensaje : this.mensaje;
    }
}
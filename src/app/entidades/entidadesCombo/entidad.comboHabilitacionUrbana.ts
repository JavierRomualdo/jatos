export class ComboHabilitacionUrbana {
    id: number;
    siglas: string = "";
    nombrehabilitacionurbana: string = "";
  
    constructor(data?) {
      data ? this.hydrate(data) : null;
    }
  
    hydrate(data) {
      this.id = data.id ? data.id : this.id;
      this.siglas = data.siglas ? data.siglas : this.siglas;
      this.nombrehabilitacionurbana = data.nombrehabilitacionurbana ?
        data.nombrehabilitacionurbana : this.nombrehabilitacionurbana;
    }
  }
  
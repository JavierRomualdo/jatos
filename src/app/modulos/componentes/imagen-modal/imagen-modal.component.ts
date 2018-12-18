import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-imagen-modal',
  templateUrl: './imagen-modal.component.html',
  styleUrls: ['./imagen-modal.component.css']
})
export class ImagenModalComponent implements OnInit {

  @Input() parametros;
  @Output() displayChange = new EventEmitter();
  
  public display: boolean = false;
  public foto: string;

  constructor() { }

  ngOnInit() {
    if (this.parametros) {
      this.display = this.parametros.display;
      this.foto = this.parametros.foto;
      this.display = true;
    }
  }

  onClose(){
    this.displayChange.emit(false);
  }

  // Work against memory leak if component is destroyed
  ngOnDestroy() {
    this.displayChange.unsubscribe();
  }
}

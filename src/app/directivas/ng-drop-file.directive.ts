import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../entidades/file-item';

@Directive({
  selector: '[appNgDropFile]'
})
export class NgDropFileDirective {

  @Input() archivos: FileItem[] = []; // estos son los archivos que necesito controlar
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  // se arrastro el mouse
  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) { // cuando el mouse entra emite un true
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) { // cuando el mouse sale emite un false
    this.mouseSobre.emit(false);
  }

  // cuando se suelta el mouse
  @HostListener('drop', ['$event'])
  public onDrop(event: any) { // cuando el mouse sale emite un false
    const transferencia = this._getTransferencia(event);
    if (!transferencia) {
      return;
    }

    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);

    this.mouseSobre.emit(false);
  }

  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList) {
    // console.log(archivosLista);
    // tomar las propiedades y convertir en un arreglo
    // tslint:disable-next-line:forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      if (this._archivoPuedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }
    console.log('extraer archivos: ');
    console.log(this.archivos);
  }

  // Validaciones (deben ser privadas "no salen de aca")

  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (!this._archivoYaFueDroppeado(archivo.name) && this._esImagen(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }
  private _prevenirDetener(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDroppeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('El archivo ' + nombreArchivo + ' ya esta agregado');
        return true;
      }
    }
    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }
}

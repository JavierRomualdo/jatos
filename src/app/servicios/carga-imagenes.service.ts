import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs-compat/Observable';

import * as firebase from 'firebase';
import { FileItem } from '../entidades/file-item';

@Injectable()
export class CargaImagenesService {
  // private CARPETA_IMAGENES = 'img';
  private itemDoc: AngularFirestoreDocument<any>;
  private shirtCollection: AngularFirestoreCollection<any>;
  private item: Observable<any>;
  private items: Observable<any[]>;
  constructor(private db: AngularFirestore,
    private _db: AngularFirestore) { }

  cargarImagen(CARPETA_IMAGENES: string, imagen: FileItem) {
    const storageRef = firebase.storage().ref();
    // metodo para subir archivos en los dos servicios de  firebase (firestore y storage)
    this.subiendoEnFirebase(storageRef, CARPETA_IMAGENES, imagen);
  }

  cargarImagenesFirebase(CARPETA_IMAGENES: string, imagenes: FileItem[]) {
    // console.log(imagenes);
    const storageRef = firebase.storage().ref();
    for (const item of imagenes) {
      item.estaSubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }
      console.log('item archivo: ');
      console.log(item.archivo);
      // metodo para subir archivos en los dos servicios de  firebase (firestore y storage)
      this.subiendoEnStorage(storageRef, CARPETA_IMAGENES, item);
    }
  }

  private subiendoEnStorage(storageRef: firebase.storage.Reference, CARPETA_IMAGENES: string, item: FileItem) {
    const referenciaImagen = storageRef.child( `${ CARPETA_IMAGENES }/${ item.nombreArchivo }` );
      const uploadTask: firebase.storage.UploadTask = referenciaImagen.put( item.archivo );
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error al subir', error),
        () => {
          referenciaImagen.getDownloadURL().then(
            ( urlImagen ) => {
                console.log('Imagen cargada correctamente');
                item.url = urlImagen;
                item.estaSubiendo = false;
                console.log(item);
                console.log('fin del metdo guardar imagen');
            },
            ( error ) => console.log('No existe la URL')
          );
        }
      );
  }

  private subiendoEnFirebase(storageRef: firebase.storage.Reference, CARPETA_IMAGENES: string, item: FileItem) {
    const referenciaImagen = storageRef.child( `${ CARPETA_IMAGENES }/${ item.nombreArchivo }` );
      const uploadTask: firebase.storage.UploadTask = referenciaImagen.put( item.archivo );
      // const uploadTask: firebase.storage.UploadTask =
        // storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`).put(item.archivo);
      // se ejecuta
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error al subir', error),
        () => {
          referenciaImagen.getDownloadURL().then(
            ( urlImagen ) => {
                console.log('Imagen cargada correctamente');
                item.url = urlImagen;
                item.estaSubiendo = false;
                console.log(item);
                this.guardarImagen({
                    nombre: item.nombreArchivo,
                    size: Math.round(item.archivo.size / 1024 / 1024) + ' MB',
                    url: item.url
                }, CARPETA_IMAGENES);
                console.log('fin del metdo guardar imagen');
            },
            ( error ) => console.log('No existe la URL')
          ).finally(() => console.log("se ha subido la imagen correctamente :)"));
          /* console.log('Imagen cargada correctamente');
          console.log(uploadTask.snapshot.downloadURL);
          item.url = uploadTask.snapshot.downloadURL;
          item.estaSubiendo = false;
          console.log(item);*/
          // guardamos el imagen a firestore
          // this.guardarImagen({nombre: item.nombreArchivo, url: item.url});
        }
      );
  }

  /**CLOUD STORAGE (bueno solo elimina :'v xq se trata de archivo elimina y se sube otro) */
  deleteArchivo(CARPETA_IMAGENES: string, nombreArchivo: string) { // id: string
    const storageRef = firebase.storage().ref();
    const desertRef = storageRef.child(CARPETA_IMAGENES + '/' + nombreArchivo);
    desertRef.delete().then(function() {
      console.log(nombreArchivo + ' se ha eliminado (storage).');
      // this.deleteImagen(CARPETA_IMAGENES, id);
    }).catch(function(error) {
      console.log(nombreArchivo + ' no se ha eliminado. El error: ' + error);
    });
  }

  mostrarUrlArchivo(CARPETA_IMAGENES: string, nombreArchivo: string): Promise<any> {
    const storageRef = firebase.storage().ref();
    const referenciaImagen = storageRef.child(CARPETA_IMAGENES + '/' + nombreArchivo);
    return referenciaImagen.getDownloadURL();
  }

  /**CRUD CLOUD FIRESTORE */
  private guardarImagen(imagen: {nombre: string, size: string, url: string}, CARPETA_IMAGENES: string) {
    this.db.collection(`/${CARPETA_IMAGENES}`).add(imagen); // tambien vale
    // const id = this.db.createId();
    // this.shirtCollection.doc(id).set(imagen);
    /*.then(function() {
      console.log(' se ha guardado (storage).');
    }).catch(function(error) {
      console.log(' no se ha guardado (storage). El error: ' + error);
    });*/
    // console.log('return id');
    // this.db.collection(`/${CARPETA_IMAGENES}`).add(imagen); // tambien vale
    // return id;
  }

  getImagen(CARPETA_IMAGENES: string, id: string): Observable<any> {
    this.itemDoc = this.db.doc<any>(CARPETA_IMAGENES + '/' + id);
    this.item = this.itemDoc.valueChanges();
    return this.item;
  }

  getImagenes(CARPETA_IMAGENES: string): Observable<any> {
    this.shirtCollection = this.db.collection(CARPETA_IMAGENES);
    this.items = this.shirtCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as any;
        data.id = a.payload.doc.id;
        console.log(data);
        return data;
      });
    });
    return this.items;
  }

  getImages(CARPETA_IMAGES: string): Promise<any>  {
    return new Promise((resolve, reject) => {
      this.shirtCollection = this.db.collection(CARPETA_IMAGES);
      this.shirtCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as any;
          data.id = a.payload.doc.id;
          return data;
        });
      }).subscribe(
        (res) => {
          console.log('res: ');
          console.log(res);
          resolve(res);
        },
        (error) => {
          reject(error);
          this.handleError(error);
        }
      );
    });
  }

  /**
   * get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http.get(this.appConfig.baseApiPath + url, {
        headers: this.appendAuthHeader()
      }).map((res: Response) => res.json()).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
          this.handleError(error);
        }
      );
    });
  }
   */

  updateImagen(CARPETA_IMAGENES: string, id: string, image: {nombre: string, size: string, url: string}) {
    this.itemDoc = this.db.doc<any>(CARPETA_IMAGENES + '/' + id);
    this.itemDoc.update(image);
  }

  deleteImagen(CARPETA_IMAGENES: string, id: string) {
    this.itemDoc = this.db.doc<any>(CARPETA_IMAGENES + '/' + id);
    this.itemDoc.delete().then(function() {
      console.log(id + ' se ha eliminado (firestore).');
    }).catch(function(error) {
      console.log(id + ' no se ha eliminado. El error: ' + error);
    });
  }

  /**Ejemplo de retornar un documento mediante el id (forma general)*/
  /*this.itemDoc = this.db.doc<any>(this.usuario.name + '/nD9YCnt5jisNb2jncJC6');
        this.item = this.itemDoc.valueChanges();
        this.item.subscribe(
          data => {
            console.log('soloooooo xd item con data: ');
            console.log(data);
          }
        );*/

  /*Ejemplo de retornar todos los documentos que existe en una determinada carpeta*/
  /*this.shirtCollection = this.db.collection(this.usuario.name + '/');
        this.items = this.shirtCollection.snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as any;
            data.id = a.payload.doc.id;
            return data; // {id, ...data}
          });
        });*/
        handleError(error: any): Promise<any> {
          if (error.status === 401 || error.status === 403) {
              sessionStorage.clear();
              localStorage.clear();
          }
          if (error.status === 404) {
            console.error('página solicitada no se encuentra');
          }
          return Promise.reject(error.message || error);
        }
}

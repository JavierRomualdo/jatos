import { Component, OnInit } from '@angular/core';
import { DataUpdateService } from 'src/app/servicios/dataUpdate/data-update.service';
import { LS } from 'src/app/contantes/app-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private dataUpdateService: DataUpdateService
    ) { }

  ngOnInit() {
    this.dataUpdateService.setFotoPerfil(JSON.parse(localStorage.getItem(LS.KEY_FOTO_PERFIL)));
  }

}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-estamos-trabajando',
  templateUrl: './estamos-trabajando.component.html',
  styleUrls: ['./estamos-trabajando.component.css']
})
export class EstamosTrabajandoComponent implements OnInit {

  constructor(
    public location: Location
  ) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }
}

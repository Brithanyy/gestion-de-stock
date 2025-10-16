import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Alerta } from '../../Services/alerta/alerta';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alertas',
  imports: [CommonModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css'
})
export class Alertas {

  readonly alerta : Alerta = inject(Alerta);
}

import { Component, inject, OnInit } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts-page',
  imports: [CommonModule],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css'
})
export class AlertsPage implements OnInit {


  readonly servicioBebidas : ServicioBebidas = inject(ServicioBebidas);

  bebidasConAlerta: any[] = [];

  ngOnInit(): void {
    this.obtenerBebidasConAlerta();
  }


  obtenerBebidasConAlerta() {
    this.servicioBebidas.getLowStockDrink().subscribe({
      next: (bebidasConStockBajo) => {
        this.bebidasConAlerta = bebidasConStockBajo;
      }
    });
  }

}

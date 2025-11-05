import { Component, inject, OnInit } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { Bebida } from '../../Models/Bebida';
import { Alerta } from '../../Services/alerta/alerta';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notificacion',
  imports: [CommonModule],
  templateUrl: './notificacion.html',
  styleUrl: './notificacion.css'
})
export class Notificacion implements OnInit{

  readonly SERVICIO_BEBIDAS = inject(ServicioBebidas);
  readonly ALERTA = inject(Alerta);
  sidebarAbierto = false;
  bebidas : Bebida[] = [];
  private suscripcion?: Subscription;

  ngOnInit(): void {
    this.SERVICIO_BEBIDAS.bebidasStockBajo$.subscribe({
      next: (bebidas) => {
        this.bebidas = bebidas;
      }
    });
  }

  // Para abrir y cerrar el sidebar
  cerrarNotificaciones() {
    this.bebidas = [];
  }
}

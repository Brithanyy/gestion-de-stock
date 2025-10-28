import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { Alerta } from '../../Services/alerta/alerta';
import { Bebida } from '../../Models/Bebida';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-detail-drink-page',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './detail-drink-page.html',
  styleUrl: './detail-drink-page.css'
})
export class DetailDrinkPage implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  readonly ACTIVATED_ROUTE : ActivatedRoute = inject(ActivatedRoute);
  readonly ROUTER : Router = inject(Router);
  readonly SERVICIO_BEBIDAS : ServicioBebidas = inject(ServicioBebidas);
  readonly ALERTA : Alerta = inject(Alerta);

  idBebida : string = '';
  idUsuario : string = '';
  
  detailBebida : Bebida = {

    id: '',
    name: '',
    type: 'Ninguna',
    category: 'Ninguna',
    brand: '',
    milliliters: 0,
    alcoholContent: 0, 
    price: 0,
    stock: 0, 
    imageUrl: '',
    createdAt: new Date()
  }

  //*MÉTODOS
  ngOnInit(): void {
    
    this.obtenerBebida();
  };

  obtenerBebida() {

    this.idBebida = this.ACTIVATED_ROUTE.snapshot.params['id'];

    this.idUsuario = this.ACTIVATED_ROUTE.snapshot.params['idUser'];
    
    this.SERVICIO_BEBIDAS.getDrink(this.idBebida).subscribe({

      next: (bebidaDevuelta : Bebida) => { this.detailBebida = bebidaDevuelta; },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al cargar la bebida.", "danger"); }
    });
  };

  volverAtras() { this.ROUTER.navigate(['homePage', this.idUsuario]); };

}

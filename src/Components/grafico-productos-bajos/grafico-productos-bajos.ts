import { Component, inject, OnInit } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';

@Component({
  selector: 'app-grafico-productos-bajos',
  imports: [],
  templateUrl: './grafico-productos-bajos.html',
  styleUrl: './grafico-productos-bajos.css'
})
export class GraficoProductosBajos implements OnInit{
  readonly SERVICIO_BEBIDAS : ServicioBebidas = inject(ServicioBebidas);
  totalBebidasConStockBajo: number = 0;
  porcentaje: number = 0; // Para la barra de progreso
  maximo: number = 100; // valor máximo para la barra

  ngOnInit(): void {
    this.obtenerTotalBebidasConStockBajo();
  }

  obtenerTotalBebidasConStockBajo() {
     this.SERVICIO_BEBIDAS.getLowStockDrink().subscribe({
      next: (bebidas) => {
        console.log(bebidas.length)
        this.totalBebidasConStockBajo = bebidas.length;
        this.porcentaje = (this.totalBebidasConStockBajo / this.maximo) * 100;
      }
    });
  }
  
}


import { Component, inject, OnInit } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';

@Component({
  selector: 'app-grafico-numero-bebidas',
  imports: [],
  templateUrl: './grafico-numero-bebidas.html',
  styleUrl: './grafico-numero-bebidas.css'
})
export class GraficoNumeroBebidas implements OnInit{

  readonly SERVICIO_BEBIDAS : ServicioBebidas = inject(ServicioBebidas);
  totalBebidas: number = 0;
  porcentaje: number = 0; // Para la barra de progreso
  maximo: number = 100; // valor máximo para la barra
  ngOnInit(): void {
    
    this.obtenerTotalBebidas();
  }

  obtenerTotalBebidas() {
     this.SERVICIO_BEBIDAS.getAllDrinks().subscribe({
      next: (bebidas) => {
        this.totalBebidas = bebidas.length;
        this.porcentaje = (this.totalBebidas / this.maximo) * 100;
      }
    });
  }


}

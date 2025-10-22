import { Component } from '@angular/core';
import { GraficoTorta } from "../../Components/grafico-torta/grafico-torta";
import { GraficoTotalBebidas } from "../../Components/grafico-total-bebidas/grafico-total-bebidas";
import { GraficoNumeroBebidas } from "../../Components/grafico-numero-bebidas/grafico-numero-bebidas";
import { GraficoProductosBajos } from "../../Components/grafico-productos-bajos/grafico-productos-bajos";

@Component({
  selector: 'app-reports-page',
  imports: [GraficoTorta, GraficoTotalBebidas, GraficoNumeroBebidas, GraficoProductosBajos],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css'
})
export class ReportsPage {

}

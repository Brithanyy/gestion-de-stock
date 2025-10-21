import { Component } from '@angular/core';
import { GraficoTorta } from "../../Components/grafico-torta/grafico-torta";
import { GraficoTotalBebidas } from "../../Components/grafico-total-bebidas/grafico-total-bebidas";

@Component({
  selector: 'app-reports-page',
  imports: [GraficoTorta, GraficoTotalBebidas],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css'
})
export class ReportsPage {

}

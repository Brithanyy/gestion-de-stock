declare const google: any;
import { Component, inject, OnInit } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';

@Component({
  selector: 'app-grafico-total-bebidas',
  imports: [],
  templateUrl: './grafico-total-bebidas.html',
  styleUrl: './grafico-total-bebidas.css'
})
export class GraficoTotalBebidas implements OnInit{
  readonly servicioBebidas : ServicioBebidas = inject(ServicioBebidas);

  bebidas: any[] = [];

  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    this.obtenerBebidas();
  }

  grafico() {
    const dataArray: any[][] = [['Bebida', 'Cantidad', { role: 'tooltip', type: 'string' }]];
    this.bebidas.forEach(b => {
    dataArray.push([b.name, b.stock, `${b.name}: ${b.stock} unidades`]);
  });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
      title: 'Total de Bebidas',
      hAxis: { title: 'Bebida', textPosition: 'none' },
      vAxis: { title: 'Cantidad' },
      legend: 'none',
      tooltip: { trigger: 'focus' },
      colors: ['#f47227']
    };

  const chart = new google.visualization.ColumnChart(document.getElementById('chart_div_total'));
  chart.draw(data, options);

  }
  obtenerBebidas() {
    this.servicioBebidas.getAllDrinks().subscribe({
      next: (bebidas) => {
        this.bebidas = bebidas;
        google.charts.setOnLoadCallback(() => this.grafico());
      }
    })
  }
  
}

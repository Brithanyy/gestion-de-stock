declare const google: any;
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';

@Component({
  selector: 'app-grafico-torta',
  imports: [],
  templateUrl: './grafico-torta.html',
  styleUrl: './grafico-torta.css'
})

export class GraficoTorta implements OnInit {


  readonly servicioBebidas : ServicioBebidas = inject(ServicioBebidas);

  bebidas: any[] = [];

  ngOnInit(): void {
      google.charts.load('current', { packages: ['corechart'] });
      this.obtenerBebidas();
  }


   grafico() {
    // Contar bebidas por categoría usando un objeto simple
    const counts: Record<string, number> = {};

    this.bebidas.forEach(b => {
      const categoria = (b.category ?? b.categoria ?? 'Sin categoría') as string;
      counts[categoria] = (counts[categoria] || 0) + 1;
    });

    // Convertir a formato para Google Charts
    const dataArray: (string | number)[][] = [['Categoría', 'Cantidad'], 
      ...Object.entries(counts).map(([cat, cnt]) => [cat, cnt])
    ];

    // Asegurarse que google y el elemento existen
    const container = document.getElementById('chart_div_torta');
    if (!container || typeof google === 'undefined' || !google.visualization) {
      console.warn('No se puede dibujar el gráfico: falta google o el contenedor #chart_div');
      return;
    }
    // Paleta de ejemplo (ajusta los hex a tu diseño)
    const palette = ['#e85d04', '#f48c06', '#faa307', '#ffba08', '#9d0208', '#6a040f','#d00000', '#dc2f02', ];
     // calcular tamaño responsivo basado en el ancho real del contenedor
    const width = container.clientWidth;
    const height = Math.max(400, Math.round(width * 0.6)); // ajusta proporción (0.6) a tu gusto

    const data = google.visualization.arrayToDataTable(dataArray);
    const options = { title: 'Bebidas por Categoría', is3D: true, colors: palette, width, height };
    const chart = new google.visualization.PieChart(container);
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

declare const google: any;
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';

@Component({
  selector: 'app-grafico-total-bebidas',
  imports: [],
  templateUrl: './grafico-total-bebidas.html',
  styleUrl: './grafico-total-bebidas.css'
})
export class GraficoTotalBebidas implements OnInit, OnDestroy {

  readonly servicioBebidas: ServicioBebidas = inject(ServicioBebidas);
  bebidas: any[] = [];
  private resizeListener: (() => void) | null = null;

  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    this.obtenerBebidas();

    // 🔹 Redibuja automáticamente al redimensionar la ventana
    this.resizeListener = () => this.redibujarGrafico();
    window.addEventListener('resize', this.resizeListener);
  }

  grafico() {
    const dataArray: any[][] = [['Bebida', 'Cantidad', { role: 'tooltip', type: 'string' }]];

    this.bebidas.forEach(b => {
      dataArray.push([b.name, b.stock, `${b.name}: ${b.stock} unidades`]);
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const container = document.getElementById('chart_div_total');
    if (!container) return;

    const width = container.clientWidth;
    const height = Math.max(300, Math.round(width * 0.55));

    const options = {
      title: 'Total de Bebidas',
      titleTextStyle: { fontSize: 20, bold: true, color: '#fff' },
      backgroundColor: '#1e1e1e',
      hAxis: {
        title: 'Bebida',
        textStyle: { color: '#fff', fontSize: 12 },
        titleTextStyle: { color: '#fff', fontSize: 14 },
      },
      vAxis: {
        title: 'Cantidad',
        textStyle: { color: '#fff', fontSize: 12 },
        titleTextStyle: { color: '#fff', fontSize: 14 },
      },
      legend: 'none',
      tooltip: { trigger: 'focus', textStyle: { fontSize: 14 } },
      colors: ['#f47227'],
      chartArea: { width: '70%', height: '70%' },
      width,
      height,
    };

    const chart = new google.visualization.ColumnChart(container);
    chart.draw(data, options);
  }

  obtenerBebidas() {
    this.servicioBebidas.getAllDrinks().subscribe({
      next: (bebidas) => {
        this.bebidas = bebidas;
        google.charts.setOnLoadCallback(() => this.grafico());
      }
    });
  }

  private redibujarGrafico() {
    if (this.bebidas.length > 0) {
      this.grafico();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}

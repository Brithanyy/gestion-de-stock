declare const google: any;
import {
  Component,
  inject,
  OnInit,
  HostListener
} from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';

@Component({
  selector: 'app-grafico-torta',
  imports: [],
  templateUrl: './grafico-torta.html',
  styleUrl: './grafico-torta.css'
})
export class GraficoTorta implements OnInit {

  readonly servicioBebidas: ServicioBebidas = inject(ServicioBebidas);
  bebidas: any[] = [];

  private chart: any; // 🔹 referencia al gráfico
  private data: any;  // 🔹 referencia a los datos
  private options: any; // 🔹 referencia a las opciones

 ngOnInit(): void {
  google.charts.load('current', { packages: ['corechart'] });
  this.obtenerBebidas();

  // 🔹 Redibuja automáticamente al cambiar el tamaño de pantalla
  window.addEventListener('resize', () => this.redibujarGrafico());
}

private redibujarGrafico() {
  if (this.bebidas.length > 0) {
    this.grafico();
  }
}

  /** 🔁 Redibuja el gráfico al cambiar el tamaño de la ventana */
  @HostListener('window:resize')
  onResize() {
    if (this.chart && this.data && this.options) {
      this.chart.draw(this.data, this.options);
    }
  }

  /** 📊 Construye el gráfico de torta */
  grafico() {
    const counts: Record<string, number> = {};

    this.bebidas.forEach(b => {
      const categoria = (b.category ?? b.categoria ?? 'Sin categoría') as string;
      counts[categoria] = (counts[categoria] || 0) + 1;
    });

    const dataArray: (string | number)[][] = [
      ['Categoría', 'Cantidad'],
      ...Object.entries(counts).map(([cat, cnt]) => [cat, cnt])
    ];

    const container = document.getElementById('chart_div_torta');
    if (!container || typeof google === 'undefined' || !google.visualization) {
      console.warn('⚠️ No se puede dibujar el gráfico: falta google o el contenedor #chart_div_torta');
      return;
    }

    const palette = ['#e85d04', '#f48c06', '#faa307', '#ffba08', '#9d0208', '#6a040f', '#d00000', '#dc2f02'];
    const width = container.clientWidth;
    const height = Math.max(300, Math.round(width * 0.6)); // 🔹 Ajuste dinámico de altura

    this.data = google.visualization.arrayToDataTable(dataArray);

    this.options = {
      title: 'Bebidas por Categoría',
      is3D: true,
      colors: palette,
      width,
      height,
      backgroundColor: 'transparent',
      chartArea: { width: '90%', height: '80%' },
      titleTextStyle: { fontSize: 18, bold: true, color: '#fff' },
      legend: { textStyle: { fontSize: 14, color: '#fff' } },
      pieSliceText: 'percentage',
      pieSliceTextStyle: { fontSize: 12, bold: true, color: '#fff' }
    };

    this.chart = new google.visualization.PieChart(container);
    this.chart.draw(this.data, this.options);
  }

  /** 🔄 Obtiene las bebidas desde el servicio */
  obtenerBebidas() {
    this.servicioBebidas.getAllDrinks().subscribe({
      next: (bebidas) => {
        this.bebidas = bebidas;
        google.charts.setOnLoadCallback(() => this.grafico());
      }
    });
  }
}

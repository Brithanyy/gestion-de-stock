import { Component, inject } from '@angular/core';
import { GraficoTorta } from "../../Components/grafico-torta/grafico-torta";
import { GraficoTotalBebidas } from "../../Components/grafico-total-bebidas/grafico-total-bebidas";
import { GraficoNumeroBebidas } from "../../Components/grafico-numero-bebidas/grafico-numero-bebidas";
import { GraficoProductosBajos } from "../../Components/grafico-productos-bajos/grafico-productos-bajos";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports-page',
  imports: [GraficoTorta, GraficoTotalBebidas, GraficoNumeroBebidas, GraficoProductosBajos],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css'
})
export class ReportsPage {

  private pdfActual: jsPDF | null = null;
  private fechaFormateada: string = '';
  readonly servicioLogin : ServicioAutenticacion = inject(ServicioAutenticacion);
  readonly ROUTER : Router = inject(Router);
  usuarioLogueado = this.servicioLogin.usuario;

async descargarPDF() {
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const secciones = Array.from(document.querySelectorAll(
    'app-grafico-torta, app-grafico-total-bebidas, app-grafico-numero-bebidas, app-grafico-productos-bajos'
  )) as HTMLElement[];

  if (!secciones.length) {
    console.warn('⚠️ No se encontraron gráficos para exportar');
    return;
  }

  for (let i = 0; i < secciones.length; i++) {
    const seccion = secciones[i];

    // 🔹 Forzar render completo antes de capturar
    await new Promise(resolve => setTimeout(resolve, 1000));

    const originalBg = seccion.style.backgroundColor;
    seccion.style.backgroundColor = '#ffffff';

    const canvas = await html2canvas(seccion, {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        // Forzar visibilidad y colores
        const clonedSection = clonedDoc.querySelector('body');
        if (clonedSection) {
          clonedSection.style.backgroundColor = '#ffffff';
          clonedSection.style.color = '#000';
          clonedSection.style.opacity = '1';
          clonedSection.style.filter = 'none';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = canvas.width / canvas.height;
    let pdfWidth = pageWidth - 20;
    let pdfHeight = pdfWidth / ratio;

    if (pdfHeight > pageHeight - 20) {
      pdfHeight = pageHeight - 20;
      pdfWidth = pdfHeight * ratio;
    }

    const x = (pageWidth - pdfWidth) / 2;
    const y = (pageHeight - pdfHeight) / 2;

    pdf.addImage(imgData, 'JPEG', x, y, pdfWidth, pdfHeight);

    if (i < secciones.length - 1) pdf.addPage();
    seccion.style.backgroundColor = originalBg;
  }

  const now = new Date();
  const fecha = `${now.getDate().toString().padStart(2,'0')}_${(now.getMonth()+1)
    .toString().padStart(2,'0')}_${now.getFullYear()}-${now.getHours().toString().padStart(2,'0')}hs`;

  pdf.save(`Reporte_${fecha}.pdf`);
}


  volverAtras() { 

    const idUser = this.usuarioLogueado()?.id;
    this.ROUTER.navigate(['/homePage', idUser]); 
  
  };
}

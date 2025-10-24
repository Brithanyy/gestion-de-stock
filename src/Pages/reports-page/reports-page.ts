import { Component } from '@angular/core';
import { GraficoTorta } from "../../Components/grafico-torta/grafico-torta";
import { GraficoTotalBebidas } from "../../Components/grafico-total-bebidas/grafico-total-bebidas";
import { GraficoNumeroBebidas } from "../../Components/grafico-numero-bebidas/grafico-numero-bebidas";
import { GraficoProductosBajos } from "../../Components/grafico-productos-bajos/grafico-productos-bajos";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reports-page',
  imports: [GraficoTorta, GraficoTotalBebidas, GraficoNumeroBebidas, GraficoProductosBajos],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css'
})
export class ReportsPage {

  exportarPDF() {

    const contenedorDashboard = document.querySelector('.reports-grid') as HTMLElement;

    html2canvas(contenedorDashboard).then(canvas => {

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4'); //Modo apaisado

      const pageWidth = pdf.internal.pageSize.getWidth();  // 297 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

      //Proporciones para mantener escala real
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;

      //Márgenes laterales de 10 mm
      const margin = 10;
      let pdfWidth = pageWidth - margin * 2;
      let pdfHeight = pdfWidth / ratio;

      //Si la imagen sobrepasa el alto, ajustamos al alto
      if(pdfHeight > pageHeight - margin * 2) {

        pdfHeight = pageHeight - margin * 2;
        pdfWidth = pdfHeight * ratio;
      }

      //Centramos la imagen
      const posX = (pageWidth - pdfWidth) / 2;
      const posY = (pageHeight - pdfHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', posX, posY, pdfWidth, pdfHeight);

      const now = new Date();

      const dia = now.getDate().toString().padStart(2, '0');
      const mes = (now.getMonth() + 1).toString().padStart(2, '0'); // los meses van de 0-11
      const año = now.getFullYear();

      const horas = now.getHours().toString().padStart(2, '0');
      const minutos = now.getMinutes().toString().padStart(2, '0');

      const fechaFormateada = dia + "/" + mes + "/" + año + "  " + horas + ":" + minutos + "hs";

      pdf.save("Reporte del día: " + fechaFormateada  + ".pdf");
    });
  };

}

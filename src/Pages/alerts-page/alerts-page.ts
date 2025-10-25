import { Component, inject, OnInit } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf'; //Para exportar el pdf 
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-alerts-page',
  imports: [CommonModule],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css'
})
export class AlertsPage implements OnInit {


  readonly servicioBebidas : ServicioBebidas = inject(ServicioBebidas);

  bebidasConAlerta: any[] = [];

  ngOnInit(): void {
    this.obtenerBebidasConAlerta();
  }


  obtenerBebidasConAlerta() {
    this.servicioBebidas.getLowStockDrink().subscribe({
      next: (bebidasConStockBajo) => {
        this.bebidasConAlerta = bebidasConStockBajo;
      }
    });
  }
  
  descargarPDF() {
    const contenedorLista = document.querySelector('.tabla-bebidas') as HTMLElement;
    html2canvas(contenedorLista).then(canvas => {

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
  }
}

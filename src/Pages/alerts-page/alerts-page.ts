import { Component, inject, OnInit } from '@angular/core';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf'; //Para exportar el pdf 
import html2canvas from 'html2canvas';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerts-page',
  imports: [CommonModule],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css'
})
export class AlertsPage implements OnInit {


  readonly servicioBebidas : ServicioBebidas = inject(ServicioBebidas);

  bebidasConAlerta: any[] = [];

    readonly servicioLogin : ServicioAutenticacion = inject(ServicioAutenticacion);
    readonly ROUTER : Router = inject(Router);
    usuarioLogueado = this.servicioLogin.usuario;

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

  html2canvas(contenedorLista, {
    backgroundColor: '#ffffff',
    scale: 2,                   
    useCORS: true               
  }).then(canvas => {

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();  // 297 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;

    const margin = 10;
    let pdfWidth = pageWidth - margin * 2;
    let pdfHeight = pdfWidth / ratio;

    if (pdfHeight > pageHeight - margin * 2) {
      pdfHeight = pageHeight - margin * 2;
      pdfWidth = pdfHeight * ratio;
    }

    const posX = (pageWidth - pdfWidth) / 2;
    const posY = (pageHeight - pdfHeight) / 2;

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    pdf.addImage(imgData, 'PNG', posX, posY, pdfWidth, pdfHeight);

    const now = new Date();
    const dia = now.getDate().toString().padStart(2, '0');
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    const año = now.getFullYear();
    const horas = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}hs`;

    pdf.save(`Alertas del día ${fechaFormateada}.pdf`);
  });
}

  volverAtras() {
    
    const idUser = this.usuarioLogueado()?.id;
    this.ROUTER.navigate(['/homePage', idUser]); 
  }
}

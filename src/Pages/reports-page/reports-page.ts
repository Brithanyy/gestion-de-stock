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


  volverAtras() { 

    const idUser = this.usuarioLogueado()?.id;
    this.ROUTER.navigate(['/homePage', idUser]); 
  
  };
}

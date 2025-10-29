import { Component, computed, inject, OnInit } from '@angular/core';
import { ServicioMovimientos } from '../../Services/movimientos/servicio-movimientos';
import { Alerta } from '../../Services/alerta/alerta';
import { Movimiento } from '../../Models/Movimiento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf'; //Para exportar el pdf 
import html2canvas from 'html2canvas';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movements-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './movements-page.html',
  styleUrl: './movements-page.css'
})
export class MovementsPage implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  readonly SERVICIO_MOVIMIENTOS : ServicioMovimientos = inject(ServicioMovimientos);
  readonly ALERTA : Alerta = inject(Alerta);
  readonly servicioLogin : ServicioAutenticacion = inject(ServicioAutenticacion);
  readonly ROUTER : Router = inject(Router);
  usuarioLogueado = this.servicioLogin.usuario;

  movimientos : Movimiento[] = [];
  tipoUsuario = computed(() => this.servicioLogin.usuario()?.profile);
  terminoBusqueda : string = '';
  //*MÉTODOS
  ngOnInit(): void {
    
    this.obtenerMovimientos();
    this.eliminarMovimientosAntiguos();
  };

  obtenerMovimientos() {

    this.SERVICIO_MOVIMIENTOS.getAllMotions().subscribe({

      next: (movimientosDevueltos : Movimiento[]) => { 

        const movimientosFiltrados = this.filtrarMovimientos(movimientosDevueltos);
        this.movimientos = movimientosFiltrados.slice(0, 30); //Mostramos los últimos 30 movimientos
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al cargar los movimientos.", "danger"); }
    })
  };

  filtrarMovimientos(movimientos: Movimiento[]): Movimiento[] {

    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - 1); //Establecer la fecha límite a un mes atrás

    
    const movimientosRecientes = movimientos.filter(movimiento => {

      const fechaMovimiento = new Date(movimiento.movementDate);
      return fechaMovimiento >= fechaLimite; 
    });

    //Ordenar los movimientos por fecha descendente (más recientes primero)
    movimientosRecientes.sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime());

    return movimientosRecientes;
  };

  eliminarMovimiento(movimiento : Movimiento) {

    this.SERVICIO_MOVIMIENTOS.deleteMotion(movimiento.id).subscribe({

      next: (movimientoDevuelto : Movimiento) => { 

        this.ALERTA.mostrar("Movimiento eliminado con éxito.", "success");
        this.obtenerMovimientos();
       },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al eliminar el movimiento.", "danger"); }
    });
  };

  eliminarMovimientosAntiguos() {

    const fechaLimite = new Date();

    fechaLimite.setMonth(fechaLimite.getMonth() - 1); //Fecha límite a un mes atrás

    //Filtrar los movimientos antiguos
    this.SERVICIO_MOVIMIENTOS.getAllMotions().subscribe({

      next: (movimientosDevueltos: Movimiento[]) => {

        const movimientosAntiguos = movimientosDevueltos.filter(movimiento => {

          const fechaMovimiento = new Date(movimiento.movementDate);
          return fechaMovimiento < fechaLimite; //Movimiento es más antiguo que un mes
        });

        //Eliminamos los movimientos antiguos uno por uno
        movimientosAntiguos.forEach(movimiento => {

          this.SERVICIO_MOVIMIENTOS.deleteMotion(movimiento.id).subscribe({

            next: () => { this.ALERTA.mostrar("Movimiento eliminado con éxito.", "success"); },
            error: (errorDevuelto) => { this.ALERTA.mostrar("Error al eliminar el movimiento.", "danger"); }
          });
        });
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al obtener movimientos antiguos", "danger"); }
    });
  };

  filtrarConBarraDeBusqueda() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    
    if(termino === '') {
      this.obtenerMovimientos();
      return;
    };

    let movimientosFiltrados = this.movimientos.filter(movimiento => {

      const fechaMovimiento = new Date(movimiento.movementDate)
      .toLocaleDateString('es-AR');  // ej: "25/10/2025"
      return (
      movimiento.nameUser.toLowerCase().includes(termino) ||
      fechaMovimiento.toLowerCase().includes(termino)
    );
    });
    
    if(this.movimientos.length === 0) { this.ALERTA.mostrar("No se encontró ningun movimiento registrado con ese nombre o fecha.", "danger"); };

    this.movimientos = movimientosFiltrados;
  };

  descargarPDF() {
  const contenedorLista = document.querySelector('.tabla-movimientos') as HTMLElement;
  if (!contenedorLista) return;

  // 🔹 Aplicamos un fondo blanco temporal (solo mientras se captura)
  const fondoOriginal = contenedorLista.style.backgroundColor;
  contenedorLista.style.backgroundColor = '#ffffff';
  contenedorLista.style.color = '#000000';
  contenedorLista.style.opacity = '1';
  contenedorLista.style.filter = 'none';

  html2canvas(contenedorLista, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true
  }).then(canvas => {
    // 🔹 Restauramos estilos originales
    contenedorLista.style.backgroundColor = fondoOriginal;

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

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

    pdf.save(`Movimientos ${fechaFormateada}.pdf`);
  });
}

  volverAtras() {
    
    const idUser = this.usuarioLogueado()?.id;
    this.ROUTER.navigate(['/homePage', idUser]); 
  }
}


import { Component, inject, OnInit } from '@angular/core';
import { ServicioMovimientos } from '../../Services/movimientos/servicio-movimientos';
import { Alerta } from '../../Services/alerta/alerta';
import { Movimiento } from '../../Models/Movimiento';

@Component({
  selector: 'app-movements-page',
  imports: [],
  templateUrl: './movements-page.html',
  styleUrl: './movements-page.css'
})
export class MovementsPage implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  readonly SERVICIO_MOVIMIENTOS : ServicioMovimientos = inject(ServicioMovimientos);
  readonly ALERTA : Alerta = inject(Alerta);

  movimientos : Movimiento[] = [];

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
}


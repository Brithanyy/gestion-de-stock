import { Component, computed, inject, OnInit } from '@angular/core';
import { Bebida } from '../../Models/Bebida';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { Alerta } from '../../Services/alerta/alerta';
import { FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { ServicioMovimientos } from '../../Services/movimientos/servicio-movimientos';
import { Movimiento } from '../../Models/Movimiento';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Usuario } from '../../Models/Usuario';
import { LetDeclaration } from '@angular/compiler';

@Component({
  selector: 'app-home-page',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  readonly ROUTER : Router = inject(Router);
  readonly ACTIVATED_ROUTE : ActivatedRoute = inject(ActivatedRoute);
  readonly SERVICIO_BEBIDAS : ServicioBebidas = inject(ServicioBebidas);
  readonly SERVICIO_MOVIMIENTOS : ServicioMovimientos = inject(ServicioMovimientos);
  readonly SERVICIO_USUARIOS : ServicioUsuarios = inject(ServicioUsuarios);
  readonly ALERTA : Alerta = inject(Alerta);
  readonly FORM_BUILDER : FormBuilder = inject(FormBuilder);
  private servicioAuth = inject(ServicioAutenticacion);

  usuario = this.servicioAuth.usuario;

  tipoUsuario = computed(() => this.usuario()?.profile);

  idUsuarioLogueado : string = '';

  formIngresoStock = this.FORM_BUILDER.nonNullable.group({

    cantidadIngreso: [1, [Validators.required, Validators.min(1)]]
  });

  formEgresoStock = this.FORM_BUILDER.nonNullable.group({

    cantidadEgreso: [1, [Validators.required, Validators.min(1)]]
  });

  bebidas: Bebida[] = [];

  usuarioLogueado : Usuario = {

      id: "",
      username: "",
      password: "",
      profile: "ninguno",
      isLoggedIn: false,
      avatarUrl: ""
  };

  //*MÉTODOS
  ngOnInit(): void { 

    this.obtenerBebidas();

    this.obtenerUsuario();

  };

  esAdmin() { return this.tipoUsuario()?.toLowerCase() === 'admin'; };

  get cantidadIngreso() { return this.formIngresoStock.get('cantidadIngreso'); };
  get cantidadEgreso() { return this.formEgresoStock.get('cantidadEgreso'); };

  obtenerBebidas() {

    this.SERVICIO_BEBIDAS.getAllDrinks().subscribe({

      next: (bebidasDevueltas : Bebida[]) => {

        this.bebidas = bebidasDevueltas;
        this.ALERTA.mostrar("Bebidas cargadas con éxito", "success");
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al cargar las bebidas.", "danger"); }
    });
  };

  editarBebida(idBebida : string | undefined) { this.ROUTER.navigate(['/editDrinkPage', idBebida]); };

  verDetalle(idBebida : string | undefined) { this.ROUTER.navigate(['/detailDrinkPage', idBebida]); };

  eliminarBebida(idBebida : string | undefined) {

    this.SERVICIO_BEBIDAS.deleteDrink(idBebida).subscribe({

      next: (bebidaDevuelta : Bebida) => { 
        
        this.ALERTA.mostrar("Bebida eliminada con éxito", "success"); 

        setTimeout(() => {
          this.obtenerBebidas();
        }, 2000);
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al eliminar la bebida.", "danger"); }
    });
  };

  obtenerUsuario() {

    this.idUsuarioLogueado = this.ACTIVATED_ROUTE.snapshot.params['id'];

    this.SERVICIO_USUARIOS.getUser(this.idUsuarioLogueado).subscribe({

      next: (usuarioDevuelto : Usuario) => { this.usuarioLogueado = usuarioDevuelto; },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error obtener el usuario.", "danger"); }
    });
  };

  aumentarStock(bebida : Bebida) {

    const cantidadModificada = this.formIngresoStock.value.cantidadIngreso!;

    bebida.stock += cantidadModificada;

    const ingresoMovimiento : Movimiento = {

      idDrink: bebida.id,              
      nameDrink: bebida.name,          
      typeMotion: 'Ingreso', 
      amount: cantidadModificada,              
      movementDate: new Date(Date.now()),         
      idUser: this.usuarioLogueado.id,             
      nameUser: this.usuarioLogueado.username,         
    };

    this.SERVICIO_BEBIDAS.putDrink(bebida).subscribe({

      next: (bebidaDevuelta : Bebida) => { 

        this.ALERTA.mostrar("Ingreso registrado con éxito", "success");
 
        this.SERVICIO_MOVIMIENTOS.postMotion(ingresoMovimiento).subscribe({

          next: (movimientoDevuelto : Movimiento) => { this.ALERTA.mostrar("Movimiento registrado con éxito", "success"); },

          error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el movimiento", "danger"); }
        });

        this.obtenerBebidas();

        this.formIngresoStock.patchValue({ cantidadIngreso: 1 });
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el ingreso", "danger"); }
    });
  };

  decrementarStock(bebida : Bebida) {

    const cantidadModificada = this.formEgresoStock.value.cantidadEgreso!;

    if(cantidadModificada > bebida.stock) {

      this.ALERTA.mostrar("No puedes egresar más que el stock disponible", "danger");
      this.formEgresoStock.patchValue({ cantidadEgreso: 1 });
      return
    }

    bebida.stock -= cantidadModificada;

    const egresoMovimiento : Movimiento = {

      idDrink: bebida.id,              
      nameDrink: bebida.name,          
      typeMotion: 'Egreso', 
      amount: cantidadModificada,              
      movementDate: new Date(Date.now()),         
      idUser: this.usuarioLogueado.id,             
      nameUser: this.usuarioLogueado.username,         
    };

    this.SERVICIO_BEBIDAS.putDrink(bebida).subscribe({

      next: (bebidaDevuelta : Bebida) => { 

        this.ALERTA.mostrar("Ingreso registrado con éxito", "success");
 
        this.SERVICIO_MOVIMIENTOS.postMotion(egresoMovimiento).subscribe({

          next: (movimientoDevuelto : Movimiento) => { this.ALERTA.mostrar("Movimiento registrado con éxito", "success"); },

          error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el movimiento", "danger"); }
        });

        this.obtenerBebidas();

        this.formEgresoStock.patchValue({ cantidadEgreso: 1 });
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el ingreso", "danger"); }
    });
  };

}

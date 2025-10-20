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

  formMovimientos = this.FORM_BUILDER.nonNullable.group({

    cantidad: [0, [Validators.required, Validators.min(0)]]
  });

  bebidas: Bebida[] = [];

  editStockBebida : Bebida = {

    id: '',
    name: '',
    type: 'ninguna',
    category: 'ninguna',
    brand: '',
    milliliters: 0,
    alcoholContent: 0, 
    price: 0, 
    stock: 0,
    imageUrl: '', 
    createdAt: new Date() 
  };

  usuarioActual : Usuario = {
      id: "",
      username: "",
      password: "",
      profile: "ninguno",
      isLoggedIn: false,
      avatarUrl: ""
  }

  //*MÉTODOS
  ngOnInit(): void { 
    
    this.obtenerBebidas();
  };

  esAdmin() { return this.tipoUsuario()?.toLowerCase() === 'admin'; };

  get cantidad() { return this.formMovimientos.get('cantidad'); }

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


  aumentarStock(idBebida : string | undefined) {

    //Tengo que traerme el usuario que está logueado (podemos tener una ruta parametrizada en HomePage, entonces, desde el login, le pasas el id del user)
    //Tener en cuenta que si agrego esto, debo modificar ciertas cosas del programa
    //Tengo que  hacer un get de la bebida que quiero modificar el stock
    //Antes de hacer el put de la bebida, verificar si la cantidad de decremento en stock no me deja en stock negativo. 
    //Si el stock queda en menor o igual a 5 debo lanzar una notificación y agregar esta bebida en "Ver alertas". Tiene que mostrar cuyas bebidas tenga un stock menor o igual que cinco
    //Una vez validado todo lo anterior, puedo hacer el put de esa bebida con el stock modificado (la cantidad me la traigo del input del form)
    //Tengo que hacer un post de movimiento con los datos del User y Bebida
  

  };

  decrementarStock(idBebida : string | undefined) {

  };

}

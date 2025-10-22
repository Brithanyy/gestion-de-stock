import { Component, computed, inject, OnInit } from '@angular/core';
import { Bebida } from '../../Models/Bebida';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { Alerta } from '../../Services/alerta/alerta';
import { FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { ServicioMovimientos } from '../../Services/movimientos/servicio-movimientos';
import { Movimiento } from '../../Models/Movimiento';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Usuario } from '../../Models/Usuario';
import { LetDeclaration } from '@angular/compiler';
import { DrinkCard } from '../../Components/drink-card/drink-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, DrinkCard, CommonModule, FormsModule], 
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
  private servicioAuth = inject(ServicioAutenticacion);

  usuario = this.servicioAuth.usuario;

  tipoUsuario = computed(() => this.usuario()?.profile);

  idUsuarioLogueado : string = '';

  bebidas: Bebida[] = [];

  bebidasFiltradas: Bebida[] = [];

  terminoBusqueda: string = '';

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

  obtenerBebidas() {

    this.SERVICIO_BEBIDAS.getAllDrinks().subscribe({

      next: (bebidasDevueltas : Bebida[]) => {

        this.bebidas = bebidasDevueltas;
        this.bebidasFiltradas = bebidasDevueltas;
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al cargar las bebidas.", "danger"); }
    });
  };

  editarBebida(idBebida : string | undefined) { this.ROUTER.navigate(['/editDrinkPage', idBebida]); };

  verDetalle(idBebida : string | undefined) { this.ROUTER.navigate(['/detailDrinkPage', idBebida, this.idUsuarioLogueado]); };

  eliminarBebida(id?: string) {
    
     if (!id) return;
    this.bebidas = this.bebidas.filter(b => b.id !== id);
    this.bebidasFiltradas = this.bebidasFiltradas.filter(b => b.id !== id);
  };

  obtenerUsuario() {

    this.idUsuarioLogueado = this.ACTIVATED_ROUTE.snapshot.params['id'];

    this.SERVICIO_USUARIOS.getUser(this.idUsuarioLogueado).subscribe({

      next: (usuarioDevuelto : Usuario) => { this.usuarioLogueado = usuarioDevuelto; },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error obtener el usuario.", "danger"); }
    });
  };

  aumentarStock(bebida : Bebida, cantidad : number) {

    bebida.stock += cantidad;

    const ingresoMovimiento : Movimiento = {

      idDrink: bebida.id!,              
      nameDrink: bebida.name,          
      typeMotion: 'Ingreso', 
      amount: cantidad,              
      movementDate: new Date(Date.now()),         
      idUser: this.usuarioLogueado.id,             
      nameUser: this.usuarioLogueado.username,         
    };

    this.SERVICIO_BEBIDAS.putDrink(bebida).subscribe({

      next: (bebidaDevuelta : Bebida) => { 
 
        this.SERVICIO_MOVIMIENTOS.postMotion(ingresoMovimiento).subscribe({

          next: (movimientoDevuelto : Movimiento) => { },

          error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el movimiento", "danger"); }
        });

        this.obtenerBebidas();
      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el ingreso", "danger"); }
    });
  };

  decrementarStock(bebida : Bebida, cantidad : number) {

    if(cantidad > bebida.stock) {

      this.ALERTA.mostrar("No puedes egresar más que el stock disponible", "danger");
      return
    }

    bebida.stock -= cantidad;

    const egresoMovimiento : Movimiento = {

      idDrink: bebida.id!,              
      nameDrink: bebida.name,          
      typeMotion: 'Egreso', 
      amount: cantidad,              
      movementDate: new Date(Date.now()),         
      idUser: this.usuarioLogueado.id,             
      nameUser: this.usuarioLogueado.username,         
    };

    this.SERVICIO_BEBIDAS.putDrink(bebida).subscribe({

      next: (bebidaDevuelta : Bebida) => { 

 
        this.SERVICIO_MOVIMIENTOS.postMotion(egresoMovimiento).subscribe({

          next: (movimientoDevuelto : Movimiento) => {  },

          error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el movimiento", "danger"); }
        });

        this.obtenerBebidas();

      },

      error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el ingreso", "danger"); }
    });
  };

  filtrarBebidas() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    
    if(termino === '') {
      this.bebidasFiltradas = this.bebidas;
      return;
    }

    this.bebidasFiltradas = this.bebidas.filter(bebida =>
    bebida.name.toLowerCase().includes(termino) ||
    bebida.category.toLowerCase().includes(termino) ||
    bebida.brand.toLowerCase().includes(termino)
    );
    
    if(this.bebidasFiltradas.length === 0) {
      this.ALERTA.mostrar("No se encontró ninguna bebida registrada con ese nombre.", "danger");
    }
  }

}

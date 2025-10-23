import { Component, computed, inject, OnInit } from '@angular/core';
import { Bebida } from '../../Models/Bebida';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { Alerta } from '../../Services/alerta/alerta';
import { ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { ServicioMovimientos } from '../../Services/movimientos/servicio-movimientos';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Usuario } from '../../Models/Usuario';
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

  idUsuarioLogueado : string = this.ACTIVATED_ROUTE.snapshot.params['id'];

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

    obtenerUsuario() {
  
      this.SERVICIO_USUARIOS.getUser(this.idUsuarioLogueado).subscribe({
  
        next: (usuarioDevuelto : Usuario) => { this.usuarioLogueado = usuarioDevuelto; },
  
        error: (errorDevuelto) => { this.ALERTA.mostrar("Error obtener el usuario.", "danger"); }
      });
    };

  filtrarBebidas() {

    const termino = this.terminoBusqueda.trim().toLowerCase();
    
    if(termino === '') {

      this.bebidasFiltradas = this.bebidas;
      return;
    };

    this.bebidasFiltradas = this.bebidas.filter(bebida =>

      bebida.name.toLowerCase().includes(termino) ||
      bebida.category.toLowerCase().includes(termino) ||
      bebida.brand.toLowerCase().includes(termino)
    );
    
    if(this.bebidasFiltradas.length === 0) { this.ALERTA.mostrar("No se encontró ninguna bebida registrada con ese nombre.", "danger"); };
  };

}

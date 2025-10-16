import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NavBar } from "../../Components/nav-bar/nav-bar";
import { BarraLateral } from "../../Components/barra-lateral/barra-lateral";
import { Footer } from "../../Components/footer/footer";
import { Usuario } from '../../Models/Usuario';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Alerta } from '../../Services/alerta/alerta';
import { CommonModule } from '@angular/common';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';

@Component({
  selector: 'app-page-usuarios',
  imports: [NavBar, BarraLateral, Footer, CommonModule],
  templateUrl: './page-usuarios.html',
  styleUrl: './page-usuarios.css'
})
export class PageUsuarios {


  readonly servicioUsuarios : ServicioUsuarios = inject(ServicioUsuarios);

  usuarios = computed(() => this.servicioUsuarios.usuariosSignal());

  readonly servicioLogin : ServicioAutenticacion = inject(ServicioAutenticacion);

  logueado = computed(() => this.servicioLogin.isLoggedIn());

  usuarioLogueado = this.servicioLogin.usuario;

  readonly alerta : Alerta = inject(Alerta);


  editarUsuario(usuario : Usuario) {

  }

  eliminarUsuario(usuario : Usuario) {

  }


}

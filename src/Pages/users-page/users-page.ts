import { Component, computed, inject } from '@angular/core';
import { Usuario } from '../../Models/Usuario';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Alerta } from '../../Services/alerta/alerta';
import { CommonModule } from '@angular/common';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';

@Component({
  selector: 'app-users-page',
  imports: [CommonModule],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css'
})
export class UsersPage {

  //*CONSTANTES Y VARIABLES GLOBALES
  readonly servicioUsuarios : ServicioUsuarios = inject(ServicioUsuarios);

  usuarios = computed(() => this.servicioUsuarios.usuariosSignal());

  readonly servicioLogin : ServicioAutenticacion = inject(ServicioAutenticacion);

  logueado = computed(() => this.servicioLogin.isLoggedIn());

  usuarioLogueado = this.servicioLogin.usuario;

  readonly alerta : Alerta = inject(Alerta);

  //*MÉTODOS
  editarUsuario(usuario : Usuario) {

  }

  eliminarUsuario(usuario : Usuario) {

  }

}

import { Component, computed, inject, OnInit } from '@angular/core';
import { Usuario } from '../../Models/Usuario';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Alerta } from '../../Services/alerta/alerta';
import { CommonModule } from '@angular/common';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-page',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css'
})
export class UsersPage implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  readonly servicioUsuarios : ServicioUsuarios = inject(ServicioUsuarios);

  usuarios: Usuario[] = [];

  readonly servicioLogin : ServicioAutenticacion = inject(ServicioAutenticacion);

  logueado = computed(() => this.servicioLogin.isLoggedIn());

  usuarioLogueado = this.servicioLogin.usuario;

  readonly alerta : Alerta = inject(Alerta);

  readonly router : Router = inject(Router);

  readonly usuarioActual = this.usuarioLogueado();

  //*MÉTODOS

  ngOnInit(): void { 
    
    this.listarUsuarios(); 

  }

  eliminarUsuario(usuario : Usuario) {

    this.servicioUsuarios.deleteUser(usuario.id).subscribe({

      next : (user) => {

        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
        this.alerta.mostrar("Usuario eliminado con éxito.", "success");
      },
      error : (err) => { this.alerta.mostrar("Error al eliminar el usuario.", "danger"); }
    });
  };

  listarUsuarios() {

    this.servicioUsuarios.getAllUsers().subscribe({

      next : (usuariosDevueltos) => { this.usuarios.push(...usuariosDevueltos); },

      error : (err) => { this.alerta.mostrar("Error al cargar los usuarios.", "danger"); }
    });
  };

  crearUsuarioPage() { this.router.navigate(['/newUser']); };

  volverAtras() {
    this.router.navigate(['/homePage', this.usuarioActual?.id]);
  }

  isUsuarioActivo(usuario: Usuario) {
    return this.usuarioLogueado()?.id === usuario.id;
 }

}

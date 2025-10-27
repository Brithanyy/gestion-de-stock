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

  visiblePasswords = new Set<string>();

  //*MÉTODOS
  private clave(usuario: Usuario) {

    return (usuario.id ?? usuario.username)?.toString();
  }

  verContrasena(usuario: Usuario) {

    const k = this.clave(usuario);
    return !!k && this.visiblePasswords.has(k);
  }

  togglePasswordVisibility(usuario: Usuario) {

    const k = this.clave(usuario);
    if (!k) return;
    if (this.visiblePasswords.has(k)) this.visiblePasswords.delete(k);
    else this.visiblePasswords.add(k);
  }

  ngOnInit(): void { 
    
    this.listarUsuarios(); 

  }

  eliminarUsuario(usuario: Usuario) {
  const usuarioActual = this.usuarioLogueado();
  
  if (!usuarioActual) return;

  //Chequeo: no se puede eliminar el usuario logueado
  if (usuario.id === usuarioActual.id) {
    this.alerta.mostrar("No puedes eliminarte a ti mismo.", "danger");
    return;
  }

  //Chequeo: no eliminar al último admin
  const admins = this.usuarios.filter(u => u.profile === 'admin');
  if (usuario.profile === 'admin' && admins.length <= 1) {
    this.alerta.mostrar("Debe quedar al menos un usuario administrador.", "danger");
    return;
  }

  // Si pasa los chequeos, se puede eliminar
  this.servicioUsuarios.deleteUser(usuario.id).subscribe({
    next: () => {
      this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
      this.alerta.mostrar("Usuario eliminado con éxito.", "success");
    },
    error: () => {
      this.alerta.mostrar("Error al eliminar el usuario.", "danger");
    }
  });
}

  listarUsuarios() {

    this.servicioUsuarios.getAllUsers().subscribe({

      next : (usuariosDevueltos) => { this.usuarios.push(...usuariosDevueltos); },

      error : (err) => { this.alerta.mostrar("Error al cargar los usuarios.", "danger"); }
    });
  };

  crearUsuarioPage() { this.router.navigate(['/newUser']); };

  volverAtras() { this.router.navigate(['/homePage', this.usuarioActual?.id]); }

  isUsuarioActivo(usuario: Usuario) { return this.usuarioLogueado()?.id === usuario.id; }

}

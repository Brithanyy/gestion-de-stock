import { computed, inject, Injectable, signal } from '@angular/core';
import { Usuario } from '../../Models/Usuario';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Alerta } from '../alerta/alerta';
import { ServicioUsuarios } from '../usuarios/servicio-usuarios';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {

  //*CONSTANTES Y VARIABLES GLOBALES
  //Api de nuestro json-server
  private API_URL = 'http://localhost:3000/Usuarios';

  // Señal que guarda el usuario logueado o null
  private usuarioActual = signal<Usuario | null>(null);

  // Computed para saber si hay un usuario logueado
  readonly isLoggedIn = computed(() => this.usuarioActual() !== null);

  // Servicio de alertas
  readonly alerta: Alerta = inject(Alerta);

  // Servicio de usuarios
  readonly usuariosServicio: ServicioUsuarios = inject(ServicioUsuarios);


  //*MÉTODOS
  constructor(private http : HttpClient, private router : Router) {
    this.restaurarSesion();
  }
  get usuario() { 
    return this.usuarioActual.asReadonly(); 
  }

  private restaurarSesion() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado || usuarioGuardado === 'undefined') return;

    const usuarioParsed: Usuario = JSON.parse(usuarioGuardado);

    // Verificamos que exista id
    if (!usuarioParsed.id) {
      localStorage.removeItem('usuario');
      return;
    }

    // Validamos con backend
    this.http.get<Usuario>(`${this.API_URL}/${usuarioParsed.id}`).subscribe({
      next: (usuarioBackend) => {
        if (usuarioBackend) {
          // Forzamos id como string
          const usuarioFinal = { ...usuarioBackend, id: String(usuarioBackend.id) };
          this.usuarioActual.set(usuarioFinal);
        } else {
          this.usuarioActual.set(null);
          localStorage.removeItem('usuario');
        }
      },
      error: () => {
        this.usuarioActual.set(null);
        localStorage.removeItem('usuario');
      }
    });
  }


   login(username: string, password: string) {
    this.http.get<Usuario[]>(`${this.API_URL}?username=${username}&password=${password}`)
      .subscribe({
        next: (usuarios) => {
          if (usuarios.length > 0) {
            const usuario = { ...usuarios[0], id: String(usuarios[0].id) };

            // Guardamos en señal y localStorage
            this.usuarioActual.set(usuario);
            localStorage.setItem('usuario', JSON.stringify(usuario));

            // Navegamos
            this.router.navigate(['/homePage', usuario.id]);
          } else {
            this.alerta.mostrar('Usuario o contraseña incorrecta', 'danger');
          }
        },
        error: () => this.alerta.mostrar('Error de conexión', 'danger')
      });
  }

  logOut() {
    this.usuarioActual.set(null);
    localStorage.removeItem('usuario');
    this.router.navigate(['/auth/loginPage']);
  }

}

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

  //Señal que guarda el usuario logueado o null
  private usuarioActual = signal<Usuario | null>(null);  

   //Sirve para saber si alguien esta logueado
  isLoggedIn = computed(() => this.usuarioActual() !== null);

  //Servicio de alertas
  readonly alerta : Alerta = inject(Alerta);

  readonly usuariosServicio : ServicioUsuarios = inject(ServicioUsuarios);

  //*MÉTODOS
  constructor(private http : HttpClient, private router : Router) {

  // Restauramos la sesión del localStorage
  const usuarioGuardado = localStorage.getItem('usuario');  

  if(usuarioGuardado && usuarioGuardado !== 'undefined') {

    const usuario = JSON.parse(usuarioGuardado);

    // Verificamos con el backend si el usuario existe

    this.http.get<Usuario>(`${this.API_URL}/${usuario.id}`).subscribe({
      next: (usuarioBackend) => {
        // Si el usuario existe, lo seteamos
        this.usuarioActual.set(usuarioBackend);
      },
      error: () => {
        // Si no existe o hay error (por ejemplo, backend caído), deslogueamos
        this.usuarioActual.set(null);
        localStorage.removeItem('usuario');
      }
    });
  }
}
  get usuario() { 
    return this.usuarioActual.asReadonly(); 
  }

login(nombre: string, password: string) {
  this.http.get<Usuario[]>(`${this.API_URL}?username=${nombre}&password=${password}`)
    .subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];

          // Guardamos el usuario logueado en la señal
          this.usuarioActual.set(usuario);

          // Guardamos en localStorage
          localStorage.setItem('usuario', JSON.stringify(usuario));

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

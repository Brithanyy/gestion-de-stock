import { computed, Injectable, signal } from '@angular/core';
import { Usuario } from '../../Models/Usuario';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {
  //Api de nuestro json-server
  private API_URL = 'http://localhost:3000/Usuarios';

  //Señal que guarda el usuario logueado o null
  private usuarioActual = signal<Usuario | null>(null);  

   //Sirve para saber si alguien esta logueado
  isLoggedIn = computed(() => this.usuarioActual() !== null);

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

  login(nombre: string, password : string) {
    this.http.get<Usuario[]>(`${this.API_URL}?username=${nombre}&password=${password}`)
    .subscribe((usuarios) => {
        if (usuarios.length === 1) {
          const usuario = usuarios[0];
          this.usuarioActual.set(usuario);
          localStorage.setItem('usuario', JSON.stringify(usuario));
          alert("INICIO DE SESION EXITOSO")
          this.router.navigate(['/home']);
        } else {
          alert('Usuario no encontrado');
        }
      });
  }

  logOut() {
    this.usuarioActual.set(null);
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }


}

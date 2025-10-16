import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../Models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarios {

  constructor(private http: HttpClient) {
    this.getAllUsers();
   }

  readonly peticionesHttp = inject(HttpClient);
  readonly urlBase = 'http://localhost:3000/Usuarios';

  usuariosSignal = signal<Usuario[]>([]);


  getAllUsers() {
    return this.http.get<Usuario[]>(this.urlBase)
    .subscribe(usuarios => {
      this.usuariosSignal.set(usuarios);
    });
  }

  getUser(id: string | null | undefined) {
    return this.peticionesHttp.get<Usuario>(this.urlBase + '/' + id);
  }

  postUser(newUser : Usuario) {
    return this.peticionesHttp.post<Usuario>(this.urlBase, newUser);
  }

  deleteUser(id: string | null | undefined) {
    return this.peticionesHttp.delete<Usuario>(this.urlBase + '/' + id);
  }

  putUser(editUser : Usuario) {
    return this.peticionesHttp.put<Usuario>(this.urlBase + '/' + editUser.id, editUser);
  }  


}

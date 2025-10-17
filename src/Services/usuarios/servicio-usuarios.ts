import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../Models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarios {

  constructor() {}

  readonly peticionesHttp = inject(HttpClient);
  readonly urlBase = 'http://localhost:3000/Usuarios';


  getAllUsers() {
    return this.peticionesHttp.get<Usuario[]>(this.urlBase);
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

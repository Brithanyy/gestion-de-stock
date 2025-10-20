import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Movimiento } from '../../Models/Movimiento';

@Injectable({
  providedIn: 'root'
})
export class ServicioMovimientos {
  constructor() { }

  readonly peticionesHttp = inject(HttpClient);
  readonly urlBase = 'http://localhost:3000/Movimientos';

  getAllMotions() {
    return this.peticionesHttp.get<Movimiento[]>(this.urlBase);
  }

  getMotion(id: string | null | undefined) {
    return this.peticionesHttp.get<Movimiento>(this.urlBase + '/' + id);
  }

  postMotion(newMotion : Movimiento) {
    return this.peticionesHttp.post<Movimiento>(this.urlBase, newMotion);
  }

  deleteMotion(id: string | null | undefined) {
    return this.peticionesHttp.delete<Movimiento>(this.urlBase + '/' + id);
  }

  putMotion(editMotion : Movimiento) {
    return this.peticionesHttp.put<Movimiento>(this.urlBase + '/' + editMotion.id, editMotion);
  }  
}

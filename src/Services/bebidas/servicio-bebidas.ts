import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bebida } from '../../Models/Bebida';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioBebidas {
  constructor() { }

  readonly peticionesHttp = inject(HttpClient);
  readonly urlBase = 'http://localhost:3000/Bebidas';

  getAllDrinks() {
    return this.peticionesHttp.get<Bebida[]>(this.urlBase);
  }

  getDrink(id: string | null | undefined) {
    return this.peticionesHttp.get<Bebida>(this.urlBase + '/' + id);
  }

  postDrink(newDrink : Bebida) {
    return this.peticionesHttp.post<Bebida>(this.urlBase, newDrink);
  }

  deleteDrink(id: string | null | undefined) {
    return this.peticionesHttp.delete<Bebida>(this.urlBase + '/' + id);
  }

  putDrink(editDrink : Bebida) {
    return this.peticionesHttp.put<Bebida>(this.urlBase + '/' + editDrink.id, editDrink);
  }  
  //Metodo que nos devuelve las bebidas con stock menor o igual a 5
  getLowStockDrink() {
    return this.getAllDrinks().pipe(
    map(bebidas => bebidas.filter(bebida => bebida.stock <= 5))
  );
  }

  /* EJEMPLO DE COMO USARLO EN NUESTRO COMPONENTE O PAGE
this.servicioBebidas.getLowStockDrink().subscribe({
  next: (bebidasConStockBajo) => {
     Aquí tienes el array filtrado
  }
});
  */

}

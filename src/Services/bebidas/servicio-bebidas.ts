import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bebida } from '../../Models/Bebida';
import { BehaviorSubject, interval, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioBebidas {
  readonly peticionesHttp = inject(HttpClient);
  readonly urlBase = 'http://localhost:3000/Bebidas';

  // 🔹 Estado reactivo para bebidas con bajo stock
  private bebidasStockBajoSubject = new BehaviorSubject<Bebida[]>([]);
  bebidasStockBajo$ = this.bebidasStockBajoSubject.asObservable();

  constructor() {
    // 🔁 Actualiza automáticamente cada 10 segundos
    interval(1000)
      .pipe(switchMap(() => this.getLowStockDrink()))
      .subscribe(bajas => this.bebidasStockBajoSubject.next(bajas));

    // 🔹 Carga inicial inmediata
    this.getLowStockDrink().subscribe(bajas => this.bebidasStockBajoSubject.next(bajas));
  }

  // 🔹 Obtener todas las bebidas
  getAllDrinks() {
    return this.peticionesHttp.get<Bebida[]>(this.urlBase);
  }

  // 🔹 Obtener una bebida específica
  getDrink(id: string | null | undefined) {
    return this.peticionesHttp.get<Bebida>(`${this.urlBase}/${id}`);
  }

  // 🔹 Agregar una nueva bebida
  postDrink(newDrink: Bebida) {
    return this.peticionesHttp.post<Bebida>(this.urlBase, newDrink);
  }

  // 🔹 Eliminar una bebida
  deleteDrink(id: string | null | undefined) {
    return this.peticionesHttp.delete<Bebida>(`${this.urlBase}/${id}`);
  }

  // 🔹 Editar una bebida
  putDrink(editDrink: Bebida) {
    return this.peticionesHttp.put<Bebida>(`${this.urlBase}/${editDrink.id}`, editDrink);
  }

  // 🔹 Método original (devuelve observable con bebidas con stock bajo)
  getLowStockDrink() {
    return this.getAllDrinks().pipe(
      map(bebidas => bebidas.filter(bebida => bebida.stock <= 5))
    );
  }

  // 🔹 NUEVO: actualiza el BehaviorSubject con las bebidas de stock bajo
  actualizarBebidasConStockBajo() {
    this.getLowStockDrink().subscribe({
      next: (bebidas) => this.bebidasStockBajoSubject.next(bebidas),
      error: (err) => console.error('Error al actualizar bebidas con stock bajo:', err)
    });
  }

  // 🔹 NUEVO: cuando se modifica una bebida, actualizamos también el stock bajo
  actualizarYRefrescar(bebida: Bebida) {
    return this.putDrink(bebida).subscribe({
      next: () => this.actualizarBebidasConStockBajo(),
      error: (err) => console.error('Error al actualizar bebida:', err)
    });
  }
}

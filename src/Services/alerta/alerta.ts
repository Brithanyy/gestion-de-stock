import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Alerta {
  // Señal que guarda el mensaje de alerta
  mensaje = signal<string>('');

  // Señal que guarda el tipo de alerta (success, danger, warning, info)
  tipo = signal<'success' | 'danger' | ''>('');

  // Señal para mostrar u ocultar la alerta
  visible = signal<boolean>(false);

   mostrar(mensaje: string, tipo: 'success' | 'danger'| '' = '') {
    this.mensaje.set(mensaje);
    this.tipo.set(tipo);
    this.visible.set(true);
    // Ocultamos la alerta automáticamente después de 3 segundos
    setTimeout(() => this.visible.set(false), 3000);
    }

    ocultar() {
    this.visible.set(false);
  }


}

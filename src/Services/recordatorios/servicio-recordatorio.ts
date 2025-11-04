import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Recordatorio } from '../../Models/Recordatorio';

@Injectable({
  providedIn: 'root'
})
export class ServicioRecordatorio {
  readonly peticionesHttp = inject(HttpClient);
  readonly urlBase = 'http://localhost:3000/Recordatorios';

  getAllReminders() {
        return this.peticionesHttp.get<Recordatorio[]>(this.urlBase);
      };
    
      getReminder(id: string | null | undefined) {
        return this.peticionesHttp.get<Recordatorio>(this.urlBase + '/' + id);
      };
    
      postReminder(newReminder : Recordatorio) {
        return this.peticionesHttp.post<Recordatorio>(this.urlBase, newReminder);
      };
    
      deleteReminder(id: string | null | undefined) {
        return this.peticionesHttp.delete<Recordatorio>(this.urlBase + '/' + id);
      };
    
      putReminder(editReminder : Recordatorio) {
        return this.peticionesHttp.put<Recordatorio>(this.urlBase + '/' + editReminder.id, editReminder);
      };
}

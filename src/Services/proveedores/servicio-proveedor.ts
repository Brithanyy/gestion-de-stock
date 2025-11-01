import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Proveedor } from '../../Models/Proveedor';

@Injectable({
  providedIn: 'root'
})
export class ServicioProveedor {
  readonly peticionesHttp = inject(HttpClient);
  readonly urlBase = 'http://localhost:3000/Proveedores';


  getAllProvider() {
      return this.peticionesHttp.get<Proveedor[]>(this.urlBase);
    };
  
    getProvider(id: string | null | undefined) {
      return this.peticionesHttp.get<Proveedor>(this.urlBase + '/' + id);
    };
  
    postProvider(newProvider : Proveedor) {
      return this.peticionesHttp.post<Proveedor>(this.urlBase, newProvider);
    };
  
    deleterovider(id: string | null | undefined) {
      return this.peticionesHttp.delete<Proveedor>(this.urlBase + '/' + id);
    };
  
    putProvider(editProvider : Proveedor) {
      return this.peticionesHttp.put<Proveedor>(this.urlBase + '/' + editProvider.id, editProvider);
    };

}

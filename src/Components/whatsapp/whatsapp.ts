import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp',
  imports: [],
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.css'
})
export class Whatsapp {
  readonly telefonoAdmin = '+5492236360340';

  abrirWhatsapp() {
    const url = `https://wa.me/${this.telefonoAdmin}`;
    window.open(url, '_blank');
  }
}

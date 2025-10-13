import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLogin } from "../Pages/page-login/page-login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageLogin],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion-de-stock');
}

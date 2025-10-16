import { Component} from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Alertas } from "../Components/alertas/alertas";


@Component({
  selector: 'app-root',
  imports: [Alertas, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


}

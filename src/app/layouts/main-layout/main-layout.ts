import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../../../Components/footer/footer";
import { Header } from "../../../Components/header/header";
import { Sidebar } from "../../../Components/sidebar/sidebar";
import { Notificacion } from "../../../Components/notificacion/notificacion";



@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Footer, Header, Sidebar, Notificacion],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}

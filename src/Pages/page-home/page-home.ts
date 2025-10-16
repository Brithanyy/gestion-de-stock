import { Component } from '@angular/core';
import { Footer } from "../../Components/footer/footer";
import { NavBar } from "../../Components/nav-bar/nav-bar";
import { BarraLateral } from "../../Components/barra-lateral/barra-lateral";

@Component({
  selector: 'app-page-home',
  imports: [Footer, NavBar, BarraLateral],
  templateUrl: './page-home.html',
  styleUrl: './page-home.css'
})
export class PageHome {

}

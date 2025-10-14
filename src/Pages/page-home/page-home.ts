import { Component } from '@angular/core';
import { Footer } from "../../Components/footer/footer";
import { NavBar } from "../../Components/nav-bar/nav-bar";

@Component({
  selector: 'app-page-home',
  imports: [Footer, NavBar],
  templateUrl: './page-home.html',
  styleUrl: './page-home.css'
})
export class PageHome {

}

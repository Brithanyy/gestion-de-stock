import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../../../Components/footer/footer";
import { Header } from "../../../Components/header/header";
import { Sidebar } from "../../../Components/sidebar/sidebar";



@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Footer, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

/* ###### DISTRIBUIDOR PRINCIPAL SPA ###### */
// ------ Expone Un Cascaron Donde El Router Inyectara Cada Vista O Modulo En Concreto ------
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  // ------ Nombre Asignado Al Compilado Resultante ------
  title = 'ticketpro-web';
}

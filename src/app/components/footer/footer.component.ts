import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/* ###### COMPONENTE DE PIE DE PAGINA ######## */
// ------ No Contiene Logica Especial Oculta Solo Enlaces De Ruta ------
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {}

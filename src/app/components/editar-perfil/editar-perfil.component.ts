import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HeroComponent } from "../hero/hero.component";

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
  imports: [HeroComponent, ReactiveFormsModule],
})
export class EditarPerfilComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Cargamos los datos actuales para rellenar el formulario
    this.authService.getPerfil().subscribe((user) => {
      this.editForm.patchValue({
        nombre: user.nombre,
        apellidos: user.apellidos,
        fechaNacimiento: user.fechaNacimiento,
        direccion: user.direccion,
        ciudad: user.ciudad,
        metodoPagoPreferido: user.metodoPagoPreferido,
      });
    });
  }

  initForm() {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required]],
      fechaNacimiento: [''],
      direccion: [''],
      ciudad: [''],
      metodoPagoPreferido: ['TARJETA'],
    });
  }

  guardarCambios() {
    if (this.editForm.valid) {
      const datosActualizados = this.editForm.value;
      this.authService.updatePerfil(datosActualizados).subscribe({
        next: () => {
          // Si todo va bien, volvemos a la vista de cuenta
          this.router.navigate(['/mi-cuenta']);
        },
        error: (err) => console.error('Error al actualizar', err),
      });
    }
  }

  cancelar() {
    this.router.navigate(['/mi-cuenta']);
  }
}

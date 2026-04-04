import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray, // <-- Importante
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeroComponent, RouterModule],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent implements OnInit {
  editForm!: FormGroup;
  loading: boolean = false;
  tiposTelefono = ['MOVIL', 'FIJO', 'TRABAJO']; // Opciones del Enum

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  initForm() {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(9)]],
      fechaNacimiento: ['', [Validators.required]],
      // Array de teléfonos
      telefonos: this.fb.array([]),

      calle: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      pisoPuerta: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.minLength(5)]],
      ciudad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      metodoPagoPreferido: ['', [Validators.required]],
    });
  }

  // Getter para acceder fácilmente al array en el HTML
  get telefonosFormArray() {
    return this.editForm.get('telefonos') as FormArray;
  }

  // Crear un grupo de teléfono (Número + Tipo)
  crearTelefonoFormGroup(numero = '', tipo = 'MOVIL'): FormGroup {
    return this.fb.group({
      numero: [
        numero,
        [Validators.required, Validators.pattern('^[0-9]{9,15}$')],
      ],
      tipo: [tipo, [Validators.required]],
    });
  }

  agregarTelefono(numero = '', tipo = 'MOVIL') {
    this.telefonosFormArray.push(this.crearTelefonoFormGroup(numero, tipo));
  }

  eliminarTelefono(index: number) {
    this.telefonosFormArray.removeAt(index);
  }

  cargarDatosUsuario() {
    this.loading = true;
    this.authService.getPerfil().subscribe({
      next: (user) => {
        this.editForm.patchValue({
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          dni: user.dni,
          fechaNacimiento: user.fechaNacimiento,
          calle: user.calle,
          numero: user.numero,
          pisoPuerta: user.pisoPuerta,
          codigoPostal: user.codigoPostal,
          ciudad: user.ciudad,
          provincia: user.provincia,
          pais: user.pais,
          metodoPagoPreferido: user.metodoPagoPref || user.metodoPagoPreferido,
        });

        // Limpiar y cargar teléfonos del servidor
        this.telefonosFormArray.clear();
        // Verificamos si el usuario tiene teléfonos en la respuesta del servidor
        if (user.telefonos && user.telefonos.length > 0) {
          user.telefonos.forEach((tel: any) => {
            // Creamos una fila nueva por cada teléfono que viene de la BD
            this.telefonosFormArray.push(
              this.fb.group({
                numero: [
                  tel.numero,
                  [Validators.required, Validators.pattern('^[0-9]{9,15}$')],
                ],
                tipo: [tel.tipo || 'MOVIL', [Validators.required]],
              }),
            );
          });
        } else {
          // Si no tiene ninguno, añadimos uno vacío para que no se vea feo
          this.agregarTelefono();
        }

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  guardarCambios() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    // Ahora this.editForm.value incluye el array "telefonos: [{numero, tipo}, ...]"
    this.authService.updatePerfil(this.editForm.value).subscribe({
      next: () => this.router.navigate(['/perfil']),
      error: (err) => {
        console.error('Error al actualizar', err);
        this.loading = false;
        alert('No se pudieron guardar los cambios.');
      },
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.editForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  cancelar() {
    this.router.navigate(['/perfil']);
  }
}

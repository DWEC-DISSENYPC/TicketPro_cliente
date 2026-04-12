import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule, // <-- Añadido para [(ngModel)]
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeroComponent,
    RouterModule,
  ],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent implements OnInit {
  editForm!: FormGroup;
  loading: boolean = false;
  tiposTelefono = ['MOVIL', 'FIJO', 'TRABAJO'];
  passwordActual: string = '';
  passwordNueva: string = '';
  errorMessage: string = '';
  mensajeSuccess: string = '';

  // --- Propiedades Imagen ---
  imagenSeleccionada: File | null = null;
  imagenPerfilUrl: string = '';

  // --- Propiedades Contraseña ---
  showPassword = false;
  nuevaPass: string = ''; // Usamos string en lugar de any
  confirmarPass: string = '';
  token: string = '';
  passActual: string | undefined;

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

  // --- LÓGICA FORMULARIO PRINCIPAL ---
  initForm() {
    this.editForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(9)]],
      fechaNacimiento: ['', [Validators.required]],
      telefonos: this.fb.array([]),
      calle: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      pisoPuerta: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.minLength(5)]],
      ciudad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      metodoPagoPref: ['', [Validators.required]],
    });
    // Eliminado passwordMatchValidator de aquí porque ya no es reactivo
  }

  guardarCambios() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.updatePerfil(this.editForm.value).subscribe({
      next: () => {
        this.showToastMessage('Datos actualizados correctamente', 'success');
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        this.loading = false;
        alert('No se pudieron guardar los cambios personales.');
      },
    });
  }

  // --- LÓGICA IMAGEN (Independiente) ---
  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPerfilUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  subirImagen() {
    if (!this.imagenSeleccionada) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('imagen', this.imagenSeleccionada);

    this.authService.subirImagenPerfil(formData).subscribe({
      next: (res) => {
        this.imagenPerfilUrl = res.url;
        this.imagenSeleccionada = null; // Limpiamos selección
        this.showToastMessage('Imagen actualizada correctamente', 'success');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToastMessage('Error al subir la imagen', 'info');
      },
    });
  }

  // --- LÓGICA CONTRASEÑA (Independiente) ---

  actualizarPassword(): void {
    if (!this.passwordActual || !this.passwordNueva) {
      this.errorMessage = 'Debes completar ambos campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService
      .updatePassword(this.passwordNueva, this.passwordActual)
      .subscribe({
        next: () => {
          this.loading = false;
          this.passwordNueva = '';
          this.passwordActual = '';
          this.showToastMessage('Contraseña cambiada con éxito', 'success');
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err.error?.message || 'Error al cambiar la contraseña.';
        },
      });
  }

  // --- MÉTODOS AUXILIARES ---
  get telefonosFormArray() {
    return this.editForm.get('telefonos') as FormArray;
  }

  agregarTelefono(numero = '', tipo = 'MOVIL') {
    this.telefonosFormArray.push(
      this.fb.group({
        numero: [
          numero,
          [Validators.required, Validators.pattern('^[0-9]{9,15}$')],
        ],
        tipo: [tipo, [Validators.required]],
      }),
    );
  }

  eliminarTelefono(index: number) {
    this.telefonosFormArray.removeAt(index);
  }

  cargarDatosUsuario() {
    this.loading = true;
    this.authService.getPerfil().subscribe({
      next: (user) => {
        this.imagenPerfilUrl = user.imagenUrl || '';
        this.editForm.patchValue(user);

        this.telefonosFormArray.clear();
        if (user.telefonos?.length > 0) {
          user.telefonos.forEach((tel: any) =>
            this.agregarTelefono(tel.numero, tel.tipo),
          );
        } else {
          this.agregarTelefono();
        }
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.editForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  cancelar() {
    this.router.navigate(['/perfil']);
  }

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'info' = 'info';

  showToastMessage(message: string, type: 'success' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}

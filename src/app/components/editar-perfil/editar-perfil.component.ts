import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeroComponent } from '../hero/hero.component';

/* ###### COMPONENTE DE EDICION DE PERFIL ###### */
// ------ Agrupa La Logica Para Editar Los Datos De La Cuenta Del Usuario ------
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

  /* ###### ESTADOS DEL FORMULARIO Y VARIABLES GLOBALES ###### */

  // ------ Objeto Que Almacena El Formulario Reactivo ------
  editForm!: FormGroup;
  // ------ Indicador Visual De Carga ------
  loading: boolean = false;
  // ------ Enum Temporal De Tipos De Telefono ------
  tiposTelefono = ['MOVIL', 'FIJO', 'TRABAJO'];
  // ------ Estado Para Contraseña En Uso ------
  passwordActual: string = '';
  // ------ Estado Para Contraseña Deseada ------
  passwordNueva: string = '';
  // ------ Mensajeria De Fallo ------
  errorMessage: string = '';
  // ------ Mensajeria De Exito ------
  mensajeSuccess: string = '';

  /* ###### PROPIEDADES DE IMAGEN ###### */

  // ------ Archivo Intermedio Subido Desde El Ordenador ------
  imagenSeleccionada: File | null = null;
  // ------ Ruta Directa Del Alojamiento Remoto De Imagen ------
  imagenPerfilUrl: string = '';

  /* ###### PROPIEDADES DE CONTRASEÑA ADICIONALES ###### */

  // ------ Alterna Visualizacion Al Escribir Pass ------
  showPassword = false;
  // ------ Almacen De Seguridad Secundaria ------
  nuevaPass: string = '';
  // ------ Requisito De Comparacion ------
  confirmarPass: string = '';
  // ------ Hash De Solicitud En Correo ------
  token: string = '';
  // ------ Interfaz Temporal De Contraseña ------
  passActual: string | undefined;

  /* ###### CONSTRUCTOR PRINCIPAL ###### */

  // ------ Genera Las Dependencias Inyectables Hacia Auth E Inicia Obstruido Form ------
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initForm();
  }

  /* ###### CICLO DE VIDA INTERNO ###### */

  // ------ Detonador De Acciones Posteriores Al Cargar Graficos ------
  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  /* ###### LOGICA FORMULARIO PRINCIPAL ###### */

  // ------ Inicializador De FormGroup Global Relativo ------
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
    // ------ Eliminado Password Match Validator De Aqui Porque Ya No Es Reactivo ------
  }

  // ------ Detonador Http De Almacenamiento Creador Update ------
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

  /* ###### LOGICA DE IMAGEN (INDEPENDIENTE) ###### */

  // ------ Previsualizador Html Del File Api ------
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

  // ------ Ejecuta La Peticion Con El File Formato Crudo En Multipart ------
  subirImagen() {
    if (!this.imagenSeleccionada) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('imagen', this.imagenSeleccionada);

    this.authService.subirImagenPerfil(formData).subscribe({
      next: (res) => {
        this.imagenPerfilUrl = res.url;
        // ------ Limpiamos Seleccion ------
        this.imagenSeleccionada = null;
        this.showToastMessage('Imagen actualizada correctamente', 'success');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToastMessage('Error al subir la imagen', 'info');
      },
    });
  }

  /* ###### LOGICA CONTRASEÑA (INDEPENDIENTE) ###### */

  // ------ Dispara Peticion Propia De Nuevo Hash ------
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

  /* ###### METODOS DE SOPORTE Y MANUBLAJE DE ARRAYS ###### */

  // ------ Getter Del Array Formularios Para Usarlo En Template ------
  get telefonosFormArray() {
    return this.editForm.get('telefonos') as FormArray;
  }

  // ------ Añade Un FormGroup Extra Al Subrarray Telefono ------
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

  // ------ Corta Y Retira Indice Solicitado Del Array Formulario ------
  eliminarTelefono(index: number) {
    this.telefonosFormArray.removeAt(index);
  }

  // ------ Peticion Desencadenada De Informacion Restablecida Por Defecto ------
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

  // ------ Revisa El Toched Del Controlador Directo Visual ------
  campoInvalido(campo: string): boolean {
    const control = this.editForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  // ------ Boton Restablece Navegacion Atrás ------
  cancelar() {
    this.router.navigate(['/perfil']);
  }

  /* ###### CONTROLADORES TOAST NOTIFICACIONES ###### */

  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'info' = 'info';

  // ------ Ejecucion Global Temporizada A Desvancer ------
  showToastMessage(message: string, type: 'success' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}

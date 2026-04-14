import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventoService } from '../../services/evento.service';
import { EventoDTO, SesionDTO, CompraEntradasDTO } from '../../models/evento.model';

/* ###### COMPONENTE DE EVENTO DETALLADO ###### */
// ------ Se Encarga De Cargar Y Gestionar La Seleccion Individualizada De Espectaculos ------
@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css'],
})
export class EventoDetalleComponent implements OnInit {

  /* ###### VARIABLES Y ALMACENES PUBLICOS ###### */

  // ------ Persistencia Del Formato Dto De Un Evento Activo ------
  evento: EventoDTO | null = null;
  // ------ Recuperacion En Bruto De Sesiones Atadas Al Evento ------
  sesiones: SesionDTO[] = [];
  // ------ Listado Modificado Y Visualizable Segun Filtros Aplicados ------
  sesionesFiltradas: SesionDTO[] = [];
  // ------ Extraccion Dinamica De Ubicaciones Existentes ------
  ciudades: string[] = [];
  // ------ Mapeado Singular De La Caja Selectora ------
  ciudadSeleccionada: string | null = null;
  // ------ Array De Opciones Escritas Numericamente Asociadas Al Id ------
  cantidadSeleccionada: Record<number, number> = {};
  // ------ Variable De Restriccion Automatica Activada ------
  cantidadAjustada: Record<number, boolean> = {};
  
  /* ###### INDICADORES GLOBALES ###### */

  // ------ Detonador De Panel Cargando ------
  cargando: boolean = false;
  // ------ Texto De Exception Lanzable ------
  error: string | null = null;
  // ------ Frase De Confirmacion Exitosa Tras Comprar ------
  exitoCompra: string | null = null;

  /* ###### INYECCION DE DEPENDENCIAS ###### */

  // ------ Recupera Las Instancias De Rutas Y La Conexion Rest Central ------
  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ) {}

  /* ###### INICIO DE CICLO ###### */

  // ------ Al Arrancar Mapea El Id Enviado En La Ruta Html ------
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.cargarEventoDetalle(id);
    } else {
      this.error = 'ID de evento inválido.';
    }
  }

  /* ###### FUNCIONES COMPARTIDAS HTTP Y MANUBLAJE ###### */

  // ------ Peticion Combinada Con Fork Join Para Obtener Informacion Reestructurada ------
  cargarEventoDetalle(id: number): void {
    this.cargando = true;
    this.error = null;
    this.exitoCompra = null;

    forkJoin({
      evento: this.eventoService.obtenerPorId(id),
      sesiones: this.eventoService.listarSesionesPorEvento(id),
    }).subscribe({
      next: ({ evento, sesiones }) => {
        this.evento = evento;
        this.sesiones = sesiones || [];
        this.actualizarCiudades();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando el detalle del evento:', err);
        this.error = 'No se pudo cargar el detalle del evento. Intenta de nuevo más tarde.';
        this.cargando = false;
      },
    });
  }

  // ------ Depura Todo A Un Set Sin Duplicados De Las Procedencias Geo ------
  actualizarCiudades(): void {
    this.ciudades = Array.from(
      new Set(this.sesiones.map((sesion) => sesion.ciudadUbicacion).filter(Boolean))
    );
    this.ciudadSeleccionada = this.ciudades.length ? this.ciudades[0] : null;
    this.filtrarSesiones();
  }

  // ------ Disparador Reaccionario Que Recorta Y Desecha Objetos Diferentes A Lo Mostrado ------
  filtrarSesiones(): void {
    if (!this.ciudadSeleccionada) {
      this.sesionesFiltradas = [...this.sesiones];
      return;
    }

    this.sesionesFiltradas = this.sesiones.filter(
      (sesion) => sesion.ciudadUbicacion === this.ciudadSeleccionada
    );

    // ------ Setea A Minimo 1 Cada Caja Por Defecto ------
    this.sesionesFiltradas.forEach((sesion) => {
      if (!this.cantidadSeleccionada[sesion.id]) {
        this.cantidadSeleccionada[sesion.id] = 1;
      }
    });
  }

  // ------ Fusion De Texto De Direccion Relativa ------
  obtenerLocalizacion(): string {
    const sesion = this.sesionesFiltradas[0];
    if (!sesion) {
      return 'Información no disponible.';
    }
    return `${sesion.nombreSala}, ${sesion.nombreUbicacion}`;
  }

  /* ###### CALCULOS VISIBLES NUMERICAMENTE ###### */

  // ------ Compara Capacidad Total Frente A Reservada Y Oculta Los Negativos A Cero ------
  entradasDisponibles(sesion: SesionDTO): number {
    return Math.max(0, (sesion.capacidadSala || 0) - (sesion.entradasVendidas || 0));
  }

  // ------ Restringe Y Asigna Avisos Si El Cliente Manipula Erronea Su Cantidad O Ingresa Vivos ------
  validarCantidad(sesion: SesionDTO): number {
    const disponible = this.entradasDisponibles(sesion);
    let cantidad = this.cantidadSeleccionada[sesion.id] ?? 1;
    this.cantidadAjustada[sesion.id] = false;

    if (cantidad < 1) {
      cantidad = 1;
    }
    if (cantidad > disponible) {
      cantidad = disponible;
      this.cantidadAjustada[sesion.id] = true;
    }

    return cantidad;
  }

  // ------ Actualizador De Variable Global Por Interaccion En Css Input ------
  onCantidadChange(sesion: SesionDTO): void {
    this.cantidadSeleccionada[sesion.id] = this.validarCantidad(sesion);
  }

  // ------ Retorna Si La Cifra Supera Disposicion Para Boton De Comprar ------
  cantidadNoValida(sesion: SesionDTO): boolean {
    const cantidad = this.cantidadSeleccionada[sesion.id] ?? 1;
    const disponible = this.entradasDisponibles(sesion);
    return cantidad < 1 || cantidad > disponible;
  }

  /* ###### PETICION PRINCIPAL DE COMPRA DIRECTA ###### */

  // ------ Finaliza Confirmando El Pedido Formal Atraves Del Servicio Interconectado ------
  comprarSesion(sesion: SesionDTO): void {
    this.error = null;
    this.exitoCompra = null;

    const cantidad = this.validarCantidad(sesion);
    const disponible = this.entradasDisponibles(sesion);
    if (cantidad < 1 || cantidad > disponible) {
      this.error = `Selecciona entre 1 y ${disponible} entradas disponibles.`;
      return;
    }

    // ------ Generar Dto Necesario Que Enviarlo Al Endpoint ------
    const compra: CompraEntradasDTO = {
      sesionId: sesion.id,
      cantidad,
    };

    this.eventoService.realizarCompra(compra).subscribe({
      next: (mensaje) => {
        this.exitoCompra = mensaje || 'Compra realizada con éxito.';
        // ------ Limpiar La Cantidad Seleccionada Y El Aviso De Ajuste ------
        delete this.cantidadSeleccionada[sesion.id];
        delete this.cantidadAjustada[sesion.id];
        // ------ Recargar El Detalle Del Evento Para Actualizar Las Entradas Disponibles ------
        this.cargarEventoDetalle(this.evento!.id);
      },
      error: (err: any) => {
        console.error('Error al realizar compra:', err);

        // ------ Manejo Especifico De Errores Controlados ------
        if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (err.status === 401) {
          this.error = 'Debes iniciar sesión para realizar una compra.';
        } else if (err.status === 403) {
          this.error = 'No tienes permisos para realizar esta acción.';
        } else if (err.status === 404) {
          this.error = 'El servicio de compras no está disponible.';
        } else if (err.status >= 500) {
          this.error = 'Error interno del servidor. Intenta de nuevo más tarde.';
        } else {
          this.error = err.error?.message || err.message || 'No se pudo completar la compra. Intenta de nuevo más tarde.';
        }
      },
    });
  }
}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { InPaciente } from '../../../modelos/modelPacientes/InPacientes';
import { PacientesService } from '../../../servicios/pacientes.service';
import { routes } from '../../../app.routes';
import { AlertService } from '../../../servicios/Alertas/alertas.service';
import { DirectivasModule } from '../../../directivas/directivas.module';

@Component({
    selector: 'app-listapacientes',
    imports: [CommonModule, RouterModule, DirectivasModule],
    templateUrl: './listapacientes.component.html',
    styleUrl: './listapacientes.component.css'
})
export class ListapacientesComponent {
  listaPacientes: InPaciente[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private ServicioPaciente: PacientesService,
    private ServicioAlertas: AlertService
  ) {}

  ngOnInit(): void {
    this.listarPacientesEstado(true);
  }

  listarPacientesEstado(estado: any): void {
    this.ServicioPaciente.LPacientesEstado(estado).subscribe({
      next: (res) => {
        this.listaPacientes = res;
      },
      error: (err) => {
        this.ServicioAlertas.infoEventoConfir(
          'SESIÓN EXPIRADA',
          'Inicie nuevamente sesión',
          () => {
            this.router.navigate(['/login']);
          }
        );
      },
    });
  }

  eliminarPaciente(id: any, nombre: string): void {
    this.ServicioAlertas.confirm(
      'CONFIRMAR ACCIÓN',
      '¿Está seguro que desea eliminar el registro de ' + nombre,
      'Si, eliminar',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ServicioPaciente.EliminarPaciente(id).subscribe({
          next: (res) => {
            this.listaPacientes = this.listaPacientes.filter(
              (paciente) => parseInt(paciente.codigo) !== id
            );

            this.ServicioAlertas.eliminacionCorrecta();
          },
          error: (err) => {
            this.ServicioAlertas.error(
              'ERROR',
              'Se genero un error en el proceso de eliminación'
            );
            console.log('ERROR  ' + err.error.error);
          },
        });
      }
    });
  }

  ActualizarPaciente(id: any): void {
    this.router.navigate(['home/actualizarPaciente', id]);
  }
}

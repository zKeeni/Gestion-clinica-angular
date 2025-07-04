import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { InEspecialidades } from '../../../modelos/modeloEspecialidades/InEspecialidades';
import { especialidadesService } from '../../../servicios/especialidades.service';
import { AlertService } from '../../../servicios/Alertas/alertas.service';

@Component({
    selector: 'app-listaespecialidades',
    imports: [CommonModule, RouterModule],
    templateUrl: './listaespecialidades.component.html',
    styleUrl: './listaespecialidades.component.css'
})
export class listaEspecialidadesComponent {
  listaEspecialidades: InEspecialidades[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private ServicioEspecialidad: especialidadesService,
    private ServicioAlertas: AlertService
  ) {}

  ngOnInit(): void {
    this.listarEspecialidadesEstado(true);
  }

  listarEspecialidadesEstado(estado: any): void {
    this.ServicioEspecialidad.LespecialidadesEstado(estado).subscribe({
      next: (res) => {
        this.listaEspecialidades = res;

        console.log(res);
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

  eliminarEspecialidades(id: any, nombre: string): void {
    this.ServicioAlertas.confirm(
      'CONFIRMAR ACCIÓN',
      '¿Está seguro que desea eliminar el registro de ' + nombre,
      'Si, eliminar',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ServicioEspecialidad.EliminarEspecialidad(id).subscribe({
          next: (res) => {
            this.listaEspecialidades = this.listaEspecialidades.filter(
              (especialidad) => parseInt(especialidad.codigo) !== id
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

  Actualizarespecialidad(id: any): void {
    this.router.navigate(['home/actualizarEspecialidades', id]);
  }
}

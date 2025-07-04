import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ConsultoriosService } from '../../../servicios/consultorios.service';
import { InConsultorios } from '../../../modelos/modelConsultorios/InConsultorios';
import { AlertService } from '../../../servicios/Alertas/alertas.service';

@Component({
    selector: 'app-listacosultorios',
    imports: [CommonModule, RouterModule],
    templateUrl: './listaconsultorios.component.html',
    styleUrl: './listaconsultorios.component.css'
})
export class ListaconsultoriosComponent {
  listaConsultorios: InConsultorios[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private ServicioConsultorio: ConsultoriosService,
    private ServicioAlertas: AlertService
  ) {}

  ngOnInit(): void {
    this.listarConsultoriosEstado(true);
  }

  listarConsultoriosEstado(estado: any): void {
    this.ServicioConsultorio.LConsultoriosEstado(estado).subscribe({
      next: (res) => {
        this.listaConsultorios = res;
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

  eliminarConsultorios(id: any, nombre: string): void {
    this.ServicioAlertas.confirm(
      'CONFIRMAR ACCIÓN',
      '¿Está seguro que desea eliminar el registro de ' + nombre,
      'Si, eliminar',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        this.ServicioConsultorio.EliminarConsultorio(id).subscribe({
          next: (res) => {
            this.listaConsultorios = this.listaConsultorios.filter(
              (consultorio) => parseInt(consultorio.codigo) !== id
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

  ActualizarConsultorio(id: any): void {
    this.router.navigate(['home/actualizarConsultorios', id]);
  }
}

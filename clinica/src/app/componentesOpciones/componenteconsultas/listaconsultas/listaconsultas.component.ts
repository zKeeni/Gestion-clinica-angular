import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InCitaPacienteLista } from '../../../modelos/modeloCitas/InCitaPacienteLista';
import { citasService } from '../../../servicios/citas.service';
import { MedicosService } from '../../../servicios/medicos.service';
import { InMedico } from '../../../modelos/modelMedicos/InMedico';
import { AlertService } from '../../../servicios/Alertas/alertas.service';
import { AuthService } from '../../../servicios/authservicio.service';
import { DirectivasModule } from '../../../directivas/directivas.module';

@Component({
    selector: 'app-listaconsultas',
    imports: [CommonModule, RouterModule, DirectivasModule],
    templateUrl: './listaconsultas.component.html',
    styleUrl: './listaconsultas.component.css'
})
export class listaConsultasComponent {
  listaCitasPacientesP: InCitaPacienteLista[] = [];
  listaMedicos: InMedico[] = [];
  codigoMedico: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private servicioCitas: citasService,
    private servicioMedicos: MedicosService,
    private ServicioAlertas: AlertService,
    private authServi: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authServi.obtenerRol() == 'administrador') {
      this.cargarMedico();
    }else if (this.authServi.obtenerRol() == 'medico'){

      this.codigoMedico = parseInt(this.authServi.obtenerCodigoMedico() ?? "0");

      this.listarCitasPacienteMedicoP(this.codigoMedico,true);

      
    }
  }

  onSelectChange(event: Event): void {
    const cbx = event.target as HTMLSelectElement;
    console.log('entra al evento change');

    if (cbx.id === 'selectMedico') {
      this.listarCitasPacienteMedicoP(parseInt(cbx.value), true);
    }
  }

  listarCitasPacienteMedicoP(codigo: number, estado: boolean): void {
    this.servicioCitas.LcitasPacientesPendientes(codigo, estado).subscribe({
      next: (res) => {
        this.listaCitasPacientesP = res;
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

  cargarMedico(): void {
    this.servicioMedicos.LMedicos().subscribe({
      next: (res) => {
        this.listaMedicos = res;
      },
      error: (err) => {
        console.error('Error cargar medicos:', err.message);
        this.ServicioAlertas.error(
          'ERROR',
          'Se genero un error en el proceso de obtener los datos de medico'
        );
      },
    });
  }

  RealizarConsulta(citaPaciente: InCitaPacienteLista): void {
    this.router.navigate(['home/realizarConsulta'], {
      queryParams: {
        codigo_cita: citaPaciente.codigo_cita,
        cedula: citaPaciente.cedula,
        nombre: citaPaciente.nombre_completo,
        edad: citaPaciente.edad,
      },
    });
  }
}

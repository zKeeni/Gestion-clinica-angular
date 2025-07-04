import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InCitaPacienteLista } from '../../../modelos/modeloCitas/InCitaPacienteLista';
import { MedicosService } from '../../../servicios/medicos.service';
import { InMedico } from '../../../modelos/modelMedicos/InMedico';
import { AlertService } from '../../../servicios/Alertas/alertas.service';
import { historialService } from '../../../servicios/historial.service';
import {
  InHistorial,
  InHistorialLista,
} from '../../../modelos/modeloHistorial/InHistorial';
import { consultasService } from '../../../servicios/consultas.service';
import { jsPDF } from 'jspdf';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgModule } from '@angular/core';
import { AuthService } from '../../../servicios/authservicio.service';
import { DirectivasModule } from '../../../directivas/directivas.module';

@Component({
    selector: 'app-listahistorial',
    imports: [RouterModule, ReactiveFormsModule, CommonModule, DirectivasModule],
    templateUrl: './listahistorial.component.html',
    styleUrl: './listahistorial.component.css'
})
export class listaHistorialComponent {
  listaHistorial: InHistorialLista[] = [];
  listaHistorialCompleta: InHistorial[] = [];

  listaMedicos: InMedico[] = [];
  codigoMedico: number = 0;
  txtCedula: string = '';
  txtFechaInicio: string = '';
  txtFechaFin: string = '';
  formListarConsulta: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,

    private servicioHistorial: historialService,
    private servicioMedicos: MedicosService,
    private servicioConsultas: consultasService,
    private authService : AuthService,

    private ServicioAlertas: AlertService
  ) {
    this.formListarConsulta = this.formBuilder.group({
      txtCedulaPaciente: [''],
      checkCanlendario: [false], // Checkbox desmarcado por defecto
      txtFechaInicio: [{ value: '', disabled: true }],
      txtFechaFin: [{ value: '', disabled: true }],

      selectMedico: [],
      end: [''],
    });

    this.formListarConsulta
      .get('checkCanlendario')
      ?.valueChanges.subscribe((enabled) => {
        if (enabled) {
          this.formListarConsulta.get('txtFechaInicio')?.enable();
          this.formListarConsulta.get('txtFechaFin')?.enable();
        } else {
          this.formListarConsulta.get('txtFechaInicio')?.disable();
          this.formListarConsulta.get('txtFechaFin')?.disable();
          this.txtFechaFin = '';
          this.txtFechaInicio = '';
        }
      });
  }

  ngOnInit(): void {
    this.cargarMedico();

    this.codigoMedico = parseInt(this.authService.obtenerCodigoMedico() ?? "0");

  }

  onSelectChange(event: Event): void {
    const cbx = event.target as HTMLSelectElement;

    if (cbx.id === 'selectMedico') {
      this.codigoMedico = parseInt(cbx.value);
    }
  }

  listarHistorialFilto() {
    this.txtCedula = this.formListarConsulta.value.txtCedulaPaciente || null;
    if(this.authService.obtenerRol()=='administrador'){
      this.codigoMedico = this.formListarConsulta.value.selectMedico || null;

    }

    console.log(this.codigoMedico)
    this.txtFechaFin = this.formListarConsulta.value.txtFechaFin || null;
    this.txtFechaInicio = this.formListarConsulta.value.txtFechaInicio || null;

    console.log(this.formListarConsulta.value.end);
    this.listarHistorial(
      this.txtCedula,
      this.codigoMedico,
      this.txtFechaInicio,
      this.txtFechaFin
    );
  }

  listarHistorial(
    cedulaPaciente: any,
    codigoMedico: any,
    fechaInicio: any,
    fechaFin: any
  ): void {
    this.servicioHistorial
      .LhistorialcedPacientecodMedicoFechaIF(
        cedulaPaciente,
        codigoMedico,
        fechaInicio,
        fechaFin
      )
      .subscribe({
        next: (res) => {
          this.listaHistorial = res;
          console.log(res);
        },
        error: (err) => {
          this.ServicioAlertas.info('', 'No se encontraron registros');
        },
      });
  }

  cargarMedico(): void {
    this.servicioMedicos.LMedicos().subscribe({
      next: (res) => {
        console.log(res);
        this.listaMedicos = res;
        console.log(this.listaMedicos);

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

  BuscarConsultaPorCodigoConsulta(codigoConsulta: number): void {
    this.servicioHistorial.LhistorialCodigoConsulta(codigoConsulta).subscribe({
      next: (res) => {
        this.generatePDF(res);
      },
      error: (err) => {
        console.error('Error cargar medicos:', err.message);
        this.ServicioAlertas.error(
          'ERROR',
          'Se genero un error en el proceso de obtener los datos '
        );
      },
    });
  }

  generatePDF(consulta: InHistorial) {
    if (!consulta) {
      console.error('Consulta no encontrada.');
      return;
    }
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text(`Historial de Consulta N° ${consulta.codigo_consulta}`, 105, 10, { align: 'center' });
    doc.addImage('/iconoestetocopio.jpg','png',10,10,50,50);
    // Información del paciente
    doc.setFontSize(12);
    doc.text('Información del Paciente:', 10, 30);
    doc.text(
      `Nombre: ${consulta.nombre_paciente} ${consulta.apellido_paciente}`,
      10,
      40
    );
    doc.text(`Cédula: ${consulta.cedula_paciente}`, 10, 50);
    doc.text(`Edad: ${consulta.edad_paciente || 'N/A'}`, 10, 60);

    // Información del médico
    doc.text('Información del Médico:', 10, 80);
    doc.text(
      `Nombre: ${consulta.nombre_medico} ${consulta.apellido_medico}`,
      10,
      90
    );
    doc.text(`Cédula: ${consulta.cedula_medico}`, 10, 100);
    doc.text(`Especialidad: ${consulta.especialidad}`, 10, 110);

    // Detalles de la consulta
    doc.text('Detalles de la Consulta:', 10, 130);
    doc.text(
      `Fecha: ${new Date(consulta.fecha_consulta).toLocaleDateString()}`,
      10,
      140
    );
    doc.text(`Consultorio: ${consulta.consultorio}`, 10, 150);
    doc.text(`Diagnóstico: ${consulta.diagnostico}`, 10, 160);
    doc.text(`Tratamiento: ${consulta.tratamiento}`, 10, 170);
    doc.text(`Observaciones: ${consulta.observaciones}`, 10, 180);

    // Agregar más datos si es necesario
    doc.text(`Peso: ${consulta.peso || 'N/A'}`, 10, 190);
    doc.text(
      `Presión Arterial: ${consulta.presion_arterial || 'N/A'}`,
      10,
      200
    );
    doc.text(`Temperatura: ${consulta.temperatura || 'N/A'}°C`, 10, 210);

    // Guardar el PDF
    //doc.save(`consulta_${consulta.codigo_consulta}.pdf`);
    // Abrir el PDF en una nueva ventana o en el mismo navegador
    const pdfOutput = doc.output('bloburl');
    window.open(pdfOutput, '_blank');
  }

  abrirReporte(codigo: any): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['home/historial/imprimir', codigo])
    );
    window.open(url, '_blank');
  }
}

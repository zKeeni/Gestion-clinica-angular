import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ControlEvent,
  FormBuilder,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InPaciente } from '../../../modelos/modelPacientes/InPacientes';
import { PacientesService } from '../../../servicios/pacientes.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../servicios/Alertas/alertas.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-frmpacientes',
    imports: [ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './frmpacientes.component.html',
    styleUrl: './frmpacientes.component.css'
})
export class FrmpacientesComponent {
  frmPaciente: FormGroup;
  eventoUpdate: boolean = false;
  codigo: number | null = null;

  @ViewChild('datepickerElement') datepickerElement!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private pacienteServ: PacientesService,
    private alertaServ: AlertService,
    private route: ActivatedRoute
  ) {
    this.frmPaciente = this.formBuilder.group({
      txtCedula: ['', Validators.required],
      txtNombres: ['', Validators.required],
      txtApellidos: ['', Validators.required],
      txtFechNac: ['', Validators.required],
      txtNumTelefono: ['', Validators.required],
      txtCorreo: ['', [Validators.email]],
      txtDireccion: ['', Validators.required],
      txtDetalles: [''],
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((parametros) => {
      const id = parametros.get('id');
      if (id) {
        this.eventoUpdate = true;

        this.codigo = parseInt(id);
        this.cargarPaciente(this.codigo);
      } else {
        this.eventoUpdate = false;
      }
    });
  }

  cargarPaciente(id: number): void {
    this.pacienteServ.LPacientesId(id).subscribe({
      next: (paciente) => {
        const fechaFormateada = paciente.fecha_nacimiento
          ? paciente.fecha_nacimiento.split('T')[0]
          : null;

        this.frmPaciente.patchValue({
          txtCedula: paciente.cedula,
          txtNombres: paciente.nombre,
          txtApellidos: paciente.apellido,
          txtCorreo: paciente.email,
          txtNumTelefono: paciente.telefono,
          txtDireccion: paciente.direccion,
          txtDetalles: paciente.descripcion,
          txtFechNac: fechaFormateada,
        });
      },
      error: (err) => {
        console.log('Error al cargar paciente:', err);
        this.alertaServ.error(
          'No se pudo cargar la información del paciente',
          'Comuniquese con su administrador de TI'
        );
      },
    });
  }

  guardarPaciente(): void {
    if (this.frmPaciente.invalid) {
      this.alertaServ.info(
        '',
        'Por favor, complete todos los campos obligatorios *'
      );
      this.marcarCamposComoTocados();
      return;
    }

    const paciente: InPaciente = {
      cedula: this.frmPaciente.value.txtCedula,
      nombre: this.frmPaciente.value.txtNombres,
      apellido: this.frmPaciente.value.txtApellidos,
      email: this.frmPaciente.value.txtCorreo,
      telefono: this.frmPaciente.value.txtNumTelefono,
      direccion: this.frmPaciente.value.txtDireccion,
      descripcion: this.frmPaciente.value.txtDetalles,
      fecha_nacimiento: this.frmPaciente.value.txtFechNac,

      codigo: '',
    };


    if (this.eventoUpdate) {
      paciente.codigo = '' + this.codigo;
      this.pacienteServ.ActualizarPaciente(paciente).subscribe({
        next: (res) => {
          this.alertaServ.success('Paciente actualizado con éxito.', '');
          this.router.navigate(['home/listapacientes']);
        },
        error: (err) => {
          console.log('Error al actualizar paciente:', err.error.msg);
          this.alertaServ.error(
            'ERROR AL ACTUALIZAR',
            'Hubo un problema al actualizar el paciente: revise que la información sea correcta'
          );
        },
      });
    } else {
      this.pacienteServ.CrearPaciente(paciente).subscribe({
        next: (res) => {
          this.alertaServ.success('Paciente registrado con éxito.', '');
          this.router.navigate(['home/listapacientes']);
        },
        error: (err) => {
          console.log('Error al crear paciente:', err);
          this.alertaServ.error(
            'ERROR AL REGISTRAR',
            'Hubo un problema al registrar el paciente: revise que la información sea correcta'
          );
        },
      });
    }
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.frmPaciente.controls).forEach((campo) => {
      const control = this.frmPaciente.get(campo);
      if (control) {
        control.markAsTouched();
      }
    });
  }

    salirSinGuardar(): void {
      Swal.fire({
        title: '¿Está seguro que desea salir?',
        text: 'Los cambios no guardados se perderán.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/home/listapacientes']);
        }
      });
    }

}

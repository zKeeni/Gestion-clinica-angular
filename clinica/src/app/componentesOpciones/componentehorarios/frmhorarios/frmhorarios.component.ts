import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { horariosService } from '../../../servicios/horarios.service';
import { InHorarios } from '../../../modelos/modeloHorarios/InHorarios';
import { AlertService } from '../../../servicios/Alertas/alertas.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-frmhorarios',
    imports: [ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './frmhorarios.component.html',
    styleUrl: './frmhorarios.component.css'
})
export class FrmhorariosComponent {
  frmHorarios: FormGroup;
  eventoUpdate: boolean = false;
  codigo: number | null = null;
  estado:boolean  = true;

  @ViewChild('datepickerElement') datepickerElement!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private horearioServ: horariosService,
    private alertaServ: AlertService,
    
    private route: ActivatedRoute
  ) {
    this.frmHorarios = this.formBuilder.group({
      txtHoraInicio: ['', Validators.required],
      txtHoraFin: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((parametros) => {
      const id = parametros.get('id');

      if (id) {
        this.eventoUpdate = true;
        this.codigo = parseInt(id);

        this.cargarHorarios(this.codigo);
      } else {
        this.eventoUpdate = false;
      }
    });
  }

  cargarHorarios(id: number): void {
    this.horearioServ.LhorariosId(id).subscribe({
      next: (horario) => {
        
        this.estado= Boolean(horario.estado);
        this.frmHorarios.patchValue({
         
          txtHoraInicio: horario.hora_inicio,
          txtHoraFin: horario.hora_fin
        
        });
      },
      error: (err) => {
        console.log('Error al cargar horario:', err);
       },
    });
  }
  

  guardarhorario(): void {
    if (this.frmHorarios.invalid) {
      this.alertaServ.info(
        '',
        'Por favor, complete todos los campos obligatorios *'
      );
      this.marcarCamposComoTocados();
      return;
    }

    const horario: InHorarios = {
     
      hora_inicio: this.frmHorarios.value.txtHoraInicio,   
      hora_fin: this.frmHorarios.value.txtHoraFin,
      codigo: '' ,
      estado : '' ,
      usuario:''+1  
    };


    if (this.eventoUpdate) {
      horario.codigo = '' + this.codigo;
      horario.estado =''+ this.estado;

      this.horearioServ.ActualizarHorario(horario).subscribe({
        next: (res) => {
          console.log('horario actualizada:', res);
          this.alertaServ.success('Horario actualizado con éxito.', '');
          this.router.navigate(['home/listahorarios']);
        },
        error: (err) => {
          console.log('Error al actualizar horario:', err.error.msg);
          this.alertaServ.error(
            'ERROR AL ACTUALIZAR',
            'Hubo un problema al actualizar el horario: revise que la información sea correcta'
          );        },
      });
    } else {
      this.horearioServ.CrearHorario(horario).subscribe({
        next: (res) => {
          this.alertaServ.success('Horario registrado con éxito.', '');
          this.router.navigate(['home/listahorarios']);
        },
        error: (err) => {
          console.log('Error al crear horario:', err);
          this.alertaServ.error(
            'ERROR AL REGISTRAR',
            'Hubo un problema al registrar el Horario: revise que la información sea correcta'
          );        },
      });
    }
  }


  marcarCamposComoTocados(): void {
    Object.keys(this.frmHorarios.controls).forEach((campo) => {
      const control = this.frmHorarios.get(campo);
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
            this.router.navigate(['/home/listahorarios']);
          }
        });
      }
}

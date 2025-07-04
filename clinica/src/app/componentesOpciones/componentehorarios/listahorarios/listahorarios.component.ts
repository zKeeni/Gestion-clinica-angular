import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { InHorarios } from '../../../modelos/modeloHorarios/InHorarios';
import { horariosService } from '../../../servicios/horarios.service';
import { AlertService } from '../../../servicios/Alertas/alertas.service';


@Component({
    selector: 'app-listaHorarios',
    imports: [CommonModule, RouterModule],
    templateUrl: './listahorarios.component.html',
    styleUrl: './listahorarios.component.css'
})
export class listaHorariosComponent {

  listaHorarios : InHorarios[] =[];


  constructor(
    private http: HttpClient,
    private router : Router,
    private ServicioHorarios: horariosService,
    private ServicioAlertas: AlertService
    
  ){
  }

  ngOnInit(): void {
     
    this.listarhorarioesEstado(true);
  }


  listarhorarioesEstado(estado: any ) : void {  
    
    this.ServicioHorarios.LhorariosEstado(estado).subscribe(
      {
          next: res =>{

            this.listaHorarios= res;

           

          },error :err=>{

            this.ServicioAlertas.infoEventoConfir('SESIÓN EXPIRADA', 'Inicie nuevamente sesión', () => {
              this.router.navigate(['/login']);
            });
          }

      }
    );
    
 
  };


    
  eliminarHorarios(id: any, nombre : string): void {

    this.ServicioAlertas.confirm(
      'CONFIRMAR ACCIÓN',
      '¿Está seguro que desea eliminar el registro de ' + nombre,
      'Si, eliminar',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {

        this.ServicioHorarios.EliminarHorario(id).subscribe(
      
          {
            next:res=>{
              this.listaHorarios = this.listaHorarios.filter(horario => parseInt(horario.codigo) !== id);

              this.ServicioAlertas.eliminacionCorrecta();


              },
            error: err =>{
             
              this.ServicioAlertas.error('ERROR','Se genero un error en el proceso de eliminación');
              console.log('ERROR  '+ err.error.error);
            }
  
          });
   
      }
    });
  }
  
  Actualizarhorario(id : any):void{

    this.router.navigate(['home/actualizarHorarios',id]);

  }


  
}

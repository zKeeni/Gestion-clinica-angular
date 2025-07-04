import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InMedico } from '../../../modelos/modelMedicos/InMedico';
import { HttpClient } from '@angular/common/http';
import { MedicosService } from '../../../servicios/medicos.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-listamedicos',
    imports: [CommonModule, RouterModule],
    templateUrl: './listamedicos.component.html',
    styleUrl: './listamedicos.component.css'
})
export class ListamedicosComponent {
 listaMedicos : InMedico[] =[];


  constructor(
    private http: HttpClient,
    private router : Router,
    private ServicioMedico: MedicosService
  ){
  }

  ngOnInit(): void {
     
    this.listarMedicosEstado(true);
  }


  listarMedicosEstado(estado: any ) : void {  
    
    this.ServicioMedico.LMedicosEstado(estado).subscribe(
      {
          next: res =>{

            this.listaMedicos= res;

           
              console.log(res);

          },error :err=>{
             alert('NO EXISTEN REGISTROS DE EMPLEADOS');
          }

      }
    );
    
 
  };


    
  eliminarMedico(id: any, nombre : string): void {

    Swal.fire({
      title: "¿Está seguro que desea eliminar el registro de "+ nombre+ " ?",
      text: "¡No podrás revertir esto! A menos que sea adminitrador",
      icon: "warning",
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar Registro!",
      denyButtonText:"Cancelar Acción"
    }).then((result) => {
      if (result.isConfirmed) {

        this.ServicioMedico.EliminarMedico(id).subscribe(
      
          {
            next:res=>{
              this.listaMedicos = this.listaMedicos.filter(medico => parseInt(medico.codigo) !== id);

              Swal.fire({
                title: "Eliminado!",
                text: "Registro Eliminado con éxito ",
                icon: "success"
              });

              },
            error: err =>{
             
              Swal.fire("El registro no se pudo eliminar", "", "error");
              console.log('ERROR  '+ err.error.error);
            }
  
          });


        
      }else if (result.isDenied) {
        Swal.fire("El registro no se elimino", "", "error");

      }
    });
  }
  
  ActualizarMedico(id : any):void{
    this.router.navigate(['/home/actualizarMedico',id]);
  }

  
  


}

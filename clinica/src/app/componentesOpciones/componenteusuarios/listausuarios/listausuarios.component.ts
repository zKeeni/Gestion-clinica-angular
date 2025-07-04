import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../servicios/Alertas/alertas.service';
import { UsuariosService } from '../../../servicios/usuarios.service'; 
import { InUsuarioVista } from '../../../modelos/modeloUsuarios/InUsuarios';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-listausuarios',
    imports: [CommonModule, RouterModule],
    templateUrl: './listausuarios.component.html',
    styleUrl: './listausuarios.component.css'
})
export class ListausuariosComponent {
  
  listaUsuarios: InUsuarioVista[] = [];
  
    constructor(
      private http: HttpClient,
      private router: Router,
      private usuarioServ: UsuariosService,
      private ServicioAlertas: AlertService
    ) {}
  
    ngOnInit(): void {
      this.listarUsuarios();
    }
  
    listarUsuarios(): void {
      this.usuarioServ.LUsuarios().subscribe({
        next: (res) => {
          this.listaUsuarios = res;
  
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
  
    eliminarUsuario(id: any, nombre : string): void {
    
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
            console.log(id +" XDDDD");
            this.usuarioServ.EliminarUsuario(id).subscribe(
          
              {
                next:res=>{
                  this.listaUsuarios = this.listaUsuarios.filter(usuario => parseInt(usuario.codigo_usuario) !== id);
    
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
  
    ActualizarUsuario(id: any): void {
      this.router.navigate(['home/actualizarUsuarios', id]);
    }



}

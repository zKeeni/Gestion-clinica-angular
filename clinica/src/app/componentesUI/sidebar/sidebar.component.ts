import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DirectivasModule } from '../../directivas/directivas.module';
import { AlertService } from '../../servicios/Alertas/alertas.service';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterLink, DirectivasModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  openMenu: number | null = null;
  userRole: string = 'administrador'; 

  constructor(
    private alertaServ:AlertService
  ){
  }

  toggleMenu(menuId: number): void {
  this.openMenu = this.openMenu === menuId ? null : menuId;
  }
  cerrarSesion(){
    this.alertaServ.preguntaRedireccion('¿CERRAR SESIÓN?', 'login');
  }
 
}

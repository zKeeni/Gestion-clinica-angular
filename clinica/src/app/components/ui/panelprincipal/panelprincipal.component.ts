import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { PanelcontenidoComponent } from "../panelcontenido/panelcontenido.component";

@Component({
    selector: 'app-panelprincipal',
    imports: [HeaderComponent, SidebarComponent, PanelcontenidoComponent],
    templateUrl: './panelprincipal.component.html',
    styleUrl: './panelprincipal.component.css'
})
export class PanelprincipalComponent {


  openMenu: number | null = null;
  toggleMenu(menuId: number): void {
  this.openMenu = this.openMenu === menuId ? null : menuId;
}

}

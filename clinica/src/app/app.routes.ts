import { Routes } from '@angular/router';
import { ComponenteloginComponent } from './componentesOpciones/componentelogin/componentelogin.component';
import { DashboardComponent } from './componentesOpciones/dashboard/dashboard.component';
import { ListapacientesComponent } from './componentesOpciones/componentepacientes/listapacientes/listapacientes.component';
import { FrmpacientesComponent } from './componentesOpciones/componentepacientes/frmpacientes/frmpacientes.component';
import { ListamedicosComponent } from './componentesOpciones/componentemedicos/listamedicos/listamedicos.component';
import { FrmmedicosComponent } from './componentesOpciones/componentemedicos/frmmedicos/frmmedicos.component';
import { FrmcitasComponent } from './componentesOpciones/componentecitas/frmcitas/frmcitas.component';
import { FrmconsultasComponent } from './componentesOpciones/componenteconsultas/frmconsultas/frmconsultas.component';
import { ListaconsultoriosComponent } from './componentesOpciones/componenteconsultorios/listaconsultorios/listaconsultorios.component';
import { FrmconsultoriosComponent } from './componentesOpciones/componenteconsultorios/frmconsultorio/frmconsultorios.component';
import { listaEspecialidadesComponent } from './componentesOpciones/componenteespecialidades/listaespecialidades/listaespecialidades.component';
import { FrmespecialidadsComponent } from './componentesOpciones/componenteespecialidades/frmespecialidades/frmespecialidades.component';
import { listaHorariosComponent } from './componentesOpciones/componentehorarios/listahorarios/listahorarios.component';
import { FrmhorariosComponent } from './componentesOpciones/componentehorarios/frmhorarios/frmhorarios.component';
import { PanelprincipalComponent } from './componentesUI/panelprincipal/panelprincipal.component';
import { listaConsultasComponent } from './componentesOpciones/componenteconsultas/listaconsultas/listaconsultas.component';
import { listaHistorialComponent } from './componentesOpciones/componenteHistorial/listaHistorial/listahistorial.component';
import { ListausuariosComponent } from './componentesOpciones/componenteusuarios/listausuarios/listausuarios.component';
import { FrmusuariosComponent } from './componentesOpciones/componenteusuarios/frmusuarios/frmusuarios.component';

import { AuthService } from './servicios/authservicio.service';
import { RoleGuard } from './guards/role.guard';
import { reporteHistorialComponent } from './componentesOpciones/componentesreportes/reporteHistorialClinico/listahorarios/reporteHistorial.component';
import { pagina404Component } from './componentesUI/paginas/404/pagina404.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: ComponenteloginComponent },
  { path: '404', component: pagina404Component },


  {
    path: 'home',
    component: PanelprincipalComponent,
    canActivate: [AuthService], // Protege todas las rutas dentro de 'home'
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Pacientes (Ejemplo: solo rol "admin" puede crear/actualizar)
      {
        path: 'listapacientes',
        component: ListapacientesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'recepcionista'] },
      },
      {
        path: 'crearPaciente',
        component: FrmpacientesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'recepcionista'] },
      },
      {
        path: 'actualizarPaciente/:id',
        component: FrmpacientesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'recepcionista'] },
      },

      // Médicos
      {
        path: 'listamedicos',
        component: ListamedicosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'crearMedico',
        component: FrmmedicosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'actualizarMedico/:id',
        component: FrmmedicosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },

      // Citas (Ejemplo: solo rol "recepcionista" puede agendar citas)
      {
        path: 'frmcitas',
        component: FrmcitasComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'recepcionista'] },
      },

      // Consultas
      {
        path: 'listaconsultas',
        component: listaConsultasComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'medico'] },
      },
      {
        path: 'realizarConsulta',
        component: FrmconsultasComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'medico'] },
      },

      // Consultorios
      {
        path: 'listaconsultorios',
        component: ListaconsultoriosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'crearConsultorios',
        component: FrmconsultoriosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'actualizarConsultorios/:id',
        component: FrmconsultoriosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },

      // Especialidades
      {
        path: 'listaespecialidades',
        component: listaEspecialidadesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'crearEspecialidades',
        component: FrmespecialidadsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'actualizarEspecialidades/:id',
        component: FrmespecialidadsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },

      // Horarios
      {
        path: 'listahorarios',
        component: listaHorariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'crearHorarios',
        component: FrmhorariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'actualizarHorarios/:id',
        component: FrmhorariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },

      //Usuarios
      {
        path: 'listausuarios',
        component: ListausuariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'crearUsuarios',
        component: FrmusuariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },
      {
        path: 'actualizarUsuarios/:id',
        component: FrmusuariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador'] },
      },

      // Historial Clínico (Ejemplo: solo rol "medico" puede ver el historial)
      {
        path: 'listahistorial',
        component: listaHistorialComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'medico', 'recepcionista'] },
      },
      {
        path: 'historial/imprimir/:codigo',
        component: reporteHistorialComponent,
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'medico', 'recepcionista'] },
      },
    ],
  },

  { path: '**', component: pagina404Component },
];

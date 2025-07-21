import { Routes } from '@angular/router';
import { ComponenteloginComponent } from './components/pages/login/componentelogin/componentelogin.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ListapacientesComponent } from './components/pages/pacientes/listapacientes/listapacientes.component';
import { FrmpacientesComponent } from './components/pages/pacientes/frmpacientes/frmpacientes.component';
import { ListamedicosComponent } from './components/pages/medicos/listamedicos/listamedicos.component';
import { FrmmedicosComponent } from './components/pages/medicos/frmmedicos/frmmedicos.component';
import { FrmcitasComponent } from './components/pages/citas/frmcitas/frmcitas.component';
import { FrmconsultasComponent } from './components/pages/consultas/frmconsultas/frmconsultas.component';
import { ListaconsultoriosComponent } from './components/pages/consultorios/listaconsultorios/listaconsultorios.component';
import { FrmconsultoriosComponent } from './components/pages/consultorios/frmconsultorio/frmconsultorios.component';
import { listaEspecialidadesComponent } from './components/pages/especialidades/listaespecialidades/listaespecialidades.component';
import { FrmespecialidadsComponent } from './components/pages/especialidades/frmespecialidades/frmespecialidades.component';
import { listaHorariosComponent } from './components/pages/horarios/listahorarios/listahorarios.component';
import { FrmhorariosComponent } from './components/pages/horarios/frmhorarios/frmhorarios.component';
import { PanelprincipalComponent } from './components/ui/panelprincipal/panelprincipal.component';
import { listaConsultasComponent } from './components/pages/consultas/listaconsultas/listaconsultas.component';
import { listaHistorialComponent } from './components/pages/historial/listaHistorial/listahistorial.component';
import { ListausuariosComponent } from './components/pages/usuarios/listausuarios/listausuarios.component';
import { FrmusuariosComponent } from './components/pages/usuarios/frmusuarios/frmusuarios.component';

import { AuthService } from './servicios/authservicio.service';
import { RoleGuard } from './guards/role.guard';
import { reporteHistorialComponent } from './components/pages/reportes/historialClinico/listahorarios/reporteHistorial.component';
import { pagina404Component } from './components/ui/404/pagina404.component';
import { RecuperarContraseniaComponent } from './components/pages/login/recuperarcontrasena/recuperarcontrasena.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: ComponenteloginComponent },
  { path: 'login/recuperacion/:username', component: RecuperarContraseniaComponent },
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

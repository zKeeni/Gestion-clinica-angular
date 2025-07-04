const express = require('express');

const cors = require('cors');
require('dotenv').config();


const rutasPaciente = require('./rutas/rutasPacientes');
const rutasConsultorios = require('./rutas/rutasConsultorios');
const rutasHorarios = require('./rutas/rutasHorarios');
const rutasEspecialidades = require('./rutas/rutasEspecialidades');
const rutasMedico = require('./rutas/rutasMedicos');
const rutasCitas = require('./rutas/rutasCitas');
const rutasConsultas = require('./rutas/rutasConsultas');
const rutasMedicoEspecialidad = require('./rutas/rutasMedicoEspecialidad');
const rutasUsuarios = require('./rutas/rutasUsuarios');
const rutasRoles = require('./rutas/rutasRoles');

const login = require('./controladores/Login/ctlLogin');

const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/pacientes', rutasPaciente);
app.use('/consultorios', rutasConsultorios);
app.use('/especialidades', rutasEspecialidades);
app.use('/horarios', rutasHorarios);
app.use('/medicos', rutasMedico);
app.use('/citas', rutasCitas);
app.use('/consultas', rutasConsultas);
app.use('/medicoespecialidad', rutasMedicoEspecialidad);
app.use('/usuarios', rutasUsuarios);
app.use('/roles', rutasRoles);

app.post('/login',login.validacionUsers );
module.exports = app;

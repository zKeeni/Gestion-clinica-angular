const express = require('express');
const router = express.Router();
const controladorPacientes = require('../controladores/Pacientes/ctlPacientes');
const authenticateToken = require('../middleware/auth');


router.get('/listar/:estado', authenticateToken,
    controladorPacientes.getPacientesEstado);

router.get('/:cedula/:estado', authenticateToken,
        controladorPacientes.getPacienteCedulaEstado);

router.get('/listar', authenticateToken,
    controladorPacientes.getPacientes);


router.get('/:id', authenticateToken,
    controladorPacientes.getPacienteId);

router.delete('/Eliminar/:id', authenticateToken,
   controladorPacientes.eliminarPaciente);

router.post('/Registrar', authenticateToken,
    controladorPacientes.RegistrarPaciente);

router.put('/Actualizar', authenticateToken,
    controladorPacientes.ActualizarPaciente);


module.exports = router; 
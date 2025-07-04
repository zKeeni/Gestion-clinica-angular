const express = require('express');
const router = express.Router();
const ctlMedicoEspecialidad = require('../controladores/Especialidades/ctlMedicoEspecialidad');
const authenticateToken = require('../middleware/auth');

router.post('/Registrar', authenticateToken, ctlMedicoEspecialidad.registrarMedicoEspecialidad);

router.delete('/Eliminar', authenticateToken, ctlMedicoEspecialidad.eliminarMedicoEspecialidad);


module.exports = router; 
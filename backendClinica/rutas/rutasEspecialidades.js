const express = require('express');
const router = express.Router();
const controladorEspecialidades = require('../controladores/Especialidades/ctlEspecialidades');
const authenticateToken = require('../middleware/auth');


router.get('/listar/:estado', authenticateToken,
    controladorEspecialidades.getEspecialidadesEstado);

router.get('/listar', authenticateToken,
    controladorEspecialidades.getEspecialidades);

router.get('/:id', authenticateToken,
    controladorEspecialidades.getEspecialidadId);

router.delete('/Eliminar/:id', authenticateToken,
   controladorEspecialidades.eliminarEspecialidad);

router.post('/Registrar', authenticateToken,
    controladorEspecialidades.RegistrarEspecialidad);

router.put('/Actualizar', authenticateToken,
    controladorEspecialidades.ActualizarEspecialidad);


module.exports = router; 
const express = require('express');
const router = express.Router();
const controladorHorarios = require('../controladores/Horarios/ctlHorarios');
const authenticateToken = require('../middleware/auth');


router.get('/listar/:estado', authenticateToken,
    controladorHorarios.getHorariosEstado);

router.get('/listar', authenticateToken,
    controladorHorarios.getHorarios);

router.get('/:id', authenticateToken,
    controladorHorarios.getHorariosId);

router.delete('/Eliminar/:id', authenticateToken,
   controladorHorarios.eliminarhorario);

router.post('/Registrar', authenticateToken,
    controladorHorarios.RegistrarHorarios);

router.put('/Actualizar', authenticateToken,
    controladorHorarios.Actualizarhorario);


module.exports = router; 
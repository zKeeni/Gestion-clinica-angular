const express = require('express');
const router = express.Router();
const controladorMedicos = require('../controladores/Medicos/ctlMedicos');
const authenticateToken = require('../middleware/auth');


router.get('/Listar/:estado', authenticateToken,
    controladorMedicos.getMedicosEstado);

router.get('/Listar', authenticateToken,
    controladorMedicos.getMedicos);

router.get('/ListarSinUsuario', authenticateToken,
    controladorMedicos.getMedicoSinUsuario);

router.get('/:id', authenticateToken,
    controladorMedicos.getMedicoId);

router.put('/asignarUsuario', authenticateToken,
    controladorMedicos.asignarUsuarioAMedico);

router.get('/Especialidad/:id', authenticateToken,
    controladorMedicos.getEspecialidadMedicoId);

router.delete('/Eliminar/:id', authenticateToken,
    controladorMedicos.eliminarMedico);

router.post('/Registrar', authenticateToken,
    controladorMedicos.registrarMedico);

router.put('/Actualizar', authenticateToken,
    controladorMedicos.actualizarMedico);

router.get('/horario/:id', authenticateToken,
    controladorMedicos.getMedicoHorario);


module.exports = router;  
const express = require('express');
const router = express.Router();
const controladorCitas = require('../controladores/Citas/ctlCitas');
const authenticateToken = require('../middleware/auth');


router.get('/medicoEspecialidad/:id', authenticateToken,
    controladorCitas.getMedicosEspecialidad);

router.get('/citasDisponiblesMedico/:id', authenticateToken,
    controladorCitas.getCitasPendiantesMedico);

router.post('/Registrar',authenticateToken,
        controladorCitas.RegistrarCitas);

    module.exports = router;

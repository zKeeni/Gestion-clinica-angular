const express = require('express');
const router = express.Router();
const controladorUsuarios = require('../controladores/Usuarios/ctlUsuarios');
const controladorLogin = require('../controladores/Login/ctlLogin');

const authenticateToken = require('../middleware/auth');


router.get('/listar', authenticateToken,
    controladorUsuarios.getUsuarios);

router.get('/:id', authenticateToken,
    controladorUsuarios.getUsuarioId);

router.delete('/Eliminar/:id', authenticateToken,
   controladorUsuarios.eliminarUsuario);

router.post('/Registrar', authenticateToken,
    controladorUsuarios.registrarUsuario);

router.put('/Actualizar', authenticateToken,
    controladorUsuarios.actualizarUsuario);
router.post('/recuperar/correo', controladorLogin.obtenerCorreo);

module.exports = router; 
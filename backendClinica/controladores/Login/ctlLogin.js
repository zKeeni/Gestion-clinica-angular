const pool = require('../../configuracion/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const SessionManager = require('../../middleware/sessionManager');

exports.validacionUsers = async (req, res) => {
  const { nombre_usuario, contrasenia } = req.body;
  
  // Validación básica
  if (!nombre_usuario || !contrasenia) {
    return res.status(400).json({ 
      success: false,
      message: 'Nombre de usuario y contraseña son requeridos' 
    });
  }
  
  // Actualiza la query para incluir el LEFT JOIN con la tabla medico
  const query = `
    SELECT 
  u.codigo AS id_usuario, 
  u.nombre_usuario,
  u.contrasenia,  
  r.nombre AS rol,
  m.codigo AS codigo_medico,
  m.nombre as nombre_medico,
  m.apellido as apellido_medico
FROM usuario u
JOIN rol r ON u.codigo_rol = r.codigo
LEFT JOIN medico m ON u.codigo = m.codigo_usuario
WHERE u.nombre_usuario = $1
  AND u.estado = true;

  `;
  const values = [nombre_usuario];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    const usuario = result.rows[0];
    const contraseñaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!contraseñaValida) {
      return res.status(401).json({ 
        success: false,
        message: 'Contraseña Incorrecta' 
      });
    }

    // Generar ID único para el token (JWT ID)
    const tokenJti = crypto.randomUUID();
    
    // Crear el JWT incluyendo el código del médico y jti
    const token = jwt.sign(
      {  
        id: usuario.id_usuario, 
        nombreUsuario: usuario.nombre_usuario, 
        rol: usuario.rol,
        codigoMedico: usuario.codigo_medico,
        nombresMedico: usuario.nombre_medico ? 'Dr.' + usuario.nombre_medico + ' ' + usuario.apellido_medico : null,
        jti: tokenJti, // JWT ID único para esta sesión
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Obtener información del dispositivo para fingerprinting
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const deviceFingerprint = SessionManager.generateDeviceFingerprint(userAgent, ipAddress);
    
    // Crear sesión activa
    const sessionResult = await SessionManager.createSession(usuario.id_usuario, tokenJti, {
      userAgent,
      ipAddress,
      fingerprint: deviceFingerprint
    });
    
    if (!sessionResult.success) {
      return res.status(500).json({ 
        success: false,
        message: 'Error creando sesión de usuario' 
      });
    }

    // Respuesta exitosa
    res.json({ 
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombreUsuario: usuario.nombre_usuario,
        rol: usuario.rol,
        codigoMedico: usuario.codigo_medico,
        nombresMedico: usuario.nombre_medico ? 'Dr.' + usuario.nombre_medico + ' ' + usuario.apellido_medico : null
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

// Nuevo método para logout
exports.logout = async (req, res) => {
  try {
    // Obtener token del header
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // Decodificar token para obtener el jti
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.jti) {
          // Invalidar la sesión específica
          await SessionManager.invalidateSession(decoded.jti);
        }
      } catch (jwtError) {
        // Si el token ya expiró o es inválido, aún respondemos exitosamente
        console.log('Token ya inválido en logout:', jwtError.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
    
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error durante el logout'
    });
  }
};

// Método para obtener sesiones activas del usuario
exports.getSesionesActivas = async (req, res) => {
  try {
    const userId = req.user.id; // Del middleware de autenticación
    const sesiones = await SessionManager.getUserActiveSessions(userId);
    
    res.json({
      success: true,
      sesiones
    });
    
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo sesiones activas'
    });
  }
};

// Método para invalidar todas las otras sesiones
exports.invalidarOtrasSesiones = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentTokenJti = req.user.jti;
    
    const invalidatedCount = await SessionManager.invalidateAllUserSessions(userId, currentTokenJti);
    
    res.json({
      success: true,
      message: `${invalidatedCount} sesiones invalidadas`,
      invalidatedCount
    });
    
  } catch (error) {
    console.error('Error invalidando sesiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error invalidando otras sesiones'
    });
  }
};

 exports.obtenerCorreo = async (req, res) => {
  const { nombreUsuario } = req.body;
console.log(nombreUsuario);
  const query = `
    SELECT u.email
    FROM usuario u
    WHERE u.nombre_usuario = $1
      AND u.estado = true;
  `;
  const values = [nombreUsuario];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const correo = result.rows[0].email;
    const oculto = correo.replace(/(.{4}).+(@.+)/, '$1********$2');

  res.json({ correoOculto: oculto }); 
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  } 
};

const codigos = new Map(); 



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'clinicacomunitariautm@gmail.com',           
    pass: 'tvaxrtljvgympqpj'             
  },

   tls: {
    rejectUnauthorized: false
  }
});

const enviarCorreo = async (para, asunto, mensaje) => {
  const opciones = {
    from: 'clinicacomunitariautm@gmail.com',
    to: para,
    subject: asunto,
    text: mensaje
  };

  await transporter.sendMail(opciones);
};



exports.enviarCodigo = async (req, res) => {
  const { nombreUsuario } = req.body;

  const query = `
    SELECT u.email
    FROM usuario u
    WHERE u.nombre_usuario = $1
      AND u.estado = true;
  `;
  const values = [nombreUsuario];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const correo = result.rows[0].email;
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();

    codigos.set(nombreUsuario, codigo); 

    await enviarCorreo(correo, 'Código de recuperación', `Tu código es: ${codigo}`);

    res.json({ mensaje: 'Código enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.cambiarContrasenia = async (req, res) => {
  const { nombreUsuario, nuevoPassword, codigoIngresado } = req.body;

  const codigoGuardado = codigos.get(nombreUsuario);

  if (!codigoGuardado) {
    return res.status(400).json({ mensaje: 'No se ha enviado un código para este usuario' });
  }

  if (codigoIngresado !== codigoGuardado) {
    return res.status(401).json({ mensaje: 'Código incorrecto' });
  }

  try {

    const query = `
     select cambiar_contrasenia_usuario($1, $2);
    `;
    const values = [nombreUsuario, nuevoPassword];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }
    codigos.delete(nombreUsuario);

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

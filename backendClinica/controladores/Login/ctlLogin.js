const pool = require('../../configuracion/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


exports.validacionUsers = async (req, res) => {
  const { nombre_usuario, contrasenia } = req.body;
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
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    const contraseñaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Contraseña Incorrecta' });
    }

    // Crear el JWT incluyendo el código del médico (puede ser null si el usuario no es médico)
    const token = jwt.sign(
      { 
        id: usuario.id_usuario, 
        nombreUsuario: usuario.nombre_usuario, 
        rol: usuario.rol,
        codigoMedico: usuario.codigo_medico,// Este campo se incluirá si existe
        nombresMedico: 'Dr.'+usuario.nombre_medico +' ' + usuario.apellido_medico
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
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

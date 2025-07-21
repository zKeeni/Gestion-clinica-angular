const pool = require('../../configuracion/db');
const { sendOTPEmail } = require('../../utils/sendEmail');

function generarCodigoOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}


exports.loginConOTP = async (req, res) => {
  const { nombre_usuario, contrasenia } = req.body;

  try {
    const resultado = await pool.query(
      'SELECT * FROM usuario WHERE nombre_usuario = $1 AND estado = true',
      [nombre_usuario]
    );

    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }

    const bcrypt = require('bcryptjs');
    const contrasenaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const codigoOTP = generarCodigoOTP();
    await pool.query(
    'INSERT INTO verificacion_2pasos (codigo_usuario, codigo_otp) VALUES ($1, $2)',
    [usuario.codigo, codigoOTP]
    );

    await sendOTPEmail(usuario.email, codigoOTP);

    return res.json({ mensaje: 'Código OTP enviado al correo', usuario_codigo: usuario.codigo });
  } catch (error) {
    console.error('Error en loginConOTP:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};


exports.validarOTP = async (req, res) => {
  const { codigo_usuario, codigo_otp } = req.body;

  try {
    const resultado = await pool.query(
      `SELECT * FROM verificacion_2pasos
       WHERE codigo_usuario = $1 AND codigo_otp = $2 AND expirado = false
       ORDER BY creado_en DESC LIMIT 1`,
      [codigo_usuario, codigo_otp]
    );

    const registro = resultado.rows[0];

    if (!registro) {
      return res.status(401).json({ mensaje: 'Código incorrecto o expirado' });
    }

    // Marcar OTP como usado
    await pool.query(`UPDATE verificacion_2pasos SET expirado = true WHERE id = $1`, [registro.id]);

    // Obtener datos del usuario para generar el token
    const resultUser = await pool.query(
      `SELECT 
        u.codigo AS id_usuario, 
        u.nombre_usuario,
        r.nombre AS rol,
        m.codigo AS codigo_medico,
        m.nombre as nombre_medico,
        m.apellido as apellido_medico
      FROM usuario u
      JOIN rol r ON u.codigo_rol = r.codigo
      LEFT JOIN medico m ON u.codigo = m.codigo_usuario
      WHERE u.codigo = $1`,
      [codigo_usuario]
    );

    const usuario = resultUser.rows[0];

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nombreUsuario: usuario.nombre_usuario,
        rol: usuario.rol,
        codigoMedico: usuario.codigo_medico,
        nombresMedico: `Dr. ${usuario.nombre_medico ?? ''} ${usuario.apellido_medico ?? ''}`
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ mensaje: 'Verificación 2FA exitosa', token });

  } catch (error) {
    console.error('Error al validar OTP:', error);
    return res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
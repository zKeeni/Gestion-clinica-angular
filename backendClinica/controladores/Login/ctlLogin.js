const pool = require('../../configuracion/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

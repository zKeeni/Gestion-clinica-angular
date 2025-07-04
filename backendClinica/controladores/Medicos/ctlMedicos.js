const pool = require("../../configuracion/db");

// Obtener médicos por estado
exports.getMedicosEstado = async (req, res) => {
  const { estado } = req.params;
  const query = "SELECT * FROM listarmedicosestado($1)";
  try {
    const result = await pool.query(query, [estado]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener médicos sin usuario
exports.getMedicoSinUsuario = async (req, res) => {
  const query = "SELECT * FROM listarMedicosSinUsuario()";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener médicos sin usuario:", error);
    res.status(500).json({
      error: "No se pudo obtener la lista de médicos sin usuario",
      details: error.message
    });
  }
};


// Obtener todos los médicos
exports.getMedicos = async (req, res) => {
  const query = "SELECT * FROM medico";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener médico por ID
exports.getMedicoId = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM medico WHERE codigo = $1";
  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "No existe ese médico" });
    }
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el médico por ID" });
  }
};

// Obtener especialidades de médico por ID
exports.getEspecialidadMedicoId = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM ObtenerEspecialidadesMedico($1);";
  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount > 0) {
      res.json(result.rows);
    } else {
      res
        .status(404)
        .json({ error: "No existen especialidades para ese médico" });
    }
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    res
      .status(500)
      .json({ error: "No se pudo obtener las especialidades del médico" });
  }
};

// Obtener horario medico por ID
exports.getMedicoHorario = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM  listar_horario_de_medico($1)";
  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "No existe un horario registrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el horario del medico" });
  }
};

// Registrar médico
exports.registrarMedico = async (req, res) => {
  const {
    codigo_horario,
    codigo_consultorio,
    cedula,
    licencia_medica,
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    direccion,
    email,
  } = req.body;

  const query =
    "SELECT registrarmedico($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) AS id_medico";
  const values = [
    codigo_horario,
    codigo_consultorio,
    cedula,
    licencia_medica,
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    direccion,
    email,
  ];

  try {
    const result = await pool.query(query, values);
    const idMedico = result.rows[0].id_medico; // Capturar el ID retornado
    res.status(201).json({
      message: "Médico registrado exitosamente",
      idMedico, // Retornar el ID en la respuesta
    });
  } catch (error) {
    res.status(400).json({
      error: "No se pudo registrar al médico",
      details: error.message,
    });
  }
};

// Actualizar médico
exports.actualizarMedico = async (req, res) => {
  const {
    codigo,
    codigo_horario,
    codigo_consultorio,
    cedula,
    licencia_medica,
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    direccion,
    email,
  } = req.body;
  const query =
    "SELECT actualizarmedico($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
  const values = [
    codigo,
    codigo_horario,
    codigo_consultorio,
    cedula,
    licencia_medica,
    nombre,
    apellido,
    fecha_nacimiento,
    telefono,
    direccion,
    email,
  ];

  try {
    await pool.query(query, values);
    res.status(200).json({ message: "Médico actualizado exitosamente" });
  } catch (error) {
    res
      .status(400)
      .json({
        error: "No se pudo actualizar al médico",
        details: error.message,
      });
  }
};


exports.asignarUsuarioAMedico = async (req, res) => {
  const { codigo_medico, codigo_usuario } = req.body;

  const query = `
    UPDATE public.medico
    SET codigo_usuario = $1
    WHERE codigo = $2
    RETURNING *;
  `;
  const values = [codigo_usuario, codigo_medico];

  try {
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Médico no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario asignado correctamente al médico',
      medico: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al asignar el usuario al médico' });
  }
};

//Eliminar medico
exports.eliminarMedico = async (req, res) => {
  const { id } = req.params;
  const query = "select from eliminarmedico($1);";
  const values = [id];

  console.log(values);
  try {
    const medico = await pool.connect();
    const result = await pool.query(query, values, (error, result) => {
      if (error) {
        res.status(400).json({ error: error.message });
      } else {
        res
          .status(200)
          .json({ message: "El registro medico se elimino correctamente" });
      }
    });
    medico.release();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "ERROR EN EL SERVIDOR" });
  }
};

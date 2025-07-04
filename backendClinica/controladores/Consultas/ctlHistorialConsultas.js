const pool = require('../../configuracion/db');

exports.getHistorialDeConsultasCompleta = async (req, res) => {
   
    const query = 'SELECT * FROM vista_historialmedico';
    try {
        const result = await pool.query(query);
        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHistorialporCedPacienteCodMedicoFechaIF = async (req, res) => {
    const { cedula_paciente, codigo_medico, fecha_inicio, fecha_fin } = req.params;

    const parsedCedulaPaciente = cedula_paciente === 'null' || !cedula_paciente ? null : cedula_paciente;
    const parsedCodigoMedico = codigo_medico === 'null' || !codigo_medico ? null : parseInt(codigo_medico, 10);
    const parsedFechaInicio = fecha_inicio === 'null' || !fecha_inicio ? null : fecha_inicio;
    const parsedFechaFin = fecha_fin === 'null' || !fecha_fin ? null : fecha_fin;

    const query = 'SELECT * FROM listarSimpleHistorialDCedPacCodMedFechas($1, $2, $3, $4)';
    const values = [parsedCedulaPaciente, parsedCodigoMedico, parsedFechaInicio, parsedFechaFin];

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getHistorialporCodigoConsulta = async (req, res) => {
    const { codigo_consulta} = req.params;

    const parsedcodigo_consulta = codigo_consulta === 'null' || !codigo_consulta ? null : codigo_consulta;

    const query = 'SELECT * FROM listarhistorialdcedpaccodmedfechas($1)';
    const values = [codigo_consulta];

    try {
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



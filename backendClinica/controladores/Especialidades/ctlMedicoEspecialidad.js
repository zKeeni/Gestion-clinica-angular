const pool = require('../../configuracion/db');

// Registrar Médico Especialidad
exports.registrarMedicoEspecialidad = async (req, res) => {
    const especialidades = req.body; // Suponiendo que es un array
    const query = 'SELECT * FROM public.registrarMedicoEspecialidad($1, $2)';

    try {
        for (const especialidad of especialidades) {
            const values = [especialidad.id_medico, especialidad.id_especialidad];
            await pool.query(query, values);
        }
        res.status(200).json({ message: 'Especialidades registradas correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al registrar especialidades del médico' });
    }
};

exports.eliminarMedicoEspecialidad = async (req, res) => {
    const { codigo } = req.query; // Recibe los códigos desde la URL
    if (!codigo) {
        return res.status(400).json({ error: 'No se proporcionaron códigos para eliminar' });
    }

    const codigosArray = Array.isArray(codigo) ? codigo : [codigo]; // Asegurar que sea un array

    const query = 'SELECT * FROM public.eliminarMedicoEspecialidad($1)';

    try {
        for (const codigo of codigosArray) {
            await pool.query(query, [codigo]);
        }
        res.status(200).json({ message: 'Especialidades eliminadas correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar especialidades del médico' });
    }
};



// Eliminar Médico Especialidad (cambiar estado a false)
// exports.eliminarMedicoEspecialidad = async (req, res) => {
//     const { id } = req.params; // Recibimos el código como parámetro de la URL
//     const query = 'SELECT * FROM public.eliminarMedicoEspecialidad($1)';
//     const values = [id];

//     try {
//         const result = await pool.query(query, values);
//         res.status(200).json({ message: 'Médico especialidad eliminada correctamente' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Error al eliminar Médico Especialidad' });
//     }
// };


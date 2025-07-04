const pool = require('../../configuracion/db');

exports.getMedicosEspecialidad = async (req, res) => {
    const {id} = req.params;
    const query = 'SELECT * FROM listarmedicoespecialidad($1);';
    const values = [id]
    try {
        const result = await pool.query(query,values);
        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getCitasPendiantesMedico = async (req, res) => {
    const {id} = req.params;
    const query = 'SELECT * FROM citas_activas_medico WHERE codigo_medico =$1;';
    const values = [id]
    try {
        const result = await pool.query(query,values);
        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.RegistrarCitas = async (req, res) => {


    const { codigo_paciente,codigo_medico,codigo_especialidad,motivo,hora,fecha,usuario,antecedentes} = req.body;
    const query ='select from registrar_cita($1, $2,$3,$4,$5,$6,$7,$8)';

    const values = [ codigo_paciente,codigo_medico,codigo_especialidad,motivo,hora,fecha,usuario,antecedentes];

    console.log(values);
    try {
        const cosultorio = await pool.connect();
        const result = await pool.query(query,values);
        cosultorio.release();
        res.status(200).json({message:'Cita registrado'});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"No se pudo registar la cita"});

        
    }




};
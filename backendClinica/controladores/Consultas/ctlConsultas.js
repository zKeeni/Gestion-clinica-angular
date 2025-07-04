const pool = require('../../configuracion/db');




exports.getCitasPendientesMedico = async (req, res) => {
    const {id,estado} = req.params;
    const query = 'SELECT * FROM obtener_citas_medico($1, $2)';
    const values = [id,estado]
    try {
        const result = await pool.query(query,values);
        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.RegistrarConsulta = async (req, res) => {


    const { codigo_cita,peso,temperatura,presion,estatura,diagnostico,tratamiento,observaciones,usuario} = req.body;
    console.log(res.body);

    const query ='select from registrar_consulta($1, $2,$3,$4,$5,$6,$7,$8,$9)';

    const values = [ codigo_cita,peso,temperatura,presion,estatura,diagnostico,tratamiento,observaciones,usuario];

    try {
        const cosultorio = await pool.connect();
        const result = await pool.query(query,values);
        cosultorio.release();
        res.status(200).json({message:'Consulta registrada'});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});

        
    }




};
const pool = require('../../configuracion/db');

// Obtener todos los empleados
exports.getPacientesEstado = async (req, res) => {
     
    const {estado} = req.params;
    const query = 'SELECT * FROM listarpacientesestado($1)';
    const values = [estado]
    try {
        const result = await pool.query(query,values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getPacientes = async (req, res) => {
     
    const query = 'SELECT * FROM paciente;';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPacienteId = async (req, res) => {
   
    const {id} = req.params;
    const query ='select* from paciente where codigo=$1'
    const values = [id]
    try {
        const result = await pool.query(query,values);
        
        if (result.rowCount>0){
            res.json(result.rows[0]);
        }else{
            res.status(400).json({error:"NO EXISTE ESE PACIENTE"});

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"ERROR EN EL SERVIDOR"});

        
    }

    };

    exports.getPacienteCedulaEstado = async (req, res) => {
   
        const {cedula,estado} = req.params;
        const query ='select * from listarpacientesestado($2) where cedula =$1 ;'
        const values = [cedula,estado]
        try {
            const result = await pool.query(query,values);
            
            if (result.rowCount>0){
                res.json(result.rows[0]);
            }else{
                res.status(400).json({error:"NO SE ENCONTRARON RESULTADOS"});
    
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error:"ERROR EN EL SERVIDOR"});
    
            
        }
    
        };


exports.RegistrarPaciente = async (req, res) => {


    const {cedula, nombre,apellido,fecha_nacimiento,telefono,direccion,email,descripcion} = req.body;
    const query ='select registrarpaciente( $1,$2,$3,$4,$5,$6,$7,$8);';
    const values = [cedula, nombre,apellido,fecha_nacimiento,telefono,direccion,email,descripcion];

    console.log(values);
    try {
        const actor = await pool.connect();
        const result = await pool.query(query,values);
        actor.release();
        res.status(200).json({message:'Paciente registrado'});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"No se pudo registar al Paciente"});

        
    }




};


exports.ActualizarPaciente = async (req, res) => {

    const {codigo,cedula, nombre,apellido,fecha_nacimiento,telefono,direccion,email,descripcion} = req.body;
    const query ='select actualizarpaciente( $1,$2,$3,$4,$5,$6,$7,$8,$9);';
    const values = [codigo,cedula, nombre,apellido,fecha_nacimiento,telefono,direccion,email,descripcion];
    console.log(values);
    try {
        const actor = await pool.connect();
        const result = await pool.query(query,values);
        actor.release();
        res.status(200).json({message:'Paciente actualizado '});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    
        
    }
    };


exports.eliminarPaciente = async (req, res) => {

    const {id} = req.params;
        const query ='select from eliminarPaciente($1);'
        const values = [id]
    
        console.log(values);
        try {
            const actor = await pool.connect();
            const result = await pool.query(query,values,(error,result)=>{
    
                if (error){
                    res.status(400).json({error: error.message});
    
                }else{
                    res.status(200).json({message:"El registro se elimino correctamente"});
                }
    
            });
            actor.release();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error:"ERROR EN EL SERVIDOR"});
    
            
        }
    };


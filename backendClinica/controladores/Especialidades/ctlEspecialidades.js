const pool = require('../../configuracion/db');

exports.getEspecialidadesEstado = async (req, res) => {
     
    const {estado} = req.params;
    const query = 'SELECT * FROM listarespecialidadesestado($1)';
    const values = [estado]
    try {
        const result = await pool.query(query,values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getEspecialidades = async (req, res) => {
     
    const query = 'SELECT * FROM especialidad;';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEspecialidadId = async (req, res) => {
   
    const {id} = req.params;
    const query ='select * from especialidad where codigo=$1'
    const values = [id]
    try {
        const result = await pool.query(query,values);
        
        if (result.rowCount>0){
            res.json(result.rows);
        }else{
            res.status(400).json({error:"NO EXISTE ESA ESPECIALIDAD"});

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"ERROR EN EL SERVIDOR"});

        
    }

    };


exports.RegistrarEspecialidad = async (req, res) => {


    const { nombre,descripcion} = req.body;
    const query ='select from registrarespecialidad($1, $2)';

    const values = [ nombre,descripcion];

    console.log(values);
    try {
        const cosultorio = await pool.connect();
        const result = await pool.query(query,values);
        cosultorio.release();
        res.status(200).json({message:'Especialidad registrada'});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"No se pudo registar a la Especialidad"});

        
    }




};


exports.ActualizarEspecialidad = async (req, res) => {

    const {codigo,nombre,descripcion,estado} = req.body;
    const query ='select from actualizarespecialidad($1, $2, $3,$4);';
    const values = [codigo, nombre,descripcion,estado];
    console.log(values);
    try {
        const conect = await pool.connect();
        const result = await pool.query(query,values);
        conect.release();
        res.status(200).json({message:'Especialidad actualizada '});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    
        
    }
    };


exports.eliminarEspecialidad = async (req, res) => {

    const {id} = req.params;
        const query ='select from eliminarespecialidad($1);';
        const values = [id]
    
        console.log(values);
        try {
            const conector = await pool.connect();
            const result = await pool.query(query,values,(error,result)=>{
    
                if (error){
                    res.status(400).json({error: error.message});
    
                }else{
                    res.status(200).json({message:"El registro se elimino correctamente"});
                }
    
            });
            conector.release();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error:"ERROR EN EL SERVIDOR"});
    
            
        }
    };




 


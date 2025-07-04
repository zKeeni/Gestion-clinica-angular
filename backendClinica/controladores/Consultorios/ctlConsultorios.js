const pool = require('../../configuracion/db');

exports.getConsultoriosEstado = async (req, res) => {
     
    const {estado} = req.params;
    const query = 'SELECT * FROM listarconsultoriosestado($1)';
    const values = [estado]
    try {
        const result = await pool.query(query,values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getConsultorios = async (req, res) => {
     
    const query = 'SELECT * FROM consultorio;';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConsultoriosId = async (req, res) => {
   
    const {id} = req.params;
    const query ='select * from consultorio where codigo=$1'
    const values = [id]
    try {
        const result = await pool.query(query,values);
        
        if (result.rowCount>0){
            res.json(result.rows);
        }else{
            res.status(400).json({error:"NO EXISTE ESE CONSULTORIO"});

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"ERROR EN EL SERVIDOR"});

        
    }

    };


exports.RegistrarConsultorios = async (req, res) => {


    const { nombre,descripcion} = req.body;
    const query ='select from registrarconsultorio($1, $2)';

    const values = [ nombre,descripcion];

    console.log(values);
    try {
        const cosultorio = await pool.connect();
        const result = await pool.query(query,values);
        cosultorio.release();
        res.status(200).json({message:'Consultorio registrado'});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"No se pudo registar al Consultorio"});

        
    }




};


exports.ActualizarConsultorio = async (req, res) => {

    const {codigo,nombre,descripcion} = req.body;
    const query ='select from actualizarconsultorio($1, $2, $3);';
    const values = [codigo, nombre,descripcion];
    console.log(values);
    try {
        const conect = await pool.connect();
        const result = await pool.query(query,values);
        conect.release();
        res.status(200).json({message:'Consultorio actualizado '});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    
        
    }
    };


exports.eliminarConsultorio = async (req, res) => {

    const {id} = req.params;
        const query ='select from eliminarconsultorio($1);';
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


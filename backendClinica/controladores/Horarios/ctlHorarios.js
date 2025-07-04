const pool = require('../../configuracion/db');

exports.getHorariosEstado = async (req, res) => {
     
    const {estado} = req.params;
    const query = 'SELECT * FROM listarhorariosestado($1)';
    const values = [estado]
    try {
        const result = await pool.query(query,values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getHorarios = async (req, res) => {
     
    const query = 'SELECT * FROM horario;';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHorariosId = async (req, res) => {
   
    const {id} = req.params;
    const query ='select * from horario where codigo=$1'
    const values = [id]
    try {
        const result = await pool.query(query,values);
        
        if (result.rowCount>0){
            res.json(result.rows);
        }else{
            res.status(400).json({error:"NO EXISTE ESE horario"});

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"ERROR EN EL SERVIDOR"});

        
    }

    };


exports.RegistrarHorarios = async (req, res) => {


    const {  hora_inicio,hora_fin  ,usuario} = req.body;
    const query ='select from registrarhorario($1, $2,$3)';

    const values = [ hora_inicio,hora_fin  ,usuario];

    console.log(values);
    try {
        const cosultorio = await pool.connect();
        const result = await pool.query(query,values);
        cosultorio.release();
        res.status(200).json({message:'horario registrado'});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"No se pudo registar al horario"});

        
    }




};


exports.Actualizarhorario = async (req, res) => {

    const {codigo,hora_inicio,hora_fin  ,usuario,estado} = req.body;
    const query ='select from actualizarhorario($1, $2, $3,$4,$5);';
    const values = [codigo,hora_inicio,hora_fin  ,usuario,estado];
    console.log(values);
    try {
        const conect = await pool.connect();
        const result = await pool.query(query,values);
        conect.release();
        res.status(200).json({message:'horario actualizado '});
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message});
    
        
    }
    };


exports.eliminarhorario = async (req, res) => {

    const {id} = req.params;
        const query ='select from eliminarhorario($1);';
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


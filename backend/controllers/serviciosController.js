export function insertarServicio(db) {
    return (req, res) => {
        const { tipo, duracionMinutos, precio } = req.body;
        
        // Validar entrada
        if (!tipo || typeof tipo !== 'string' || tipo.trim().length === 0) {
            return res.status(400).json({ mensaje: "Tipo de servicio requerido" });
        }
        if (tipo.length > 100) {
            return res.status(400).json({ mensaje: "Tipo de servicio muy largo" });
        }
        
        if (typeof duracionMinutos !== 'number' || duracionMinutos <= 0) {
            return res.status(400).json({ mensaje: "Duración debe ser número positivo" });
        }
        
        if (typeof precio !== 'number' || precio < 0) {
            return res.status(400).json({ mensaje: "Precio debe ser número no negativo" });
        }
        
        db.query("insert into servicios (tipo, duracion_minutos, precio) values (?,?,?)", 
            [tipo.trim(), duracionMinutos, precio],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al crear servicio" });
                }
                return res.status(201).json({ id: result.insertId, tipo, duracionMinutos, precio });
            }
        );
    };
}

export function obtenerServicios(db) {
    return (req, res) => {
        db.query("select * from servicios", (err, result) => {
            if (err) { res.status(500).send(err); }
            else { res.json(result); }
        })
    };
}

export function obtenerServicioPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        
        // Validar que id sea número
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        db.query('select * from servicios where id = ?', [id], (err, result) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error al obtener servicio" });
            }
            
            if (!result || result.length === 0) {
                return res.status(404).json({ mensaje: "Servicio no encontrado" });
            }
            
            res.json(result[0]);
        });
    };
}

export function actualizarServicio(db) {
    return (req, res) => {
        const { id } = req.params;
        const { tipo, duracionMinutos, precio } = req.body;
        
        // Validar id
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        // Validar entrada (mismo que insertar)
        if (!tipo || typeof tipo !== 'string' || tipo.trim().length === 0) {
            return res.status(400).json({ mensaje: "Tipo de servicio requerido" });
        }
        if (typeof duracionMinutos !== 'number' || duracionMinutos <= 0) {
            return res.status(400).json({ mensaje: "Duración debe ser número positivo" });
        }
        if (typeof precio !== 'number' || precio < 0) {
            return res.status(400).json({ mensaje: "Precio debe ser número no negativo" });
        }
        
        db.query('update servicios set tipo = ?, duracion_minutos = ?, precio = ? where id = ?',
            [tipo.trim(), duracionMinutos, precio, id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al actualizar servicio" });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ mensaje: "Servicio no encontrado" });
                }
                
                res.json({ mensaje: "Servicio actualizado" });
            }
        );
    };
}

export function eliminarServicio(db) {
    return (req, res) => {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        db.query('delete from servicios where id = ?', [id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al eliminar servicio" });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ mensaje: "Servicio no encontrado" });
                }
                
                res.json({ mensaje: "Servicio eliminado" });
            }
        );
    };
};
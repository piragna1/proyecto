export function obtenerTurnos(db) {
    return (req, res) => {
        db.query("select * from turnos", (err, result) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error al obtener turnos" });
            }
            
            if (!result) {
                return res.json([]);
            }
            
            res.json(result);
        });
    };
};

export function obtenerTurnoPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        db.query("select * from turnos where id = ?", [id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al obtener turno" });
                }
                
                if (!result || result.length === 0) {
                    return res.status(404).json({ mensaje: "Turno no encontrado" });
                }
                
                res.json(result[0]);
            }
        );
    };
};

export function insertarTurno(db) {
    return (req, res) => {
        const turno = req.body;
        
        // Validar estructura
        if (!turno || !turno.usuario || !turno.servicio) {
            return res.status(400).json({ mensaje: "Datos incompletos" });
        }
        
        if (!turno.usuario.id || !turno.servicio.id) {
            return res.status(400).json({ mensaje: "ID usuario o servicio inválido" });
        }
        
        // Validar fechas
        if (!turno.fechaHoraInicio || !turno.fechaHoraFin) {
            return res.status(400).json({ mensaje: "Fechas requeridas" });
        }
        
        const inicio = new Date(turno.fechaHoraInicio);
        const fin = new Date(turno.fechaHoraFin);
        
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            return res.status(400).json({ mensaje: "Formato de fecha inválido" });
        }
        
        if (inicio >= fin) {
            return res.status(400).json({ 
                mensaje: "La hora de inicio debe ser menor a la de fin" 
            });
        }
        
        if (inicio < new Date()) {
            return res.status(400).json({ 
                mensaje: "No se puede crear turno en el pasado" 
            });
        }
        
        // Validar que no se superpone
        db.query(
            `select * from turnos where id_servicio = ? 
             and ((fecha_hora_inicio < ? and fecha_hora_fin > ?)
             or (fecha_hora_inicio < ? and fecha_hora_fin > ?))`,
            [turno.servicio.id, fin, inicio, fin, inicio],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al verificar disponibilidad" });
                }
                
                if (result && result.length > 0) {
                    return res.status(409).json({ 
                        mensaje: "Ese horario no está disponible" 
                    });
                }
                
                // Insertar turno
                db.query(
                    "insert into turnos (id_usuario, id_servicio, fecha_hora_inicio, fecha_hora_fin) values (?,?,?,?)",
                    [turno.usuario.id, turno.servicio.id, turno.fechaHoraInicio, turno.fechaHoraFin],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ mensaje: "Error al crear turno" });
                        }
                        return res.status(201).json({ id: result.insertId, ...turno });
                    }
                );
            }
        );
    };
};

export function eliminarTurno(db) {
    return (req, res) => {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        db.query('delete from turnos where id = ?', [id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al eliminar turno" });
                }
                
                if (!result || result.affectedRows === 0) {
                    return res.status(404).json({ mensaje: "Turno no encontrado" });
                }
                
                res.json({ mensaje: "Turno eliminado" });
            }
        );
    };
};

export function actualizarTurno(db) {
    return (req, res) => {
        const { usuario, servicio, fechaHoraInicio, fechaHoraFin } = req.body;
        const { id } = req.params;
        
        // Validar ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        // Validar estructura
        if (!usuario || !servicio) {
            return res.status(400).json({ mensaje: "Datos incompletos" });
        }
        
        if (!usuario.id || !servicio.id) {
            return res.status(400).json({ mensaje: "ID usuario o servicio inválido" });
        }
        
        // Validar fechas
        if (!fechaHoraInicio || !fechaHoraFin) {
            return res.status(400).json({ mensaje: "Fechas requeridas" });
        }
        
        const inicio = new Date(fechaHoraInicio);
        const fin = new Date(fechaHoraFin);
        
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            return res.status(400).json({ mensaje: "Formato de fecha inválido" });
        }
        
        if (inicio >= fin) {
            return res.status(400).json({ 
                mensaje: "La hora de inicio debe ser menor a la de fin" 
            });
        }
        
        if (inicio < new Date()) {
            return res.status(400).json({ 
                mensaje: "No se puede actualizar a turno en el pasado" 
            });
        }
        
        // Validar que no se superpone (excluyendo este turno)
        db.query(
            `select * from turnos where id_servicio = ? and id != ?
             and ((fecha_hora_inicio < ? and fecha_hora_fin > ?)
             or (fecha_hora_inicio < ? and fecha_hora_fin > ?))`,
            [servicio.id, id, fin, inicio, fin, inicio],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al verificar disponibilidad" });
                }
                
                if (result && result.length > 0) {
                    return res.status(409).json({ 
                        mensaje: "Ese horario no está disponible" 
                    });
                }
                
                // Actualizar turno
                db.query(
                    'update turnos set id_usuario = ?, id_servicio = ?, fecha_hora_inicio = ?, fecha_hora_fin = ? where id = ?',
                    [usuario.id, servicio.id, fechaHoraInicio, fechaHoraFin, id],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ mensaje: "Error al actualizar turno" });
                        }
                        
                        if (!result || result.affectedRows === 0) {
                            return res.status(404).json({ mensaje: "Turno no encontrado" });
                        }
                        
                        res.json({ mensaje: "Turno actualizado" });
                    }
                );
            }
        );
    };
};
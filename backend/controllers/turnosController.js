import bcrypt from 'bcrypt';

function validarFechasTurno(body, res) {
    const { fechaHoraInicio, fechaHoraFin } = body;
    if (!fechaHoraInicio || !fechaHoraFin) {
        res.status(400).json({ mensaje: "Fechas requeridas" });
        return null;
    }

    const inicio = new Date(fechaHoraInicio);
    const fin = new Date(fechaHoraFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        res.status(400).json({ mensaje: "Formato de fecha inválido" });
        return null;
    }

    if (inicio >= fin) {
        res.status(400).json({ mensaje: "La hora de inicio debe ser menor a la de fin" });
        return null;
    }

    if (inicio < new Date()) {
        res.status(400).json({ mensaje: "No se puede crear turno en el pasado" });
        return null;
    }

    return { inicio, fin, inicioStr: fechaHoraInicio, finStr: fechaHoraFin };
}

// Verifica que un usuario no tenga más de un turno en el mismo día
function verificarUnTurnoPorDia(db, idUsuario, fechaHoraInicio, res, excluirId, callback, mensaje) {
    let query = 'select count(*) as cantidad from turnos where id_usuario = ? and date(fecha_hora_inicio) = date(?)';
    const params = [idUsuario, fechaHoraInicio];

    if (excluirId) {
        query += ' and id != ?';
        params.push(excluirId);
    }

    db.query(query, params, (err, filas) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al verificar turnos del usuario" });
        }

        if (filas && filas[0].cantidad > 0) {
            return res.status(409).json({ mensaje });
        }

        callback();
    });
}

// Verifica solapamiento e inserta el turno (compartido por alta normal y alta de mostrador)
function insertarTurnoConCliente(db, res, { idUsuario, idServicio, inicio, fin, inicioStr, finStr, respuesta, mensajeExisteTurno }) {
    verificarUnTurnoPorDia(db, idUsuario, inicioStr, res, null, () => {
        db.query(
            `select * from turnos where id_servicio = ? 
             and ((fecha_hora_inicio < ? and fecha_hora_fin > ?)
             or (fecha_hora_inicio < ? and fecha_hora_fin > ?))`,
            [idServicio, fin, inicio, fin, inicio],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al verificar disponibilidad" });
                }

                if (result && result.length > 0) {
                    return res.status(409).json({
                        mensaje: "Ese horario no está disponible"
                    });
                }

                db.query(
                "insert into turnos (id_usuario, id_servicio, fecha_hora_inicio, fecha_hora_fin) values (?,?,?,?)",
                [idUsuario, idServicio, inicioStr, finStr],
                (err, result2) => {
                    if (err) {
                        return res.status(500).json({ mensaje: "Error al crear turno" });
                    }
                    return res.status(201).json({ id: result2.insertId, ...respuesta });
                    }
                );
            }
        );
    }, mensajeExisteTurno);
}

// Genera un email único para clientes de mostrador (derivado del teléfono)
function obtenerEmailMostrador(db, telefono, callback, intento = 0) {
    const base = 'turno-mostrador.' + telefono + '@barberia.local';
    const email = intento === 0 ? base : base.replace('@', '-' + intento + '@');

    db.query('select id from usuarios where email = ?', [email], (err, filas) => {
        if (err) return callback(null);
        if (filas && filas.length > 0) {
            if (intento < 10) return obtenerEmailMostrador(db, telefono, callback, intento + 1);
            return callback(null);
        }
        callback(email);
    });
}

export function obtenerTurnos(db) {
    return (req, res) => {
        const { fecha } = req.query;

        if (fecha !== undefined) {
            if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return res.status(400).json({ mensaje: "Formato de fecha inválido. Use YYYY-MM-DD" });
            }
        }

        let query = "select * from turnos";
        const params = [];

        if (fecha !== undefined) {
            query += " where date(fecha_hora_inicio) = ?";
            params.push(fecha);
        }

        query += " order by fecha_hora_inicio";

        db.query(query, params, (err, result) => {
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

        const validacionFechas = validarFechasTurno(req.body, res);
        if (!validacionFechas) return;

        insertarTurnoConCliente(db, res, {
            idUsuario: turno.usuario.id,
            idServicio: turno.servicio.id,
            ...validacionFechas,
            respuesta: turno,
            mensajeExisteTurno: "No puedes reservar 2 turnos para el mismo dia",
        });
    };
};

export function insertarTurnoMostrador(db) {
    return (req, res) => {
        const { idServicio, fechaHoraInicio, fechaHoraFin, nombre, telefono } = req.body;

        if (!idServicio || !fechaHoraInicio || !fechaHoraFin || !nombre || !telefono) {
            return res.status(400).json({ mensaje: "Datos incompletos" });
        }

        const idServicioNum = Number(idServicio);
        if (!idServicioNum || isNaN(idServicioNum)) {
            return res.status(400).json({ mensaje: "Servicio inválido" });
        }

        if (typeof nombre !== 'string' || nombre.trim().length === 0) {
            return res.status(400).json({ mensaje: "Nombre requerido" });
        }

        if (typeof telefono !== 'string' || telefono.trim().length === 0 || telefono.length > 20) {
            return res.status(400).json({ mensaje: "Teléfono inválido" });
        }

        const validacionFechas = validarFechasTurno(req.body, res);
        if (!validacionFechas) return;

        // Validar que el servicio exista
        db.query('select id from servicios where id = ?', [idServicioNum], (errServ, servicios) => {
            if (errServ) {
                return res.status(500).json({ mensaje: "Error al verificar servicio" });
            }

            if (!servicios || servicios.length === 0) {
                return res.status(404).json({ mensaje: "Servicio no encontrado" });
            }

            // Reutilizar usuario si el teléfono ya existe (registrado o mostrador)
            db.query('select id from usuarios where telefono = ?', [telefono.trim()], (errUsr, usuarios) => {
                if (errUsr) {
                    return res.status(500).json({ mensaje: "Error al verificar cliente" });
                }

                if (usuarios && usuarios.length > 0) {
                    return insertarTurnoConCliente(db, res, {
                        idUsuario: usuarios[0].id,
                        idServicio: idServicioNum,
                        ...validacionFechas,
                        respuesta: { fechaHoraInicio, fechaHoraFin, nombre, telefono },
                        mensajeExisteTurno: "El usuario ya tiene un turno reservado para ese día",
                    });
                }

                // Crear cliente de mostrador
                obtenerEmailMostrador(db, telefono.trim(), (email) => {
                    if (!email) {
                        return res.status(500).json({ mensaje: "Error al crear cliente" });
                    }

                    const claveRandom = Math.random().toString(36).slice(2) + Date.now().toString(36);
                    bcrypt.hash(claveRandom, 10, (errHash, hash) => {
                        if (errHash) {
                            return res.status(500).json({ mensaje: "Error al crear cliente" });
                        }

                        db.query(
                            'INSERT INTO usuarios (nombre, email, telefono, clave, rol, superadmin, direccion, mostrador) VALUES (?,?,?,?,?,?,?,?)',
                            [nombre.trim(), email, telefono.trim(), hash, 'cliente', false, null, true],
                            (errInsert, result) => {
                                if (errInsert) {
                                    console.error('Error al crear cliente de mostrador:', errInsert.message);
                                    return res.status(500).json({ mensaje: "Error al crear cliente: " + errInsert.message });
                                }

                                return insertarTurnoConCliente(db, res, {
                                    idUsuario: result.insertId,
                                    idServicio: idServicioNum,
                                    ...validacionFechas,
                                    respuesta: { fechaHoraInicio, fechaHoraFin, nombre, telefono },
                                    mensajeExisteTurno: "El usuario ya tiene un turno reservado para ese día",
                                });
                            }
                        );
                    });
                });
            });
        });
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
        
// Validar que el usuario no supere un turno por día y que no se superponga (excluyendo este turno)
        verificarUnTurnoPorDia(db, usuario.id, fechaHoraInicio, res, id, () => {
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
}, "El usuario ya tiene un turno reservado para ese día");
    };
};
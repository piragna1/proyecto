export function obtenerTurnos(db) {
    return (req, res) => {
        db.query("select * from turnos", (err, result) => {
            if (err) res.status(500).send(err);
            else res.json(result);
        });
    };
};

export function obtenerTurnoPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        console.log(id)
        db.query("select * from turnos where id = ?", [id],
            (err, result) => {
                if (err) res.status(500).send(err);
                else res.json(result[0]);
            }
        );
    };
};

export function insertarTurno(db) {
    return (req, res) => {
        const turno = req.body;
        // console.log('turno');
        // console.log(turno);
        // return;

        db.query("insert into turnos (id_usuario, id_servicio, fecha_hora_inicio, fecha_hora_fin) values (?,?,?,?)",
            [turno.usuario.id, turno.servicio.id, turno.fechaHoraInicio, turno.fechaHoraFin],
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
    };
};

export function eliminarTurno(db) {
    return (req, res) => {
        const { id } = req.params;
        db.query('delete from turnos where id = ?', [id],
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
    };
};

export function actualizarTurno(db) {
    return (req, res) => {
        const { usuario, servicio, fechaHoraInicio, fechaHoraFin } = req.body;
        const { id } = req.params;
        console.log(usuario);
        console.log(servicio);
        console.log(fechaHoraInicio);
        console.log(fechaHoraFin);
        db.query('update turnos set id_usuario = ?, id_servicio = ?, fecha_hora_inicio = ?, fecha_hora_fin = ? where id = ?',
            [usuario.id, servicio.id, fechaHoraInicio, fechaHoraFin, id],
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
    };
};
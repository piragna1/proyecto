export function obtenerTurnos(db) {
    return (req, res) => {
        db.query("select * from turnos", (err, result) => {
            if (err) res.status(500).send(err);
            else res.json(result);
        });
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
        )
    }
}
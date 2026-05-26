export function insertarServicio(db) {
    return (req, res) => {
        const { tipo, duracionMinutos, precio } = req.body;
        db.query("insert into servicios (tipo, duracion_minutos, precio) values (?,?,?)", [tipo, duracionMinutos, precio],
            (err, result) => {
                if (err) return res.json(err);
                return res.json(result);
            }
        );
    };
}

export function obtenerServicios(db) {
    return (req, res) => {
        db.query("select * from servicios", (err, result) => {
            if (err) res.status(500).send(err);
            else res.json(result);
        })
    };
}

export function obtenerServicioPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        db.query('select * from servicios where id = ?', [id], (err, result) => {
            if (err) res.status(500).send(err);
            else res.json(result[0]);
        });
    };
}
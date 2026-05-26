export function obtenerUsuarios(db) {
    return (req, res) => {
        db.query("SELECT * FROM usuarios", (err, result) => {
            if (err) res.status(500).send(err);
            else res.json(result);
        });
    };
};

export function obtenerUsuarioPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        db.query("SELECT * FROM usuarios where id = ?", [id], (err, result) => {
            if (err) res.status(500).send(err);
            else res.json(result[0]);
        });
    };
};

export function insertarUsuario(db) {
    return (req, res) => {
        const { nombre, email, telefono, clave, rol, superadmin, direccion } = req.body;
        db.query('insert into usuarios (nombre,email,telefono,clave,rol,superadmin, direccion) values (?,?,?,?,?,?,?) ',
            [nombre, email, telefono, clave, rol, superadmin, direccion], (err, result) => {
                if (err) return res.json(err);
                res.json(result);
            });
    };
};
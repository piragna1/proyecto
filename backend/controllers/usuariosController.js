import bcrypt from 'bcrypt';

export function obtenerUsuarios(db) {
    return (req, res) => {
        db.query("SELECT * FROM usuarios", (err, result) => {
            if (err) { res.status(500).send(err); }
            else { res.json(result); }
        });
    };
};

export function obtenerUsuarioPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        db.query("SELECT * FROM usuarios where id = ?", [id], (err, result) => {
            if (err) { res.status(500).send(err); }
            else { res.json(result[0]); }
        });
    };
};

export function insertarUsuario(db) {
    return async (req, res) => {
        try {
            const { nombre, email, telefono, clave, rol, superadmin, direccion } = req.body;
            const hash = await bcrypt.hash(clave, 10);

            db.query('insert into usuarios (nombre,email,telefono,clave,rol,superadmin, direccion) values (?,?,?,?,?,?,?) ',
                [nombre, email, telefono, hash, rol, superadmin, direccion], (err, result) => {
                    if (err) { return res.json(err); }

                    res.json(result);
                });
        } catch (error) {

            res.status(500).json(error.message);
        }
    };
};

export function actualizarUsuario(db) {
    return async (req, res) => {
        try {
            const { nombre, email, telefono, clave, rol, superadmin, direccion } = req.body;

            const { id } = req.params;
            if (clave && clave.trim() !== '') {

                const hash = await bcrypt.hash(clave, 10);
                db.query('update usuarios set nombre = ?, email = ?, telefono = ?, clave = ?, rol = ?, superadmin = ?, direccion = ? where id = ?',
                    [nombre, email, telefono, hash, rol, superadmin, direccion, id],
                    (err, result) => {
                        if (err) { return res.json(err); }

                        return res.json(result);
                    }
                );
            }
            else {
                db.query('update usuarios set nombre = ?, email = ?, telefono = ?, rol = ?, superadmin = ?, direccion = ? where id = ?',
                    [nombre, email, telefono, rol, superadmin, direccion, id],
                    (err, result) => {
                        if (err) { return res.json(err); }

                        return res.json(result);
                    }
                );
            }
        } catch (error) {

            console.log(error)
        }
    };
};

export function eliminarUsuario(db) {
    return (req, res) => {
        const { id } = req.params;
        db.query('delete from usuarios where id = ?', [id],
            (err, result) => {
                if (err) { return res.json(err); }

                return res.json(result);
            }
        );
    };
};
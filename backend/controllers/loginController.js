import bcrypt from 'bcrypt';
export function loginUsuario(db) {
    return (req, res) => {
        const { email, clave } = req.body;
        db.query("select * from usuarios where email = ?", [email],
            async (err, result) => {
                if (err) return res.status(500).send(err);
                if (result.length === 0) {
                    return res.status(401).json({ mensaje: "Credenciales invalidas" });
                }
                console.log('result: ', result);

                const coincide = await bcrypt.compare(
                    clave,
                    result[0].clave
                );
                if (coincide) { return res.json(result[0]); }
                return res.status(401).json({ mensaje: "Credenciales invalidas" });
            }
        );
    };
}

export function loginAdmin(db) {
    return (req, res) => {
        const { email, clave } = req.body;
        console.log(req.body);
        console.log('clave', clave);
        db.query("select * from usuarios where email = ?", [email],
            async (err, result) => {
                if (err) return res.status(500).send(err);
                if (result.length === 0) {
                    return res.status(401).json({ mensaje: "Credenciales invalidas" });
                }
                console.log('result:', result[0]);

                const coincide = await bcrypt.compare(
                    clave,
                    result[0].clave
                );
                console.log('coincide:', coincide)
                if (coincide) { return res.json(result[0]); }
                return res.status(401).json({ mensaje: "Credenciales invalidas" });
            }
        );
    };
}

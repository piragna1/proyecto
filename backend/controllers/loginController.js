export function loginUsuario(db) {
    return (req, res) => {
        const { email, clave } = req.body;
        db.query("select * from usuarios where email = ? and clave = ?", [email, clave],
            (err, result) => {
                if (err) return res.status(500).send(err);
                if (result.length === 0) {
                    return res.status(401).json({ mensaje: "Credenciales invalidas" });
                }
                res.json({ mensaje: "Login exitoso", usuario: result[0] });
            }
        );
    };
}

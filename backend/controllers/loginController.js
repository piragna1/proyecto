import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export function loginUsuario(db) {
    return (req, res) => {
        const { email, clave } = req.body;
        db.query("select * from usuarios where email = ?", [email],
            async (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                const usuario = result[0];

                if (!usuario || !bcrypt.compareSync(clave, usuario.clave)) {
                    return res.status(401).json({ mensaje: "Credenciales invalidas" });
                }

                const token = jwt.sign({
                    id:usuario.id,
                    email:usuario.email,
                    nombre:usuario.nombre,
                    rol:usuario.rol,
                    superadmin:usuario.superadmin
                }, process.env.JWT_SECRET, {
                    expiresIn:"1h"
                });
                return res.json({token});
            }
        );
    };
};

export function loginAdmin(db) {
    return (req, res) => {
        const { email, clave } = req.body;
        console.log(req.body);
        console.log('clave', clave);
        db.query("select * from usuarios where email = ?", [email],
            async (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                const usuario = result[0];

                if (!usuario || !bcrypt.compareSync(clave,usuario.clave)) {
                    return res.status(401).json({ mensaje: "Credenciales invalidas" });
                };

                const token = jwt.sign({
                    id:usuario.id,
                    email:usuario.email,
                    nombre:usuario.nombre,
                    rol:usuario.rol,
                    superadmin:usuario.superadmin
                }, process.env.JWT_SECRET, {
                    expiresIn:"1h"
                });
                
                return res.json({token});

            }
        );
    };
}

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Función auxiliar de validación
function validarCredenciales(email, clave) {
    const errores = [];
    
    if (!email || typeof email !== 'string') {
        errores.push("Email requerido");
    } else {
        email = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errores.push("Email inválido");
        }
        if (email.length > 255) {
            errores.push("Email muy largo");
        }
    }
    
    if (!clave || typeof clave !== 'string') {
        errores.push("Contraseña requerida");
    } else {
        if (clave.length < 6) {
            errores.push("Contraseña muy corta");
        }
        if (clave.length > 255) {
            errores.push("Contraseña muy larga");
        }
    }
    
    return { valido: errores.length === 0, errores };
}

export function loginUsuario(db) {
    return (req, res) => {
        let { email, clave } = req.body;
        
        // Validar entrada
        const validacion = validarCredenciales(email, clave);
        if (!validacion.valido) {
            return res.status(400).json({ 
                mensaje: "Credenciales inválidas",
                errores: validacion.errores 
            });
        }
        
        email = email.trim().toLowerCase();
        
        db.query("select * from usuarios where email = ?", [email],
            async (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error en el servidor" });
                }
                
                // Verificar que existe resultado
                if (!result || result.length === 0) {
                    return res.status(401).json({ 
                        mensaje: "Credenciales inválidas" 
                    });
                }
                
                const usuario = result[0];

                if (!bcrypt.compareSync(clave, usuario.clave)) {
                    return res.status(401).json({ 
                        mensaje: "Credenciales inválidas" 
                    });
                }

                const token = jwt.sign({
                    id: usuario.id,
                    email: usuario.email,
                    nombre: usuario.nombre,
                    rol: usuario.rol,
                    superadmin: usuario.superadmin
                }, process.env.JWT_SECRET, {
                    expiresIn: "1h"
                });
                
                return res.json({ token });
            }
        );
    };
};

export function loginAdmin(db) {
    return loginUsuario(db);
}

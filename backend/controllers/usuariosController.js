import bcrypt from 'bcrypt';

const ROLES_VALIDOS = ['admin', 'peluquero', 'usuario'];

// Función auxiliar de validación
function validarUsuario(usuario, esCreacion = true) {
    const errores = [];
    
    if (!usuario.nombre || typeof usuario.nombre !== 'string' || usuario.nombre.trim().length === 0) {
        errores.push("Nombre requerido");
    } else if (usuario.nombre.length > 100) {
        errores.push("Nombre muy largo");
    }
    
    if (!usuario.email || typeof usuario.email !== 'string') {
        errores.push("Email requerido");
    } else {
        usuario.email = usuario.email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
            errores.push("Email inválido");
        }
        if (usuario.email.length > 255) {
            errores.push("Email muy largo");
        }
    }
    
    if (!usuario.telefono || typeof usuario.telefono !== 'string') {
        errores.push("Teléfono requerido");
    } else if (usuario.telefono.length > 20) {
        errores.push("Teléfono muy largo");
    }
    
    // Validar clave solo en creación o si se proporciona en actualización
    if (esCreacion || (usuario.clave && usuario.clave.trim() !== '')) {
        if (!usuario.clave || typeof usuario.clave !== 'string') {
            errores.push("Contraseña requerida");
        } else if (usuario.clave.length < 6) {
            errores.push("Contraseña muy corta (mínimo 6 caracteres)");
        } else if (usuario.clave.length > 255) {
            errores.push("Contraseña muy larga");
        }
    }
    
    if (!usuario.rol || !ROLES_VALIDOS.includes(usuario.rol)) {
        errores.push("Rol inválido");
    }
    
    if (typeof usuario.superadmin !== 'boolean') {
        errores.push("Superadmin debe ser boolean");
    }
    
    if (usuario.direccion && usuario.direccion.length > 255) {
        errores.push("Dirección muy larga");
    }
    
    return { valido: errores.length === 0, errores };
}

export function obtenerUsuarios(db) {
    return (req, res) => {
        db.query("SELECT id, nombre, email, telefono, rol, superadmin, direccion FROM usuarios", 
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al obtener usuarios" });
                }
                res.json(result || []);
            }
        );
    };
};

export function obtenerUsuarioPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        db.query("SELECT id, nombre, email, telefono, rol, superadmin, direccion FROM usuarios WHERE id = ?", 
            [id], 
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al obtener usuario" });
                }
                
                if (!result || result.length === 0) {
                    return res.status(404).json({ mensaje: "Usuario no encontrado" });
                }
                
                res.json(result[0]);
            }
        );
    };
};

export function insertarUsuario(db) {
    return async (req, res) => {
        try {
            const { nombre, email, telefono, clave, rol, superadmin, direccion } = req.body;
            
            // Validar entrada
            const usuario = { nombre, email, telefono, clave, rol, superadmin, direccion };
            const validacion = validarUsuario(usuario, true);
            
            if (!validacion.valido) {
                return res.status(400).json({ 
                    mensaje: "Datos inválidos",
                    errores: validacion.errores 
                });
            }
            
            const hash = await bcrypt.hash(clave.trim(), 10);
            
            db.query(
                'INSERT INTO usuarios (nombre, email, telefono, clave, rol, superadmin, direccion) VALUES (?,?,?,?,?,?,?)',
                [nombre.trim(), email.trim().toLowerCase(), telefono.trim(), hash, rol, superadmin, direccion?.trim() || null],
                (err, result) => {
                    if (err) {
                        // Detectar error de email duplicado
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(409).json({ mensaje: "El email ya está registrado" });
                        }
                        return res.status(500).json({ mensaje: "Error al crear usuario" });
                    }
                    
                    res.status(201).json({ id: result.insertId, nombre, email, rol });
                }
            );
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear usuario" });
        }
    };
};

export function actualizarUsuario(db) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, email, telefono, clave, rol, superadmin, direccion } = req.body;
            
            if (!id || isNaN(id)) {
                return res.status(400).json({ mensaje: "ID inválido" });
            }
            
            // Validar entrada
            const usuario = { nombre, email, telefono, clave: clave || '', rol, superadmin, direccion };
            const validacion = validarUsuario(usuario, false);
            
            if (!validacion.valido) {
                return res.status(400).json({ 
                    mensaje: "Datos inválidos",
                    errores: validacion.errores 
                });
            }
            
            let query = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, rol = ?, superadmin = ?, direccion = ?';
            let params = [nombre.trim(), email.trim().toLowerCase(), telefono.trim(), rol, superadmin, direccion?.trim() || null];
            
            // Si hay clave nueva, agregar a query
            if (clave && clave.trim() !== '') {
                const hash = await bcrypt.hash(clave.trim(), 10);
                query += ', clave = ?';
                params.splice(3, 0, hash); // Insertar hash después de telefono
            }
            
            query += ' WHERE id = ?';
            params.push(id);
            
            db.query(query, params, (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ mensaje: "El email ya está en uso" });
                    }
                    return res.status(500).json({ mensaje: "Error al actualizar usuario" });
                }
                
                if (!result || result.affectedRows === 0) {
                    return res.status(404).json({ mensaje: "Usuario no encontrado" });
                }
                
                res.json({ mensaje: "Usuario actualizado" });
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar usuario" });
        }
    };
};

export function eliminarUsuario(db) {
    return (req, res) => {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        
        db.query('DELETE FROM usuarios WHERE id = ?', [id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al eliminar usuario" });
                }
                
                if (!result || result.affectedRows === 0) {
                    return res.status(404).json({ mensaje: "Usuario no encontrado" });
                }
                
                res.json({ mensaje: "Usuario eliminado" });
            }
        );
    };
};
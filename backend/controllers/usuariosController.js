import bcrypt from 'bcrypt';

const ROLES_VALIDOS = ['administrador', 'peluquero', 'cliente'];

function esSuperAdmin(usuario) {
    return usuario?.superadmin === 1 || usuario?.superadmin === true;
}

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
        if (!/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/.test(usuario.email)) {
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
        } else if (usuario.clave.length < 10) {
            errores.push("Contraseña muy corta (mínimo 10 caracteres)");
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
        const { rol } = req.query;

        // Un cliente no puede listar usuarios
        if (!req.user || req.user.rol === 'cliente') {
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        // El peluquero solo puede listar clientes
        if (req.user.rol === 'peluquero' && rol !== 'cliente') {
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        if (rol && !ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({ mensaje: "Rol inválido" });
        }

        let query = "SELECT id, nombre, email, telefono, rol, superadmin, direccion, mostrador FROM usuarios";
        const params = [];
        if (rol) {
            query += " WHERE rol = ?";
            params.push(rol);
        }

        db.query(query, params, (err, result) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error al obtener usuarios" });
            }
            res.json(result || []);
        });
    };
};

export function obtenerUsuarioPorId(db) {
    return (req, res) => {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }

        if (!req.user) {
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        // Un cliente solo puede ver su propio perfil; administradores y peluqueros pueden ver cualquiera
        if (req.user.rol === 'cliente' && Number(id) !== req.user.id) {
            return res.status(403).json({ mensaje: "No autorizado" });
        }
        
        db.query("SELECT id, nombre, email, telefono, rol, superadmin, direccion, mostrador FROM usuarios WHERE id = ?", 
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
            
            // Solo usuarios administradores pueden crear usuarios
            if (!req.user || req.user.rol !== 'administrador') {
                return res.status(403).json({ mensaje: "No autorizado" });
            }

            // Solo el superadmin puede crear administradores u otorgar superadmin
            if (rol === 'administrador' || superadmin === true) {
                if (!esSuperAdmin(req.user)) {
                    return res.status(403).json({ mensaje: "Solo el superadmin puede crear administradores u otorgar superadmin" });
                }
            }

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
                        // Detectar error de email duplicado o teléfono duplicado
                        if (err.code === 'ER_DUP_ENTRY') {
                            if (err.message.includes('email')) {
                                return res.status(409).json({ mensaje: "El email ya está registrado" });
                            } else if (err.message.includes('telefono')) {
                                return res.status(409).json({ mensaje: "El teléfono ya está registrado" });
                            }
                        }
                        return res.status(500).json({ mensaje: "Error al crear usuario" });
                    }
                    
                    res.status(201).json({ id: result.insertId, nombre, email, rol });
                }
            );
        } catch {
            res.status(500).json({ mensaje: "Error al crear usuario" });
        }
    };
};

// Registro público: siempre crea un cliente
export function registrarUsuario(db) {
    return async (req, res) => {
        try {
            const { nombre, email, telefono, clave, direccion } = req.body;

            const usuario = { nombre, email, telefono, clave, rol: 'cliente', superadmin: false, direccion };
            const validacion = validarUsuario(usuario, true);

            if (!validacion.valido) {
                return res.status(400).json({ 
                    mensaje: "Datos inválidos",
                    errores: validacion.errores 
                });
            }

            const hash = await bcrypt.hash(clave.trim(), 10);
            const emailFinal = email.trim().toLowerCase();
            const telefonoFinal = telefono.trim();

            // Si el teléfono pertenece a un cliente de mostrador, se reescribe esa fila
            db.query(
                'SELECT id, mostrador FROM usuarios WHERE telefono = ?',
                [telefonoFinal],
                (errSelect, fila) => {
                    if (errSelect) {
                        return res.status(500).json({ mensaje: "Error al crear usuario" });
                    }

                    if (fila && fila.length > 0 && fila[0].mostrador === 1) {
                        db.query(
                            'UPDATE usuarios SET nombre = ?, email = ?, clave = ?, mostrador = false WHERE id = ?',
                            [nombre.trim(), emailFinal, hash, fila[0].id],
                            (err) => {
                                if (err) {
                                    if (err.code === 'ER_DUP_ENTRY' && err.message.includes('email')) {
                                        return res.status(409).json({ mensaje: "El email ya está registrado" });
                                    }
                                    return res.status(500).json({ mensaje: "Error al crear usuario" });
                                }
                                return res.status(201).json({ id: fila[0].id, nombre, email: emailFinal, rol: 'cliente' });
                            }
                        );
                        return;
                    }

                    db.query(
                        'INSERT INTO usuarios (nombre, email, telefono, clave, rol, superadmin, direccion) VALUES (?,?,?,?,?,?,?)',
                        [nombre.trim(), emailFinal, telefonoFinal, hash, 'cliente', false, direccion?.trim() || null],
                        (err, result) => {
                            if (err) {
                                if (err.code === 'ER_DUP_ENTRY') {
                                    if (err.message.includes('email')) {
                                        return res.status(409).json({ mensaje: "El email ya está registrado" });
                                    } else if (err.message.includes('telefono')) {
                                        return res.status(409).json({ mensaje: "El teléfono ya está registrado" });
                                    }
                                }
                                return res.status(500).json({ mensaje: "Error al crear usuario" });
                            }

                            res.status(201).json({ id: result.insertId, nombre, email: emailFinal, rol: 'cliente' });
                        }
                    );
                }
            );
        } catch {
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
            const idNum = Number(id);

            if (!req.user) {
                return res.status(403).json({ mensaje: "No autorizado" });
            }

            db.query("SELECT rol, superadmin FROM usuarios WHERE id = ?", [idNum], async (err, resultado) => {
                try {
                    if (err) {
                        return res.status(500).json({ mensaje: "Error al actualizar usuario" });
                    }
                    if (!resultado || resultado.length === 0) {
                        return res.status(404).json({ mensaje: "Usuario no encontrado" });
                    }

                    const destino = resultado[0];
                    const esEdicionPropia = idNum === req.user.id;

                    let rolFinal = rol;
                    let superadminFinal = superadmin;

                    if (esEdicionPropia) {
                        // En el propio perfil se preservan rol y superadmin actuales
                        rolFinal = destino.rol;
                        superadminFinal = esSuperAdmin(destino);
                    } else {
                        // Editar a otro usuario exige ser administrador
                        if (req.user.rol !== 'administrador') {
                            return res.status(403).json({ mensaje: "No autorizado" });
                        }
                        // Un admin normal no puede editar superadmins ni otorgar superadmin/rol admin
                        if (esSuperAdmin(destino) || superadmin === true || rol === 'administrador') {
                            if (!esSuperAdmin(req.user)) {
                                return res.status(403).json({ mensaje: "Solo el superadmin puede modificar superadmins u otorgar superadmin" });
                            }
                        }
                    }

                    // Validar entrada
                    const usuario = { nombre, email, telefono, clave: clave || '', rol: rolFinal, superadmin: superadminFinal, direccion };
                    const validacion = validarUsuario(usuario, false);

                    if (!validacion.valido) {
                        return res.status(400).json({ 
                            mensaje: "Datos inválidos",
                            errores: validacion.errores 
                        });
                    }

                    let query = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, rol = ?, superadmin = ?, direccion = ?';
                    let params = [nombre.trim(), email.trim().toLowerCase(), telefono.trim(), rolFinal, superadminFinal, direccion?.trim() || null];

                    // Si hay clave nueva, agregar a query
                    if (clave && clave.trim() !== '') {
                        const hash = await bcrypt.hash(clave.trim(), 10);
                        query += ', clave = ?';
                        params.splice(3, 0, hash); // Insertar hash después de telefono
                    }

                    query += ' WHERE id = ?';
                    params.push(idNum);

                    db.query(query, params, (err, result) => {
                        if (err) {
                            if (err.code === 'ER_DUP_ENTRY') {
                                if (err.message.includes('email')) {
                                    return res.status(409).json({ mensaje: "El email ya está en uso" });
                                } else if (err.message.includes('telefono')) {
                                    return res.status(409).json({ mensaje: "El teléfono ya está en uso" });
                                }
                            }
                            return res.status(500).json({ mensaje: "Error al actualizar usuario" });
                        }
                        
                        if (!result || result.affectedRows === 0) {
                            return res.status(404).json({ mensaje: "Usuario no encontrado" });
                        }
                        
                        res.json({ mensaje: "Usuario actualizado" });
                    });
                } catch {
                    res.status(500).json({ mensaje: "Error al actualizar usuario" });
                }
            });
        } catch {
            res.status(500).json({ mensaje: "Error al actualizar usuario" });
        }
    };
};

export function cambiarClave(db) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const { claveAnterior, nuevaClave } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({ mensaje: "ID inválido" });
            }
            const idNum = Number(id);

            if (!req.user || idNum !== req.user.id) {
                return res.status(403).json({ mensaje: "No autorizado" });
            }

            if (!claveAnterior || typeof claveAnterior !== 'string') {
                return res.status(400).json({ mensaje: "Clave anterior requerida" });
            }

            const errores = [];
            if (!nuevaClave || typeof nuevaClave !== 'string') {
                errores.push("Contraseña requerida");
            } else if (nuevaClave.length < 10) {
                errores.push("Contraseña muy corta (mínimo 10 caracteres)");
            } else if (nuevaClave.length > 255) {
                errores.push("Contraseña muy larga");
            }
            if (errores.length > 0) {
                return res.status(400).json({ mensaje: "Datos inválidos", errores });
            }

            db.query("SELECT clave FROM usuarios WHERE id = ?", [idNum], async (err, resultado) => {
                try {
                    if (err) {
                        return res.status(500).json({ mensaje: "Error al cambiar la clave" });
                    }
                    if (!resultado || resultado.length === 0) {
                        return res.status(404).json({ mensaje: "Usuario no encontrado" });
                    }

                    const hashActual = resultado[0].clave;
                    if (!bcrypt.compareSync(claveAnterior, hashActual)) {
                        return res.status(401).json({ mensaje: "La clave anterior es incorrecta" });
                    }
                    if (bcrypt.compareSync(nuevaClave.trim(), hashActual)) {
                        return res.status(400).json({ mensaje: "No puedes utilizar la misma clave que antes" });
                    }

                    const hashNuevo = await bcrypt.hash(nuevaClave.trim(), 10);
                    db.query('UPDATE usuarios SET clave = ? WHERE id = ?', [hashNuevo, idNum], (err, result) => {
                        if (err) {
                            return res.status(500).json({ mensaje: "Error al cambiar la clave" });
                        }
                        if (!result || result.affectedRows === 0) {
                            return res.status(404).json({ mensaje: "Usuario no encontrado" });
                        }
                        res.json({ mensaje: "Clave actualizada" });
                    });
                } catch {
                    res.status(500).json({ mensaje: "Error al cambiar la clave" });
                }
            });
        } catch {
            res.status(500).json({ mensaje: "Error al cambiar la clave" });
        }
    };
};

export function eliminarUsuario(db) {
    return (req, res) => {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }
        const idNum = Number(id);

        if (!req.user || req.user.rol !== 'administrador') {
            return res.status(403).json({ mensaje: "No autorizado" });
        }

        if (idNum === req.user.id) {
            return res.status(403).json({ mensaje: "No puedes eliminar tu propia cuenta" });
        }

        db.query("SELECT superadmin FROM usuarios WHERE id = ?", [idNum], (err, resultado) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error al eliminar usuario" });
            }
            if (!resultado || resultado.length === 0) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }

            if (esSuperAdmin(resultado[0]) && !esSuperAdmin(req.user)) {
                return res.status(403).json({ mensaje: "Solo el superadmin puede eliminar superadmins" });
            }

            db.query('DELETE FROM usuarios WHERE id = ?', [idNum],
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
        });
    };
};
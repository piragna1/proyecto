//notificacionesController.js
export function obtenerNotificaciones(db) {
    return (req, res) => {
        const { fecha, usuario, tipo, motivo, telefono, mensaje, estado } = req.query;

        const condiciones = [];
        const params = [];

        if (fecha !== undefined) {
            if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return res.status(400).json({ mensaje: "Formato de fecha inválido. Use YYYY-MM-DD" });
            }
            condiciones.push('date(n.fecha_envio) = ?');
            params.push(fecha);
        }

        if (usuario !== undefined && usuario !== '') {
            condiciones.push('u.nombre like ?');
            params.push(`%${usuario}%`);
        }

        if (tipo !== undefined && tipo !== '') {
            condiciones.push('n.tipo = ?');
            params.push(tipo);
        }

        if (motivo !== undefined && motivo !== '') {
            condiciones.push('n.motivo like ?');
            params.push(`%${motivo}%`);
        }

        if (telefono !== undefined && telefono !== '') {
            condiciones.push('n.telefono like ?');
            params.push(`%${telefono}%`);
        }

        if (mensaje !== undefined && mensaje !== '') {
            condiciones.push('n.mensaje like ?');
            params.push(`%${mensaje}%`);
        }

        if (estado !== undefined && estado !== '') {
            condiciones.push('n.estado = ?');
            params.push(estado);
        }

        let query =
            `select n.id, n.tipo, n.motivo, n.telefono, n.mensaje, n.estado, n.fecha_envio, u.nombre as usuario_nombre
             from notificaciones n
             join usuarios u on u.id = n.id_usuario`;
        if (condiciones.length > 0) {
            query += ' where ' + condiciones.join(' and ');
        }
        query += ' order by n.id desc';

        db.query(query, params, (err, result) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error al obtener notificaciones" });
            }
            res.json(result || []);
        });
    };
}
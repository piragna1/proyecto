//notificacionesController.js
export function obtenerNotificaciones(db) {
    return (req, res) => {
        db.query(
            `select n.id, n.tipo, n.motivo, n.telefono, n.mensaje, n.estado, n.fecha_envio, u.nombre as usuario_nombre
             from notificaciones n
             join usuarios u on u.id = n.id_usuario
             order by n.id desc`,
            (err, result) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al obtener notificaciones" });
                }
                res.json(result || []);
            }
        );
    };
}
//notificacionesController.js
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const TAMANIO_PAGINA = 25;

// El regex solo valida la forma; esto además rechaza fechas que no existen
// como 2026-13-45, que MySQL no puede castear y terminaba en un 500.
function esFechaValida(valor) {
    if (typeof valor !== 'string' || !REGEX_FECHA.test(valor)) return false;
    const [anio, mes, dia] = valor.split('-').map(Number);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));
    return fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
}

export function obtenerNotificaciones(db) {
    return (req, res) => {
        const { fecha, desde, hasta, pagina, usuario, tipo, motivo, telefono, mensaje, estado, orden, direccion } = req.query;

        const condiciones = [];
        const params = [];

        const columnasOrden = {
            fecha: 'n.fecha_envio',
            usuario: 'u.nombre',
            tipo: 'n.tipo',
            motivo: 'n.motivo',
            telefono: 'n.telefono',
            mensaje: 'n.mensaje',
            estado: 'n.estado',
        };

        // n.id desc desempata los valores repetidos para que la paginación sea estable
        let orderBy = 'order by n.id desc';
        if (orden !== undefined && orden !== '') {
            if (!columnasOrden[orden]) {
                return res.status(400).json({ mensaje: "Campo de orden inválido" });
            }
            const dir = direccion === undefined || direccion === '' ? 'asc' : direccion;
            if (dir !== 'asc' && dir !== 'desc') {
                return res.status(400).json({ mensaje: "Dirección de orden inválida (asc o desc)" });
            }
            orderBy = `order by ${columnasOrden[orden]} ${dir}, n.id desc`;
        }

        if (fecha !== undefined) {
            if (!esFechaValida(fecha)) {
                return res.status(400).json({ mensaje: "Formato de fecha inválido. Use YYYY-MM-DD" });
            }
            if (desde !== undefined || hasta !== undefined) {
                return res.status(400).json({ mensaje: "No se puede combinar 'fecha' con el rango de fechas" });
            }
            condiciones.push('date(n.fecha_envio) = ?');
            params.push(fecha);
        } else {
            if (desde !== undefined && !esFechaValida(desde)) {
                return res.status(400).json({ mensaje: "Formato de 'desde' inválido. Use YYYY-MM-DD" });
            }
            if (hasta !== undefined && !esFechaValida(hasta)) {
                return res.status(400).json({ mensaje: "Formato de 'hasta' inválido. Use YYYY-MM-DD" });
            }
            if (desde !== undefined && hasta !== undefined && desde > hasta) {
                return res.status(400).json({ mensaje: "El rango de fechas está invertido" });
            }
            if (desde !== undefined) {
                condiciones.push('date(n.fecha_envio) >= ?');
                params.push(desde);
            }
            if (hasta !== undefined) {
                condiciones.push('date(n.fecha_envio) <= ?');
                params.push(hasta);
            }
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

        let paginaActual = 1;
        if (pagina !== undefined && pagina !== '') {
            const numero = Number(pagina);
            if (!Number.isInteger(numero) || numero < 1) {
                return res.status(400).json({ mensaje: "Página inválida" });
            }
            paginaActual = numero;
        }

        const from = ' from notificaciones n join usuarios u on u.id = n.id_usuario';
        const where = condiciones.length > 0 ? ' where ' + condiciones.join(' and ') : '';

        db.query(`select count(*) as total${from}${where}`, params, (errTotal, resTotal) => {
            if (errTotal) {
                return res.status(500).json({ mensaje: "Error al obtener notificaciones" });
            }

            const total = Number(resTotal[0]?.total || 0);
            const totalPaginas = Math.max(1, Math.ceil(total / TAMANIO_PAGINA));
            if (paginaActual > totalPaginas) {
                paginaActual = totalPaginas;
            }
            const offset = (paginaActual - 1) * TAMANIO_PAGINA;

            db.query(
                `select n.id, n.tipo, n.motivo, n.telefono, n.mensaje, n.estado, n.fecha_envio, u.nombre as usuario_nombre
                 ${from}${where} ${orderBy} limit ? offset ?`,
                [...params, TAMANIO_PAGINA, offset],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ mensaje: "Error al obtener notificaciones" });
                    }
                    res.json({ notificaciones: result || [], total, pagina: paginaActual });
                }
            );
        });
    };
}
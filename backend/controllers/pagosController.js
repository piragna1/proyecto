//pagosController.js
// Gestión de pagos en mostrador: registra el cobro de un turno (efectivo/transferencia)
// y expone el historial con total recaudado. El pago guarda un snapshot del cliente,
// servicio y horario para conservar el historial aunque el turno luego se elimine.
const METODOS_VALIDOS = ['efectivo', 'transferencia'];

export function registrarPago(db) {
    return (req, res) => {
        const { idTurno, metodo, monto } = req.body;

        if (!idTurno || isNaN(idTurno)) {
            return res.status(400).json({ mensaje: "ID de turno inválido" });
        }

        if (!metodo || !METODOS_VALIDOS.includes(metodo)) {
            return res.status(400).json({ mensaje: "Método de pago inválido (efectivo o transferencia)" });
        }

        db.query(
            `select t.id as id_turno, t.id_usuario, t.fecha_hora_inicio as horario,
                    s.tipo as servicio_tipo, s.precio, u.nombre as nombre_cliente, u.telefono as telefono_cliente
             from turnos t
             join servicios s on s.id = t.id_servicio
             join usuarios u on u.id = t.id_usuario
             where t.id = ?`,
            [idTurno],
            (err, filas) => {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al verificar turno" });
                }

                if (!filas || filas.length === 0) {
                    return res.status(404).json({ mensaje: "Turno no encontrado" });
                }

                db.query('select id from pagos where id_turno = ?', [idTurno], (errPago, pagos) => {
                    if (errPago) {
                        return res.status(500).json({ mensaje: "Error al verificar pago" });
                    }

                    if (pagos && pagos.length > 0) {
                        return res.status(409).json({ mensaje: "El turno ya está pagado" });
                    }

                    const turno = filas[0];
                    const montoFinal = (monto === undefined || monto === null || monto === '')
                        ? Number(turno.precio)
                        : Number(monto);

                    if (isNaN(montoFinal) || montoFinal <= 0) {
                        return res.status(400).json({ mensaje: "Monto inválido" });
                    }

                    db.query(
                        `insert into pagos (id_turno, id_usuario, monto, metodo, nombre_cliente, servicio_tipo, horario_turno, telefono_cliente)
                         values (?,?,?,?,?,?,?,?)`,
                        [idTurno, turno.id_usuario, montoFinal, metodo, turno.nombre_cliente, turno.servicio_tipo, turno.horario, turno.telefono_cliente || null],
                        (errInsert, result) => {
                            if (errInsert) {
                                console.error('Error al registrar pago:', errInsert.message);
                                return res.status(500).json({ mensaje: "Error al registrar pago" });
                            }
                            return res.status(201).json({ id: result.insertId, idTurno, monto: montoFinal, metodo });
                        }
                    );
                });
            }
        );
    };
}

export function obtenerPagos(db) {
    return (req, res) => {
        const { fecha, cliente, telefono, servicio, horario, metodo, montoMin, montoMax } = req.query;

        const condiciones = [];
        const params = [];

        if (fecha !== undefined) {
            if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return res.status(400).json({ mensaje: "Formato de fecha inválido. Use YYYY-MM-DD" });
            }
            condiciones.push('date(fecha_pago) = ?');
            params.push(fecha);
        }

        if (cliente !== undefined && cliente !== '') {
            condiciones.push('nombre_cliente like ?');
            params.push(`%${cliente}%`);
        }

        if (telefono !== undefined && telefono !== '') {
            condiciones.push('telefono_cliente like ?');
            params.push(`%${telefono}%`);
        }

        if (servicio !== undefined && servicio !== '') {
            condiciones.push('servicio_tipo like ?');
            params.push(`%${servicio}%`);
        }

        if (horario !== undefined && horario !== '') {
            condiciones.push('horario_turno like ?');
            params.push(`%${horario}%`);
        }

        if (metodo !== undefined && metodo !== '') {
            if (!METODOS_VALIDOS.includes(metodo)) {
                return res.status(400).json({ mensaje: "Método de pago inválido (efectivo o transferencia)" });
            }
            condiciones.push('metodo = ?');
            params.push(metodo);
        }

        if (montoMin !== undefined && montoMin !== '') {
            const min = Number(montoMin);
            if (isNaN(min)) {
                return res.status(400).json({ mensaje: "Monto mínimo inválido" });
            }
            condiciones.push('monto >= ?');
            params.push(min);
        }

        if (montoMax !== undefined && montoMax !== '') {
            const max = Number(montoMax);
            if (isNaN(max)) {
                return res.status(400).json({ mensaje: "Monto máximo inválido" });
            }
            condiciones.push('monto <= ?');
            params.push(max);
        }

        let query = 'select * from pagos';
        if (condiciones.length > 0) {
            query += ' where ' + condiciones.join(' and ');
        }
        query += ' order by fecha_pago desc';

        db.query(query, params, (err, pagos) => {
            if (err) {
                return res.status(500).json({ mensaje: "Error al obtener pagos" });
            }

            const total = (pagos || []).reduce((acc, p) => acc + Number(p.monto), 0);
            return res.json({ pagos: pagos || [], total });
        });
    };
}
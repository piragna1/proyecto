//notificacionesService.js
// Registro de avisos de turno en la tabla `notificaciones` (sin envío real por WhatsApp).
// El envío por whatsapp-web.js quedó descartado: si el día de la demo se integra
// la API oficial (ej. WhatsApp Cloud API), basta con reemplazar registrar() por el envío.
export function normalizarTelefono(telefono) {
    if (!telefono) return null;
    let num = String(telefono).replace(/\D/g, '');
    const pais = process.env.PAIS_CODE || '54';
    if (num.startsWith(pais)) return num;
    if (num.startsWith('0')) num = num.slice(1);
    num = pais + num;
    return num.length >= 11 && num.length <= 15 ? num : null;
}

export function armarMensaje(tipo, { usuario, servicio, motivo, anterior, actual }) {
    const ubicacion = process.env.UBICACION_NEGOCIO || 'Consultar ubicación';
    const nombre = usuario && usuario.nombre ? usuario.nombre : 'Cliente';
    const servicioTexto = servicio ? `${servicio.tipo} - $${servicio.precio}` : 'Servicio no disponible';
    const lineas = [];

    if (tipo === 'modificacion') {
        lineas.push('TURNO MODIFICADO');
        lineas.push(`Cliente: ${nombre}`);
        lineas.push(`Servicio: ${servicioTexto}`);
        if (anterior) lineas.push(`Horario anterior: ${anterior}`);
        if (actual) lineas.push(`Nuevo horario: ${actual}`);
        if (motivo) lineas.push(`Motivo: ${motivo}`);
    } else if (tipo === 'eliminacion') {
        lineas.push('TURNO CANCELADO');
        lineas.push(`Cliente: ${nombre}`);
        lineas.push(`Servicio: ${servicioTexto}`);
        if (anterior) lineas.push(`Horario: ${anterior}`);
    } else {
        lineas.push('NUEVO TURNO RESERVADO');
        lineas.push(`Cliente: ${nombre}`);
        lineas.push(`Servicio: ${servicioTexto}`);
        if (actual) lineas.push(`Horario: ${actual}`);
    }

    lineas.push(`Dirección: ${ubicacion}`);
    return lineas.join('\n');
}

function registrar(db, { idUsuario, tipo, motivo, telefonoDestino, mensaje, estado }) {
    db.query(
        'insert into notificaciones (id_usuario, tipo, motivo, telefono, mensaje, estado, fecha_envio) values (?,?,?,?,?,?,?)',
        [idUsuario, tipo, motivo || null, telefonoDestino || null, mensaje, estado, null],
        (err) => {
            if (err) console.error('[notificaciones] Error al registrar:', err.message);
        }
    );
}

// Fire-and-forget: registra el aviso (omitida = no se envía, queda documentado el intento)
export function enviarNotificacionTurno(db, datos) {
    const { idUsuario, idServicio, tipo, motivo, anterior, actual } = datos;

    db.query('select nombre, telefono from usuarios where id = ?', [idUsuario], (errUsr, usuarios) => {
        if (errUsr || !usuarios || usuarios.length === 0) {
            console.error('[notificaciones] No se pudo notificar: usuario', idUsuario, errUsr ? errUsr.message : 'no encontrado');
            return;
        }
        const usuario = usuarios[0];

        db.query('select tipo, precio from servicios where id = ?', [idServicio], (errServ, servicios) => {
            const servicio = (!errServ && servicios && servicios.length > 0) ? servicios[0] : null;
            const mensaje = armarMensaje(tipo, { usuario, servicio, motivo, anterior, actual });
            const telefonoDestino = normalizarTelefono(process.env.DEMO_DESTINO || usuario.telefono);

            if (process.env.NOTIFICACIONES_ACTIVO !== 'true') {
                console.log('[notificaciones] Aviso omitido (NOTIFICACIONES_ACTIVO != true):\n' + mensaje);
                return registrar(db, { idUsuario, tipo, motivo, telefonoDestino, mensaje, estado: 'omitida' });
            }

            console.log('[notificaciones] Aviso registrado (sin envío real):\n' + mensaje);
            registrar(db, { idUsuario, tipo, motivo, telefonoDestino, mensaje, estado: 'omitida' });
        });
    });
}
//notificacionesService.js
// Avisos de turno: registra el intento en la tabla `notificaciones` y lo envía por
// WhatsApp a través de un gateway tipo "linked device" (Whapi.Cloud por defecto).
// Sin WHAPI_TOKEN configurado, queda registrado como 'omitida' y la app no se rompe.
const WHAPI_URL = process.env.WHAPI_URL || 'https://gate.whapi.cloud';

function formatearFecha(valor) {
    if (!valor) return null;
    const fecha = new Date(valor);
    if (isNaN(fecha.getTime())) return String(valor);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} ${hora}:${minutos}`;
}

export function normalizarTelefono(telefono) {
    if (!telefono) return null;
    let num = String(telefono).replace(/\D/g, '');
    const pais = process.env.PAIS_CODE || '54';
    if (num.startsWith('0')) num = num.slice(1);
    if (!num.startsWith(pais)) num = pais + num;
    // Argentina: los móviles se registran en WhatsApp como 549 + área + número (incluye el 9).
    // Los fijos no tienen WhatsApp, así que si el número no trae el 9 se asume móvil.
    if (pais === '54' && /^54(?!9)/.test(num)) {
        num = num.slice(0, 2) + '9' + num.slice(2);
    }
    return num.length >= 11 && num.length <= 15 ? num : null;
}

export function armarMensaje(tipo, { servicio, motivo, anterior, actual }) {
    const ubicacion = process.env.UBICACION_NEGOCIO || 'Consultar ubicación';
    const servicioTexto = servicio ? `${servicio.tipo} - $${servicio.precio}` : 'Servicio no disponible';
    const lineas = [];

    if (tipo === 'modificacion') {
        lineas.push('TURNO MODIFICADO');
        lineas.push(`Servicio: ${servicioTexto}`);
        if (anterior) lineas.push(`Fecha anterior: ${formatearFecha(anterior)}`);
        if (actual) lineas.push(`Nueva fecha: ${formatearFecha(actual)}`);
        if (motivo) lineas.push(`Motivo: ${motivo}`);
    } else if (tipo === 'eliminacion') {
        lineas.push('TURNO CANCELADO');
        lineas.push(`Servicio: ${servicioTexto}`);
        if (anterior) lineas.push(`Fecha: ${formatearFecha(anterior)}`);
    } else {
        lineas.push('NUEVO TURNO RESERVADO');
        lineas.push(`Servicio: ${servicioTexto}`);
        if (actual) lineas.push(`Fecha: ${formatearFecha(actual)}`);
    }

    lineas.push(`Dirección: ${ubicacion}`);
    return lineas.join('\n');
}

function registrar(db, { idUsuario, tipo, motivo, telefonoDestino, mensaje, estado, fechaEnvio }) {
    db.query(
        'insert into notificaciones (id_usuario, tipo, motivo, telefono, mensaje, estado, fecha_envio) values (?,?,?,?,?,?,?)',
        [idUsuario, tipo, motivo || null, telefonoDestino || null, mensaje, estado, fechaEnvio || null],
        (err) => {
            if (err) console.error('[notificaciones] Error al registrar:', err.message);
        }
    );
}

function actualizarEstado(db, id, estado, fechaEnvio) {
    db.query(
        'update notificaciones set estado = ?, fecha_envio = ? where id = ?',
        [estado, fechaEnvio || null, id],
        (err) => {
            if (err) console.error('[notificaciones] Error al actualizar estado:', err.message);
        }
    );
}

async function enviarPorWhapi(telefono, mensaje) {
    const controlador = new AbortController();
    const timer = setTimeout(() => controlador.abort(), 15000);
    try {
        const respuesta = await fetch(`${WHAPI_URL}/messages/text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.WHAPI_TOKEN}`,
            },
            body: JSON.stringify({ to: telefono, body: mensaje }),
            signal: controlador.signal,
        });
        clearTimeout(timer);
        const cuerpo = await respuesta.json().catch(() => null);
        if (respuesta.ok) {
            const id = (cuerpo && (cuerpo.id || (cuerpo.messages && cuerpo.messages[0] && cuerpo.messages[0].id))) || null;
            return { ok: true, id };
        }
        const detalle = cuerpo && (cuerpo.error || cuerpo.message) ? `${cuerpo.error || cuerpo.message}` : 'error desconocido';
        return { ok: false, error: `HTTP ${respuesta.status}: ${detalle}` };
    } catch (err) {
        clearTimeout(timer);
        return { ok: false, error: err && err.name === 'AbortError' ? 'timeout (15s)' : (err && err.message) || 'error de red' };
    }
}

// Fire-and-forget: registra el intento (pendiente) y envía por WhatsApp al número del cliente
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
            const telefonoDestino = normalizarTelefono(usuario.telefono);

            if (process.env.NOTIFICACIONES_ACTIVO !== 'true' || !process.env.WHAPI_TOKEN) {
                console.log('[notificaciones] Aviso omitido (sin token o desactivado):\n' + mensaje);
                return registrar(db, { idUsuario, tipo, motivo, telefonoDestino, mensaje, estado: 'omitida', fechaEnvio: new Date() });
            }

            db.query(
                'insert into notificaciones (id_usuario, tipo, motivo, telefono, mensaje, estado, fecha_envio) values (?,?,?,?,?,?,?)',
                [idUsuario, tipo, motivo || null, telefonoDestino || null, mensaje, 'pendiente', new Date()],
                (err, result) => {
                    if (err) {
                        console.error('[notificaciones] Error al registrar:', err.message);
                        return;
                    }
                    const idNotif = result.insertId;
                    console.log(`[notificaciones] Enviando a ${telefonoDestino}...\n${mensaje}`);
                    enviarPorWhapi(telefonoDestino, mensaje).then((res) => {
                        if (res.ok) {
                            console.log(`[notificaciones] Enviado a ${telefonoDestino}${res.id ? ' (id ' + res.id + ')' : ''}`);
                            actualizarEstado(db, idNotif, 'enviado', new Date());
                        } else {
                            console.error(`[notificaciones] Error al enviar a ${telefonoDestino}:`, res.error);
                            actualizarEstado(db, idNotif, 'fallo', new Date());
                        }
                    });
                }
            );
        });
    });
}
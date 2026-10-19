//whatsappService.js
// Dispatcher de envíos de WhatsApp: reparte según WHATSAPP_PROVEEDOR.
//  - 'greenapi': REST de Green API (número vinculado por QR en el panel;
//                cuota de chats por plan) — ver enviarWhatsappGreenApi. Con
//                chequeo previo del vínculo real del dispositivo: si la
//                instancia se desvinculó, el aviso se registra como 'error'
//                y no como una 'enviada' que nunca sale.
//  - 'baileys' : conexión directa sin límites de chats (librería Baileys,
//                sesión local) — ver servicios/baileysService.js.
//  - 'webjs'   : cliente Web oficial automatizado (whatsapp-web.js sobre
//                Puppeteer headless) — ver servicios/webjsService.js.
// En todos los casos el chatId destino se compone con el número normalizado
// (549XXXXXXXXXX) y el envío devuelve el id del mensaje o rechaza con error.
import { enviarWhatsappBaileys, gatewayBaileysConfigurado } from './baileysService.js';
import { enviarWhatsappWebjs, gatewayWebjsConfigurado } from './webjsService.js';

const LIMITE_MS = 8000;
const LIMITE_ESTADO_MS = 5000;

export function enviarWhatsapp(destino, mensaje) {
    const proveedor = process.env.WHATSAPP_PROVEEDOR;
    if (proveedor === 'baileys') {
        return enviarWhatsappBaileys(destino, mensaje);
    }
    if (proveedor === 'webjs') {
        return enviarWhatsappWebjs(destino, mensaje);
    }
    return enviarWhatsappGreenApi(destino, mensaje);
}

export function gatewayConfigurado() {
    const proveedor = process.env.WHATSAPP_PROVEEDOR;
    if (proveedor === 'baileys') {
        return gatewayBaileysConfigurado();
    }
    if (proveedor === 'webjs') {
        return gatewayWebjsConfigurado();
    }
    return greenApiConfigurada();
}

function greenApiConfigurada() {
    return Boolean(
        process.env.GREEN_API_URL &&
        process.env.GREEN_API_ID &&
        process.env.GREEN_API_TOKEN
    );
}

// Estado real del vínculo de la instancia (getStateInstance). Sin este chequeo,
// la API de envío aceptaba el mensaje aunque el dispositivo estuviera
// desvinculado y se registraban 'enviada' que nunca llegaban al destinatario.
// 'desconocido' (falla o timeout del chequeo) no bloquea: se intenta el envío.
function estadoInstanciaGreenApi() {
    const base = String(process.env.GREEN_API_URL).replace(/\/+$/, '');
    const url = `${base}/waInstance${process.env.GREEN_API_ID}/getStateInstance/${process.env.GREEN_API_TOKEN}`;
    return fetch(url, { signal: AbortSignal.timeout(LIMITE_ESTADO_MS) })
        .then((respuesta) => respuesta.json().catch(() => null))
        .then((datos) => (datos && datos.stateInstance) || 'desconocido')
        .catch(() => 'desconocido');
}

function enviarWhatsappGreenApi(destino, mensaje) {
    if (!greenApiConfigurada()) {
        return Promise.reject(new Error('Green API sin configurar (GREEN_API_URL / GREEN_API_ID / GREEN_API_TOKEN)'));
    }
    return estadoInstanciaGreenApi().then((estado) => {
        if (estado !== 'authorized' && estado !== 'desconocido') {
            throw new Error('Instancia de Green API sin vínculo (estado: ' + estado + '). Re-vincular el QR desde la Consola de Green API.');
        }
        const base = String(process.env.GREEN_API_URL).replace(/\/+$/, '');
        const url = `${base}/waInstance${process.env.GREEN_API_ID}/sendMessage/${process.env.GREEN_API_TOKEN}`;
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: `${destino}@c.us`, message: mensaje }),
            signal: AbortSignal.timeout(LIMITE_MS),
        })
            .then((respuesta) => respuesta.json().catch(() => null).then((datos) => ({ respuesta, datos })))
            .then(({ respuesta, datos }) => {
                if (!respuesta.ok || !datos || !datos.idMessage) {
                    const detalle = (datos && (datos.error || datos.message || JSON.stringify(datos))) || `HTTP ${respuesta.status}`;
                    throw new Error(detalle);
                }
                return datos.idMessage;
            });
    });
}

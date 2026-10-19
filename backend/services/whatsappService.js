//whatsappService.js
// Dispatcher de envíos de WhatsApp: reparte según WHATSAPP_PROVEEDOR.
//  - 'greenapi': REST de Green API (número vinculado por QR en el panel;
//                cuota de chats por plan) — ver enviarWhatsappGreenApi.
//  - 'baileys' : conexión directa sin límites de chats (librería Baileys,
//                sesión local) — ver servicios/baileysService.js.
// En ambos casos el chatId destino se compone con el número normalizado
// (549XXXXXXXXXX) y el envío devuelve el id del mensaje o rechaza con error.
import { enviarWhatsappBaileys, gatewayBaileysConfigurado } from './baileysService.js';

const LIMITE_MS = 8000;

export function enviarWhatsapp(destino, mensaje) {
    if (process.env.WHATSAPP_PROVEEDOR === 'baileys') {
        return enviarWhatsappBaileys(destino, mensaje);
    }
    return enviarWhatsappGreenApi(destino, mensaje);
}

export function gatewayConfigurado() {
    if (process.env.WHATSAPP_PROVEEDOR === 'baileys') {
        return gatewayBaileysConfigurado();
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

function enviarWhatsappGreenApi(destino, mensaje) {
    if (!greenApiConfigurada()) {
        return Promise.reject(new Error('Green API sin configurar (GREEN_API_URL / GREEN_API_ID / GREEN_API_TOKEN)'));
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
}

//whatsappService.js
// Envío de WhatsApp vía Green API (gateway del número personal vinculado por QR
// en el panel; plan Developer gratuito). Sin plantillas ni aprobaciones: texto
// libre directo. Sin SDK: fetch nativo con la REST API de sendMessage.
// El chatId destino se compone con el número normalizado (549XXXXXXXXXX) + @c.us.
const LIMITE_MS = 8000;

export function gatewayConfigurado() {
    return Boolean(
        process.env.GREEN_API_URL &&
        process.env.GREEN_API_ID &&
        process.env.GREEN_API_TOKEN
    );
}

export function enviarWhatsapp(destino, mensaje) {
    if (!gatewayConfigurado()) {
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

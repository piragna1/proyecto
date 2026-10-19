//baileysService.js
// Gateway de WhatsApp sin límites de chats: conexión directa al protocolo de
// WhatsApp Web con la librería Baileys (WebSocket, sin navegador). Gratis,
// pero es una API no oficial: mantener el volumen de envíos bajo (riesgo de ban).
// La sesión vinculada se guarda por defecto en %LOCALAPPDATA%\turnera\baileys-sesion
// (disco local, fuera de OneDrive): el handshake de vinculación es sensible al
// tiempo y la sync de la nube lo retrasa (override opcional por BAILEYS_SESION_DIR).
// Se vincula una única vez con el teléfono "sender" (el número del negocio),
// sin cámara: con un código de emparejamiento si WHATSAPP_SENDER_PHONE está
// definido; si no, por QR en la consola.
// El socket se crea en forma lazy (solo si WHATSAPP_PROVEEDOR=baileys) y
// expone enviarWhatsappBaileys con el mismo contrato que Green API.
import makeWASocket, { Browsers, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pino from 'pino';

// Logger silencioso: Baileys emite un ruido JSON enorme por defecto que
// ensuciaba la consola del backend (solo nos interesan los mensajes [baileys]).
const LOG_BAILEYS = pino({ level: 'silent' });

const TIMEOUT_CONEXION_MS = 20000;
const TIMEOUT_ENVIO_MS = 20000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resuelta en cada uso (y no al importar) para respetar el .env: dotenv corre
// después de los imports del módulo.
function dirSesion() {
    return process.env.BAILEYS_SESION_DIR
        || path.join(process.env.LOCALAPPDATA || __dirname, 'turnera', 'baileys-sesion');
}

// Teléfono sender sin caracteres no numéricos (ej: 5492234468141). Si está
// definido y la sesión no está vinculada, se activa el modo código (sin cámara).
function telefonoSender() {
    const soloDigitos = (process.env.WHATSAPP_SENDER_PHONE || '').replace(/\D/g, '');
    return soloDigitos.length >= 8 ? soloDigitos : '';
}

let socket = null;
let socketPromesa = null;
let esperandoConexion = null;
let estadoConexion = 'inactivo';

export function baileysActivo() {
    return process.env.WHATSAPP_PROVEEDOR === 'baileys';
}

function conTimeout(promesa, ms, texto) {
    return Promise.race([
        promesa,
        new Promise((_, rechazar) => setTimeout(() => rechazar(new Error(texto)), ms)),
    ]);
}

function limpiarSesion() {
    try {
        fs.rmSync(dirSesion(), { recursive: true, force: true });
    } catch (error) {
        console.error('[baileys] No se pudo limpiar la sesión:', error.message);
    }
}

function desconectar(mensaje) {
    estadoConexion = 'cerrada';
    if (esperandoConexion) {
        const pendientes = esperandoConexion;
        esperandoConexion = null;
        pendientes.rechazarTodos.forEach((rechazar) => rechazar(new Error(mensaje)));
    }
}

async function construirSocket() {
    const { state, saveCreds } = await useMultiFileAuthState(dirSesion());

    const nuevoSocket = makeWASocket({
        auth: state,
        browser: Browsers.macOS('Desktop'),
        printQRInTerminal: false,
        syncFullHistory: false,
        logger: LOG_BAILEYS,
        level: 'silent',
    });
    socket = nuevoSocket;

    nuevoSocket.ev.on('creds.update', saveCreds);

    // Modo código: sesión sin registrar + teléfono sender configurado.
    const modoCodigo = !state.creds.registered && telefonoSender();

    nuevoSocket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            if (modoCodigo) {
                // En modo código el QR refleja el emparejamiento por código y
                // fallaría al escanearlo: no se imprime. El código se pide
                // abajo, apenas el WebSocket queda activo.
                console.log('[baileys] Modo código de emparejamiento: usá el código que se muestra en la consola (sin cámara).');
            } else {
                // El QR expira cada ~30 segundos: se re-imprime en cada rotación.
                // Conviene escanear el ÚLTIMO que aparece; si expira, se imprime otro.
                console.log('[baileys] Escaneá este QR (vigente por ~30s; el último impreso es el válido):');
                qrcode.generate(qr, { small: true });
            }
        }

        if (connection === 'connecting') {
            estadoConexion = 'conectando';
        }

        if (connection === 'open') {
            estadoConexion = 'conectado';
            console.log('[baileys] Conectado: WhatsApp listo para enviar avisos.');
            if (esperandoConexion) {
                const pendientes = esperandoConexion;
                esperandoConexion = null;
                pendientes.resolverTodos.forEach((resolver) => resolver());
            }
        }

        if (connection === 'close') {
            const codigo = lastDisconnect?.error?.output?.statusCode;
            if (codigo === DisconnectReason.loggedOut) {
                desconectar('[baileys] Sesión revocada en el teléfono: se borró la carpeta de sesión; el próximo arranque pedirá un código/QR nuevo.');
                limpiarSesion();
                socket = null;
                socketPromesa = null;
            } else {
                desconectar('[baileys] Conexión interrumpida (código ' + codigo + '); se reintentará en el próximo envío.');
                socket = null;
                socketPromesa = null;
            }
        }
    });

    // Vinculación por código (sin cámara): se pide 3 segundos después de crear
    // el socket para que el WebSocket ya esté abierto.
    if (modoCodigo) {
        const sender = telefonoSender();
        setTimeout(() => {
            nuevoSocket.requestPairingCode(sender)
                .then((codigo) => {
                    console.log('');
                    console.log('[baileys] ══ VINCULACIÓN POR CÓDIGO (sin cámara) ══');
                    console.log('[baileys] En el teléfono: WhatsApp ▸ Configuración ▸ Dispositivos vinculados ▸');
                    console.log('[baileys] Vincular dispositivo ▸ "Vincular con el número de teléfono" ▸ escribí:');
                    console.log('[baileys]   CÓDIGO: ' + codigo);
                    console.log('');
                })
                .catch((error) => {
                    console.error('[baileys] Código no disponible: ' + error.message);
                    console.error('[baileys] Reintentá reiniciando el backend.');
                });
        }, 3000);
    }

    return nuevoSocket;
}

// Crea el socket una única vez y lo reutiliza; si la conexión cae, el próximo
// envío reconecta desde cero automáticamente (regenerando credenciales si hace falta).
function obtenerSocket() {
    if (!socketPromesa) {
        socketPromesa = construirSocket().catch((error) => {
            socketPromesa = null;
            throw error;
        });
    }
    return socketPromesa;
}

// Devuelve una promesa que se resuelve cuando la conexión está 'open'
// (o inmediatamente si ya está lista). Con timeout para no colgar avisos.
function esperarConexion() {
    if (estadoConexion === 'conectado') {
        return Promise.resolve();
    }
    if (!esperandoConexion) {
        esperandoConexion = { resolverTodos: [], rechazarTodos: [] };
    }
    return new Promise((resolver, rechazar) => {
        esperandoConexion.resolverTodos.push(resolver);
        esperandoConexion.rechazarTodos.push(rechazar);
    });
}

export function gatewayBaileysConfigurado() {
    // El proveedor baileys no necesita claves: el estado real se revela al
    // intentar enviar (sesión revocada / QR pendiente termina en estado 'error'
    // con su motivo en consola).
    return true;
}

export function enviarWhatsappBaileys(destino, mensaje) {
    return obtenerSocket()
        .then((sock) => {
            const chatId = `${destino}@s.whatsapp.net`;
            return conTimeout(
                esperarConexion(),
                TIMEOUT_CONEXION_MS,
                'Baileys sin conexión (¿faltó vincular el dispositivo? verificá la consola del backend)'
            ).then(() => conTimeout(
                sock.sendMessage(chatId, { text: mensaje }),
                TIMEOUT_ENVIO_MS,
                'Baileys: envío agotó el tiempo de espera'
            ));
        })
        .then((resultado) => (resultado && resultado.key && resultado.key.id) || 'enviado');
}

// Conecta al iniciar el backend si el proveedor activo es baileys: así el
// código de emparejamiento (o el QR) aparece en la consola del arranque y no
// recién en el primer aviso. Con greenapi este llamado no hace nada.
export function inicializarBaileys() {
    if (baileysActivo()) {
        console.log('[baileys] Proveedor activo: conectando (código de emparejamiento o QR si la sesión no está vinculada)');
        obtenerSocket().catch((error) => console.error('[baileys] Error al conectar al arrancar:', error.message));
    }
}

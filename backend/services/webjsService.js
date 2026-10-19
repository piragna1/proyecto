//webjsService.js
// Gateway de WhatsApp con el cliente Web oficial automatizado (whatsapp-web.js
// sobre Puppeteer headless). Sin límites de chats: el vínculo es el mismo flujo
// de WhatsApp Web que el teléfono ya conoce (probar con otro cliente Web oficial
// funciona cuando la librería no-oficial Baileys es rechazada). Uso demo con
// volumen bajo. La sesión se guarda por defecto en
// %LOCALAPPDATA%\turnera\whatsapp-web-sesion (disco local, fuera de OneDrive:
// el inicio de sesión es sensible a tiempos), con override por WEBJS_SESION_DIR.
// El cliente se crea en forma lazy (solo si WHATSAPP_PROVEEDOR=webjs) y expone
// enviarWhatsappWebjs con el mismo contrato que Green API/baileys.
import qrcode from 'qrcode-terminal';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TIMEOUT_LISTO_MS = 60000;
const TIMEOUT_ENVIO_MS = 20000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resuelta en cada uso (y no al importar) para respetar el .env: dotenv corre
// después de los imports del módulo.
function dirSesion() {
    return process.env.WEBJS_SESION_DIR
        || path.join(process.env.LOCALAPPDATA || __dirname, 'turnera', 'whatsapp-web-sesion');
}

// Puppeteer descarga su propio Chromium, pero en esta máquina la descarga quedó
// corrupta dos veces (descompresión truncada). Si hay un Chrome o Edge del
// sistema, se usa ese binario en forma headless con perfil aislado (no toca las
// sesiones personales del navegador). Override manual por WEBJS_CHROME_EXE.
function rutaNavegador() {
    if (process.env.WEBJS_CHROME_EXE) {
        return process.env.WEBJS_CHROME_EXE;
    }
    const candidatos = [
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    ];
    const localChrome = process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe');
    if (localChrome) candidatos.push(localChrome);
    return candidatos.find((ruta) => fs.existsSync(ruta)) || undefined;
}

let cliente = null;
let clientePromesa = null;
let esperandoListo = null;
let estadoCliente = 'inactivo';

function conTimeout(promesa, ms, texto) {
    return Promise.race([
        promesa,
        new Promise((_, rechazar) => setTimeout(() => rechazar(new Error(texto)), ms)),
    ]);
}

function desconectar(mensaje) {
    estadoCliente = 'cerrada';
    if (esperandoListo) {
        const pendientes = esperandoListo;
        esperandoListo = null;
        pendientes.rechazarTodos.forEach((rechazar) => rechazar(new Error(mensaje)));
    }
}

// Baileys enseñó la lección: la librería se carga en forma dinámica solo en el
// modo webjs, así que un problema de instalación no rompe los otros proveedores.
async function construirCliente() {
    // whatsapp-web.js es CommonJS: en ESM los named exports llegan en .default.
    const mod = await import('whatsapp-web.js');
    const { Client, LocalAuth } = mod && mod.default ? mod.default : mod;

    const navegador = rutaNavegador();
    if (navegador) {
        console.log('[webjs] Chromium: usando el navegador del sistema (' + navegador + ').');
    } else {
        console.log('[webjs] Chromium: sin Chrome/Edge detectable, Puppeteer usará su Chromium descargado.');
    }

    const nuevo = new Client({
        authStrategy: new LocalAuth({ dataPath: dirSesion() }),
        puppeteer: {
            headless: true,
            executablePath: navegador,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
    });

    nuevo.on('qr', (qr) => {
        // El QR vence en ~20 segundos: se re-imprime en cada rotación; conviene
        // escanear el ÚLTIMO que aparece.
        console.log('[webjs] Vinculá este QR (vence en ~20s; el último impreso es el válido):');
        qrcode.generate(qr, { small: true });
    });

    nuevo.on('authenticated', () => {
        console.log('[webjs] QR aceptado: guardando sesión...');
    });

    nuevo.on('ready', () => {
        estadoCliente = 'conectado';
        console.log('[webjs] Conectado: WhatsApp listo para enviar avisos.');
        if (esperandoListo) {
            const pendientes = esperandoListo;
            esperandoListo = null;
            pendientes.resolverTodos.forEach((resolver) => resolver());
        }
    });

    nuevo.on('auth_failure', (motivo) => {
        console.error('[webjs] No se pudo autenticar:', motivo);
        desconectar('[webjs] Autenticación falló: ' + motivo);
        cliente = null;
        clientePromesa = null;
    });

    nuevo.on('disconnected', (motivo) => {
        desconectar('[webjs] Sesión cerrada (' + motivo + '); se reintenta en el próximo aviso.');
        cliente = null;
        clientePromesa = null;
    });

    nuevo.initialize().catch((error) => {
        console.error('[webjs] Error al inicializar:', error.message);
        desconectar('[webjs] Inicio falló: ' + error.message);
        cliente = null;
        clientePromesa = null;
    });

    return nuevo;
}

// Crea el cliente una única vez y lo reutiliza; si la conexión cae, el próximo
// envío repue desde cero (con QR solo si el teléfono revocó la sesión).
function obtenerCliente() {
    if (!clientePromesa) {
        estadoCliente = 'iniciando';
        clientePromesa = construirCliente().then((nuevo) => {
            cliente = nuevo;
            return nuevo;
        }).catch((error) => {
            clientePromesa = null;
            throw error;
        });
    }
    return clientePromesa;
}

// Devuelve una promesa que se resuelve cuando el cliente está 'ready'
// (o inmediatamente si ya está listo). Con timeout para no colgar avisos.
function esperarListo() {
    if (estadoCliente === 'conectado') {
        return Promise.resolve();
    }
    if (!esperandoListo) {
        esperandoListo = { resolverTodos: [], rechazarTodos: [] };
    }
    return new Promise((resolver, rechazar) => {
        esperandoListo.resolverTodos.push(resolver);
        esperandoListo.rechazarTodos.push(rechazar);
    });
}

export function webjsActivo() {
    return process.env.WHATSAPP_PROVEEDOR === 'webjs';
}

export function gatewayWebjsConfigurado() {
    // No necesita claves de entorno: el estado real se revela al intentar
    // enviar (sin sesión vinculada queda esperando el QR y termina en
    // 'error' por timeout con el motivo en consola).
    return true;
}

export function enviarWhatsappWebjs(destino, mensaje) {
    return obtenerCliente()
        .then(() => conTimeout(
            esperarListo(),
            TIMEOUT_LISTO_MS,
            'webjs sin conexión (¿faltó vincular el QR? verificá la consola del backend)'
        ))
        .then(() => conTimeout(
            cliente.sendMessage(`${destino}@c.us`, mensaje),
            TIMEOUT_ENVIO_MS,
            'webjs: envío agotó el tiempo de espera'
        ))
        .then((respuesta) => {
            const id = respuesta && respuesta.id && respuesta.id._serialized;
            if (!id) {
                // El cooldown anti-spam de WhatsApp absorbe los primeros mensajes de
                // un dispositivo recién vinculado: sendMessage resuelve sin el id
                // serializado y el mensaje nunca sale. Eso se registra 'error' y no
                // 'enviada' (la tabla no miente).
                console.error('[webjs] Respuesta inesperada del envío: ' + JSON.stringify(respuesta));
                throw new Error('El cliente Web no confirmó el envío (¿cooldown anti-spam del dispositivo recién vinculado?)');
            }
            return id;
        });
}

// Inicializa al arrancar el backend si el proveedor activo es webjs: así el QR
// (si falta vincular sesión) aparece en la consola del arranque y no recién
// en el primer aviso. Con otro proveedor este llamado no hace nada.
export function inicializarWebjs() {
    if (webjsActivo()) {
        console.log('[webjs] Proveedor activo: iniciando cliente (QR esperado si la sesión no está vinculada, puede demorar ~10-30s el arranque del Chromium)');
        obtenerCliente().catch((error) => console.error('[webjs] Error al iniciar al arrancar:', error.message));
    }
}

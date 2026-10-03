//usersSeed.js
// Seed de datos de prueba. DESTRUCTIVO: borra y regenera las tablas
// usuarios, servicios, turnos, notificaciones y pagos.
// Uso: node backend/scripts/usersSeed.js
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

const ADMINISTRADORES = [
    { nombre: 'Laura Gomez', email: 'laura.gomez@barberia.local', telefono: '2234490001', clavePlano: 'LauraGomez#26', direccion: 'Juncal 200' },
    { nombre: 'Martin Diaz', email: 'martin.diaz@barberia.local', telefono: '2234490002', clavePlano: 'MartinDiaz#26', direccion: 'Juncal 201' }
];

const PELUQUEROS = [
    { nombre: 'Pepe Mujica', email: 'pepe.mujica@barberia.local', telefono: '2234490003', clavePlano: 'PepeMujica#26', direccion: 'Juncal 100' },
    { nombre: 'Sofia Rios', email: 'sofia.rios@barberia.local', telefono: '2234490004', clavePlano: 'SofiaRios#26', direccion: 'Juncal 101' },
    { nombre: 'Nico Ferreyra', email: 'nico.ferreyra@barberia.local', telefono: '2234490005', clavePlano: 'NicoFerreyra#26', direccion: 'Juncal 102' }
];

const CLIENTES = [
    { nombre: 'Maria Sanchez', email: 'maria.sanchez@correo.com', telefono: '2234468141', clavePlano: 'MariaSanchez#26' },
    { nombre: 'Juan Perez', email: 'juan.perez@correo.com', telefono: '2234468142', clavePlano: 'JuanPerez#26' },
    { nombre: 'Carla Lopez', email: 'carla.lopez@correo.com', telefono: '2234468143', clavePlano: 'CarlaLopez#26' },
    { nombre: 'Diego Martinez', email: 'diego.martinez@correo.com', telefono: '2234468144', clavePlano: 'DiegoMartinez#26' },
    { nombre: 'Ana Gomez', email: 'ana.gomez@correo.com', telefono: '2234468145', clavePlano: 'AnaGomez#26' },
    { nombre: 'Bruno Silva', email: 'bruno.silva@correo.com', telefono: '2234468146', clavePlano: 'BrunoSilva#26' },
    { nombre: 'Lucia Torres', email: 'lucia.torres@correo.com', telefono: '2234468147', clavePlano: 'LuciaTorres#26' },
    { nombre: 'Nadia Suarez', email: 'nadia.suarez@correo.com', telefono: '2234468148', clavePlano: 'NadiaSuarez#26' }
];

// Clientes creados desde mostrador: rol 'cliente' con mostrador = true.
// No tienen clave: se define cuando el cliente se registra (ver usuariosController.js).
// El email sigue el mismo patrón que genera la app (turnosController.js).
const CLIENTES_MOSTRADOR = [
    { nombre: 'Cliente Mostrador Uno', telefono: '2234480001' },
    { nombre: 'Cliente Mostrador Dos', telefono: '2234480002' }
];

const SERVICIOS = [
    { tipo: 'Corte', precio: 29000 },
    { tipo: 'Barba', precio: 20000 },
    { tipo: 'Color', precio: 35000 },
    { tipo: 'Corte + Barba', precio: 45000 },
    { tipo: 'Alisado', precio: 55000 },
    { tipo: 'Lavado', precio: 15000 }
];

// Turnos en días hábiles futuros. La app no permite dos turnos del mismo
// cliente el mismo día, ni dos turnos con el mismo servicio y horario.
const TURNOS = [
    { cliente: 'Maria Sanchez', servicio: 'Corte', dia: 1, hora: '10:00' },
    { cliente: 'Juan Perez', servicio: 'Barba', dia: 1, hora: '11:00' },
    { cliente: 'Carla Lopez', servicio: 'Color', dia: 1, hora: '12:00' },
    { cliente: 'Cliente Mostrador Uno', servicio: 'Corte', dia: 1, hora: '19:00' },
    { cliente: 'Diego Martinez', servicio: 'Corte + Barba', dia: 2, hora: '15:00' },
    { cliente: 'Ana Gomez', servicio: 'Lavado', dia: 2, hora: '16:00' },
    { cliente: 'Bruno Silva', servicio: 'Barba', dia: 2, hora: '17:00' },
    { cliente: 'Maria Sanchez', servicio: 'Color', dia: 3, hora: '09:30' },
    { cliente: 'Juan Perez', servicio: 'Alisado', dia: 3, hora: '14:00' },
    { cliente: 'Lucia Torres', servicio: 'Corte + Barba', dia: 3, hora: '18:00' }
];

// Pagos sobre los turnos ya creados (índice dentro de TURNOS) con los
// métodos válidos del backend (efectivo/transferencia).
const PAGOS = [
    { indiceTurno: 0, metodo: 'efectivo' },
    { indiceTurno: 1, metodo: 'transferencia' },
    { indiceTurno: 4, metodo: 'efectivo' },
    { indiceTurno: 8, metodo: 'transferencia' }
];

function emailMostrador(telefono) {
    return `turno-mostrador.${telefono}@barberia.local`;
}

function formatearFechaSQL(fecha) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Devuelve la fecha del día hábil N contado desde hoy (hoy no se usa).
function fechaHabil(dia) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    let restantes = dia;
    while (restantes > 0) {
        const diaSemana = fecha.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) {
            restantes--;
        }
        if (restantes > 0) {
            fecha.setDate(fecha.getDate() + 1);
        }
    }
    return fecha;
}

async function resetDatabase() {
    await db.query('set foreign_key_checks = 0');
    for (const tabla of ['pagos', 'notificaciones', 'turnos', 'servicios', 'usuarios']) {
        await db.query(`delete from ${tabla}`);
        await db.query(`alter table ${tabla} auto_increment = 1`);
    }
    await db.query('set foreign_key_checks = 1');
    console.log('Base de datos reiniciada');
}

async function crearUsuario({ nombre, email, telefono, clavePlano, rol, superadmin, direccion, mostrador }) {
    // Sin clavePlano (clientes de mostrador) se guarda vacía: se define al registrarse.
    const hash = clavePlano ? await bcrypt.hash(clavePlano, 10) : '';
    const [resultado] = await db.query(
        'insert into usuarios (nombre, email, telefono, clave, rol, superadmin, direccion, mostrador) values (?,?,?,?,?,?,?,?)',
        [nombre, email, telefono, hash, rol, superadmin, direccion || null, mostrador ? 1 : 0]
    );
    console.log(`Usuario creado: ${nombre} (${rol}${mostrador ? ' mostrador' : ''})`);
    return resultado.insertId;
}

async function seedUsuarios() {
    const porNombre = new Map();

    if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
        throw new Error('Faltan SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD en el .env');
    }

    const idSuperadmin = await crearUsuario({
        nombre: 'Super Admin',
        email: process.env.SUPERADMIN_EMAIL,
        telefono: '2230000000',
        clavePlano: process.env.SUPERADMIN_PASSWORD,
        rol: 'administrador',
        superadmin: true,
        direccion: 'Sistema'
    });
    porNombre.set('Super Admin', { id: idSuperadmin, email: process.env.SUPERADMIN_EMAIL, telefono: '2230000000', clave: process.env.SUPERADMIN_PASSWORD });

    for (const a of ADMINISTRADORES) {
        const id = await crearUsuario({ ...a, rol: 'administrador', superadmin: false, mostrador: false });
        porNombre.set(a.nombre, { id, email: a.email, telefono: a.telefono, clave: a.clavePlano });
    }

    for (const p of PELUQUEROS) {
        const id = await crearUsuario({ ...p, rol: 'peluquero', superadmin: false, mostrador: false });
        porNombre.set(p.nombre, { id, email: p.email, telefono: p.telefono, clave: p.clavePlano });
    }

    for (const c of CLIENTES) {
        const id = await crearUsuario({ ...c, rol: 'cliente', superadmin: false, mostrador: false });
        porNombre.set(c.nombre, { id, email: c.email, telefono: c.telefono, clave: c.clavePlano });
    }

    for (const c of CLIENTES_MOSTRADOR) {
        const email = emailMostrador(c.telefono);
        const id = await crearUsuario({ ...c, email, rol: 'cliente', superadmin: false, mostrador: true });
        porNombre.set(c.nombre, { id, email, telefono: c.telefono, clave: 'sin clave (se define al registrarse)' });
    }

    return porNombre;
}

async function seedServicios() {
    const porTipo = new Map();

    for (const s of SERVICIOS) {
        const [resultado] = await db.query(
            'insert into servicios (tipo, precio) values (?,?)',
            [s.tipo, s.precio]
        );
        porTipo.set(s.tipo, { id: resultado.insertId, precio: s.precio });
        console.log(`Servicio creado: ${s.tipo} ($${s.precio})`);
    }

    return porTipo;
}

async function seedTurnos(usuarios, servicios) {
    const turnos = [];

    for (const t of TURNOS) {
        const usuario = usuarios.get(t.cliente);
        const servicio = servicios.get(t.servicio);

        if (!usuario || !servicio) {
            console.log(`Sin datos para el turno de: ${t.cliente}`);
            turnos.push(null);
            continue;
        }

        const [hh, mm] = t.hora.split(':').map(Number);
        const inicio = fechaHabil(t.dia);
        inicio.setHours(hh, mm, 0, 0);
        const horario = formatearFechaSQL(inicio);

        const [resultado] = await db.query(
            'insert into turnos (id_usuario, id_servicio, fecha_hora_inicio) values (?,?,?)',
            [usuario.id, servicio.id, horario]
        );

        console.log(`Turno creado: ${t.cliente} -> ${t.servicio} ${horario}`);
        turnos.push({
            idTurno: resultado.insertId,
            idUsuario: usuario.id,
            cliente: t.cliente,
            telefono: usuario.telefono,
            servicio: t.servicio,
            precio: servicio.precio,
            horario
        });
    }

    return turnos;
}

async function seedPagos(turnos) {
    for (const p of PAGOS) {
        const turno = turnos[p.indiceTurno];

        if (!turno) {
            console.log(`No se pudo generar el pago en la posición ${p.indiceTurno}`);
            continue;
        }

        await db.query(
            'insert into pagos (id_turno, id_usuario, monto, metodo, nombre_cliente, servicio_tipo, horario_turno, telefono_cliente) values (?,?,?,?,?,?,?,?)',
            [turno.idTurno, turno.idUsuario, Number(turno.precio), p.metodo, turno.cliente, turno.servicio, turno.horario, turno.telefono]
        );

        console.log(`Pago registrado: ${turno.cliente} (${p.metodo}) - $${Number(turno.precio)}`);
    }
}

async function resumen(usuarios, turnos) {
    const [[{ total }]] = await db.query('select count(*) as total from usuarios');
    console.log('\n===== Resumen del seed =====');
    console.log(`Usuarios: ${total} (1 superadmin, ${ADMINISTRADORES.length} administradores, ${PELUQUEROS.length} peluqueros, ${CLIENTES.length} clientes, ${CLIENTES_MOSTRADOR.length} clientes de mostrador)`);
    console.log(`Servicios: ${SERVICIOS.length}`);
    console.log(`Turnos: ${turnos.filter((t) => t !== null).length}`);
    console.log(`Pagos: ${PAGOS.length}`);
    console.log('\nCredenciales de prueba:');
    console.log(`  Super admin: ${process.env.SUPERADMIN_EMAIL} / ${process.env.SUPERADMIN_PASSWORD}`);
    for (const nombre of usuarios.keys()) {
        if (nombre === 'Super Admin') continue;
        const u = usuarios.get(nombre);
        console.log(`  ${nombre} (${u.email}) / ${u.clave}`);
    }
}

async function seed() {
    try {
        await resetDatabase();
        const usuarios = await seedUsuarios();
        const servicios = await seedServicios();
        const turnos = await seedTurnos(usuarios, servicios);
        await seedPagos(turnos);
        await resumen(usuarios, turnos);
        console.log('\nSeed completado');
    } catch (error) {
        const detalle = error.message || error.code || 'error desconocido';
        console.log('Error en el seed:', detalle);
    } finally {
        await db.end();
    }
}

seed();
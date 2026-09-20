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

const CLIENTES = [
    { nombre: 'Maria Sanchez', telefono: '2234468141', clavePlano: 'msanchez123' },
    { nombre: 'Juan Perez', telefono: '2234468143', clavePlano: 'juanperez123' },
    { nombre: 'Carla Lopez', telefono: '2234468144', clavePlano: 'carlalopez123' },
    { nombre: 'Diego Martinez', telefono: '2234468145', clavePlano: 'diegomartinez123' },
    { nombre: 'Ana Gomez', telefono: '2234468146', clavePlano: 'anagomez123' }
];

const PELUQUEROS = [
    { nombre: 'Pepe Mujica', telefono: '2234468142', clavePlano: 'pmujica123', direccion: 'Juncal 100' }
];

const SERVICIOS = [
    { tipo: 'Corte', precio: 29000 },
    { tipo: 'Barba', precio: 20000 },
    { tipo: 'Color', precio: 35000 }
];

const TURNOS_POR_CLIENTE = ['Maria Sanchez', 'Juan Perez', 'Carla Lopez', 'Diego Martinez', 'Ana Gomez'];
const SERVICIO_POR_TURNO = ['Corte', 'Barba', 'Color', 'Corte', 'Barba'];
const HORAS_INICIO = ['10:00', '11:00', '12:00', '15:00', '10:30'];

const PAGOS = [
    { cliente: 'Maria Sanchez', metodo: 'efectivo' },
    { cliente: 'Juan Perez', metodo: 'transferencia' }
];

const telefonoPorCliente = new Map(CLIENTES.map((c) => [c.nombre, c.telefono]));

function emailGmail(nombre) {
    const partes = nombre.trim().toLowerCase().split(/\s+/);
    return partes[0][0] + partes.slice(1).join('') + '@gmail.com';
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

function proximosDiasHabiles(cantidad) {
    const fechas = [];
    const dia = new Date();
    dia.setDate(dia.getDate() + 1);
    while (fechas.length < cantidad) {
        const diaSemana = dia.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) {
            fechas.push(new Date(dia));
        }
        dia.setDate(dia.getDate() + 1);
    }
    return fechas;
}

async function seedUsuarios() {
    const creados = [];
    const mapEmail = new Map();

    const todos = [
        {
            nombre: 'Super Admin',
            email: process.env.SUPERADMIN_EMAIL,
            telefono: '2230000000',
            clavePlano: process.env.SUPERADMIN_PASSWORD,
            rol: 'administrador',
            superadmin: true,
            direccion: 'Sistema'
        },
        ...CLIENTES.map((c) => ({
            nombre: c.nombre,
            email: emailGmail(c.nombre),
            telefono: c.telefono,
            clavePlano: c.clavePlano,
            rol: 'cliente',
            superadmin: false,
            direccion: null
        })),
        ...PELUQUEROS.map((p) => ({
            nombre: p.nombre,
            email: emailGmail(p.nombre),
            telefono: p.telefono,
            clavePlano: p.clavePlano,
            rol: 'peluquero',
            superadmin: false,
            direccion: p.direccion
        }))
    ];

    for (const u of todos) {
        if (!u.email || !u.clavePlano) {
            creados.push('Faltan credenciales del superadmin en el .env (SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD)');
            continue;
        }

        const [existentes] = await db.query(
            'select id from usuarios where email = ? or telefono = ?',
            [u.email, u.telefono]
        );

        if (existentes.length > 0) {
            mapEmail.set(u.email, existentes[0].id);
            creados.push(`Ya existe: ${u.nombre} (${u.email})`);
            continue;
        }

        const hash = await bcrypt.hash(u.clavePlano, 10);
        const [resultado] = await db.query(
            'insert into usuarios (nombre, email, telefono, clave, rol, superadmin, direccion) values (?,?,?,?,?,?,?)',
            [u.nombre, u.email, u.telefono, hash, u.rol, u.superadmin, u.direccion]
        );

        mapEmail.set(u.email, resultado.insertId);
        creados.push(`Usuario creado: ${u.nombre} (${u.rol})`);
    }

    creados.forEach((m) => console.log(m));
    return mapEmail;
}

async function seedServicios() {
    const mapTipo = new Map();

    for (const s of SERVICIOS) {
        const [existentes] = await db.query('select id, precio from servicios where tipo = ?', [s.tipo]);

        if (existentes.length > 0) {
            mapTipo.set(s.tipo, { id: existentes[0].id, precio: Number(existentes[0].precio) });
            console.log(`Ya existe servicio: ${s.tipo}`);
            continue;
        }

        const [resultado] = await db.query(
            'insert into servicios (tipo, precio) values (?,?)',
            [s.tipo, s.precio]
        );

        mapTipo.set(s.tipo, { id: resultado.insertId, precio: s.precio });
        console.log(`Servicio creado: ${s.tipo} ($${s.precio})`);
    }

    return mapTipo;
}

async function seedTurnos(usuarios, servicios) {
    const turnos = [];
    const fechas = proximosDiasHabiles(TURNOS_POR_CLIENTE.length);

    for (let i = 0; i < TURNOS_POR_CLIENTE.length; i++) {
        const clienteNombre = TURNOS_POR_CLIENTE[i];
        const email = emailGmail(clienteNombre);
        const idUsuario = usuarios.get(email);
        const infoServ = servicios.get(SERVICIO_POR_TURNO[i]);

        if (!idUsuario || !infoServ) {
            console.log(`Sin datos para el turno de: ${clienteNombre}`);
            continue;
        }

        const [existentes] = await db.query('select id from turnos where id_usuario = ?', [idUsuario]);
        if (existentes.length > 0) {
            console.log(`Ya existe turno para: ${clienteNombre}`);
            continue;
        }

        const [hh, mm] = HORAS_INICIO[i].split(':').map(Number);
        const inicio = new Date(fechas[i]);
        inicio.setHours(hh, mm, 0, 0);

        const [resultado] = await db.query(
            'insert into turnos (id_usuario, id_servicio, fecha_hora_inicio) values (?,?,?)',
            [idUsuario, infoServ.id, formatearFechaSQL(inicio)]
        );

        console.log(`Turno creado: ${clienteNombre} -> ${SERVICIO_POR_TURNO[i]} ${formatearFechaSQL(inicio)}`);

        turnos.push({
            idTurno: resultado.insertId,
            idUsuario,
            clienteNombre,
            email,
            telefonoCliente: telefonoPorCliente.get(clienteNombre),
            servicioTipo: SERVICIO_POR_TURNO[i],
            precio: infoServ.precio,
            horario: formatearFechaSQL(inicio)
        });
    }

    return turnos;
}

async function seedPagos(usuarios) {
    for (const p of PAGOS) {
        const email = emailGmail(p.cliente);
        const idUsuario = usuarios.get(email);
        if (!idUsuario) {
            console.log(`Sin usuario para pagar de: ${p.cliente}`);
            continue;
        }

        const [turnos] = await db.query(
            `select t.id as id_turno, t.id_usuario, t.fecha_hora_inicio as horario,
                    s.tipo as servicio_tipo, s.precio, u.nombre as nombre_cliente, u.telefono as telefono_cliente
             from turnos t
             join servicios s on s.id = t.id_servicio
             join usuarios u on u.id = t.id_usuario
             where t.id_usuario = ?
             order by t.fecha_hora_inicio desc
             limit 1`,
            [idUsuario]
        );

        if (turnos.length === 0) {
            console.log(`Sin turno para pagar de: ${p.cliente}`);
            continue;
        }

        const turno = turnos[0];
        const [existentes] = await db.query('select id from pagos where id_turno = ?', [turno.id_turno]);
        if (existentes.length > 0) {
            console.log(`Ya está pagado: ${p.cliente} (${p.metodo})`);
            continue;
        }

        await db.query(
            'insert into pagos (id_turno, id_usuario, monto, metodo, nombre_cliente, servicio_tipo, horario_turno, telefono_cliente) values (?,?,?,?,?,?,?,?)',
            [turno.id_turno, turno.id_usuario, Number(turno.precio), p.metodo, turno.nombre_cliente, turno.servicio_tipo, turno.horario, turno.telefono_cliente || null]
        );

        console.log(`Pago registrado: ${p.cliente} (${p.metodo}) - $${Number(turno.precio)}`);
    }
}

async function seed() {
    try {
        const usuarios = await seedUsuarios();
        const servicios = await seedServicios();
        const turnos = await seedTurnos(usuarios, servicios);
        await seedPagos(usuarios);
    } catch (error) {
        console.log('Error en el seed:', error.message);
    } finally {
        await db.end();
    }
}

seed();
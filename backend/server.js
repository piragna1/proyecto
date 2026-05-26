import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'turnera'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MYSQL');
});



app.post("/login", (req, res) => {
    const { email, clave } = req.body;
    db.query("select * from usuarios where email = ? and clave = ?", [email, clave],
        (err, result) => {
            if (err) res.status(500).send(err);
            if (result.length === 0) {
                return res.status(401).json({ mensaje: "Credenciales invalidas" });
            }
            res.json({ mensaje: "Login exitoso", usuario: result[0] });
        }
    )
});

app.post('/usuarios', (req, res) => {
    const { nombre, email, telefono, clave, rol, superadmin } = req.body;
    db.query('insert into usuarios (nombre,email,telefono,clave,rol,superadmin) values (?,?,?,?,?,?) ',
        [nombre, email, telefono, clave, rol, superadmin], (err, result) => {
            if (err) return res.json(err);
            res.json(result);
        });
})

app.get("/usuarios", (req, res) => {
    db.query("SELECT * FROM usuarios", (err, result) => {
        if (err) res.status(500).send(err);
        else res.json(result);
    })
});


app.post("/servicios", (req, res) => {
    const { tipo, duracionMinutos, precio } = req.body;
    db.query("insert into servicios (tipo, duracion_minutos, precio) values (?,?,?)", [tipo, duracionMinutos, precio],
        (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        }
    )
})

app.get("/servicios", (req, res) => {
    db.query("select * from servicios", (err, result) => {
        if (err) res.status(500).send(err);
        else res.json(result);
    })
})

app.post("/turnos", (req, res) => {
    const turno = req.body;
    // console.log('turno');
    // console.log(turno);
    // return;

    db.query("insert into turnos (id_usuario, id_servicio, fecha_hora_inicio, fecha_hora_fin) values (?,?,?,?)",
        [turno.usuario.id, turno.servicio.id, turno.fechaHoraInicio, turno.fechaHoraFin],
        (err, result) => {
            if (err) return res.json(err);
            return res.json(result);
        }
    )
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");

});
//server.js
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import loginRoutes from './routes/login.js'
import serviciosRoutes from './routes/servicios.js'
import turnosRoutes from './routes/turnos.js'
import usuariosRoutes from './routes/usuarios.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use('/login', loginRoutes(db));
app.use('/servicios', serviciosRoutes(db));
app.use('/turnos', turnosRoutes(db));
app.use('/usuarios', usuariosRoutes(db));



app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");

});
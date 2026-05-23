import express from 'epxress';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'turnera_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MYSQL');
});


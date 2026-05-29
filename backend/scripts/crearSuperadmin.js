import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function crearSuperadmin() {

    const nombre = 'Super Admin';
    const email = process.env.SUPERADMIN_EMAIL;
    const telefono = '2230000000';
    const clavePlano = process.env.SUPERADMIN_PASSWORD;
    const rol = 'administrador';
    const superadmin = true;
    const direccion = 'Sistema';

    try {

        const hash = await bcrypt.hash(clavePlano, 10);

        db.query(
            `select * from usuarios where superadmin = 1`,
            async (err, result) => {

                if (err) {
                    console.log(err);
                    db.end();
                    return;
                }

                if (result.length > 0) {
                    console.log('Ya existe un superadmin');
                    db.end();
                    return;
                }

                db.query(
                    `insert into usuarios
            (nombre,email,telefono,clave,rol,superadmin,direccion)
            values (?,?,?,?,?,?,?)`,
                    [
                        nombre,
                        email,
                        telefono,
                        hash,
                        rol,
                        superadmin,
                        direccion
                    ],
                    (err, result) => {

                        if (err) {
                            console.log(err);
                            db.end();
                            return;
                        }

                        console.log('Superadmin creado');

                        db.end();
                    }
                );
            }
        );

    } catch (error) {
        console.log(error);
    }
}

crearSuperadmin();
import {json} from 'express';
import mysql from 'mysql2/promise';

function conectarBanco() {
    const conn = mysql.createPool({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database:process.env.DB_NAME
    });
    return conn;
}
export default conectarBanco;
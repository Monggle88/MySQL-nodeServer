import mysql from 'mysql2';

export const pool = mysql.createPool({
    host: 'express-database.c1uetpaeeywr.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    database: 'MySQL_nodeServer',
    password: 'admin1234',
});

//Data Access
require('dotenv').config();

const { Client, Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.PGDATABASE,
    password: process.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false
    }
})

// const client = new Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.PGDATABASE,
//     password: process.PGPASSWORD,
//     port: process.env.PGPORT,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })


module.exports = pool;
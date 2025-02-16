const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'je2v!he6',
    server: 'localhost',
    database: 'VendingMachineDB',
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true // Trust the self-signed certificate
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
    sql, poolPromise
};
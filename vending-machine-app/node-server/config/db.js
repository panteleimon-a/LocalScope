const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'je2v!he6',
    server: 'localhost',
    database: 'VendingMachineDB',
    options: {
        encrypt: true,
        trustServerCertificate: true // Only for development/testing with self-signed certs!
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Immediately connect to the pool and handle errors:
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
        console.log('Connected to SQL Server');
        return pool; // Return the pool so it can be used elsewhere
    })
  .catch(err => {
        console.error('Database Connection Failed! Bad Config or Server Down:', err);
        // CRITICAL: Handle the error appropriately. Here are some options:
        // 1. Exit the process (if the connection is essential for the app):
        process.exit(1); // Or process.kill(process.pid) to be more forceful

        // 2. Throw the error to be handled by the calling module:
        // throw err;

        // 3. Set a flag or use a callback to indicate the error:
        // connectionError = true;  // And check this flag before any db operations.
        // if (typeof connectionCallback === 'function') connectionCallback(err);
    });

module.exports = {
    sql,
    poolPromise // Export the Promise, not the pool directly
};
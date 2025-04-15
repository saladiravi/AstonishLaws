const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // Adjust if connecting to a remote server
    database: 'AstonishLaws',
    password: 'admin',
    port: 5432,  
});
pool.query('SET TIMEZONE = \'Asia/Kolkata\';')
  .then(() => console.log('Timezone set to Asia/Kolkata'))
  .catch((err) => console.error('Error setting timezone', err));

module.exports=pool
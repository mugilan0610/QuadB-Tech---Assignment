const {client} = require('../config/config.js')
const createTable = ()=>{client.query(`
  CREATE TABLE IF NOT EXISTS wazirx (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    last VARCHAR(50),
    buy VARCHAR(50),
    sell VARCHAR(50),
    volume VARCHAR(50),
    base_unit VARCHAR(10)
  )
`, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully');
  }
});
}


module.exports = createTable
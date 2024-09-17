const express = require("express");
const cors = require("cors");
const datarouter = require("./route/route.js");
const createTable = require("./model/data.js");
const {client} = require("./config/config.js");
const fs = require("fs");
const pg = require("pg");

const app = express();

app.use(express.json());
app.use(cors());





client.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
    
    // Create the table after successful connection
    createTable(client);

    // Additional logic that relies on the connection can go here
  }
});

// Use the router after the connection is established
app.use("/api/wazirx", datarouter);

app.listen(5000, () => console.log(`Server running on PORT 5000...`));

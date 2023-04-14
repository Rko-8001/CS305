const express = require('express');

const cors = require('cors');

require('dotenv').config();


const app = express();



app.use(cors());

app.use(express.json());

app.listen(process.env.NODE_PORT, () =>{

    console.log(`Server is running on port: ${process.env.NODE_PORT}`);

});
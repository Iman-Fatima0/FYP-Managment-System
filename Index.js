const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db = require('./db');
const bodyParser = require('body-parser');

dotenv.config();  

app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use('/user', userRoutes);
app.use('/project', projectRoutes);

const port = 3000;
app.listen(port, () => console.log('Server is running on port ' + port));

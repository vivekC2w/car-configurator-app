const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Route files
const models = require('./routes/modelRoutes');
const variants = require('./routes/variantRoutes');
const colors = require('./routes/colorRoutes');
const accessories = require('./routes/accessoryRoutes');
const features = require('./routes/featureRoutes');
const categories = require('./routes/categoryRoutes');
// const configurations = require('./routes/configurationRoutes');

//env variables
dotenv.config({ path: './.env' });

//Connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

app.use(cors());

//routes
app.use('/api/models', models);
app.use('/api/variants', variants);
app.use('/api/colors', colors);
app.use('/api/accessories', accessories);
app.use('/api/features', features);
app.use('/api/categories', categories);
// app.use('/api/configurations', configurations);

module.exports = app;
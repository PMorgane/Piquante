//importer express
const express = require('express');

const mongoose = require('mongoose');
const path = require("path");

require('dotenv').config();
const helmet = require('helmet');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');
const rateLimit = require("./middleware/rateLimit");


//appeller la methode express pour la creer
const app = express();
//connection API au cluster mongoDb
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log(err, 'Connexion à MongoDB échouée !'));


app.use(express.json());
app.use(rateLimit);
app.use(helmet({crossOriginResourcePolicy: false,}));

//HEADER permettant à chaque utilisateur d'utilisé l'api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, '/images')));

//exporter express depuis les autres fichiers du projet notament le server node
module.exports = app;

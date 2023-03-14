//import express
const express = require('express');
// import module mongoose
const mongoose = require('mongoose');

/*  La méthode configure automatiquement les variables d'environnement 
enregistrées dans le fichier .env et les rend disponibles pour l'application.  */
require('dotenv').config();

// récupération de la route user
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

//initialise une application Express.
const app = express();

/*------------------------MONGODB-----------------------------*/
mongoose.set('strictQuery', true);
// liaison avec la BDD
mongoose
  .connect(process.env.DB_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// parse des données envoyées dans les requêtes HTTP au format JSON
app.use(express.json());
// Définition d"un dossier statique pour stocker les images
app.use('/images', express.static('images'));

//CORS
app.use((req, res, next) => {
  // accés à notre API de n'importe quelle origines
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  //  envoyer des requêtes avec les méthodes mentionnées
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Middleware pour logger les requêtes et pointer les routes

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

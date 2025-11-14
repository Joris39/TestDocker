const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuration CORS pour Docker
const corsOptions = {
  origin: [
    'http://localhost:3000',    // React en dev local
    'http://localhost:3002',    // React via Docker
    'http://127.0.0.1:3000',   // Variante localhost
    'http://127.0.0.1:3002',   // Variante localhost Docker
    /^http:\/\/172\.\d+\.\d+\.\d+:3000$/, // Réseaux Docker dynamiques
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Route de base pour tester
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de gestion de tâches fonctionne !',
        cors: 'CORS configuré pour Docker'
    });
});

// Démarrage du serveur avec synchronisation de la base de données
const startServer = async () => {
    const maxRetries = 10;
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            // Tester la connexion à la base de données
            await sequelize.authenticate();
            console.log('Connexion à la base de données établie avec succès.');

            // Synchroniser les modèles avec la base de données
            await sequelize.sync({ alter: true });
            console.log('Modèles synchronisés avec la base de données.');

            // Démarrer le serveur
            app.listen(port, () => {
                console.log(`Serveur démarré sur http://localhost:${port}`);
            });
            
            break; // Sortir de la boucle si tout fonctionne
            
        } catch (error) {
            retries++;
            console.log(`Tentative de connexion ${retries}/${maxRetries} échouée. Nouvelle tentative dans 5 secondes...`);
            
            if (retries >= maxRetries) {
                console.error('Erreur lors du démarrage du serveur après', maxRetries, 'tentatives:', error);
                process.exit(1);
            }
            
            // Attendre 5 secondes avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

startServer();
# Task Management App

## Description
Cette application web de gestion de tâches permet aux utilisateurs de créer, lire, mettre à jour et supprimer des tâches. Elle est construite avec un serveur Node.js pour gérer les requêtes API, une base de données MySQL pour stocker les données, et un client React pour l'interface utilisateur.

## Technologies utilisées
- Node.js
- Express
- MySQL
- React
- Docker
- Docker Compose

## Structure du projet
```
task-management-app
├── backend          # Serveur Node.js
│   ├── src         # Code source du serveur
│   ├── package.json # Dépendances du serveur
│   └── Dockerfile   # Configuration de l'image Docker du serveur
├── frontend         # Client React
│   ├── src         # Code source du client
│   ├── package.json # Dépendances du client
│   └── Dockerfile   # Configuration de l'image Docker du client
├── database         # Scripts de base de données
│   └── init.sql    # Initialisation de la base de données
├── docker-compose.yml # Orchestration des conteneurs
└── README.md       # Documentation du projet
```

## Installation

1. Clonez le dépôt :
   ```
   git clone <URL_DU_DEPOT>
   cd task-management-app
   ```

2. Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.

3. Construisez et démarrez les conteneurs :
   ```
   docker-compose up --build
   ```

## Utilisation
- Accédez à l'application via `http://localhost:3000` pour le client.
- L'API est disponible à `http://localhost:5000/api`.

## Contribuer
Les contributions sont les bienvenues ! Veuillez soumettre une demande de tirage pour toute amélioration ou correction.

## License
Ce projet est sous licence MIT.
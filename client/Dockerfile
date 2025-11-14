FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances et régénérer le lock file
RUN npm install --only=production

# Copier le code source
COPY public/ ./public/
COPY src/ ./src/

# Exposer le port 3000
EXPOSE 3000

# Variables d'environnement pour React
ENV REACT_APP_SERVER_URL=http://localhost:3001

# Démarrer l'application
CMD ["npm", "start"]
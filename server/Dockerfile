FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le code source
COPY src/ ./src/

# Exposer le port 3001
EXPOSE 3001

# Variables d'environnement par défaut
ENV PORT=3001
ENV NODE_ENV=production

# Démarrer l'application
CMD ["npm", "start"]
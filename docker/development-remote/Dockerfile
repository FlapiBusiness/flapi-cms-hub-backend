# First Stage: Build the App
FROM node:22.11.0 AS builder

WORKDIR /app

COPY package*.json .

# Install dependencies
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Second Stage: Setup the runtime
FROM node:22.11.0 AS runtime

WORKDIR /app

# Copy the build from the previous stage
COPY --from=builder /app/build /app

# ARG pour sélectionner l'env (default: development-remote)
ARG FLAPI_ENV=development-remote
ENV FLAPI_ENV=${FLAPI_ENV}

# Copie les fichiers .env et .env.keys complet
COPY --from=builder /app/.env.${FLAPI_ENV} /app/.env
COPY --from=builder /app/.env.keys /app/.env.keys.full

# Extrait dynamiquement la bonne clé et crée un fichier .env.keys propre
RUN FLAPI_ENV_UPPER=$(echo "$FLAPI_ENV" | tr '[:lower:]' '[:upper:]') && \
    grep "CRYPT_PRIVATE_KEY_${FLAPI_ENV_UPPER}=" /app/.env.keys.full | \
    sed "s/CRYPT_PRIVATE_KEY_${FLAPI_ENV_UPPER}/CRYPT_PRIVATE_KEY/" > /app/.env.keys && \
    rm /app/.env.keys.full

# Install production dependencies only
RUN npm ci --omit="dev" --ignore-scripts

# Run migrations, seed the database and start the application
CMD npm run db:migration:staging-prod && \
    npm run db:seed && \
    npm run start:development-remote
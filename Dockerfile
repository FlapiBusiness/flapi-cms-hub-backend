# Set version for latest LTS version of Node.js
FROM node:22.11.0

WORKDIR /app

COPY package*.json .

RUN npm install -g npm@latest && npm install

COPY . .

ENV CHOKIDAR_USEPOLLING=true

# Run migrations, seed data, and start the app
CMD npm run db:migration:develop && \
    npm run db:seed && \
    npm run dev
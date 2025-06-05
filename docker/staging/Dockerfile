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
COPY --from=builder /app/.env.staging /app
COPY --from=builder /app/.env.keys /app

# Install production dependencies only
RUN npm ci --omit="dev" --ignore-scripts

# Run migrations, seed the database and start the application
CMD npm run db:migration:staging-prod && \
    npm run db:seed && \
    npm run start:staging

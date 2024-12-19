# First Stage: Build the App
FROM node:22.11.0 AS builder

WORKDIR /app

COPY package*.json .

# Install dependencies npm
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Second Stage: Setup the runtime
FROM node:22.11.0 AS runtime

WORKDIR /app

COPY --from=builder /app/build /app

COPY package*.json .

# Install production dependencies only
RUN npm ci --omit="dev" --ignore-scripts

ENV NODE_ENV=production
ENV TZ=UTC
ENV PORT=3333
ENV HOST=0.0.0.0
ENV LOG_LEVEL=error
ENV APP_KEY=2xbvu-EZ5g8viOREwy-MLmijeQEklsCB
ENV DB_HOST=109.234.165.225
ENV DB_PORT=3306
ENV DB_USER=reco5282_epi-trip
ENV DB_PASSWORD=Corentin35000
ENV DB_DATABASE=reco5282_epi-trip
ENV GOOGLE_PROJECT_ID=epiroadtrip-417614
ENV GOOGLE_PLACES_API_URL=https://places.googleapis.com/v1/places:searchText
ENV GOOGLE_ROUTES_API_URL=https://routes.googleapis.com/directions/v2:computeRoutes
ENV MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZmxvcmlhbnJvdXNzZWF1IiwiYSI6ImNsdHg0bGpjYzAzNnEyaXMxcDlvbnNzZHQifQ.N9vFw7kJyrfJuFgHF3tp0Q
ENV GOOGLE_API_KEY=AIzaSyDTGrYdZbd_aLzn_b3MoubdmmS_5tnw3aA

CMD npm run db:migration:run:staging-prod && \
    npm run db:seed && \
    npm run start
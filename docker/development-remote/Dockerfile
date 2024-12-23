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

COPY --from=builder /app/build /app
COPY package*.json .

# Define build arguments for secrets
ARG DB_USER
ARG DB_PASSWORD
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG O2SWITCH_API_TOKEN
ARG O2SWITCH_DATABASE_USERNAME
ARG O2SWITCH_DATABASE_PASSWORD
ARG GITHUB_PERSONAL_ACCESS_TOKEN
ARG MAILJET_API_SECRET_KEY
ARG MAILJET_API_KEY

# Set environment variables
ENV FRONTEND_APP_BASE_URL="https://dev.hub.flapi.org" \
    FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE="/account-validate?email=" \
    FRONTEND_APP_REDIRECT_URI_FORGOT_PASSWORD="/reset-password?resetPasswordToken=" \
    FRONTEND_APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL="/reset-email?resetPasswordToken=" \
    API_USER_TOKEN_EXPIRATION="1 days" \
    API_USER_TOKEN_SECRET_LENGTH=128 \
    HASH_DRIVER=argon \
    TZ=UTC \
    PORT=3333 \
    HOST=0.0.0.0 \
    LOG_LEVEL=trace \
    APP_KEY=VyNbUsi5FgpKrhVz-MMWJfe0nH0KnRZC \
    NODE_ENV=development-remote \
    DB_HOST=109.234.165.225 \
    DB_PORT=3306 \
    DB_USER=${DB_USER} \
    DB_PASSWORD=${DB_PASSWORD} \
    DB_DATABASE_NAME=reco5282_hub_flapi_development-remote \
    DB_DEBUG=true \
    HEALTH=test \
    AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
    AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
    AWS_SERVER_LOADBALANCER_CLUSTER_K3S=54.36.178.99 \
    AWS_DOMAIN_FLAPI=flapi.org \
    AWS_DOMAIN_FLAPI_HOSTED_ZONE_ID=Z02165602AC1DA1ERJU2H \
    O2SWITCH_HOST=teck.o2switch.net:2083 \
    O2SWITCH_API_TOKEN=${O2SWITCH_API_TOKEN} \
    O2SWITCH_USERNAME=reco5282 \
    O2SWITCH_BEGINNING_DATABASE_NAME=reco5282_ \
    O2SWITCH_DATABASE_USERNAME=${O2SWITCH_DATABASE_USERNAME} \
    O2SWITCH_DATABASE_PASSWORD=${O2SWITCH_DATABASE_PASSWORD} \
    O2SWITCH_BACKUP_DATABASE_PATH=home/reco5282/backup-database/mariadb \
    GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_PERSONAL_ACCESS_TOKEN} \
    GITHUB_USERNAME_OR_ORGANIZATION=FlapiBusiness \
    MAILJET_API_SECRET_KEY=${MAILJET_API_SECRET_KEY} \
    MAILJET_API_KEY=${MAILJET_API_KEY} \
    MAIJET_API_VERSION=3.1 \
    SMTP_HOST=none \
    SMTP_PORT=1025 \
    SMTP_USERNAME=none \
    SMTP_PASSWORD=none \
    MAIL_USERNAME=support@flapi.org

# Install production dependencies only
RUN npm ci --omit="dev" --ignore-scripts

CMD npm run db:migration:staging-prod && \
    npm run db:seed && \
    npm run start

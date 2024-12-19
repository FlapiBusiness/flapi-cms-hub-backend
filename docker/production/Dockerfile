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

# Set environment variables
ENV FRONTEND_APP_BASE_URL=http://localhost:1460 \
    FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE=/account-validate?email= \
    FRONTEND_APP_REDIRECT_URI_FORGOT_PASSWORD=/reset-password?resetPasswordToken= \
    FRONTEND_APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL=/reset-email?resetPasswordToken= \
    API_USER_TOKEN_EXPIRATION_DAYS=1 \
    HASH_DRIVER=argon \
    TZ=UTC \
    PORT=3333 \
    HOST=0.0.0.0 \
    LOG_LEVEL=trace \
    APP_KEY=VyNbUsi5FgpKrhVz-MMWJfe0nH0KnRZC \
    NODE_ENV=production \
    DB_HOST=109.234.165.225 \
    DB_PORT=3306 \
    DB_USER=reco5282_all \
    DB_PASSWORD=jbq5zgn2puw@qnr.RUE \
    DB_DATABASE=reco5282_hub_flapi_production \
    HEALTH=test \
    AWS_ACCESS_KEY_ID=AKIASWISVXTAQGDKVB6P \
    AWS_SECRET_ACCESS_KEY=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 \
    AWS_SERVER_CLUSTER_K3S=54.36.178.99 \
    AWS_DOMAIN_FLAPI=flapi.org \
    AWS_DOMAIN_FLAPI_HOSTED_ZONE_ID=Z02165602AC1DA1ERJU2H \
    O2SWITCH_HOST=teck.o2switch.net:2083 \
    O2SWITCH_API_TOKEN=EYHLFD0YNWQZIC8SMBMYKH8XHZ3GZWYP \
    O2SWITCH_USERNAME=reco5282 \
    O2SWITCH_BEGINNING_DATABASE_NAME=reco5282_ \
    O2SWITCH_DATABASE_USERNAME=reco5282_all \
    O2SWITCH_DATABASE_PASSWORD=jbq5zgn2puw@qnr.RUE \
    O2SWITCH_BACKUP_DATABASE_PATH=home/reco5282/backup-database/mariadb \
    GITHUB_PERSONAL_ACCESS_TOKEN=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 \
    GITHUB_USERNAME_OR_ORGANIZATION=FlapiBusiness \
    MAILJET_API_SECRET_KEY=c9771c4a04d73ad1937a1c93456ff740 \
    MAILJET_API_KEY=7bd86024d096359b34edda94063c9907 \
    MAIJET_API_VERSION=3.1 \
    SMTP_HOST=none \
    SMTP_PORT=none \
    SMTP_USERNAME=none \
    SMTP_PASSWORD=none \
    MAIL_USERNAME=support@flapi.org

# Install production dependencies only
RUN npm ci --omit="dev" --ignore-scripts

CMD npm run db:migration:run:staging-prod && \
    npm run db:seed && \
    npm run start

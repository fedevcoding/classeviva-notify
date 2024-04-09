FROM node:lts-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

# Copy the rest of the files
COPY . .

ARG TELEGRAM_BOT_API

ENV TELEGRAM_BOT_API $TELEGRAM_BOT_API
ENV NODE_ENV production

RUN yarn build

# Start the bot
CMD ["yarn", "start"]

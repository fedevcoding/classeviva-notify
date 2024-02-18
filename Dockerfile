FROM node:21

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN yarn install

# Copy the rest of the files
COPY . .

RUN yarn build

# Start the bot
CMD ["npm", "start"]

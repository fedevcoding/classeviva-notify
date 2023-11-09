FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .



# Compile typescript to javascript
RUN npm run build

# Start the bot
CMD ["npm", "start"]

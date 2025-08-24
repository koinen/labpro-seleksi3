FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build if using TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["sh", "-c", "npm run db:seed && npm run start:prod"]
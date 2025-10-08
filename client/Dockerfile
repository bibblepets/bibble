FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN npm run build

FROM nginx:alpine AS nginx

# Copy configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Vite app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html
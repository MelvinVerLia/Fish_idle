# Use Node.js as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (better for caching layers)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight web server for Vite (Caddy or Nginx recommended, but Serve works too)
RUN npm install -g serve

# Expose port 4173 (default Vite preview port) instead of 5173
EXPOSE 5173

# Run the frontend with serve (from the dist folder, as Vite builds into "dist")
CMD ["serve", "-s", "dist", "-l", "5173"]
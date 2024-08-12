# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Install 'serve' to serve the build directory
RUN npm install -g serve

# Set environment variable with a default value
ENV PORT=3000

# Expose the port the app runs on
EXPOSE ${PORT}

# Define the command to run the app using 'serve' with dynamic port
CMD ["sh", "-c", "serve -s build -l $PORT"]

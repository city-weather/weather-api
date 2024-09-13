# Use the official Node.js runtime as a parent image
FROM node:14-slim

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app.js file when the container launches
CMD ["node", "wapi.js"]

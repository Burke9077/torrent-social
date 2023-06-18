# Start from a Node.js version 18.16 LTS
FROM node:18.16

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the workdir in our image
COPY package*.json ./

# Install the node modules in the container
RUN npm install

# Copy the rest of your application's source files into the image
COPY . .

# Make port 3000 available to the outside once the container is running.
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
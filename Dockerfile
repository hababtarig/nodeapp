# Use a Node.js base image with the LTS version
FROM node:14

# Install pidusage globally (optional, if you want to use it globally)
RUN npm install -g pidusage

# Create a directory for the application
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory in the container
COPY . .

# Command to run the Node.js script
CMD ["node", "stress.js"]

FROM node:14


WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Expose the port on which the application will run (if applicable)
# EXPOSE 3000

CMD ["node", "stress.js"]

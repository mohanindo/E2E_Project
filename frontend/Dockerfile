FROM node:22-alpine

WORKDIR /app

# npm ci uses the committed lock file for reproducible installs.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

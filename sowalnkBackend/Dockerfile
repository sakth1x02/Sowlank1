FROM node:20
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install
COPY . .
EXPOSE 2000
CMD ["npm", "run", "server"]
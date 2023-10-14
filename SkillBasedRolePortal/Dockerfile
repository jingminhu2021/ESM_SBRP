FROM node:20-alpine

WORKDIR /react-vite-app

COPY . ./

RUN npm install --legacy-peer-deps

CMD ["npm", "run", "dev"]
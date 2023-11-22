FROM node:18.18.2
WORKDIR /app
COPY ./package.json ./package.json
COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]

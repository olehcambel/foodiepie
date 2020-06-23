FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN chown -R node:node /app
USER node
RUN npm run build

EXPOSE 4000
CMD npm start
# https://github.com/galkin/zlit-graphql/blob/master/Dockerfile
# npm run migration:run
FROM node:20.11.1

RUN mkdir /frontend/

WORKDIR /frontend/

COPY ./frontend .

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
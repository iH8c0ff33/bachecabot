FROM alpine

RUN apk add --update nodejs
RUN mkdir -p /var/app
COPY package.json /var/app/package.json
RUN cd /var/app; npm install
COPY . /var/app

EXPOSE 3000
CMD ["node", "/var/app/app.js"]

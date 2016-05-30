FROM node

RUN mkdir -p /var/app
COPY package.json /var/app/package.json
RUN cd /var/app; npm install --production
COPY . /var/app

EXPOSE 3000
CMD ["node", "/var/app/app.js"]

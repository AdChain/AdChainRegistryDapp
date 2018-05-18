FROM node:8

EXPOSE 5001

ENV PORT 5001

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN rm -rf node_modules/

RUN npm install
RUN npm install serve -g
RUN npm run build

ENTRYPOINT [ "npm" ]
CMD ["run", "start"]

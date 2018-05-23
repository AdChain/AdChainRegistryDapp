FROM node:8

EXPOSE 5002

ENV PORT 5002

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN rm -rf node_modules/

RUN npm install
RUN npm install serve -g

ENTRYPOINT [ "npm" ]
CMD ["run", "start"]
